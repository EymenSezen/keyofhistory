# Key of History - React Frontend

Bu, **Key of History** uygulamasının istemci (frontend) arayüzüdür. **Vite**, **React**, **TypeScript** ve **Vanilla CSS** kullanılarak geliştirilmiştir. 

Herhangi bir CSS kütüphanesi (Tailwind vb.) kullanılmadan, tamamen özel (custom) glassmorphism ve dark-mode temasıyla sıfırdan tasarlanmıştır.

---

## 🛠️ Kullanılan Teknolojiler

*   **Vite**: Hızlı geliştirme (Hot Module Replacement) ve optimize edilmiş production bundle sunan yeni nesil derleyici.
*   **React 18 & TypeScript**: Tip güvenli bileşen tabanlı UI geliştirme.
*   **Nginx (Docker'da)**: Derlenmiş statik dosyaları (HTML/JS/CSS) sunan ve `/api` çağrılarını backend container'ına yönlendiren reverse proxy.

---

## 🏗️ Bileşen Yapısı

*   `src/services/api.ts`: Backend REST API uç noktalarıyla iletişimi sağlayan servis katmanı.
*   `src/components/Header.tsx`: Uygulama logosunu ve başlığını içeren bileşen.
*   `src/components/StatsDashboard.tsx`: **Redis** önbelleğinden beslenen dönem istatistiklerini gösteren dashboard kartları.
*   `src/components/EventList.tsx`: Veritabanındaki tarihî olayları arama filtresiyle listeleyen kronolojik timeline.
*   `src/components/EventForm.tsx`: Yeni olay ekleme veya mevcut olayı güncelleme form bileşeni.

---

## 🚀 Nasıl Çalıştırılır?

### Yöntem A: Docker Compose ile (Tüm Sistem - Önerilen)
Sistemi tek komutla ayağa kaldırmak için projenin kök dizininde (frontend klasörünün dışında) şu komutu çalıştırın:
```bash
docker-compose -f docker-compose.dev.yml up --build
```
Bu komut Nginx sunucusunu **3000** portunda ayağa kaldıracaktır. Tarayıcınızdan **[http://localhost:3000](http://localhost:3000)** adresine girerek uygulamayı test edebilirsiniz.

### Yöntem B: Yerel Geliştirme Modu (Vite Dev Server)
Yerel makinenizde Node.js yüklüyse ve kod üzerinde anlık değişiklikler yaparak geliştirmek isterseniz:

1.  `frontend` dizinine girin:
    ```bash
    cd frontend
    ```
2.  Bağımlılıkları yükleyin (daha önce yüklenmediyse):
    ```bash
    npm install
    ```
3.  Vite geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```
4.  Uygulama **5173** portunda açılacaktır: `http://localhost:5173`
    *(Not: `vite.config.ts` içinde yaptığımız proxy ayarı sayesinde, `http://localhost:5173` üzerinden giden `/api` istekleri otomatik olarak `http://localhost:8080` backend adresine yönlendirilecektir).*

---

## 🔒 Nginx Reverse Proxy Rolü (DevOps Detayı)
[nginx.conf](file:///Users/eymensezen/Desktop/keyofhistory/frontend/nginx.conf) dosyası, Docker ortamında çalışırken çok kritik bir rol üstlenir:
1.  React uygulaması tek sayfalık bir uygulamadır (SPA). Tarayıcıda sayfalar yenilendiğinde 404 hatası alınmaması için istekleri `index.html`'e yönlendirir (`try_files $uri $uri/ /index.html;`).
2.  Tarayıcıdan gelen `/api/*` isteklerini yakalar ve Docker ağı içerisindeki backend servisine (`http://backend:8080/api/`) yönlendirir. Bu sayede **CORS** hataları önlenir ve Kubernetes Ingress yapısı yerelde simüle edilmiş olur.
