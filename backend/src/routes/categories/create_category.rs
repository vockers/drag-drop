use axum::{http::StatusCode, Extension, Json};
use sqlx::PgPool;

use crate::{error::{Error as RequestError, Result as RequestResult}, extractors::auth_extractor::Auth};

use super::{Category, CategoryRequest};

#[derive(Clone, Debug)]
struct ChildCategory {
	category: CategoryRequest,
	parent_id: i32,
}

/// create category handler - POST /api/categories
pub async fn create_category(
	Auth(user_id): Auth,
	Extension(db): Extension<PgPool>,
	Json(category): Json<CategoryRequest>,
) -> RequestResult<StatusCode> {
	let mut transaction = db.begin()
		.await
		.map_err(|_| RequestError::server())?;

    let root_category: Category = sqlx::query_as("INSERT INTO categories (name) VALUES ($1) RETURNING *")
		.bind(&category.name)
        .fetch_one(&mut *transaction)
        .await
        .map_err(|_| RequestError::server())?;
	
	let mut stack: Vec<ChildCategory> = vec![];

    if let Some(children) = category.children {
        for child in children {
            stack.push(ChildCategory {
                category: child.clone(),
                parent_id: root_category.id,
            });
        } 
    }

	while let Some(sub_category) = stack.pop() {
		let cat: Category = sqlx::query_as("INSERT INTO categories (name, parent_id) VALUES ($1, $2) RETURNING *")
    		.bind(&sub_category.category.name)
    		.bind(sub_category.parent_id)
            .fetch_one(&mut *transaction)
            .await
            .map_err(|_| RequestError::server())?;

		if let Some(children) = sub_category.category.children {
			for child in children {
				stack.push(ChildCategory {
					category: child.clone(),
					parent_id: cat.id,
				});
			}
		}
	}

	sqlx::query("INSERT INTO user_categories (user_id, category_id) VALUES ($1, $2)")
		.bind(user_id)
		.bind(root_category.id)
		.execute(&mut *transaction)
		.await
		.map_err(|_| RequestError::server())?;

	transaction.commit()
		.await
		.map_err(|_| RequestError::server())?;

	Ok(StatusCode::CREATED)
}
