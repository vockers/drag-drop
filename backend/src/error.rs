use axum::{body::Body, http::{Response, StatusCode}, response::IntoResponse, Json};
use serde_json::{json, Value};

pub type Result<T> = std::result::Result<T, Error>;

pub enum Error {
	BadRequest,
	BadRequestWithError(String),
	InternalServerError,
	NotFound(String),
	Unauthorized,
}

impl Error {
	pub fn message(&self) -> &str {
		match self {
			Self::BadRequest => "Bad Request",
			Self::BadRequestWithError(_) => "Bad Request",
			Self::InternalServerError => "Internal Server Error",
			Self::NotFound(_) => "Not Found",
			Self::Unauthorized => "Unauthorized",
		}
	}

	pub fn into_json(error: &str) -> Json<Value> {
		Json(json!({
			"error": error
		}))
	}
}

impl IntoResponse for Error {
	fn into_response(self) -> Response<Body> {
		match self {
			Self::BadRequest => StatusCode::BAD_REQUEST.into_response(),
			Self::BadRequestWithError(error) => (StatusCode::BAD_REQUEST, Error::into_json(&error)).into_response(),
			Self::Unauthorized => StatusCode::UNAUTHORIZED.into_response(),
			_ => StatusCode::INTERNAL_SERVER_ERROR.into_response()
		}
	}
}

impl From<sqlx::Error> for Error {
	fn from(_: sqlx::Error) -> Self {
		Error::InternalServerError
	}
}