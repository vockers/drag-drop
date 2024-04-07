use std::env;

use axum::{async_trait, extract::FromRequestParts, http::{request::Parts, StatusCode}};
use axum_extra::{headers::{authorization::Bearer, Authorization}, TypedHeader};
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::{error::{Error as RequestError, Result as RequestResult}, auth::TokenClaims};

pub struct Auth(pub i32);

#[async_trait]
impl<S> FromRequestParts<S> for Auth
where
    S: Send + Sync,
{
    type Rejection = RequestError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> RequestResult<Self> {
        let authorization = TypedHeader::<Authorization<Bearer>>::from_request_parts(parts, _state)
            .await
            .map_err(|_| RequestError::new(StatusCode::BAD_REQUEST, "Missing authorization header!"))?;

        let jwt = authorization.token();

        let token = decode::<TokenClaims>(
            jwt,
            &DecodingKey::from_secret(env::var("JWT_SECRET").unwrap().as_ref()),
            &Validation::default())
            .map_err(|_| RequestError::new(StatusCode::UNAUTHORIZED, "Invalid token!"))?;

        let user_id = token.claims.sub.parse::<i32>()
            .map_err(|_| RequestError::new(StatusCode::UNAUTHORIZED, "Invalid token!"))?;

        Ok(Auth(user_id))
    }
}