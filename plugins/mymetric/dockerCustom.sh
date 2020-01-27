#!/bin/sh

docker cp ./mymetric $(docker ps -f ancestor=countly/frontend:19.08.1 --format "{{.ID}}"):/opt/countly/plugins
docker cp ./mymetric $(docker ps -f ancestor=countly/api:19.08.1 --format "{{.ID}}"):/opt/countly/plugins
docker exec -i countly-server_countly-api_1 rm /opt/countly/plugins/plugins.json
docker exec -i countly-server_countly-frontend_1 rm /opt/countly/plugins/plugins.json