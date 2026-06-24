# ==============================================================================
# Build Stage
# ==============================================================================
# Using Ubuntu-based eclipse-temurin which has full multi-arch support (linux/amd64, linux/arm64)
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build

# Copy pom.xml first to leverage Docker layer caching for dependencies
COPY pom.xml .

# Download dependencies offline (helps speed up subsequent builds)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the jar package (skipping tests during Docker build, tests run in CI/CD)
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Run Stage
# ==============================================================================
# Ubuntu-based JRE image for full compatibility with Apple Silicon (ARM64)
FROM eclipse-temurin:17-jre

WORKDIR /app

# Create a non-root system user and group for security in Debian/Ubuntu
RUN groupadd -r spring && useradd -r -g spring spring
USER spring

# Copy jar from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose port (metadata)
EXPOSE 8080

# Configure JVM parameters for container optimization (memory limits)
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
