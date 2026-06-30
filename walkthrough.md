# Key of History - Walkthrough & Design Evolution

Bu doküman, projemizde şimdiye kadar yaptığımız geliştirmeleri ve son talep doğrultusunda uyguladığımız **Pixel Art (16-bit Arcade)** tasarım sistemini özetlemektedir.

---

## 🕹️ Son Durum: Pixel Art Tasarım Dönüşümü

Uygulamayı modern glassmorphism temasından çıkartıp, **retro arcade / RPG oyunları** tarzında pikselli, yüksek kontrastlı ve son derece eğlenceli bir tasarıma kavuşturduk.

### 🎨 Görsel ve Yapısal Değişiklikler
*   **Tipografi:** Google Fonts üzerinden **`Press Start 2P`** (Logo ve Butonlar için) ve **`VT323`** (Genel Yazılar ve Formlar için) retro yazı tipleri entegre edildi.
*   **Renk Paleti:** Klasik 16-bit oyun paletlerine (DB32) uygun olarak derin mor arka plan (`#181425`), koyu gri paneller, altın sarısı başlıklar ve canlı cyan detayları seçildi.
*   **Pikselli Sınırlar (Borders):** Kartların ve pencerelerin köşeleri yuvarlatılmış cam efektinden çıkarılarak, **4px kalınlığında düz siyah çerçeveler** ve retro hissi veren **kaydırılmış siyah gölgeler** (`box-shadow: 6px 6px 0px #000;`) ile kaplandı.
*   **3D Oyun Butonları:** Butonlar üzerine gelindiğinde aşağı kayan ve tıklandığında içe çöken retro oyun menüsü butonları haline getirildi.
*   **Olay Kartları (Timeline):** Olay kartları artık bir retro RPG oyunundaki **Quest Log (Görev Günlüğü)** pencerelerine benziyor. Her dönem (Antik, Orta, Yeni, Yakın Çağ) kendine has çerçeve renkleriyle ayrıldı.
*   **Redis Göstergesi:** Redis cache durum göstergesi pikselli bir yeşil "can barı" (health bar) şeklinde yanıp sönecek şekilde tasarlandı.

---

## 🏗️ Mimari ve Veri Akışı

Arayüzün arkasındaki veri akışımız şu şekildedir:

```mermaid
graph TD
    React[React Frontend - Port 3000] <-->|HTTP REST /api| Nginx[Nginx Reverse Proxy]
    Nginx <-->|Proxy Pass| Backend[Spring Boot - Port 8080]
    Backend <-->|JPA| Postgres[(PostgreSQL)]
    Backend -->|RabbitTemplate| Rabbit[RabbitMQ - Port 5672]
    Consumer[EventConsumer] <--|Listen| Rabbit
    Consumer -->|Update Stats| Redis[(Redis - Port 6379)]
    Backend <-->|Read Stats| Redis
```

---

## 🧪 Doğrulama ve Çalıştırma

TypeScript derleme hatası (`verbatimModuleSyntax` nedeniyle oluşan type-only import hatası) giderildi ve projeyi Docker üzerinde tekrardan derleme aşamasına aldık.

### Docker Compose ile Yeniden Derleme Komutu:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### URL'ler ve Paneller:
*   **React Frontend:** [http://localhost:3000](http://localhost:3000) (Pixel Art UI)
*   **Swagger API Docs:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
*   **RabbitMQ Dashboard:** [http://localhost:15672](http://localhost:15672) (guest / guest)

---

## ☸️ Phase 4: Kubernetes Local Dev Setup

Uygulamayı local Kubernetes (Docker Desktop K8s) kümesi üzerinde başarıyla ayağa kaldırdık. 

### Çalıştırılan Adımlar:
1.  **Namespace Oluşturma:** `keyofhistory-test` ve `keyofhistory-prod` ad alanları [namespaces.yaml](file:///Users/eymensezen/Desktop/keyofhistory/k8s/namespaces.yaml) ile oluşturuldu.
2.  **Manifestleri Uygulama:** `k8s/test/` altındaki Postgres, Redis, RabbitMQ, Spring Boot Backend ve Nginx Frontend manifestleri uygulandı.
3.  **İmaj Aktarımı (Containerd Sınırı Çözümü):** Docker Desktop Kubernetes containerd motoru kullandığı ve host üzerindeki Docker daemon imajlarını doğrudan göremediği için disk yazma/okuma yükünü sıfırlayan pipe yöntemiyle lokal imajlar doğrudan containerd içine aktarıldı:
    ```bash
    docker save keyofhistory-backend:latest | kubectl exec -i debug-node -n keyofhistory-test -- ctr -n k8s.io images import -
    docker save keyofhistory-frontend:latest | kubectl exec -i debug-node -n keyofhistory-test -- ctr -n k8s.io images import -
    ```
4.  **Bölmelerin (Pods) Durumu:** Pod'lar başarıyla başlatıldı ve hepsi `Running` durumuna geldi.

### Kubernetes Test URL:
*   **React Frontend (Ingress Domain):** [http://keyofhistory.local](http://keyofhistory.local) (Sıradan bir internet sitesi gibi port numarası yazmadan erişilebilir!)

---

## 🚀 Phase 5: CI/CD Pipeline (GitHub Actions)

Otomatik test, derleme, konteynerleştirme ve GitOps manifest güncelleme akışlarını yöneten **CI/CD İş Akışı (Pipeline)** [.github/workflows/ci-cd.yml](file:///Users/eymensezen/Desktop/keyofhistory/.github/workflows/ci-cd.yml) dosyası ile kuruldu.

### İş Akışı Aşamaları (Jobs):
1.  **Build & Test Backend:** Java 17 ortamında backend testlerini çalıştırır (`mvn clean verify`).
2.  **Build & Lint Frontend:** Node.js v20 ile React projesinin bağımlılıklarını kurup derleme testini yapar (`npm run build`).
3.  **Package & Deploy (CD):** Testler geçtikten sonra sadece `main` dalına (branch) yapılan push'larda veya `v*` sürüm etiketlerinde (tags) tetiklenir:
    *   GitHub Container Registry (GHCR) üzerinde oturum açar (ekstra secret şifre tanımı gerektirmeden güvenli ve hızlı).
    *   Backend ve Frontend Docker imajlarını derleyip GHCR'a yükler.
    *   **GitOps Güncellemesi:** Kubernetes manifestlerindeki (`k8s/test/` veya `k8s/prod/`) imaj etiketlerini en yeni derleme etiketi (örn: `sha-<commit_sha>` veya sürüm tag'i `v1.0.0`) ile otomatik olarak günceller ve değişiklikleri GitHub reposuna geri push eder.

---

## 🗺️ Yeni Eklenen Özellik: Hatay Tarih Haritası

Kullanıcının isteği üzerine uygulamaya tamamen interaktif ve retro RPG tarzında bir **Hatay Tarih Haritası** ekledik.

### 📍 Harita Özellikleri
- **İnteraktif SVG Tasarımı:** Hatay sınırları pikselli ve kalın çerçeveli bir SVG haritası olarak yerel koordinatlarla sıfırdan çizildi.
- **Retro RPG Göstergeleri:** Haritadaki her ilçe, üzerine gelindiğinde büyüyen, aktif seçildiğinde pikselli RPG bayrak animasyonu ve etrafında genişleyen dalgalanma efekti (`pulse ring`) oluşturan pinlerle işaretlendi.
- **Nisanyan Tarzı Köken Bilgileri (Etimoloji):** İlçelerin ve bunlara bağlı mahallelerin (örneğin Antakya'nın *Habib-i Neccar* ve *Kurtuluş Caddesi*, Samandağ'ın *Çevlik* ve *Vakıflı* mahalleleri) antik/eski adları, isimlerinin köken bilimsel kökleri (etimolojisi) ve detaylı tarihçeleri bir **RPG Diyalog Kutusu** tarzında sergilenmektedir.
- **Arayüz Navigasyonu:** Kullanıcıların Zaman Tüneli ile Harita görünümü arasında kesintisiz geçiş yapabilmesi için pikselli düğmelerden oluşan bir üst gezinti menüsü yerleştirildi.
