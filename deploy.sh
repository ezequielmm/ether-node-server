#!/bin/bash

sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$1/" .env
docker image prune -a --force
docker compose up -d