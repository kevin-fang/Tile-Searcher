# Tiling-Server  
A Python script that prints tile information given tile libraries, `getTileVariants.py`.

This repository also contains a NodeJS web server with a REST API that calls the Python script for easier use, and a simple Android client in `GetTileInfo/` to query the API.

Before starting anything, set the Arvados API keys and run `./setup.sh`

To start the web server, run `npm i && npm start`. This will install all the modules and start the server. To start the React frontend, navigate to `tile-searcher-react` and run `npm i && npm start`. Note that it requires the node backend to be running for queries.

The Android client is very barebones (and the JSON requests are currently broken) but to run it, import the project into Android Studio and build it.
