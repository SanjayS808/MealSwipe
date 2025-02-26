# MealSwipe

CSCE 463 939 Capstone Project

Building and running docker images for both backend and frontend is done easily with the already-provided `build-docker.sh`. In each case there are two features to run the docker containers: You can build a new container with new features or run the container. Note that the container will attempt to run using the same name. Therefore, you must delete any already-existing container with that name.

#### Example Usage:
```
backend/ # sudo build-docker.sh build
backend/ # sudo build-docker.sh run
```
