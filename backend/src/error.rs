use axum::{body::Body, http::{Response, StatusCode}, response::IntoResponse, Json};
use serde_json::{json, Value};

pub type Result<T> = std::result::Result<T, Error>;

pub struct Error {
	pub code: StatusCode,
	pub message: Json<Value>,
}

impl Error {
	pub fn new(code: StatusCode, message: &str) -> Self {
		Self { code, message: Json(json!({ "error": message })) }
	}

	pub fn status(code: StatusCode) -> Self {
		Self { code, message: Json(json!({})) }
	}

	/// Returns a 500 Internal Server Error
	pub fn server() -> Self {
		Self::new(StatusCode::INTERNAL_SERVER_ERROR, "internal server error")
	}
}

impl IntoResponse for Error {
	fn into_response(self) -> Response<Body> {
		(self.code, self.message).into_response()
	}
}

impl core::fmt::Debug for Error {
	fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
		write!(f, "{}: {}", self.code, self.message.0)
	}
}