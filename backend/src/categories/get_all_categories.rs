use axum::{Extension, Json};
use sqlx::PgPool;

use super::RootCategory;

use crate::error::Result as RequestResult;

/// Get all categories handler - GET /api/categories
pub async fn get_all_categories(
	Extension(db): Extension<PgPool>
) -> RequestResult<Json<Vec<RootCategory>>> {
	let categories: Vec<RootCategory> = sqlx::query_as(
		r#"SELECT c.id, c.name, uc.user_id 
		FROM categories c 
		INNER JOIN user_categories uc ON c.id = category_id 
		WHERE parent_id IS NULL
		"#)
		.fetch_all(&db)
		.await?;

    Ok(Json(categories))
}
