
if [ $# -ne 1 ]; then
    echo "Usage: $0 <run, build>"
    exit 1
fi

if [ "$1" == "dev" ]; then
    docker build --build-arg NODE_ENV=development -t mealswipe-react-native-frontend .
    docker run -p 3000:3000 react-native-frontend

elif [ "$1" == "prod" ]; then
    docker build --build-arg NODE_ENV=production -t mealswipe-react-native-frontend .
    docker run -p 8080:80 react-native-frontend

else  
    echo "Option not known or not imputted"
    exit 1
fi
