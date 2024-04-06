use axum::{routing::{get, post}, Extension, Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Postgres, Transaction};

use crate::{error::{Error as RequestError, Result as RequestResult}, extractors::auth_extractor::Auth};

pub fn routes() -> Router {
	Router::new()
		.route("/categories", post(create_category))
		.route("/categories", get(get_all_categories))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Category {
	name: String,
	children: Option<Vec<Category>>,
}

#[derive(Clone, Debug)]
struct SubCategory {
	category: Category,
	parent_id: Option<i32>,
}

#[derive(sqlx::FromRow, Serialize)]
struct DBCategory {
	id: i32,
	name: String,
	parent_id: Option<i32>,
}

/// Insert category into database.
/// parent_id is Option<i32> because the root category has no parent.
async fn insert_category(
	transaction: &mut Transaction<'_, Postgres>,
	category: &Category,
	parent_id: Option<i32>,
) -> RequestResult<i32> {
	let category_id = if let Some(parent_id) = parent_id {
		sqlx::query_as("INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING id")
		.bind(&category.name)
		.bind(parent_id)
	} else {
		sqlx::query_as("INSERT INTO categories (name) VALUES ($1) RETURNING id")
		.bind(&category.name)
	};
	let category_id: (i32,) = category_id
		.fetch_one(&mut **transaction)
		.await
		.map_err(|_| RequestError::server())?;

	Ok(category_id.0)
}

/// create category handler - POST /api/categories
async fn create_category(
	Auth(user_id): Auth,
	Extension(db): Extension<PgPool>,
	Json(category): Json<Category>,
) -> RequestResult<Json<Category>> {
	let mut transaction = db.begin()
		.await
		.map_err(|_| RequestError::server())?;
	
	let mut stack: Vec<SubCategory> = vec![SubCategory {
		category: category.clone(),
		parent_id: None,
	}];
	let mut root_id = Option::<i32>::None;

	while let Some(sub_category) = stack.pop() {
		let id = insert_category(&mut transaction, &sub_category.category, sub_category.parent_id).await?;
		if root_id.is_none() {
			root_id = Some(id);
		}
		if let Some(children) = sub_category.category.children {
			for child in children {
				stack.push(SubCategory {
					category: child.clone(),
					parent_id: Some(id),
				});
			}
		}
	}

	sqlx::query("INSERT INTO user_categories (user_id, category_id) VALUES ($1, $2)")
		.bind(user_id)
		.bind(root_id)
		.execute(&mut *transaction)
		.await
		.map_err(|_| RequestError::server())?;

	transaction.commit()
		.await
		.map_err(|_| RequestError::server())?;

	Ok(Json(category))
}

/// get all categories handler - GET /api/categories
async fn get_all_categories(Extension(db): Extension<PgPool>) -> RequestResult<Json<Vec<DBCategory>>> {
	let categories: Vec<DBCategory> = sqlx::query_as("SELECT * FROM categories WHERE parent_id IS NULL")
		.fetch_all(&db)
		.await
		.map_err(|_| RequestError::server())?;	

    Ok(Json(categories))
}