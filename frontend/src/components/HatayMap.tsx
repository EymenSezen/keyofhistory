import React, { useState } from 'react';

export interface Neighborhood {
  name: string;
  oldName?: string;
  etymology?: string;
  history: string;
}

export interface District {
  id: string;
  name: string;
  description: string;
  history: string;
  coordinates: { x: number; y: number };
  neighborhoods: Neighborhood[];
}

const HATAY_DISTRICTS: District[] = [
  {
    id: 'antakya',
    name: 'Antakya',
    description: 'Hatay\'ın merkez ilçesi. Tarih boyunca Doğu\'nun Kraliçesi olarak adlandırılmış antik metropol.',
    history: 'MÖ 300 yılında Büyük İskender\'in generali Seleucus I Nicator tarafından kurulmuştur. Roma İmparatorluğu\'nun en büyük 3. şehri olmuş, Hristiyanlık isminin ilk kez kullanıldığı St. Pierre Kilisesi\'ne ve Habib-i Neccar Camii\'ne ev sahipliği yapmaktadır.',
    coordinates: { x: 280, y: 360 },
    neighborhoods: [
      {
        name: 'Habib-i Neccar',
        oldName: 'Aşağı Antakya / Roma Mahallesi',
        etymology: 'Adını, Yasin Suresi\'nde bahsi geçen ve İsa\'nın havarilerine ilk inanan kişi olup şehit edilen Habib-i Neccar\'dan (Marangoz Habib) alır.',
        history: 'Anadolu\'da inşa edilen ilk cami olan Habib-i Neccar Camii bu mahallededir. Caminin altında pagan tapınağı ve Hristiyan mezarları yan yana yer almaktadır.'
      },
      {
        name: 'Kurtuluş Caddesi',
        oldName: 'Herod Caddesi / Via Triumphalis',
        etymology: 'Antik dönemde geceleri meşalelerle aydınlatılan dünyanın ilk sütunlu caddesidir.',
        history: 'Roma döneminde kralların ve imparatorların zafer alayları düzenlediği caddenin altında bugün 9 metre derinlikte antik mozaikler ve sütunlar yatmaktadır.'
      },
      {
        name: 'Güllübahçe',
        oldName: 'Eski Antakya / Yahudi Mahallesi',
        etymology: 'Tarihi Antakya evlerinin bahçelerindeki gül ve yasemin kokularından dolayı bu ismi almıştır.',
        history: 'Dar sokakları, yüksek avlu duvarlı taş evleri ve tarihi Antakya Havrası ile şehrin çok kültürlü dokusunu en net yansıtan mahallelerdendir.'
      }
    ]
  },
  {
    id: 'defne',
    name: 'Defne',
    description: 'Mitolojik hikayeleri, şelaleleri, defne sabunu ve zengin Roma mozaikleriyle ünlü yeşil ilçe.',
    history: 'Antik çağda "Daphne" adıyla bilinen sayfiye yeri. Roma imparatorlarının, generallerinin ve zenginlerinin villalarının yer aldığı, şelaleleriyle ünlü antik dinlenme ve tapınma merkezidir.',
    coordinates: { x: 250, y: 410 },
    neighborhoods: [
      {
        name: 'Harbiye',
        oldName: 'Daphne / Defne',
        etymology: 'Mitolojide su perisi Daphne\'nin, kendisini kovalayan ışık tanrısı Apollon\'dan kaçarken toprağa sığınıp defne ağacına dönüştüğü efsanevi yerdir.',
        history: 'Roma döneminde Apollon Tapınağı\'nın bulunduğu alandır. Bölgede yapılan kazılarda çıkan harika mozaikler bugün Hatay Arkeoloji Müzesi\'nde sergilenmektedir.'
      },
      {
        name: 'Sümerler',
        oldName: 'Asi Kıyısı',
        etymology: 'Cumhuriyet döneminde kurulan yerleşime tarihi Mezopotamya uygarlığı Sümerler\'in adı verilmiştir.',
        history: 'Asi Nehri\'nin hemen kıyısında yer alan, antik su değirmenlerinin ve bentlerinin tarihi kalıntılarını barındıran yeşil mesire alanı.'
      }
    ]
  },
  {
    id: 'samandag',
    name: 'Samandağ',
    description: 'Asi Nehri\'nin denize döküldüğü nokta. Dev tünelleri ve Türkiye\'nin tek Ermeni köyüyle meşhur kıyı ilçesi.',
    history: 'Antik Seleucia Pieria liman kentinin bulunduğu stratejik bölge. Havariler Petrus ve Pavlus\'un Anadolu\'dan Roma\'ya yelken açtığı liman olarak bilinir.',
    coordinates: { x: 160, y: 440 },
    neighborhoods: [
      {
        name: 'Çevlik',
        oldName: 'Seleucia Pieria',
        etymology: 'Büyük İskender\'in generali Seleucus Nicator\'un kendi adıyla kurduğu antik liman şehridir.',
        history: 'Dağdan gelen sel sularının limanı doldurmasını engellemek için Roma İmparatoru Vespasianus tarafından başlatılıp oğlu Titus tarafından tamamlanan, tamamı insan eliyle oyulmuş 1380 metre uzunluğundaki meşhur Titus Tüneli ve Beşikli Mağara buradadır.'
      },
      {
        name: 'Vakıflı',
        oldName: 'Vakıf Köyü / Vakıf',
        etymology: 'Türkiye\'nin tamamı Ermeni nüfusundan oluşan son ve tek Ermeni köyüdür.',
        history: 'Musa Dağı eteklerinde yer alır. Yüz yılı aşkın tarihi evleri, tarihi Ermeni kilisesi, organik tarımı ve ünlü likörleri ile bilinir.'
      },
      {
        name: 'Hıdırbey',
        oldName: 'Kabadi / Hıdırbey',
        etymology: 'Adını köyün meydanında bulunan, 3000 yıllık olduğuna inanılan devasa Musa Ağacı çınarından alır.',
        history: 'Efsaneye göre Musa Peygamber, Hızır ile buluşmak üzere dağa çıkarken asasını buraya saplamış, su içtikten sonra geriye döndüğünde asanın yeşerip dev bir çınara dönüştüğünü görmüştür.'
      }
    ]
  },
  {
    id: 'iskenderun',
    name: 'İskenderun',
    description: 'Körfezin incisi. Büyük İskender tarafından kurulan tarihi liman ve sanayi kenti.',
    history: 'MÖ 333 yılında Büyük İskender\'in İssos Savaşı\'nda Pers kralı Darius\'u mağlup etmesinden sonra "Alexandretta" adıyla kurulmuştur. Akdeniz ticareti için tarih boyunca bir kapı olmuştur.',
    coordinates: { x: 230, y: 190 },
    neighborhoods: [
      {
        name: 'Karayılan',
        oldName: 'Sarıseki Geçidi',
        etymology: 'Milli Mücadele döneminde Fransız işgaline karşı destansı bir direniş gösteren çete lideri Karayılan\'dan (Mehmet Sait) adını almıştır.',
        history: 'Amanos Dağları geçidinde Fransız birliklerine yapılan ilk pusu ve direniş hareketlerinin başladığı tarihi mahalledir.'
      },
      {
        name: 'Pac',
        oldName: 'Meydan / İskenderun Kapısı',
        etymology: 'Eski Türkçe ve Arapça sınır/vergi geçiş noktası veya köprü manasına gelen "Bac" kelimesinden evrilmiştir.',
        history: 'Tarihi kervan yollarının İskenderun limanına giriş yaptığı, gümrük kapısının kurulduğu tarihi ticaret meydanı.'
      }
    ]
  },
  {
    id: 'arsuz',
    name: 'Arsuz',
    description: 'Tarihi balıkçı limanı, temiz sahilleri ve antik kilise kalıntılarıyla turistik sahil şeridi.',
    history: 'Antik çağdaki adı "Rhosus"tur. Helenistik, Roma ve Bizans dönemlerinde aktif bir liman kenti ve havarilerin seyahat rotası olmuştur.',
    coordinates: { x: 160, y: 280 },
    neighborhoods: [
      {
        name: 'Gözcüler',
        oldName: 'Rhosopolis / Rhosus',
        etymology: 'Denizden gelebilecek korsan saldırılarını gözetlemek amacıyla kurulan tarihi gözetleme kulelerinden dolayı bu adı almıştır.',
        history: 'Bizans döneminden kalma antik kilise temelleri ve havarilerin Hristiyanlığı yaymak üzere Anadolu\'ya ayak bastığı ilk liman kalıntıları buradadır.'
      },
      {
        name: 'Karaağaç',
        oldName: 'El-Hınziriye',
        etymology: 'Tarihi karaağaç ormanlarından ismini almıştır.',
        history: 'İskenderun ile Arsuz sınırında yer alan, antik dönem tarım arazilerinin ve nehir deltalarının bulunduğu yerleşim.'
      }
    ]
  },
  {
    id: 'belen',
    name: 'Belen',
    description: 'Amanos Dağları\'nı aşan tarihi geçit. İpek Yolu kervanlarının can damarı.',
    history: 'Tarih boyunca Suriye Geçidi (Syrian Gates) olarak bilinen, Anadolu\'yu Ortadoğu\'ya bağlayan en önemli askeri ve ticari geçittir. Büyük İskender, Roma lejyonları ve Haçlılar bu geçidi kullanmıştır.',
    coordinates: { x: 260, y: 240 },
    neighborhoods: [
      {
        name: 'Halilbey',
        oldName: 'Belen Derbendi',
        etymology: 'Kanuni Sultan Süleyman döneminde geçidi korumak ve şenlendirmek üzere yerleştirilen Halil Bey Derebeyi\'nden adını almıştır.',
        history: 'Kanuni Sultan Süleyman\'ın emriyle 1553 yılında kervanların güvenliği için inşa edilen Belen Kervansarayı, tarihi cami ve hamam bu mahallededir.'
      }
    ]
  },
  {
    id: 'reyhanli',
    name: 'Reyhanlı',
    description: 'Amik Ovası\'nın verimli topraklarında, antik Hitit sarayları ve Cemil Meriç\'in izlerini taşıyan sınır ilçesi.',
    history: 'MÖ 18. yüzyıla kadar uzanan Geç Hitit Mukish Krallığı\'nın başkenti Alalakh\'ın kurulduğu Amik Ovası\'nın göbeğidir.',
    coordinates: { x: 420, y: 380 },
    neighborhoods: [
      {
        name: 'Yenişehir',
        oldName: 'Alalakh / Açana Höyük',
        etymology: 'Reyhanlı\'nın genişleme döneminde kurulan modern yerleşime bu isim verilmiştir.',
        history: 'Mahalle sınırları içinde yer alan Açana Höyük\'te yapılan kazılarda, antik Hitit sarayları, tabletler ve meşhur Kral Yarim-Lim saray kalıntıları bulunmuştur.'
      },
      {
        name: 'Cemil Meriç',
        oldName: 'Reyhaniye Merkez',
        etymology: 'Türkiye\'nin yetiştirdiği en büyük sosyolog, yazar ve düşünürlerden Cemil Meriç\'in doğup büyüdüğü mahalledir.',
        history: 'Cemil Meriç\'in doğduğu tarihi konak restore edilerek kültür evi ve müze haline getirilmiştir.'
      }
    ]
  },
  {
    id: 'altinozu',
    name: 'Altınözü',
    description: 'Tarihi zeytin ağaçları, derin vadileri ve Haçlı kaleleriyle bilinen sınır ilçesi.',
    history: 'Tarihi zeytincilik kültürünün merkezi. Roma ve Bizans döneminde tarımsal depo ve sığınak olarak kullanılan kalelere ev sahipliği yapmıştır.',
    coordinates: { x: 340, y: 460 },
    neighborhoods: [
      {
        name: 'Tokaçlı',
        oldName: 'Cuna / Juna',
        etymology: 'Türkiye\'deki tek tamamı Arap Ortodoks Hristiyan nüfusundan oluşan zeytinci köyüdür.',
        history: 'Mahallede bulunan tarihi Maria Ana (Meryem Ana) Rum Ortodoks Kilisesi 14. yüzyıldan kalmadır ve bölgenin en eski ibadethanelerindendir.'
      },
      {
        name: 'Kozkalesi',
        oldName: 'Cursus / Cursat Kalesi',
        etymology: 'Adını mahallenin tepesinde yükselen tarihi Haçlı kalesi Kozkalesi\'nden (Antik Cursat Kalesi) alır.',
        history: 'Antakya Prensliği döneminde şehri güneyden korumak için inşa edilmiş, derin uçurumlarla çevrili savunma kalesi kalıntıları bu mahallededir.'
      }
    ]
  }
];

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
        <span className="logo-badge" style={{ margin: 0 }}>Mahalle & İlçe Gözlemcisi</span>
      </div>

      <div className="map-view-layout">
        {/* Left Side: Interactive SVG Map */}
        <div className="map-panel">
          <div className="map-scroll-instructions">
            🕹️ İLÇELERE TIKLAYARAK TARİHİ MAHALLELERİNİ KEŞFEDİN
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
              <text x="380" y="520" fill="#2d3b6e" fontFamily="Press Start 2P" fontSize="10">
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
                      transform={`translate(${d.coordinates.x - 12}, ${d.coordinates.y - 12})`}
                      className={`map-pin ${isActive ? 'active-pin' : ''}`}
                    >
                      {/* Flag / Pin Shape */}
                      <rect x="2" y="2" width="20" height="15" fill={isActive ? '#f3c63f' : '#41a6f6'} stroke="#000" strokeWidth="2" />
                      <line x1="2" y1="2" x2="2" y2="22" stroke="#000" strokeWidth="3" />
                      {/* Inner pixel design */}
                      <rect x="5" y="5" width="4" height="4" fill="#000" />
                      <rect x="13" y="5" width="4" height="4" fill="#000" />
                    </g>

                    {/* Label */}
                    <rect 
                      x={d.coordinates.x - 40} 
                      y={d.coordinates.y + 16} 
                      width="80" 
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
                <h3>🏘️ TARİHİ MAHALLELER</h3>
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

                    <div className="nb-history-box">
                      <span className="nb-meta-label">Tarihi ve Önemi:</span>
                      <p className="nb-history-text">{selectedNeighborhood.history}</p>
                    </div>
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
