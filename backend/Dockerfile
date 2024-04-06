FROM rust:1.77.0-slim as build

WORKDIR /app

COPY . .

RUN cargo build --release

EXPOSE 3000

CMD ["./target/release/backend"]