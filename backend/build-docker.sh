
if [ $# -ne 1 ]; then
    echo "Usage: $0 <run, build>"
    exit 1
fi

if [ "$1" == "build" ]; then
    docker build -t mealswipe-nodejs-backend .
elif [ "$1" == "run" ]; then
    docker run --name mealswipe-backend -d -p 127.0.0.1:5001:5001 mealswipe-nodejs-backend 
else  
    echo "Option not known or not imputted"
    exit 1
fi
