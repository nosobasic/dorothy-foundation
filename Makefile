.PHONY: help dev setup install migrate seed test fmt lint clean docker-up docker-down

help:
	@echo "TDRMF - The Dorothy R. Morgan Foundation"
	@echo ""
	@echo "Available commands:"
	@echo "  make dev          - Run both frontend and backend in development mode"
	@echo "  make setup        - Initial setup: install dependencies and run migrations"
	@echo "  make install      - Install all dependencies"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed database with sample data"
	@echo "  make test         - Run all tests"
	@echo "  make fmt          - Format code"
	@echo "  make lint         - Lint code"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-up    - Start all services with Docker Compose"
	@echo "  make docker-down  - Stop all Docker services"

dev:
	@echo "Starting development servers..."
	@(cd backend && uvicorn app.main:app --reload --port 8000) & \
	npm run dev

setup: install migrate seed
	@echo "Setup complete!"

install:
	@echo "Installing frontend dependencies..."
	npm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

migrate:
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

seed:
	@echo "Seeding database..."
	cd backend && python scripts/seed.py

test:
	@echo "Running backend tests..."
	cd backend && pytest
	@echo "Running frontend tests..."
	npm test

fmt:
	@echo "Formatting backend code..."
	cd backend && ruff format .
	@echo "Formatting frontend code..."
	npm run format

lint:
	@echo "Linting backend code..."
	cd backend && ruff check .
	@echo "Linting frontend code..."
	npm run lint

clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist node_modules
	find backend -type d -name __pycache__ -exec rm -rf {} +
	find backend -type d -name "*.egg-info" -exec rm -rf {} +

docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d
	@echo "Services started! Frontend: http://localhost:3000, Backend: http://localhost:8000"

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

