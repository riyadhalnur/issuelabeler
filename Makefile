.PHONY: default modules clean

default: modules

modules:
	mkdir -p nodejs
	cp -r node_modules nodejs/
	zip -r modules.zip nodejs
	rm -rf nodejs/

clean:
	rm -rf modules.zip
