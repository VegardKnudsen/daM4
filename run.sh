#! /bin/bash

docker build . -t nodejs-rest

docker run -e VERSION=1.1 -p 9000:7777 nodejs-rest

