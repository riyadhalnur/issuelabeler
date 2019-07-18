.PHONY: default modules clean key

default: modules key

modules:
	mkdir -p nodejs
	cp -r node_modules nodejs/
	cp package.json nodejs/
	cp package-lock.json nodejs/
	zip -r modules.zip nodejs
	rm -rf nodejs/

key:
	zip key.zip issuelabeler-private-key.pem

clean:
	rm -rf modules.zip
	rm -rf key.zip
