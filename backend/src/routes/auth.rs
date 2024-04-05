use std::env;

use argon2::{password_hash::{rand_core::OsRng, Error as HashError, PasswordHasher, PasswordVerifier, SaltString}, Argon2, PasswordHash};
use axum::{async_trait, extract::{FromRequest, Request}, http::StatusCode, routing::post, Extension, Json, Router};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sqlx::PgPool;
use validator::Validate;

use crate::error::{Error as RequestError, Result as RequestResult};

pub fn router() -> Router {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
}

#[derive(Deserialize, Serialize, Validate)]
struct SignUpRequest {
    #[validate(length(min = 3, max = 30, message = "must be between 3 and 30 characters"))]
    username: String,
    #[validate(length(min = 6, max = 64, message = "must be between 6 and 64 characters"))]
    password: String,
}

#[derive(Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[allow(unused)]
#[derive(sqlx::FromRow)]
struct DBUser {
    id: i32,
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct UserResponse {
    id: i32,
    username: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TokenClaims {
    sub: String,
    iat: usize,
    exp: usize
}

#[async_trait]
impl<S> FromRequest<S> for SignUpRequest
where
    S: Send + Sync,
{
    type Rejection = RequestError;

    async fn from_request(request: Request, state: &S) -> RequestResult<Self> {
        let Json(user) = Json::<Self>::from_request(request, state)
            .await
            .map_err(|_| RequestError::status(StatusCode::BAD_REQUEST))?;

        if let Err(errors) = user.validate() {
            return Err(RequestError::new(StatusCode::BAD_REQUEST, &errors.to_string()))
        }

        Ok(user)   
    }
}

async fn signup(
    Extension(db): Extension<PgPool>,
    user: SignUpRequest
) -> RequestResult<Json<UserResponse>> {
    let hashed_password = hash_password(user.password)
        .map_err(|_| RequestError::server())?;

    let created_user: UserResponse = sqlx::query_as("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username")
        .bind(&user.username)
        .bind(hashed_password)
        .fetch_one(&db)
        .await
        .map_err(|error| { 
            match error {
                sqlx::Error::Database(db_error) if db_error.constraint() == Some("users_username_key") => {
                    RequestError::new(StatusCode::BAD_REQUEST, "Username taken!")
                },
                _ => RequestError::server(),
            }
        })?;

    Ok(Json(created_user))
}

async fn login(
    Extension(db): Extension<PgPool>,
    Json(user): Json<LoginRequest>,
) -> RequestResult<Json<Value>> {
    let db_user = sqlx::query_as::<_, DBUser>("SELECT * FROM users WHERE username = $1")
        .bind(&user.username)
        .fetch_one(&db)
        .await
        .map_err(|error| {
            match error {
                sqlx::Error::RowNotFound => RequestError::new(StatusCode::BAD_REQUEST, "Invalid username or password"),
                _ => RequestError::server()
            }
        })?;

    let password_valid = verify_password(&user.password, &db_user.password)
        .map_err(|_| RequestError::server())?;

    if !password_valid {
        return Err(RequestError::new(StatusCode::BAD_REQUEST, "Invalid username or password."))
    }

    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::minutes(60)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: db_user.id.to_string(),
        exp,
        iat,
    };
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(env::var("JWT_SECRET").unwrap().as_ref())
    ).unwrap();

    // TODO: return a JWT
    Ok(Json(json!({
        "success": token
    })))
}


fn hash_password(password: String) -> Result<String, HashError> {
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string();

    Ok(password_hash)
}

fn verify_password(password: &String, password_hash: &String) -> Result<bool, HashError> {
    let parsed_hash = PasswordHash::new(password_hash)?;
    let is_valid = Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();

    Ok(is_valid)
}