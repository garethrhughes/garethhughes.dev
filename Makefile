BUCKET ?= your-s3-bucket-name
CLOUDFRONT_ID ?=

.PHONY: install build deploy deploy-images invalidate import import-images

install:
	npm install

build:
	npm run build

deploy: build
	aws s3 sync out/ s3://$(BUCKET)/ --delete
ifdef CLOUDFRONT_ID
	$(MAKE) invalidate
endif

deploy-images:
	aws s3 sync public/images/ s3://$(BUCKET)/images/

invalidate:
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_ID) --paths "/*"

import:
	node scripts/import-hashnode.mjs

import-images:
	node scripts/import-images.mjs
