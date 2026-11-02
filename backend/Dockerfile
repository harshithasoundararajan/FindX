
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN groupadd --system --gid 1001 findx && \
    useradd --system --uid 1001 --gid 1001 findx

COPY --from=build /app/target/findx.jar app.jar

USER 1001:1001

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
