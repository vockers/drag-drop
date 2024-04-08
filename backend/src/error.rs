use axum::{body::Body, http::{Response, StatusCode}, response::IntoResponse};

pub type Result<T> = std::result::Result<T, Error>;

pub enum Error {
	BadRequest,
	BadRequestWithError(String),
	InternalServerError,
	NotFound(String),
	Unauthorized,
}

impl IntoResponse for Error {
	fn into_response(self) -> Response<Body> {
		match self {
			Self::BadRequest => StatusCode::BAD_REQUEST.into_response(),
			Self::BadRequestWithError(error) => (StatusCode::BAD_REQUEST, error).into_response(),
			Self::Unauthorized => StatusCode::UNAUTHORIZED.into_response(),
			_ => StatusCode::INTERNAL_SERVER_ERROR.into_response()
		}
	}
}

// impl core::fmt::Debug for Error {
// 	fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
// 		write!(f, "{}: {}", self)
// 	}
// }

impl From<sqlx::Error> for Error {
	fn from(_: sqlx::Error) -> Self {
		Error::InternalServerError
	}
}