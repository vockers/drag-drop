use axum::{extract::Path, Extension, Json};
use sqlx::PgPool;

use crate::error::Result as RequestResult;

use super::{Category, CategoryResponse};

/// Get one category and all its children handler - GET /api/categories/:category_id
pub async fn get_single_category(
	Path(category_id): Path<i32>,
	Extension(db): Extension<PgPool>,
) -> RequestResult<Json<CategoryResponse>> {

	let mut transaction = db.begin()
		.await?;

	let category: Category = sqlx::query_as("SELECT * FROM categories WHERE id = $1")
		.bind(category_id)
		.fetch_one(&mut *transaction)
		.await?;

	let mut root_category = CategoryResponse {
		id: category.id,
		name: category.name,
		children: Some(Vec::new()),
	};

	let children: Vec<Category> = sqlx::query_as("SELECT * FROM categories WHERE parent_id = $1")
		.bind(category_id)
		.fetch_all(&mut *transaction)
		.await?;

	transaction.commit()
		.await?;

	for child in children {
		root_category.children.as_mut().unwrap().push(CategoryResponse {
			id: child.id,
			name: child.name,
			children: None,
		});
	}

	Ok(Json(root_category))
}