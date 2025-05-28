FROM gcc:latest

WORKDIR /code

CMD ["g++", "main.cpp", "-o", "main", "&&", "./main"]