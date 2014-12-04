.PHONY: compile release
plugins=*
GRUNT=node_modules/.bin/grunt

all: compile
compile:
	$(GRUNT) --plugins=$(plugins)
release:
ifeq ($(strip $(version)),)
	@echo "\033[31mERROR:\033[0;39m No version provided."
	@echo "\033[1;30mmake release version=0.0.1\033[0;39m"
else
	sed -i.bak 's/"version": "[^"]*"/"version": "$(version)"/' bower.json
	sed -i.bak 's/"version": "[^"]*"/"version": "$(version)"/' package.json
	rm *.bak
	make compile
	git add .
	git commit -a -m "Released $(version)."
	git tag v$(version)
	git push origin master
	git push origin --tags
	@echo "\033[32mv${version} released\033[0;39m"
endif