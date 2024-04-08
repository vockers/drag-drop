pub mod auth_extractor;
pub mod login;
pub mod signup;

use argon2::{password_hash::{rand_core::OsRng, Error as HashError, PasswordHasher, PasswordVerifier, SaltString}, Argon2, PasswordHash};
use axum::{async_trait, extract::{FromRequest, Request}, routing::post, Json, Router};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use std::env;
use validator::Validate;

use crate::error::{Error as RequestError, Result as RequestResult};

use self::{login::login, signup::signup};

#[derive(Deserialize)]
pub struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Deserialize, Serialize, Validate)]
pub struct SignUpRequest {
    #[validate(length(min = 3, max = 30, message = "must be between 3 and 30 characters"))]
    username: String,
    #[validate(length(min = 6, max = 64, message = "must be between 6 and 64 characters"))]
    password: String,
}

#[allow(unused)]
#[derive(sqlx::FromRow)]
pub struct User {
    id: i32,
    username: String,
    password: String,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct UserResponse {
    id: i32,
    username: String,
    token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize
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
            .map_err(|_| RequestError::BadRequest)?;

        if let Err(errors) = user.validate() {
            return Err(RequestError::BadRequestWithError(errors.to_string()));
        }

        Ok(user)   
    }
}

pub fn router() -> Router {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
}

/// Generates a JWT token and sets it as a cookie.
pub fn generate_jwt(user_id: i32) -> String {
    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::days(30)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user_id.to_string(),
        exp,
        iat,
    };
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(env::var("JWT_SECRET").unwrap().as_ref())
    ).unwrap();

    token
}

pub fn hash_password(password: String) -> Result<String, HashError> {
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(password.as_bytes(), &salt)?
        .to_string();

    Ok(password_hash)
}

pub fn verify_password(password: &String, password_hash: &String) -> Result<bool, HashError> {
    let parsed_hash = PasswordHash::new(password_hash)?;
    let is_valid = Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();

    Ok(is_valid)
}