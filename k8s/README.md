# Key of History - Kubernetes Orchestration (Docker Desktop K8s / Minikube)

Bu dizin, uygulamamızın **Test** (`keyofhistory-test`) ve **Production** (`keyofhistory-prod`) ortamlarının Kubernetes cluster'ı üzerinde nasıl kurgulanacağını tanımlar.

---

## 🏗️ Mimari Yapı ve Ortam Farkları

Test ve Production ortamlarını izole etmek için Kubernetes **Namespaces** yapısı kullanılmıştır. Ortamlar arasındaki temel farklar:

| Özellik | Test Ortamı (`keyofhistory-test`) | Prod Ortamı (`keyofhistory-prod`) |
| :--- | :--- | :--- |
| **Kalıcı Depolama (PVC)** | 1 GiB (Hafif yerel testler için) | 5 GiB (Daha büyük veri havuzu) |
| **Ölçekleme (Replicas)** | 1 Pod (Backend ve Frontend için) | **2 Pod (High Availability - Yüksek Erişilebilirlik)** |
| **Dış Bağlantı (Access)** | **NodePort** (Doğrudan `http://localhost:30080` ile erişim) | **Ingress** (Nginx Ingress Controller üzerinden hostname ile) |
| **Kaynak Sınırları (Limits)**| Tanımlanmadı (Local CPU/RAM serbest) | Belirlendi (Pod başına CPU ve Memory limitleri) |

---

## 🚀 Kurulum Adımları

Yerel Kubernetes testleri için **Docker Desktop Kubernetes** (veya Minikube) kullanabilirsiniz. Docker Desktop ayarlarından Kubernetes özelliğini aktif ettiğinizden emin olun.

### 1. Hazırlık: Docker İmajlarını Kubernetes'e Tanıtma
Kubernetes pod'larının yerelde oluşturduğumuz imajları kullanabilmesi için imajları local Docker daemon üzerinde build etmeliyiz. (Docker Desktop K8s local daemon'ı paylaştığı için ekstra push işlemine gerek yoktur, `imagePullPolicy: IfNotPresent` kuralı sayesinde imajları doğrudan yerelden çeker).

Projeyi derlemek için (daha önce derlemediyseniz):
```bash
# Backend derleme
docker build -t keyofhistory-backend:latest ./backend

# Frontend derleme
docker build -t keyofhistory-frontend:latest ./frontend
```

### 2. Namespaces (Ortamları) Oluşturma
Ortamların sınırlarını belirleyen ad alanlarını tanımlayalım:
```bash
kubectl apply -f namespaces.yaml
```

### 3. Test Ortamını Ayağa Kaldırma (`keyofhistory-test`)
Test dizinindeki tüm manifest'leri tek komutla uygulayabilirsiniz:
```bash
kubectl apply -f test/
```

**Test Ortamına Erişim:**
Test ortamındaki frontend servisi `NodePort` (`30080` portu) ile açılmıştır. Tarayıcınızdan doğrudan şu adrese gidebilirsiniz:
👉 **[http://localhost:30080](http://localhost:30080)**

---

### 4. Production Ortamını Ayağa Kaldırma (`keyofhistory-prod`)
Üretim ortamı manifest'lerini uygulayalım:
```bash
kubectl apply -f prod/
```

**Production Ortamına Erişim (Ingress Setup):**
Production ortamında frontend doğrudan dışarı açılmaz. Bunun yerine **Ingress Rules** (`ingress.yaml`) kullanılır.
1.  Cluster'ınızda Nginx Ingress Controller kurulu olmalıdır:
    ```bash
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
    ```
2.  Bilgisayarınızın `hosts` dosyasına domain yönlendirmesini ekleyin (Mac/Linux için `/etc/hosts`):
    ```bash
    # Hosts dosyasına ekleyin
    127.0.0.1 keyofhistory.local
    ```
3.  Tarayıcınızdan production ortamına kurumsal domain ile erişin:
    👉 **[http://keyofhistory.local](http://keyofhistory.local)**

---

## 🛠️ Yararlı Kubernetes Komutları (Troubleshooting)

İşlerin yolunda gidip gitmediğini izlemek için şu komutları kullanabilirsiniz:

*   **Pod Durumlarını Listeleme:**
    ```bash
    kubectl get pods -n keyofhistory-test
    kubectl get pods -n keyofhistory-prod
    ```

*   **Backend Loglarını İzleme:**
    ```bash
    kubectl logs -n keyofhistory-test -l app=backend -f
    ```

*   **Redis CLI'a Sızma:**
    ```bash
    kubectl exec -it -n keyofhistory-test deploy/redis -- redis-cli
    ```

*   **K8s İçindeki RabbitMQ Paneline Port Forwarding İle Bağlanma:**
    Kubernetes içindeki RabbitMQ ClusterIP olarak korunduğu için yönetim paneline yerelden tünel açarak bağlanabiliriz:
    ```bash
    kubectl port-forward -n keyofhistory-test svc/rabbitmq 15672:15672
    ```
    *(Ardından tarayıcınızdan `http://localhost:15672` adresine gidebilirsiniz).*

*   **Tüm Sistemi Temizleme/Silme:**
    ```bash
    kubectl delete -f test/
    kubectl delete -f prod/
    kubectl delete -f namespaces.yaml
    ```

---

## 📦 Kubernetes Pod Yönetimi (Pod Management)

Pod'ları başlatmak, yeniden başlatmak ve ölçeklemek için kullanabileceğiniz temel komutlar:

*   **Pod'ları Başlatma:**
    ```bash
    kubectl apply -f namespaces.yaml
    kubectl apply -f test/
    ```
docker save keyofhistory-backend:latest | kubectl exec -i debug-node -n keyofhistory-test -- ctr -n k8s.io images import -


*   **Pod'ları Yeniden Başlatma (İmaj Değişikliklerinde):**
    Deployment'ları yeniden başlatarak pod'ların yeni kodları (güncellenmiş local imajları) containerd cache'inden çekmesini sağlayabilirsiniz:
    ```bash
    kubectl rollout restart deployment/backend -n keyofhistory-test
    kubectl rollout restart deployment/frontend -n keyofhistory-test
    ```

*   **Tek Bir Pod'u Zorla Silip Yeniden Başlatma:**
    Eğer tek bir pod'u silerseniz, ReplicaSet veya Deployment onun yerine anında yeni bir pod başlatacaktır:
    ```bash
    kubectl delete pod <pod-name> -n keyofhistory-test
    ```

*   **Pod Sayısını Ölçekleme (Scaling):**
    Örneğin backend pod sayısını yerelde 3'e çıkartmak veya düşürmek için:
    ```bash
    kubectl scale deployment/backend --replicas=3 -n keyofhistory-test
    ```
