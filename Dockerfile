FROM openjdk:23-jdk-slim
WORKDIR /app
COPY target/GenRepos.jar /app/GenRepos.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "GenRepos.jar"]
