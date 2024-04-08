use axum::{Extension, Json};
use sqlx::PgPool;

use crate::error::{Error as RequestError, Result as RequestResult};

use super::{generate_jwt, hash_password, SignUpRequest, User, UserResponse};

pub async fn signup(
    Extension(db): Extension<PgPool>,
    user: SignUpRequest
) -> RequestResult<Json<UserResponse>> {
    let hashed_password = hash_password(user.password)
        .map_err(|_| RequestError::InternalServerError)?;

    let created_user: User = sqlx::query_as("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *")
        .bind(&user.username)
        .bind(hashed_password)
        .fetch_one(&db)
        .await
        .map_err(|error| { 
            match error {
                sqlx::Error::Database(db_error) if db_error.constraint() == Some("users_username_key") => {
                    RequestError::BadRequestWithError("Username taken!".to_string())
                },
                _ => RequestError::InternalServerError,
            }
        })?;

    Ok(Json(UserResponse {
        id: created_user.id,
        username: created_user.username,
        token: generate_jwt(created_user.id),
    }))
}