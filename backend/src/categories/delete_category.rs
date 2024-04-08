use axum::{extract::Path, http::StatusCode, Extension};
use sqlx::{postgres::PgRow, PgPool};

use crate::{auth::auth_extractor::Auth, error::{Error as RequestError, Result as RequestResult}};

pub async fn delete_category(
    Path(category_id): Path<i32>,
    Auth(user_id): Auth,
    Extension(db): Extension<PgPool>,
) ->  RequestResult<()> {
    let user_category: Option<PgRow> = sqlx::query(
        r#"
        SELECT uc.user_id
        FROM user_categories uc
        JOIN categories c ON uc.category_id = c.id
        WHERE c.id = $1 AND uc.user_id = $2
        "#)
    .bind(category_id)
    .bind(user_id)
    .fetch_optional(&db)
    .await
    .map_err(|_| RequestError::server())?;

    if let None = user_category {
        return Err(RequestError::new(StatusCode::UNAUTHORIZED, "Unauthorized access to category"));
    }

    sqlx::query!(
        "DELETE FROM user_categories WHERE category_id = $1",
        category_id
    )
    .execute(&db)
    .await
    .map_err(|_| RequestError::server())?;

    sqlx::query(
        r#"WITH RECURSIVE category_tree AS (
            SELECT id
            FROM categories
            WHERE id = $1
            UNION
            SELECT c.id
            FROM categories c
            JOIN category_tree ct ON c.parent_id = ct.id
        
        )
        DELETE FROM categories
        WHERE id IN (SELECT id FROM category_tree)
        "#)
        .bind(category_id)
        .execute(&db)
        .await
        .map_err(|error| {dbg!(error); RequestError::server()})?;

    Ok(())
}