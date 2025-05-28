FROM openjdk:11

WORKDIR /code

CMD ["bash", "-c", "javac Main.java && java Main"]
