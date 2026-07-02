package com.keyofhistory.backend.config;

import com.keyofhistory.backend.model.HistoricalEvent;
import com.keyofhistory.backend.repository.HistoricalEventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final HistoricalEventRepository eventRepository;

    public DatabaseSeeder(HistoricalEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (eventRepository.count() == 0) {
            HistoricalEvent event1 = new HistoricalEvent();
            event1.setTitle("Antakya'nın Büyük Depremi ve İlk Yıkılışı (MS 115)");
            event1.setDescription("Roma İmparatoru Trajan'ın Part seferi sırasında kışlamak için ordusuyla Antakya'da bulunduğu sırada, tarihin en şiddetli depremlerinden biri yaşandı. Şehir yerle bir oldu, imparator pencereden kaçarak kurtuldu. Bu olay, antik kaynaklarda şehrin kaderini belirleyen ilk büyük yıkım olarak anılır.");
            event1.setEventDate("MS 115");
            event1.setEra("Antik Çağ");
            event1.setLocation("Antakya Merkez");

            HistoricalEvent event2 = new HistoricalEvent();
            event2.setTitle("Bizans Dönemi Büyük Antakya Depremi (MS 526)");
            event2.setDescription("Antakya tarihinin en ölümcül felaketinde, yaklaşık 250.000 insan hayatını kaybetti. Deprem sonrasında çıkan devasa yangınlar antik dünyanın en görkemli saraylarını ve kiliselerini küle çevirdi. Şehir bu felaketin ardından 'Theoupolis' (Tanrı'nın Şehri) adıyla yeniden inşa edilmeye çalışıldı.");
            event2.setEventDate("MS 526");
            event2.setEra("Orta Çağ");
            event2.setLocation("Antakya Merkez");

            HistoricalEvent event3 = new HistoricalEvent();
            event3.setTitle("Bölgede Alevi (Nusayri) İnancının ve Hızır Kültürünün Kökleşmesi");
            event3.setDescription("Hatay ve özellikle Antakya, Defne, Samandağ bölgelerinde yaşayan Alevi (Nusayri) toplumunun kimliği, bölgenin çok dinli hoşgörü iklimiyle bütünleşmiştir. Samandağ sahilindeki Hızır (a.s.) Makamı ve Musa Ağacı gibi ziyaret yerleri, Hızır kültünün bölgedeki manevi derinliğinin en büyük simgeleridir.");
            event3.setEventDate("Tarihsel Süreç");
            event3.setEra("Orta Çağ");
            event3.setLocation("Samandağ & Defne");

            HistoricalEvent event4 = new HistoricalEvent();
            event4.setTitle("Fransız İşgaline Karşı Dörtyol'da İlk Kurşun (1918)");
            event4.setDescription("I. Dünya Savaşı sonrasında Hatay bölgesini işgal eden Fransız güçlerine karşı, Dörtyol'un Karakese köyünde milli mücadelenin ilk kurşunu sıkıldı. Kara Mehmet Çavuş önderliğindeki yerel direniş, tüm güney cephesindeki kurtuluş meşalesini yakan tarihi olay olmuştur.");
            event4.setEventDate("19 Aralık 1918");
            event4.setEra("Yakın Çağ");
            event4.setLocation("Dörtyol");

            HistoricalEvent event5 = new HistoricalEvent();
            event5.setTitle("Bağımsız Hatay Devleti'nin Kurulması");
            event5.setDescription("Milletler Cemiyeti kararı ve Atatürk'ün kararlı dış politikası neticesinde, Fransız mandasından ayrılan bağımsız Hatay Devleti kuruldu. Cumhurbaşkanlığına Tayfur Sökmen, Başbakanlığa ise Abdurrahman Melek seçildi. Antakya'daki meclis binasında tarihi kararlar alınmaya başlandı.");
            event5.setEventDate("2 Eylül 1938");
            event5.setEra("Yakın Çağ");
            event5.setLocation("Antakya");

            HistoricalEvent event6 = new HistoricalEvent();
            event6.setTitle("Hatay'ın Türkiye Cumhuriyeti'ne Katılması");
            event6.setDescription("Hatay Millet Meclisi, tarihi bir oylamayla oy birliği ile Hatay Devleti'nin sonlandırılarak anavatana katılma kararını kabul etti. 23 Temmuz 1939'da Fransız birliklerinin şehri tamamen terk etmesi ve Türk ordusunun şehre girmesiyle Hatay, Türkiye'nin bir ili oldu.");
            event6.setEventDate("23 Haziran 1939");
            event6.setEra("Yakın Çağ");
            event6.setLocation("Hatay");

            HistoricalEvent event7 = new HistoricalEvent();
            event7.setTitle("Asrın Felaketi: 6 Şubat Depremi");
            event7.setDescription("Kahramanmaraş merkezli depremlerde en büyük yıkımı yaşayan Hatay, tarihi boyunca yaşadığı yedinci büyük yıkımla karşı karşıya kaldı. Habib-i Neccar Camii, Rum Ortodoks Kilisesi, Tarihi Meclis Binası yerle bir olurken, Antakya sokakları ve kültürel mirası devasa bir yara aldı. Şehir şu anda yeniden küllerinden doğmaya çalışıyor.");
            event7.setEventDate("6 Şubat 2023");
            event7.setEra("Yakın Çağ");
            event7.setLocation("Hatay Genel");

            eventRepository.saveAll(Arrays.asList(event1, event2, event3, event4, event5, event6, event7));
            System.out.println(">> DatabaseSeeder: Initial Hatay historical events successfully seeded into Postgres database.");
        }
    }
}
