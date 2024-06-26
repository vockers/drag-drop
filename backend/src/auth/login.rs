use axum::{Extension, Json};
use sqlx::PgPool;

use crate::error::{Error as RequestError, Result as RequestResult};

use super::{generate_jwt, verify_password, User, LoginRequest, UserResponse};

/// login handler - Returns a JWT as a Cookie - POST /api/auth/login
pub async fn login(
    Extension(db): Extension<PgPool>,
    Json(user): Json<LoginRequest>,
) -> RequestResult<Json<UserResponse>> {
    let db_user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1")
        .bind(&user.username)
        .fetch_one(&db)
        .await
        .map_err(|error| {
            match error {
                sqlx::Error::RowNotFound => RequestError::BadRequestWithError("Invalid username or password".to_string()),
                _ => RequestError::InternalServerError
            }
        })?;

    if !verify_password(&user.password, &db_user.password)
        .map_err(|_| RequestError::InternalServerError)? {
        return Err(RequestError::BadRequestWithError("Invalid username or password.".to_string()));
    }

    Ok(Json(UserResponse {
        id: db_user.id,
        username: db_user.username,
        token: generate_jwt(db_user.id),
    }))
}
