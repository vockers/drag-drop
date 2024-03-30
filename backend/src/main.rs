use backend::run;
use dotenvy::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();

    run().await;
}
