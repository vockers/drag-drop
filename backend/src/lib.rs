pub mod auth;
pub mod categories;
pub mod error;
pub mod routes;

use std::env;
use sqlx::postgres::PgPoolOptions;

pub async fn run() {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let db = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
		.expect("Failed to connect to Database");

    sqlx::migrate!()
        .run(&db)
        .await
        .unwrap();

    let port = env::var("PORT")
        .unwrap_or("3000".to_owned());
    let address = format!("0.0.0.0:{}", port);

    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    println!("Listening on port: {}", port);
    axum::serve(listener, routes::routes(db)).await.unwrap();
}