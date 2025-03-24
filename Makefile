## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'


## goinstalls: install golang tools used by this project
.PHONY: db-reset
db-reset:
	./scripts/dbreset.sh