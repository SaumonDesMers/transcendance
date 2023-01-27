all: build

build:
	docker-compose up --build --remove-orphans

down:
	docker-compose down
