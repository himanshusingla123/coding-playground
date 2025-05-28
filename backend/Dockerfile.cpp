FROM gcc:latest

WORKDIR /code

CMD ["bash", "-c", "g++ main.cpp -o main && ./main"]
