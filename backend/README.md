# Key of History - Backend Service

Bu servis, **Key of History** uygulamasının RESTful API katmanıdır. Java 17 ve Spring Boot 3 tabanlı olup, veri saklama için ilişkisel veritabanı (PostgreSQL/H2) kullanmaktadır. 

.NET ekosisteminden gelen geliştiriciler için **ASP.NET Core Web API** mimarisi ile benzer kavramlar kullanılarak geliştirilmiştir.

---

## 🛠️ Kullanılan Teknolojiler

*   **Java 17 (LTS)**: Güçlü, kararlı ve modern dil özellikleri sunan Java sürümü.
*   **Spring Boot 3.2.5**: Java dünyasının en popüler, konfigurasyon yükü azaltılmış web framework'ü (ASP.NET Core muadili).
*   **Spring Data JPA (Hibernate)**: Entity Framework Core benzeri, veritabanı işlemlerini kolaylaştıran ORM ve veri erişim katmanı.
*   **Lombok**: `@Data`, `@Builder`, `@RequiredArgsConstructor` gibi anotasyonlarla Java'daki getter, setter ve constructor boilerplate kodlarını derleme aşamasında otomatik üreten araç.
*   **Jakarta Validation**: `@NotBlank`, `@Size` gibi özniteliklerle model-level doğrulama sağlar (DataAnnotations muadili).
*   **H2 Database (In-Memory)**: Yerel testler ve veritabanı gerektirmeyen hızlı çalıştırma için kullanılan bellek içi DB.
*   **PostgreSQL**: Containerized ve production ortamları için ana ilişkisel veritabanı.
*   **Springdoc OpenAPI (Swagger)**: API uç noktalarını belgelemek ve tarayıcı üzerinden kolayca test etmek için kullanılan entegrasyon (.NET'teki Swashbuckle/Swagger muadili).
*   **RabbitMQ**: Olay bazlı asenkron mesajlaşma (Event-Driven messaging, .NET'teki MassTransit muadili).
*   **Redis**: İstatistik ve oturum verilerini yüksek performansla saklamak için kullanılan in-memory veritabanı (Cache-aside / Materialized View).

---

## 🏗️ Katmanlı Mimari Yapısı

Proje, kurumsal standartlarda **Layered Architecture (Katmanlı Mimari)** prensibine göre ayrılmıştır:

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/keyofhistory/backend/
│   │   │   ├── config/       --> Configuration Beans (OpenAPI, RabbitMQ, CORS etc.)
│   │   │   ├── controller/   --> REST Endpoints (Controllers)
│   │   │   ├── model/        --> JPA Entities (DbModels / Tables)
│   │   │   ├── dto/          --> Event/Message Models (Integration Events)
│   │   │   ├── repository/   --> Data Access Layer (DbSet / Repositories)
│   │   │   ├── service/      --> Business Logic Layer & Cache management
│   │   │   ├── consumer/     --> RabbitMQ Message Listeners (Consumers)
│   │   │   ├── exception/    --> Custom Exceptions & Global Exception Handler
│   │   │   └── BackendApplication.java --> Entry Point (Program.cs)
│   │   └── resources/
│   │       ├── application.properties      --> Ana yapılandırma
│   │       ├── application-h2.properties   --> Yerel/H2 profil ayarları
│   │       └── application-prod.properties --> Postgres/Prod profil ayarları
│   └── test/                 --> Birim ve Entegrasyon Testleri
├── Dockerfile                --> Multi-stage Docker yapılandırması
└── pom.xml                   --> Maven Bağımlılık Yönetimi (.csproj / NuGet)
```

---

## 🚀 Nasıl Çalıştırılır?

Projeyi çalıştırmak için 2 farklı yöntem kullanabilirsiniz.

### Yöntem A: Docker Compose ile Çalıştırma (Önerilen - Sıfır Kurulum)
Eğer bilgisayarınızda Java veya Maven kurulu değilse, sadece **Docker Desktop** kullanarak tüm sistemi (Backend + PostgreSQL + RabbitMQ + Redis) ayağa kaldırabilirsiniz.

1.  Projenin kök dizinine gidin (çalışma alanınızın en üst klasörü).
2.  Şu komutu çalıştırarak servisleri build edin ve başlatın:
    ```bash
    docker-compose -f docker-compose.dev.yml up --build
    ```
3.  Uygulama **8080** portunda yayına başlayacaktır: `http://localhost:8080`
4.  **RabbitMQ Yönetim Paneli** port 15672'de yayında olacaktır: `http://localhost:15672` (Kullanıcı: `guest` / Şifre: `guest`)
5.  **Redis** servisi `6379` portundan hizmet verecektir.

### Yöntem B: Yerel JDK & Maven ile Çalıştırma
Eğer yerel makinenize Java 17 ve Maven yüklemek isterseniz:

1.  `backend` klasörüne girin.
2.  Bağımlılıkları indirmek ve projeyi derlemek için:
    ```bash
    mvn clean install
    ```
3.  Uygulamayı H2 (Bellek İçi DB) modunda çalıştırmak için:
    ```bash
    mvn spring-boot:run
    ```
4.  H2 Console arayüzüne tarayıcınızdan erişip tabloları inceleyebilirsiniz:
    *   **URL:** `http://localhost:8080/h2-console`
    *   **JDBC URL:** `jdbc:h2:mem:keyofhistorydb`
    *   **Username:** `sa`
    *   **Password:** `password`

---

## 🧪 Testleri Çalıştırma

Birim testleri (Unit Tests) çalıştırmak için:

*   **Maven yüklü ise:**
    ```bash
    mvn test
    ```
*   **Docker yüklü ise (Geçici container üzerinde test çalıştırma):**
    ```bash
    docker run --rm -v "$(pwd)":/app -w /app maven:3.9.6-eclipse-temurin-17 mvn test
    ```

---

## 📖 Swagger UI & API Dokümantasyonu

Spring Boot Web API'miz için otomatik oluşturulan Swagger arayüzü sayesinde tüm istekleri tarayıcınızdan test edebilirsiniz:
*   **Swagger UI Arayüzü:** `http://localhost:8080/swagger-ui/index.html` (ASP.NET Core'daki `/swagger` benzeri)
*   **OpenAPI JSON Spec:** `http://localhost:8080/v3/api-docs`

---

## 📡 API Uç Noktaları (Endpoints)

Tüm istekler için base URL: `http://localhost:8080/api`

### 1. Tüm Olayları Listeleme veya Arama
*   **HTTP Metodu:** `GET`
*   **Endpoint:** `/events` veya arama filtresiyle `/events?search=İstanbul`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "title": "İstanbul'un Fethi",
        "description": "Doğu Roma İmparatorluğu'nun başkenti Constantinople'un Osmanlılar tarafından alınması.",
        "eventDate": "1453-05-29",
        "era": "Orta Çağ",
        "location": "İstanbul"
      }
    ]
    ```

### 2. ID ile Olay Getirme
*   **HTTP Metodu:** `GET`
*   **Endpoint:** `/events/{id}` (Örn: `/events/1`)

### 3. Yeni Olay Ekleme (Event-Driven Tetikleyici)
*   **HTTP Metodu:** `POST`
*   **Endpoint:** `/events`
*   **Request Body:**
    ```json
    {
      "title": "Cumhuriyetin İlanı",
      "description": "Türkiye Cumhuriyeti Devletinin resmen kurulması.",
      "eventDate": "1923-10-29",
      "era": "Yakın Çağ",
      "location": "Ankara"
    }
    ```
*   **Asenkron Süreç:** Bu kayıt atıldığında veritabanına yazılır ve hemen ardından RabbitMQ'ya bir `HistoricalEventEvent` fırlatılır. `EventConsumer` bu mesajı asenkron olarak dinler, dönem bazlı istatistikleri tekrardan hesaplar ve **Redis**'e yazar.

### 4. Dönem İstatistikleri (Redis Cache)
*   **HTTP Metodu:** `GET`
*   **Endpoint:** `/stats`
*   **Response (200 OK):** (Redis'ten doğrudan okunan cache verisi)
    ```json
    {
      "Orta Çağ": 1,
      "Yakın Çağ": 1
    }
    ```
