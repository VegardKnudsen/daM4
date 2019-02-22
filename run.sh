#! /bin/bash

docker build . -t nodejs-rest

docker run -e VERSION=1.1 -p 3000:3000 nodejs-rest

