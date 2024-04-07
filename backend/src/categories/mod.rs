pub mod create_category;
pub mod get_all_categories;
pub mod get_single_category;

use axum::{routing::{get, post}, Router};
use serde::{Deserialize, Serialize};

use self::{create_category::create_category, get_all_categories::get_all_categories, get_single_category::get_single_category};

#[derive(sqlx::FromRow, Serialize)]
pub struct Category {
	id: i32,
	name: String,
	parent_id: Option<i32>,
}

#[derive(sqlx::FromRow, Serialize)]
pub struct RootCategory {
	id: i32,
	name: String,
	user_id: i32,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct CategoryRequest {
	name: String,
	children: Option<Vec<CategoryRequest>>,
}

#[derive(Serialize)]
pub struct CategoryResponse {
	id: i32,
	name: String,
	children: Option<Vec<CategoryResponse>>,
}

pub fn routes() -> Router {
	Router::new()
		.route("/categories", post(create_category))
		.route("/categories", get(get_all_categories))
		.route("/categories/:category_id", get(get_single_category))
}