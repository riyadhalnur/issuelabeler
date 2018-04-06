#!/usr/bin/env bash

set -e

packer build \
  -var "aws_access_key=$AWS_ACCESS_KEY" \
  -var "aws_secret_key=$AWS_SECRET_KEY" \
  ami.json | tee packer_output.txt

cat packer_output.txt | tail -n 2 \
  | sed '$ d' \
  | sed "s/ap-southeast-1: /custom_ami = \"/" \
  | sed -e 's/[[:space:]]*$/\"/' > ami.tfvars

cat ami.tfvars
rm packer_output.txt
