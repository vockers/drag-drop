mod routes;

use std::env;

pub async fn run() {
    let port = env::var("PORT").unwrap_or("3000".to_string());
    let address = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    println!("Listening on port: 3000");
    axum::serve(listener, routes::routes()).await.unwrap();
}