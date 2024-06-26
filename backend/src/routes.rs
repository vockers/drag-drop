use axum::{http::Method, Extension, Router};
use sqlx::PgPool;
use tower_cookies::CookieManagerLayer;
use tower_http::cors::{Any, CorsLayer};

pub fn routes(db: PgPool) -> Router {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::DELETE])
        .allow_headers(Any)
        .allow_origin(Any);

    let api_routes = Router::new()
        .merge(crate::categories::routes())
        .merge(crate::auth::router());
    
    Router::new()
        .nest("/api", api_routes)
        .layer(Extension(db))
        .layer(CookieManagerLayer::new())
        .layer(cors)
}