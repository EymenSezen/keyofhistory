import React, { useState } from 'react';

export interface Neighborhood {
  name: string;
  oldName?: string;
  etymology?: string;
  history?: string;
}

export interface District {
  id: string;
  name: string;
  description: string;
  history: string;
  coordinates: { x: number; y: number };
  neighborhoods: Neighborhood[];
}

// Special historical neighborhoods with custom rich data
const HISTORICAL_NEIGHBORHOODS_DETAILS: Record<string, Neighborhood> = {
  // Antakya
  'Habib-i Neccar': {
    name: 'Habib-i Neccar',
    oldName: 'Aşağı Antakya / Roma Mahallesi',
    etymology: 'Adını, Yasin Suresi\'nde bahsi geçen ve İsa\'nın havarilerine ilk inanan kişi olup şehit edilen Habib-i Neccar\'dan (Marangoz Habib) alır.',
    history: 'Anadolu\'da inşa edilen ilk cami olan Habib-i Neccar Camii bu mahallededir. Caminin altında pagan tapınağı ve Hristiyan mezarları yan yana yer almaktadır.'
  },
  'Kurtuluş Caddesi': {
    name: 'Kurtuluş Caddesi',
    oldName: 'Herod Caddesi / Via Triumphalis',
    etymology: 'Antik dönemde geceleri meşalelerle aydınlatılan dünyanın ilk sütunlu caddesidir.',
    history: 'Roma döneminde kralların ve imparatorların zafer alayları düzenlediği caddenin altında bugün 9 metre derinlikte antik mozaikler ve sütunlar yatmaktadır.'
  },
  'Güllübahçe': {
    name: 'Güllübahçe',
    oldName: 'Eski Antakya / Yahudi Mahallesi',
    etymology: 'Tarihi Antakya evlerinin bahçelerindeki gül ve yasemin kokularından dolayı bu ismi almıştır.',
    history: 'Dar sokakları, yüksek avlu duvarlı taş evleri ve tarihi Antakya Havrası ile şehrin çok kültürlü dokusunu en net yansıtan mahallelerdendir.'
  },
  // Defne
  'Harbiye': {
    name: 'Harbiye',
    oldName: 'Daphne / Defne',
    etymology: 'Mitolojide su perisi Daphne\'nin, kendisini kovalayan ışık tanrısı Apollon\'dan kaçarken toprağa sığınıp defne ağacına dönüştüğü efsanevi yerdir.',
    history: 'Roma döneminde Apollon Tapınağı\'nın bulunduğu alandır. Bölgede yapılan kazılarda çıkan harika mozaikler bugün Hatay Arkeoloji Müzesi\'nde sergilenmektedir.'
  },
  'Sümerler': {
    name: 'Sümerler',
    oldName: 'Asi Kıyısı',
    etymology: 'Cumhuriyet döneminde kurulan yerleşime tarihi Mezopotamya uygarlığı Sümerler\'in adı verilmiştir.',
    history: 'Asi Nehri\'nin hemen kıyısında yer alan, antik su değirmenlerinin ve bentlerinin tarihi kalıntılarını barındıran yeşil mesire alanı.'
  },
  // Samandağ
  'Çevlik': {
    name: 'Çevlik',
    oldName: 'Seleucia Pieria',
    etymology: 'Büyük İskender\'in generali Seleucus Nicator\'un kendi adıyla kurduğu antik liman şehridir.',
    history: 'Dağdan gelen sel sularının limanı doldurmasını engellemek için Roma İmparatoru Vespasianus tarafından başlatılıp oğlu Titus tarafından tamamlanan, tamamı insan eliyle oyulmuş 1380 metre uzunluğundaki meşhur Titus Tüneli ve Beşikli Mağara buradadır.'
  },
  'Vakıflı': {
    name: 'Vakıflı',
    oldName: 'Vakıf Köyü / Vakıf',
    etymology: 'Türkiye\'nin tamamı Ermeni nüfusundan oluşan son ve tek Ermeni köyüdür.',
    history: 'Musa Dağı eteklerinde yer alır. Yüz yılı aşkın tarihi evleri, tarihi Ermeni kilisesi, organik tarımı ve ünlü likörleri ile bilinir.'
  },
  'Hıdırbey': {
    name: 'Hıdırbey',
    oldName: 'Kabadi / Hıdırbey',
    etymology: 'Adını köyün meydanında bulunan, 3000 yıllık olduğuna inanılan devasa Musa Ağacı çınarından alır.',
    history: 'Efsaneye göre Musa Peygamber, Hızır ile buluşmak üzere dağa çıkarken asasını buraya saplamış, su içtikten sonra geriye döndüğünde asanın yeşerip dev bir çınara dönüştüğünü görmüştür.'
  },
  // İskenderun
  'Karayılan': {
    name: 'Karayılan',
    oldName: 'Sarıseki Geçidi',
    etymology: 'Milli Mücadele döneminde Fransız işgaline karşı destansı bir direniş gösteren çete lideri Karayılan\'dan (Mehmet Sait) adını almıştır.',
    history: 'Amanos Dağları geçidinde Fransız birliklerine yapılan ilk pusu ve direniş hareketlerinin başladığı tarihi mahalledir.'
  },
  'Pac': {
    name: 'Pac',
    oldName: 'Meydan / İskenderun Kapısı',
    etymology: 'Eski Türkçe ve Arapça sınır/vergi geçiş noktası veya köprü manasına gelen "Bac" kelimesinden evrilmiştir.',
    history: 'Tarihi kervan yollarının İskenderun limanına giriş yaptığı, gümrük kapısının kurulduğu tarihi ticaret meydanı.'
  },
  // Arsuz
  'Gözcüler': {
    name: 'Gözcüler',
    oldName: 'Rhosopolis / Rhosus',
    etymology: 'Denizden gelebilecek korsan saldırılarını gözetlemek amacıyla kurulan tarihi gözetleme kulelerinden dolayı bu adı almıştır.',
    history: 'Bizans döneminden kalma antik kilise temelleri ve havarilerin Hristiyanlığı yaymak üzere Anadolu\'ya ayak bastığı ilk liman kalıntıları buradadır.'
  },
  // Belen
  'Halilbey': {
    name: 'Halilbey',
    oldName: 'Belen Derbendi',
    etymology: 'Kanuni Sultan Süleyman döneminde geçidi korumak ve şenlendirmek üzere yerleştirilen Halil Bey Derebeyi\'nden adını almıştır.',
    history: 'Kanuni Sultan Süleyman\'ın emriyle 1553 yılında kervanların güvenliği için inşa edilen Belen Kervansarayı, tarihi cami ve hamam bu mahallededir.'
  },
  // Reyhanlı
  'Yenişehir': {
    name: 'Yenişehir',
    oldName: 'Alalakh / Açana Höyük',
    etymology: 'Reyhanlı\'nın genişleme döneminde kurulan modern yerleşime bu isim verilmiştir.',
    history: 'Mahalle sınırları içinde yer alan Açana Höyük\'te yapılan kazılarda, antik Hitit sarayları, tabletler ve meşhur Kral Yarim-Lim saray kalıntıları bulunmuştur.'
  },
  // Altınözü
  'Tokaçlı': {
    name: 'Tokaçlı',
    oldName: 'Cuna / Juna',
    etymology: 'Türkiye\'deki tek tamamı Arap Ortodoks Hristiyan nüfusundan oluşan zeytinci köyüdür.',
    history: 'Mahallede bulunan tarihi Maria Ana (Meryem Ana) Rum Ortodoks Kilisesi 14. yüzyıldan kalmadır ve bölgenin en eski ibadethanelerindendir.'
  },
  'Kozkalesi': {
    name: 'Kozkalesi',
    oldName: 'Cursus / Cursat Kalesi',
    etymology: 'Adını mahallenin tepesinde yükselen tarihi Haçlı kalesi Kozkalesi\'nden (Antik Cursat Kalesi) alır.',
    history: 'Antakya Prensliği döneminde şehri güneyden korumak için inşa edilmiş, derin uçurumlarla çevrili savunma kalesi kalıntıları bu mahallededir.'
  }
};

// Raw lists of all neighborhoods for each of the 15 districts of Hatay
const NEIGHBORHOODS_BY_DISTRICT: Record<string, string[]> = {
  antakya: [
    'Habib-i Neccar', 'Kurtuluş Caddesi', 'Güllübahçe', 'Akevler', 'Akasya', 'Aksaray', 'Altınçay', 
    'Bağrıyanık', 'Cebrail', 'Cumhuriyet', 'Esentepe', 'Esenlik', 'Gazi', 'General Şükrü Kanatlı', 
    'Havuzlar', 'Haraparası', 'İplik Pazarı', 'Kantara', 'Karaali', 'Karabağ', 'Kışlasaray', 
    'Kuyulu', 'Kurtuluş', 'Meydan', 'Odabaşı', 'Saraykent', 'Şirince', 'Ürgen Paşa', 'Zenginler', 
    'Zoğallı', 'Açıkdere', 'Alahan', 'Anayazı', 'Apaydın', 'Avsuyu', 'Bitiren', 'Bohşin', 
    'Büyükdalyan', 'Demirköprü', 'Derince', 'Doğanköy', 'Ekinci', 'Gökçegöz', 'Gülderen', 
    'Güzelburç', 'Hasanlı', 'Karlısu', 'Kuruyer', 'Madenboyu', 'Maraşboğazı', 'Narlıca', 
    'Serinyol', 'Suvatlı', 'Tahtaköprü', 'Uzunali', 'Yağmurcu'
  ],
  defne: [
    'Harbiye', 'Sümerler', 'Aknehir', 'Aşağıokçular', 'Balıklıdere', 'Bostancık', 'Çekmece', 
    'Dursunlu', 'Gümüşgöze', 'Meydancık', 'Subaşı', 'Toygarlı', 'Turunçlu', 'Yeşilpınar', 
    'Ballıöz', 'Bahçeköy', 'Büyükçat', 'Çardaklı', 'Değirmenyolu', 'Hancağız', 'Hüseyinli', 
    'Karşıyaka', 'Koçören', 'Orhanlı', 'Özbek', 'Sinanlı', 'Tavla', 'Yeniçağ'
  ],
  samandag: [
    'Çevlik', 'Vakıflı', 'Hıdırbey', 'Atatürk', 'Cemal Gürsel', 'Kurtderesi', 'Mağaracık', 
    'Tekebaşı', 'Yeni Mahalle', 'Yeşilada', 'Batıayaz', 'Büyükoba', 'Ceylandere', 'Çamlıyayla', 
    'Çanakoluk', 'Çöğürlü', 'Deniz', 'Eriklikuyu', 'Fidanlı', 'Gözene', 'Huzurlu', 'Kapısuyu', 
    'Karadağ', 'Karaçay', 'Koyunoğlu', 'Kuşalanı', 'Meydan', 'Mızraklı', 'Sutaşı', 'Süzgeç', 
    'Tomruksuyu', 'Uzunbağ', 'Yeniköy', 'Yeşilyazı'
  ],
  iskenderun: [
    'Karayılan', 'Pac', 'Barıştepe', 'Buluttepe', 'Çay', 'Dumlupınar', 'Esentepe', 'Gürsel', 
    'Hürriyet', 'İsmet İnönü', 'Kocatepe', 'Meydan', 'Modern Evler', 'Muradiye', 'Numune', 
    'Piri Reis', 'Sakarya', 'Sanayi', 'Savaş', 'Süleymaniye', 'Yenişehir', 'Yıldırım Tepe', 
    'Kurtuluş', 'Barbaros', 'Cırtıman', 'Akarca', 'Kavaklıoluk', 'Orhangazi', 'Aşkarbeyli', 
    'Denizciler', 'Azganlık', 'Karahüseyinli', 'Bekbele', 'Suçıkağı'
  ],
  arsuz: [
    'Gözcüler', 'Akçalı', 'Arpagedik', 'Arpaderesi', 'Uluçınar', 'Avcılarsuyu', 'Beyköy', 
    'Gökmeydan', 'Hacıahmetli', 'Hüyük', 'Işıklı', 'Kale', 'Karagöz', 'Karaağaç', 'Konacık', 
    'Madenli', 'Nardüzü', 'Pirinçlik', 'Şarkkonak', 'Tatarlı', 'Tülek', 'Üçgüllük', 'Yelkoma', 
    'Derekuyu', 'Helvalı', 'Haymaseki', 'Kışla', 'Kozaklı'
  ],
  belen: [
    'Halilbey', 'Abdi İpekçi', 'Bakras', 'Fatih', 'Kömürçukuru', 'Kıcı', 'Ötençay', 'Soğukoluk', 
    'Şenbük', 'Tosyalı', 'Yapraklar', 'Benlidere', 'Çakallı', 'Derebahçe', 'Güzelyayla', 
    'Karapelit', 'Müftüler', 'Sarımazı'
  ],
  reyhanli: [
    'Yenişehir', 'Cemil Meriç', 'Adalar', 'Bağlar', 'Fidanlık', 'Gültepe', 'Harran', 'Pınarbaşı', 
    'Yeni Mahalle', 'Yeşilova', 'Alakuzu', 'Akyayla', 'Bayırlı', 'Beşaslan', 'Bükülmez', 
    'Cüdeydi', 'Çakıryiçek', 'Davutpaşa', 'Fevzipaşa', 'Gazimürsel', 'Konuklu', 'Kumtepe', 
    'Nergizli', 'Oğulpınar', 'Tayfur Sökmen', 'Terzihüyük', 'Uzunkavak', 'Varışlı'
  ],
  altinozu: [
    'Tokaçlı', 'Kozkalesi', 'Alakent', 'Akamber', 'Akdarı', 'Avuttepe', 'Babatorun', 'Boynuyoğun', 
    'Büyükburç', 'Carcurum', 'Çakıryiçek', 'Çatbaşı', 'Çetenli', 'Erbaş', 'Enek', 'Fatih', 
    'Hacıpaşa', 'Karsu', 'Kansu', 'Karbeyaz', 'Kıyıgören', 'Kolcular', 'Kurudere', 'Kurtmezrası', 
    'Mayadalı', 'Mursal', 'Oymaklı', 'Sarılar', 'Sarıbük', 'Seferli', 'Sofular', 'Tepehan', 
    'Toprakhisar', 'Turkmani', 'Yarseli', 'Yenişehir', 'Yiğityolu', 'Yunushanı', 'Ziyaret'
  ],
  kirikhan: [
    'Alibeyli', 'Alsancak', 'Barbaros', 'Cumhuriyet', 'Fatih', 'Mimar Sinan', 'Narlıdere', 
    'Yeni Mahalle', 'Aygırgölü', 'Baldıran', 'Baytarlı', 'Bektaşlı', 'Camuzkışlası', 'Ceylanlı', 
    'Çamsarı', 'Çataltepe', 'Çiloğlanlı', 'Danaahmetli', 'Delibekirli', 'Demirkonak', 'Gözkaya', 
    'İncirli', 'Kaletepe', 'Karaelmas', 'Karamağara', 'Kasmanlı', 'Kodallı', 'Kurtlusoğuksu', 
    'Mahmutlu', 'Muratpaşa', 'Özkızılkaya', 'Rehanlı', 'Soğuksu', 'Torunlu', 'Yarkaya'
  ],
  hassa: [
    'Akbez', 'Aktepe', 'Ardıçlı', 'Bintaş', 'Dervişpaşa', 'Girne', 'Hacılar', 'Küreci', 
    'Söğüt', 'Yalankoz', 'Yuvalı', 'Bademli', 'Çardak', 'Demrek', 'Eğribucak', 'Gazeluşağı', 
    'Haydarlar', 'Kaleköy', 'Koruhüyük', 'Mazmanlı', 'Saylak', 'Tepebaşı', 'Zeytinoba'
  ],
  yayladagi: [
    'Çamaltı', 'Kurtuluş', 'Leylekli', 'Şenköy', 'Turfanda', 'Yassıca', 'Arslanyazı', 
    'Aydınbahçe', 'Bezge', 'Çakı', 'Çatbaşı', 'Denizgören', 'Dutlubahçe', 'Görentaş', 
    'Güzelyurt', 'Hisarardı', 'Karacurun', 'Karaköse', 'Kışlak', 'Kulaç', 'Olgunlar', 
    'Sebenoba', 'Sungur', 'Şakşak', 'Uluyol', 'Yalaz', 'Yenice', 'Yeşiltepe'
  ],
  erzin: [
    'Bahçelievler', 'Gökdere', 'Hürriyet', 'İstiklal', 'Mahmutlu', 'Mustafakemalpaşa', 
    'Şükrüpaşa', 'Yeni Mahalle', 'Yeşiltepe', 'Kızılçent', 'Karahüseyinli', 'Yoncadüzü', 
    'Başlamış', 'Kuyuluk', 'Turunçlu'
  ],
  dortyol: [
    'Altınçağ', 'Çaylı', 'Numune Evler', 'Karakese', 'Kuzuculu', 'Ocaklı', 'Sanayi', 
    'Yeşilköy', 'Yeniyurt', 'Kışlalar', 'Konaklı', 'Özerli', 'Yeşiltepe', 'Altınvadisi', 'Payaslı'
  ],
  payas: [
    'Çağlalık', 'Karacami', 'Karbeyaz', 'Kürtül', 'Yeni Mahalle', 'Yıldırım Beyazıt', 'Fatih', 
    'Cumhuriyet', 'Kozludere', 'Sincan', 'İstiklal', 'Atatürk'
  ],
  kumlu: [
    'Akpınar', 'Cumhuriyet', 'Fevzipaşa', 'Gökçeoğlu', 'Hatay', 'Kaletepe', 'Kırma', 
    'Aktaş', 'Akavak', 'Gülova', 'Hamam', 'Kara Süleymanlı', 'Muharrem', 'Şarkhamamı', 
    'Yenişehir', 'Yeşilova'
  ]
};

const HATAY_DISTRICTS: District[] = [
  {
    id: 'antakya',
    name: 'Antakya',
    description: 'Hatay\'ın tarihi ve idari merkezi. Tarih boyunca Doğu\'nun Kraliçesi olarak adlandırılmış antik metropol.',
    history: 'MÖ 300 yılında Büyük İskender\'in generali Seleucus I Nicator tarafından kurulmuştur. Roma İmparatorluğu\'nun en büyük 3. şehri olmuş, Hristiyanlık isminin ilk kez kullanıldığı St. Pierre Kilisesi\'ne ve Habib-i Neccar Camii\'ne ev sahipliği yapmaktadır.',
    coordinates: { x: 290, y: 370 },
    neighborhoods: [] // Will be populated from the raw lists programmatically
  },
  {
    id: 'defne',
    name: 'Defne',
    description: 'Mitolojik hikayeleri, şelaleleri, defne sabunu ve zengin Roma mozaikleriyle ünlü yeşil ilçe.',
    history: 'Antik çağda "Daphne" adıyla bilinen sayfiye yeri. Roma imparatorlarının, generallerinin ve zenginlerinin villalarının yer aldığı, şelaleleriyle ünlü antik dinlenme ve tapınma merkezidir.',
    coordinates: { x: 260, y: 420 },
    neighborhoods: []
  },
  {
    id: 'samandag',
    name: 'Samandağ',
    description: 'Asi Nehri\'nin denize döküldüğü nokta. Dev tünelleri ve Türkiye\'nin tek Ermeni köyüyle meşhur kıyı ilçesi.',
    history: 'Antik Seleucia Pieria liman kentinin bulunduğu stratejik bölge. Havariler Petrus ve Pavlus\'un Anadolu\'dan Roma\'ya yelken açtığı liman olarak bilinir.',
    coordinates: { x: 170, y: 460 },
    neighborhoods: []
  },
  {
    id: 'iskenderun',
    name: 'İskenderun',
    description: 'Körfezin incisi. Büyük İskender tarafından kurulan tarihi liman ve sanayi kenti.',
    history: 'MÖ 333 yılında Büyük İskender\'in İssos Savaşı\'nda Pers kralı Darius\'u mağlup etmesinden sonra "Alexandretta" adıyla kurulmuştur. Akdeniz ticareti için tarih boyunca bir kapı olmuştur.',
    coordinates: { x: 230, y: 220 },
    neighborhoods: []
  },
  {
    id: 'arsuz',
    name: 'Arsuz',
    description: 'Tarihi balıkçı limanı, temiz sahilleri ve antik kilise kalıntılarıyla turistik sahil şeridi.',
    history: 'Antik çağdaki adı "Rhosus"tur. Helenistik, Roma ve Bizans dönemlerinde aktif bir liman kenti ve havarilerin seyahat rotası olmuştur.',
    coordinates: { x: 170, y: 310 },
    neighborhoods: []
  },
  {
    id: 'belen',
    name: 'Belen',
    description: 'Amanos Dağları\'nı aşan tarihi geçit. İpek Yolu kervanlarının can damarı.',
    history: 'Tarih boyunca Suriye Geçidi (Syrian Gates) olarak bilinen, Anadolu\'yu Ortadoğu\'ya bağlayan en önemli askeri ve ticari geçittir. Büyük İskender, Roma lejyonları ve Haçlılar bu geçidi kullanmıştır.',
    coordinates: { x: 290, y: 240 },
    neighborhoods: []
  },
  {
    id: 'reyhanli',
    name: 'Reyhanlı',
    description: 'Amik Ovası\'nın verimli topraklarında, antik Hitit sarayları ve Cemil Meriç\'in izlerini taşıyan sınır ilçesi.',
    history: 'MÖ 18. yüzyıla kadar uzanan Geç Hitit Mukish Krallığı\'nın başkenti Alalakh\'ın kurulduğu Amik Ovası\'nın göbeğidir.',
    coordinates: { x: 430, y: 390 },
    neighborhoods: []
  },
  {
    id: 'altinozu',
    name: 'Altınözü',
    description: 'Tarihi zeytin ağaçları, derin vadileri ve Haçlı kaleleriyle bilinen sınır ilçesi.',
    history: 'Tarihi zeytincilik kültürünün merkezi. Roma ve Bizans döneminde tarımsal depo ve sığınak olarak kullanılan kalelere ev sahipliği yapmıştır.',
    coordinates: { x: 340, y: 470 },
    neighborhoods: []
  },
  {
    id: 'kirikhan',
    name: 'Kırıkhan',
    description: 'Amik Ovası\'nın kuzeyinde yer alan, Beyazid-i Bestami türbesi ve antik kervansaray yolları ile ünlü ilçe.',
    history: 'Tarihi İpek Yolu güzergahında bir konaklama noktasıdır. Adını, bölgedeki tarihi hanların yıkık/kırık olmasından dolayı "Kırık Han" şeklinde almıştır.',
    coordinates: { x: 390, y: 260 },
    neighborhoods: []
  },
  {
    id: 'hassa',
    name: 'Hassa',
    description: 'Amanos Dağları\'nın doğu yamaçlarında kurulu, volkanik arazileri ve üzüm bağlarıyla ünlü ilçe.',
    history: 'Tarih öncesi çağlardan beri yerleşim gören bölge, Osmanlı İmparatorluğu döneminde "Hassa" (özel/seçkin yerleşim) adını almıştır.',
    coordinates: { x: 440, y: 130 },
    neighborhoods: []
  },
  {
    id: 'yayladagi',
    name: 'Yayladağı',
    description: 'Hatay\'ın en güney ucu. Antik Keldağ dağı, ipek dokumacılığı ve lokumlarıyla ünlü dağlık ilçe.',
    history: 'Antik çağda Casius Dağı (Keldağ) olarak bilinen ve tanrılara kurban sunulan kutsal dağın eteklerindedir. Roma ve Bizans döneminde sınır karakolu vazifesi görmüştür.',
    coordinates: { x: 210, y: 530 },
    neighborhoods: []
  },
  {
    id: 'erzin',
    name: 'Erzin',
    description: 'Narenciye bahçeleri, termal kaplıcaları ve İssos antik kenti kalıntılarıyla Hatay\'ın en kuzey ilçesi.',
    history: 'MÖ 333 yılında Büyük İskender ile Pers Kralı III. Darius arasında yapılan ünlü İssos Savaşı\'nın gerçekleştiği antik Epiphaneia (İssos) kenti kalıntıları bu ilçededir.',
    coordinates: { x: 270, y: 70 },
    neighborhoods: []
  },
  {
    id: 'dortyol',
    name: 'Dörtyol',
    description: 'Milli Mücadele\'de ilk kurşunun atıldığı kahraman ilçe. Narenciye ve sanayi kenti.',
    history: 'Tarihi geçitlerin kavşağında yer alır. I. Dünya Savaşı sonrasında Fransız işgaline karşı Anadolu\'daki ilk kurşunun atılarak milli direnişin başlatıldığı tarihi yerdir.',
    coordinates: { x: 280, y: 120 },
    neighborhoods: []
  },
  {
    id: 'payas',
    name: 'Payas',
    description: 'Tarihi Sokullu Mehmet Paşa Külliyesi ve kalesiyle ünlü sahil ve sanayi ilçesi.',
    history: 'Yavuz Sultan Selim\'in Mısır Seferi dönüşünde ordugah kurduğu, 1574 yılında Mimar Sinan tarafından Sokullu Mehmet Paşa adına devasa bir külliye (kervansaray, hamam, medrese, cami) inşa edilen tarihi liman kentidir.',
    coordinates: { x: 260, y: 170 },
    neighborhoods: []
  },
  {
    id: 'kumlu',
    name: 'Kumlu',
    description: 'Amik Ovası\'nın ortasında yer alan, tarıma dayalı düzlük ve sınır ilçesi.',
    history: 'Tarihi kervan yollarının geçtiği, kaplıcaları (Reyhanlı Hamamı) ile antik dönemlerden bu yana şifa merkezi olarak kullanılan tarımsal yerleşimdir.',
    coordinates: { x: 430, y: 320 },
    neighborhoods: []
  }
];

// Programmatically populate the neighborhoods arrays
HATAY_DISTRICTS.forEach((district) => {
  const neighborhoodNames = NEIGHBORHOODS_BY_DISTRICT[district.id] || [];
  district.neighborhoods = neighborhoodNames.map((name) => {
    // If we have custom details for this neighborhood, use them
    if (HISTORICAL_NEIGHBORHOODS_DETAILS[name]) {
      return HISTORICAL_NEIGHBORHOODS_DETAILS[name];
    }
    // Otherwise, generate standard default fallback data
    return {
      name,
      oldName: 'Tarihi kayıt yok',
      etymology: 'Bu mahallenin isminin spesifik bir etimolojik köken kaydı bulunmamaktadır. Genellikle Türkçe kökenli modern isimdir.',
      history: `Bu mahalle, cumhuriyet döneminde idari sınırların düzenlenmesi veya yeni yerleşimlerin kurulmasıyla oluşmuştur. İlçe genel tarihi olan "${district.name}" tarihi detaylarını üstteki panelden inceleyebilirsiniz.`
    };
  });
});

export const HatayMap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(HATAY_DISTRICTS[0]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(
    HATAY_DISTRICTS[0].neighborhoods[0]
  );

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setSelectedNeighborhood(district.neighborhoods[0] || null);
  };

  return (
    <div className="hatay-map-container">
      <div className="section-header">
        <h2>
          <svg className="section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          Hatay Tarih Haritası
        </h2>
        <span className="logo-badge" style={{ margin: 0 }}>Tüm İlçeler & Mahalleler Gözlemcisi</span>
      </div>

      <div className="map-view-layout">
        {/* Left Side: Interactive SVG Map */}
        <div className="map-panel">
          <div className="map-scroll-instructions">
            🕹️ İLÇE PİNLERİNE TIKLAYARAK TÜM MAHALLELERİNİ KEŞFEDİN
          </div>
          
          <div className="map-svg-wrapper">
            <svg 
              viewBox="0 0 600 600" 
              className="map-svg"
            >
              {/* Ocean / Water Grid */}
              <rect width="600" height="600" fill="#1b2038" />
              
              {/* Grid Lines for retro look */}
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#232a4a" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="600" fill="url(#map-grid)" />

              {/* Mediterranean Sea Text */}
              <text x="30" y="250" fill="#2d3b6e" fontFamily="Press Start 2P" fontSize="10" transform="rotate(-90 30 250)">
                AKDENİZ (MEDITERRANEAN)
              </text>
              <text x="385" y="520" fill="#2d3b6e" fontFamily="Press Start 2P" fontSize="10">
                SURİYE SINIRI
              </text>

              {/* Stylized Boundary of Hatay (Landmass) */}
              <path 
                d="M 280,50 L 350,50 L 390,70 L 450,130 L 460,180 L 420,260 L 450,330 L 440,420 L 340,500 L 260,550 L 200,560 L 190,520 L 140,460 L 150,420 L 190,340 L 200,280 L 250,220 L 220,150 L 240,110 Z" 
                fill="#2e4236" 
                stroke="#000" 
                strokeWidth="6"
                className="map-landmass"
              />

              {/* District boundaries & highlights */}
              {HATAY_DISTRICTS.map((d) => {
                const isActive = selectedDistrict?.id === d.id;
                return (
                  <g 
                    key={d.id} 
                    onClick={() => handleDistrictSelect(d)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Large invisible click target circle to make clicking easy and highly responsive */}
                    <circle 
                      cx={d.coordinates.x} 
                      cy={d.coordinates.y} 
                      r="35" 
                      fill="rgba(0,0,0,0)" 
                    />

                    {/* Pulsing selection circle behind active district */}
                    {isActive && (
                      <circle 
                        cx={d.coordinates.x} 
                        cy={d.coordinates.y} 
                        r="25" 
                        fill="rgba(243, 198, 63, 0.15)"
                        stroke="rgba(243, 198, 63, 0.5)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="map-pulse-ring"
                      />
                    )}
                    
                    {/* District Map Pin (Castle Icon for Retro Theme) */}
                    <g 
                      transform={`translate(${d.coordinates.x - 10}, ${d.coordinates.y - 10})`}
                      className={`map-pin ${isActive ? 'active-pin' : ''}`}
                    >
                      {/* Flag / Pin Shape */}
                      <rect x="2" y="2" width="16" height="12" fill={isActive ? '#f3c63f' : '#41a6f6'} stroke="#000" strokeWidth="2" />
                      <line x1="2" y1="2" x2="2" y2="18" stroke="#000" strokeWidth="2.5" />
                      {/* Inner pixel design */}
                      <rect x="5" y="5" width="3" height="3" fill="#000" />
                      <rect x="10" y="5" width="3" height="3" fill="#000" />
                    </g>

                    {/* Label Box */}
                    <rect 
                      x={d.coordinates.x - 45} 
                      y={d.coordinates.y + 16} 
                      width="90" 
                      height="18" 
                      fill="#000" 
                      stroke={isActive ? '#f3c63f' : '#000'}
                      strokeWidth="2"
                    />
                    <text 
                      x={d.coordinates.x} 
                      y={d.coordinates.y + 29} 
                      fill="#fff" 
                      fontFamily="VT323" 
                      fontSize="14" 
                      textAnchor="middle"
                    >
                      {d.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Retro RPG Dialogue Cards / Details */}
        <div className="map-details-panel">
          
          {/* District Summary Card */}
          {selectedDistrict && (
            <div className="retro-map-card district-card">
              <div className="card-header">
                <h3>🏞️ İLÇE: {selectedDistrict.name.toUpperCase()}</h3>
              </div>
              <div className="card-body">
                <p className="district-desc">{selectedDistrict.description}</p>
                <div className="retro-divider"></div>
                <p className="district-history"><strong>Tarihçesi:</strong> {selectedDistrict.history}</p>
              </div>
            </div>
          )}

          {/* Neighborhood Selector & Details Card */}
          {selectedDistrict && (
            <div className="retro-map-card neighborhood-card">
              <div className="card-header">
                <h3>🏘️ MAHALLE SEÇİCİ ({selectedDistrict.neighborhoods.length} Mahalle)</h3>
              </div>
              <div className="card-body">
                <div className="neighborhood-list">
                  {selectedDistrict.neighborhoods.map((n) => (
                    <button
                      key={n.name}
                      onClick={() => setSelectedNeighborhood(n)}
                      className={`neighborhood-tab-btn ${
                        selectedNeighborhood?.name === n.name ? 'active-tab' : ''
                      }`}
                    >
                      📍 {n.name}
                    </button>
                  ))}
                </div>

                {/* Selected Neighborhood Details */}
                {selectedNeighborhood ? (
                  <div className="neighborhood-details-box">
                    <h4 className="nb-title">{selectedNeighborhood.name}</h4>
                    
                    {selectedNeighborhood.oldName && (
                      <div className="nb-meta-row">
                        <span className="nb-meta-label">Antik/Eski Adı:</span>
                        <span className="nb-meta-value old-name">{selectedNeighborhood.oldName}</span>
                      </div>
                    )}

                    {selectedNeighborhood.etymology && (
                      <div className="nb-meta-row etymology-box">
                        <span className="nb-meta-label">Kökeni (Etimoloji):</span>
                        <p className="nb-meta-value">{selectedNeighborhood.etymology}</p>
                      </div>
                    )}

                    {selectedNeighborhood.history && (
                      <div className="nb-history-box">
                        <span className="nb-meta-label">Tarihi ve Önemi:</span>
                        <p className="nb-history-text">{selectedNeighborhood.history}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-neighborhood-selected">
                    Mahalle seçerek detayları inceleyin.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
