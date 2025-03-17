FROM openjdk:20-jdk-slim
WORKDIR /app
COPY target/GenRepos.jar /app/GenRepos.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "GetRepos.jar"]
