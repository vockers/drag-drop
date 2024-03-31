mod categories;

use axum::{Extension, Router};
use sqlx::PgPool;

pub fn routes(db: PgPool) -> Router {
    Router::new()
        .nest("/api", categories::routes())
		.layer(Extension(db))
}