#!/bin/bash

folders=("kote" "kote-2" "kote-3" "kote-4")

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 121760970575.dkr.ecr.us-east-1.amazonaws.com

for folder in "${folders[@]}"; do
  cd "$folder"
  docker compose pull
  docker compose down
  docker compose up -d
  cd ..
done