#!/usr/bin/env bash

set -e -x

sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update

sudo apt-get install docker-ce python-minimal python-pip -y
pip install awscli

sudo $(~/.local/bin/aws ecr get-login --no-include-email --region eu-west-1)
sudo docker pull ${DOCKER_IMAGE}