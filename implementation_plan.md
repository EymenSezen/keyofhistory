# DevOps & Full-Stack Java/React Roadmap (Key of History)

Merhaba! Bir senior .NET Developer olarak Java, React, Docker, Kubernetes ve CI/CD ekosistemlerine adım atmanızı kolaylaştıracak, bu teknolojileri birbirleriyle ilişkilendiren ve test/prod ortamlarını simüle eden kapsamlı bir sistem kurgulayacağız.

.NET Core'daki tecrübelerinizi Java/Spring Boot dünyasına yansıtarak ilerleyeceğiz. Örneğin:
*   **Spring Boot** $\approx$ **ASP.NET Core**
*   **Spring Data JPA / Hibernate** $\approx$ **Entity Framework Core (EF Core)**
*   **Maven / pom.xml** $\approx$ **NuGet / .csproj**
*   **Application Properties (YAML/Properties)** $\approx$ **appsettings.json**

Projeyi "Key of History" (Tarihin Anahtarı) konseptinde, tarihi olayları listeleyen, arayan ve yeni olaylar ekleyen ufak ama şık bir web uygulaması olarak tasarlayacağız.

---

## Genişletilmiş Mimari Tasarım (Event-Driven & Cache)

```mermaid
graph TD
    React[React Frontend] <-->|REST API| API[Spring Boot REST API]
    API <-->|Spring Data JPA| DB[(PostgreSQL)]
    API -->|Session / Token Store| Redis[(Redis Cache/Auth)]
    API -->|Publish Events| Rabbit[RabbitMQ Broker]
    Consumer[Spring Boot Event Consumer] <-- |Subscribe| Rabbit
    Consumer -->|Update Stats| Redis
    API <-->|Read Stats| Redis
```

### 1. Bileşenlerin Rolleri
*   **Database (PostgreSQL)**: Kalıcı veri saklama (Tarihi Olaylar, Kullanıcı Tanımları).
*   **Message Broker (RabbitMQ)**: Event-Driven yapıyı kurmak için. Bir "Tarihi Olay" CRUD işlemi (örneğin ekleme/güncelleme) yapıldığında, backend bir event yayınlayacak.
*   **Event Consumer (Spring Boot Module/Service)**: RabbitMQ'dan event'leri dinleyip, asenkron olarak istatistikleri (örneğin: yüzyıllara göre olay sayıları, en çok işlem gören dönemler) hesaplayacak.
*   **Cache & Session (Redis)**:
    1.  **Auth & Session**: İleride ekleyeceğimiz Authentication/Authorization süreçlerinde session veya token blacklist/whitelist bilgilerini saklamak için.
    2.  **Stats Cache**: Consumer'ın RabbitMQ üzerinden işleyip hazırladığı istatistik verilerini cache'lemek için. API bu verileri direkt Redis'ten okuyacak.

---

## Yol Haritası (Phases)

### Phase 1: Java Spring Boot Backend (CRUD & DB Setup)
*   Yerel Java kurulumuna ihtiyaç duymadan, projenin Maven Wrapper (`mvnw`) altyapısını kuracağız.
*   Spring Boot REST API projesi oluşturulacak.
*   PostgreSQL veritabanı bağlantısı ve Spring Data JPA (EF Core muadili) ile `HistoricalEvent` tablosunun CRUD operasyonları yazılacak.
*   Yerel testler ve geliştirme için Docker üzerinde PostgreSQL çalıştıracağız.

### Phase 2: Event-Driven & Caching (RabbitMQ & Redis)
*   Backend projemize RabbitMQ ve Redis kütüphanelerini ekleyeceğiz.
*   CRUD işlemleri yapıldığında RabbitMQ'ya event fırlatan yapıyı kuracağız.
*   Aynı projede (veya ayrı bir modülde) RabbitMQ consumer'ı yazıp, gelen event'e göre Redis üzerindeki istatistikleri güncelleyeceğiz.
*   Redis'ten veri okuyan `/api/stats` endpoint'ini hazırlayacağız.

### Phase 3: React + TypeScript Frontend
*   Vite ile React, TypeScript projesini ayağa kaldıracağız.
*   CRUD ekranları ve Redis'ten beslenen "İstatistik/Dashboard" bileşenlerini tasarlayacağız.
*   Modern, responsive ve estetik bir tasarım yapacağız.

### Phase 4: Dockerization & Docker Compose
*   Spring Boot API + Consumer, React Frontend, PostgreSQL, RabbitMQ ve Redis için Dockerfile ve `docker-compose.yml` hazırlayacağız.
*   Tek bir `docker-compose up` komutuyla tüm bu mimariyi yerelde test edebileceksiniz.

### Phase 5: Kubernetes (Docker Desktop K8s)
*   `test` ve `prod` namespace'leri oluşturulacak.
*   PostgreSQL, RabbitMQ, Redis, Backend ve Frontend için K8s Deployments, Services, ConfigMaps, Secrets, PVC'ler yazılacak.
*   **Lokal Ingress Entegrasyonu:** Lokal Kubernetes üzerinde Nginx Ingress Controller kurulup, `keyofhistory.local` adresini frontend servisine bağlayan Ingress manifestleri yazılacak ve `/etc/hosts` güncellenecek.

### Phase 6: CI/CD Pipeline (GitHub Actions)
*   Otomatik test, build, Docker image push ve Kubernetes deployment (manifest güncelleme) süreçleri kurgulanacak.

### Phase 7: Real Public Cloud Deployment (Production Domain) [NEW]
*   **Cloud Kubernetes:** AWS EKS, Google GKE veya DigitalOcean DOKS gibi yönetilen bir Kubernetes kümesi (veya VPS üzerinde K3s) kurulacak.
*   **DNS & LoadBalancer:** Gerçek bir alan adı (domain) satın alınıp, A/CNAME kayıtları Kubernetes LoadBalancer IP'sine yönlendirilecek.
*   **Let's Encrypt & SSL (HTTPS):** Küme içerisine `cert-manager` kurularak otomatik SSL sertifikası üretimi ve HTTPS yönlendirmesi kurgulanacak.

---

## User Review Required

> [!NOTE]
> Phase 7'de gerçek bir alan adına ve canlı ortama deploy edeceğimiz için bulut sağlayıcı servisleri (AWS, DigitalOcean vb.) ve domain kayıt ücretleri gibi ufak maliyetler oluşacaktır.

## Open Questions

> [!IMPORTANT]
> 1. **Bulut Sağlayıcı Tercihi:** Phase 7 için aklınızda olan veya halihazırda kullandığınız bir bulut sağlayıcı var mı? (Giriş seviyesi ve kolaylık açısından **DigitalOcean** veya **Hetzner/VPS + K3s** önerilir; kurumsal standartlar için **AWS** tercih edilebilir).
> 2. **Alan Adı (Domain):** Deploy edeceğimiz alan adını satın aldınız mı veya belirlediniz mi?

---

## Verification Plan

### Automated Tests
*   Backend REST API testleri.
*   RabbitMQ Listener testleri.

### Manual Verification
*   Docker Compose ile ayağa kaldırıp API endpoint'lerini tetikleme.
*   RabbitMQ Management Console ve Redis CLI üzerinden kuyruk ve cache verilerini inceleme.
*   Lokalde `http://keyofhistory.local` adresi üzerinden siteye portsuz erişim testi.
