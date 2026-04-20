# Dockerfile - Multi-stage build with Java 21
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
ENV TZ=Asia/Ho_Chi_Minh
ENV JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Ho_Chi_Minh"
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
