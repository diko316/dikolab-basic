DOCKER_IMAGE_NAME := dikotech/basic:1.0
DOCKER_CONSOLE_NAME := dikotech_basic_console
DOCKER_TEST_NAME := dikotech_basic_test
DOCKER_DOC_NAME := dikotech_basic_doc
DOCKER_MOUNT := /opt/app/source

.PHONY: help

help:
	@echo "Test"

container-doc-cleanup:
	@docker container prune -f && \
		docker rm -f '$(DOCKER_DOC_NAME)' 2>/dev/null || echo ''

container-test-cleanup:
	@docker container prune -f && \
		docker rm -f '$(DOCKER_TEST_NAME)' 2>/dev/null || echo ''

container-console-cleanup:
	@docker container prune -f && \
		docker rm -f '$(DOCKER_CONSOLE_NAME)' 2>/dev/null || echo ''

container-cleanup: container-doc-cleanup container-test-cleanup container-console-cleanup

image-cleanup: container-cleanup
	@docker image prune -f && \
		docker rmi -f '$(DOCKER_IMAGE_NAME)' 2>/dev/null || echo ''

image: image-cleanup
	@docker build --force-rm -f Dockerfile -t '$(DOCKER_IMAGE_NAME)' .


console: container-console-cleanup
	@docker run \
			--name '$(DOCKER_CONSOLE_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)'

tdd: container-test-cleanup
	@docker run \
			--name '$(DOCKER_TEST_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			tdd

doc: container-doc-cleanup
	@docker run \
			--name '$(DOCKER_DOC_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			doc

ddd: container-doc-cleanup
	@docker run \
			--name '$(DOCKER_DOC_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			ddd

clean-directory: container-console-cleanup
	@docker run \
			--name '$(DOCKER_CONSOLE_NAME)' \
			-ti \
			-v '$(PWD):$(DOCKER_MOUNT)' \
			'$(DOCKER_IMAGE_NAME)' \
			clean-source

clean-source: container-directory container-cleanup
