DOCKER_IMAGE_NAME := dikotech/basic:1.0
DOCKER_CONSOLE_NAME := dikotech_basic_env
DOCKER_TEST_NAME := dikotech_basic_test
DOCKER_MOUNT := /opt/app/source

.PHONY: help

help:
	@echo "Test"

container-cleanup:
	@docker container prune -f && \
		docker rm -f '$(DOCKER_CONSOLE_NAME)' 2>/dev/null || echo '' && \
		docker rm -f '$(DOCKER_TEST_NAME)' 2>/dev/null || echo ''
		

image-cleanup: container-cleanup
	@docker image prune -f && \
		docker rmi -f '$(DOCKER_IMAGE_NAME)' 2>/dev/null || echo ''

image: image-cleanup
	@docker build --force-rm -f Dockerfile -t '$(DOCKER_IMAGE_NAME)' .


console: container-cleanup
	@docker run \
			--name '$(DOCKER_CONSOLE_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)'

tdd: container-cleanup
	@docker run \
			--name '$(DOCKER_CONSOLE_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			tdd

doc: container-cleanup
	@docker run \
			--name '$(DOCKER_CONSOLE_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			doc
