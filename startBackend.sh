#!/usr/bin/env bash

results=$(arv)

if [[ $results =~ ^[ARVADOS_API_HOST] ]]
then
	./setup.sh && cd tile-searcher-backend && npm i && npm start
else 
	echo "Set tokens and retry";
fi

