use std::env;

use axum::{async_trait, extract::FromRequestParts, http::{request::Parts, StatusCode}};
use jsonwebtoken::{decode, DecodingKey, Validation};
use tower_cookies::Cookies;

use crate::{error::{Error as RequestError, Result as RequestResult}, routes::auth::TokenClaims};

pub struct Auth(pub i32);

#[async_trait]
impl<S> FromRequestParts<S> for Auth
where
    S: Send + Sync,
{
    type Rejection = RequestError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> RequestResult<Self> {
        let cookies = Cookies::from_request_parts(parts, _state)
            .await
            .map_err(|_| RequestError::server())?;

        let jwt = cookies.get("token")
            .ok_or(RequestError::new(StatusCode::UNAUTHORIZED, "Not logged in!"))?;

        let token = decode::<TokenClaims>(
            jwt.value(),
            &DecodingKey::from_secret(env::var("JWT_SECRET").unwrap().as_ref()),
            &Validation::default())
            .map_err(|_| RequestError::new(StatusCode::UNAUTHORIZED, "Invalid token!"))?;

        let user_id = token.claims.sub.parse::<i32>()
            .map_err(|_| RequestError::new(StatusCode::UNAUTHORIZED, "Invalid token!"))?;

        Ok(Auth(user_id))
    }
}