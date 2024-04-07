use axum::{Extension, Json};
use sqlx::PgPool;

use super::Category;

use crate::error::{Error as RequestError, Result as RequestResult};

/// Get all categories handler - GET /api/categories
pub async fn get_all_categories(
	Extension(db): Extension<PgPool>
) -> RequestResult<Json<Vec<Category>>> {
	let categories: Vec<Category> = sqlx::query_as("SELECT * FROM categories WHERE parent_id IS NULL")
		.fetch_all(&db)
		.await
		.map_err(|_| RequestError::server())?;	

    Ok(Json(categories))
}
