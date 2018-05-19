FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install curl jq postgresql -y

ADD scripts/wait-for-it.sh /usr/local/bin/wait-for-it

WORKDIR /app

# First add the package.json and run nnny so we don't need to re-install node
# and yarn when rebuilding if we didn't modify the package.json.
ADD ./package.json /app/package.json
RUN curl -so- https://raw.githubusercontent.com/MeLlamoPablo/nnny/v1.0.0/nnny.sh | bash

ADD . /app
RUN yarn

RUN scripts/containers/daas/set-run-configurations.sh
