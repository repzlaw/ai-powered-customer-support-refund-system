.PHONY: shell assets build

# Open a shell in the running application container.
shell:
	docker compose up -d app
	docker compose exec app sh

# Compile the current frontend source without rebuilding the Docker image.
assets:
	docker compose up -d app
	docker compose exec app npm run build

# Rebuild the image (including frontend assets) and restart the app.
build:
	docker compose up --build -d app
