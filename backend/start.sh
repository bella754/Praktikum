#!/bin/sh

# standard docker befehl, der jetzt immer automatisch ausgeführt wird
docker run \
--detach \
--name=loginproject \
--env="MYSQL_ROOT_PASSWORD=test987Login!" \
--publish 6603:3306 \
--volume=/root/docker/loginproject/conf.d:/etc/mysql/conf.d \
mysql