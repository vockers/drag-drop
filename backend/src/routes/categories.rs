use axum::{routing::post, Extension, Json, Router};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Postgres, Transaction};

use crate::error::{Error as RequestError, Result as RequestResult};

pub fn routes() -> Router {
	Router::new()
		.route("/categories", post(create_category))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Category {
	name: String,
	children: Option<Vec<Category>>,
}

struct SubCategory {
	category: Category,
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

	while let Some(sub_category) = stack.pop() {
		let id = insert_category(&mut transaction, &sub_category.category, sub_category.parent_id).await?;
		if let Some(children) = sub_category.category.children {
			for child in children {
				stack.push(SubCategory {
					category: child.clone(),
					parent_id: Some(id),
				});
			}
		}
	}

	transaction.commit()
		.await
		.map_err(|_| RequestError::server())?;

	Ok(Json(category))
}