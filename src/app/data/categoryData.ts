export interface Product {
  id: string;
  name: string;
  image: string;
  dailyPrice: number;
  weeklyPrice: number;
  location: string;
  rating: number;
  reviewCount: number;
  features: string[];
  description: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
  products: Product[];
}

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

export const categoryData: Category[] = [
  {
    id: "toprak-hazirlama",
    name: "Toprak Hazırlama",
    image: px(2252618),   // tractor plowing field
    productCount: 5,
    products: [
      {
        id: "pulluk-1",
        name: "Ağır Tip Pulluk",
        image: px(1595108),  // tractor in field
        dailyPrice: 450,
        weeklyPrice: 2800,
        location: "Konya, Türkiye",
        rating: 4.7,
        reviewCount: 38,
        features: ["3 gövdeli", "Hidrolik kumanda", "50–80 HP traktör", "25–35 cm derinlik"],
        description:
          "Ağır tip çevirmeli pulluk, derin toprak işleme için idealdir. Zorlu arazi koşullarında bile verimli çalışır. Çeltik, buğday ve mısır tarlalarında yaygın kullanılır.",
        available: true,
      },
      {
        id: "diskaro-1",
        name: "Diskaro (Diskli Tırmık)",
        image: px(974314),   // farm field overhead
        dailyPrice: 380,
        weeklyPrice: 2300,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 22,
        features: ["24 disk", "510 mm disk çapı", "Ayarlanabilir derinlik", "60–90 HP traktör"],
        description:
          "Diskaro, pulluk sonrası toprak hazırlama ve anız bozmada kullanılır. Toprakları hızla parçalar, bitki kalıntılarını karıştırarak gübre değerine dönüştürür.",
        available: true,
      },
      {
        id: "rotovayor-1",
        name: "Rotovatör",
        image: px(1084540),  // soil/ground close-up
        dailyPrice: 320,
        weeklyPrice: 1950,
        location: "Bursa, Türkiye",
        rating: 4.8,
        reviewCount: 51,
        features: ["180 cm çalışma eni", "Kuyruk mili tahrikli", "Kuru/nemli toprak", "40–60 HP traktör"],
        description:
          "Rotovatör, toprağı tam anlamıyla ufalayarak ekime hazır hale getirir. Hem pulluk hem tırmık görevini tek seferde yapar.",
        available: true,
      },
      {
        id: "kultıvator-1",
        name: "Kültivatör",
        image: px(4048041),  // farming equipment row
        dailyPrice: 260,
        weeklyPrice: 1600,
        location: "İzmir, Türkiye",
        rating: 4.4,
        reviewCount: 17,
        features: ["11 ayaklı", "Yaylı koruyucu", "Sıra arası çapa", "35–55 HP traktör"],
        description:
          "Kültivatör, çıkış sonrası çapa ve ikinci sürüm işlemlerinde kullanılır. Yabancı otları temizler, toprak havalanmasını artırır.",
        available: false,
      },
      {
        id: "tirmik-1",
        name: "Tırmık",
        image: px(1007991),  // tractor with attachment
        dailyPrice: 200,
        weeklyPrice: 1200,
        location: "Konya, Türkiye",
        rating: 4.3,
        reviewCount: 29,
        features: ["3 m çalışma eni", "Katlanabilir kanatlar", "Tohum yatağı hazırlama", "30–50 HP traktör"],
        description:
          "Çekme tırmık, toprak yüzeyini düzleyerek tohum yatağı hazırlar. Pulluk veya diskaro işlemi sonrası kullanılır.",
        available: true,
      },
    ],
  },
  {
    id: "ekim-dikim",
    name: "Ekim ve Dikim",
    image: px(440731),   // green field / planting
    productCount: 4,
    products: [
      {
        id: "ekim-makinesi-1",
        name: "Pnömatik Tahıl Ekim Makinesi",
        image: px(547084),   // wheat field seeding
        dailyPrice: 550,
        weeklyPrice: 3400,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 63,
        features: ["24 sıra", "Mısır/Buğday/Ayçiçeği", "Pnömatik dağıtım", "GPS destekli"],
        description:
          "Pnömatik ekim makinesi tohumları hassas aralıklarla ve doğru derinliğe yerleştirir. Gübre deposuyla eş zamanlı gübre uygulaması yapılabilir.",
        available: true,
      },
      {
        id: "fide-1",
        name: "Fide Dikim Makinesi",
        image: px(929382),   // seedling/planting
        dailyPrice: 400,
        weeklyPrice: 2500,
        location: "Antalya, Türkiye",
        rating: 4.6,
        reviewCount: 34,
        features: ["4 sıralı", "Domates/Biber/Patlıcan", "Otomatik sulama", "Saatte 3000 fide"],
        description:
          "Yarı otomatik fide dikim makinesi sebze fidelerini belirli aralıklarla otomatik diker. İşçilik maliyetini büyük ölçüde azaltır.",
        available: true,
      },
      {
        id: "patates-ekim-1",
        name: "Patates Ekim Makinesi",
        image: px(1586179),  // planting rows
        dailyPrice: 480,
        weeklyPrice: 2900,
        location: "Niğde, Türkiye",
        rating: 4.7,
        reviewCount: 41,
        features: ["2 sıralı", "75 cm sıra arası", "Otomatik yerleştirme", "60–80 HP traktör"],
        description:
          "Patates ekim makinesi tohum patatesleri belirli derinlik ve aralıklarda otomatik olarak toprağa yerleştirir. Üretkenliği en az 5 kat artırır.",
        available: true,
      },
      {
        id: "celtik-ekim-1",
        name: "Çeltik Ekim Makinesi",
        image: px(3631711),  // rice paddy field
        dailyPrice: 520,
        weeklyPrice: 3200,
        location: "Edirne, Türkiye",
        rating: 4.5,
        reviewCount: 19,
        features: ["8 sıralı", "Su içinde çalışır", "30 cm sıra arası", "4WD traktör uyumlu"],
        description:
          "Çeltik ekim makinesi su içindeki tarlalarda hassas ekim yapar. Fide şaşırtma veya doğrudan tohum ekimi modlarında çalışabilir.",
        available: false,
      },
    ],
  },
  {
    id: "sulama",
    name: "Sulama",
    image: px(2132250),  // irrigation sprinkler
    productCount: 4,
    products: [
      {
        id: "damla-1",
        name: "Damla Sulama Sistemi (5 Dönüm)",
        image: px(2518861),  // drip irrigation
        dailyPrice: 180,
        weeklyPrice: 1100,
        location: "Antalya, Türkiye",
        rating: 4.8,
        reviewCount: 75,
        features: ["5 dönüm kurulum", "Damlatıcı aralığı 30 cm", "Filtre dahil", "Zamanlayıcı kontrolü"],
        description:
          "Damla sulama sistemi suyu doğrudan bitki köküne ulaştırarak %40'a kadar su tasarrufu sağlar. Daha az hastalık riski ve yüksek verim sunar.",
        available: true,
      },
      {
        id: "yagmurlama-1",
        name: "Yağmurlama Sulama Sistemi",
        image: px(2132250),  // sprinkler field
        dailyPrice: 220,
        weeklyPrice: 1350,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 44,
        features: ["360° döner başlıklar", "15 m sulama yarıçapı", "Taşınabilir boru", "10 dönüm kapsama"],
        description:
          "Yağmurlama sistemi yağmur simüle ederek homojen sulama yapar. Buğday, arpa ve çim alanları için idealdir.",
        available: true,
      },
      {
        id: "pompa-1",
        name: "Dalgıç Sulama Pompası",
        image: px(1300375),  // pump/water equipment
        dailyPrice: 150,
        weeklyPrice: 900,
        location: "Şanlıurfa, Türkiye",
        rating: 4.4,
        reviewCount: 28,
        features: ["7.5 HP motor", "Saatte 25 ton debi", "50 m çekiş derinliği", "Termal koruma"],
        description:
          "Dalgıç pompa kuyulardan ve su kaynaklarından tarla sulamak için kullanılır. Yüksek verimli motor ile uzun süreli çalışmaya uygundur.",
        available: true,
      },
      {
        id: "tanker-1",
        name: "Su Tankeri (10.000 L)",
        image: px(7457193),  // water tank truck
        dailyPrice: 650,
        weeklyPrice: 4000,
        location: "Adana, Türkiye",
        rating: 4.5,
        reviewCount: 33,
        features: ["10.000 L kapasite", "Üst püskürtme", "Kuyruk mili bağlantısı", "Çift taraf tahliye"],
        description:
          "Su tankeri uzak tarlalara su taşıma ve yol sulaması için kullanılır. Büyük tarım işletmelerinde vazgeçilmezdir.",
        available: false,
      },
    ],
  },
  {
    id: "gubreleme-ilacalama",
    name: "Gübreleme ve İlaçlama",
    image: px(4919936),  // sprayer in field
    productCount: 4,
    products: [
      {
        id: "gubre-serpme-1",
        name: "Gübre Serpme Makinesi",
        image: px(8153927),  // fertilizer spreading
        dailyPrice: 290,
        weeklyPrice: 1750,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 48,
        features: ["2 ton kapasite", "24 m çalışma eni", "Elektrikli dozaj", "GPS uyumlu"],
        description:
          "Santrifüjlü gübre serpme makinesi hem granüllü hem toz gübreleri geniş alana homojen dağıtır. Tarla genelinde uniform gübre dağılımı sağlar.",
        available: true,
      },
      {
        id: "pulverizator-1",
        name: "Arazöz Pülverizatör",
        image: px(4919936),  // sprayer boom
        dailyPrice: 420,
        weeklyPrice: 2600,
        location: "İzmir, Türkiye",
        rating: 4.8,
        reviewCount: 56,
        features: ["1000 L tank", "18 m bom genişliği", "Anti-damla valf", "Basınç regülatörü"],
        description:
          "Çekilen tip bom pülverizatör zirai ilaçları geniş alana homojen ve az ziyanla uygular. Sıvı gübre uygulamasında da kullanılır.",
        available: true,
      },
      {
        id: "sivi-gubre-1",
        name: "Sıvı Gübre Tankeri",
        image: px(1108100),  // tanker in field
        dailyPrice: 380,
        weeklyPrice: 2300,
        location: "Bursa, Türkiye",
        rating: 4.5,
        reviewCount: 21,
        features: ["5.000 L kapasite", "Toprak enjektörü", "Çiftlik gübresi uyumlu", "Paslanmaz tank"],
        description:
          "Sıvı gübre tankeri hayvan gübresi ve sıvı kimyasal gübreleri doğrudan toprağa enjekte eder. Koku yayılımını minimuma indirir.",
        available: true,
      },
      {
        id: "drone-1",
        name: "Zirai İlaçlama Dronu",
        image: px(1108372),  // drone over field
        dailyPrice: 900,
        weeklyPrice: 5500,
        location: "Ankara, Türkiye",
        rating: 4.9,
        reviewCount: 89,
        features: ["16 L ilaç tankı", "Saatte 15 dönüm", "Otomatik uçuş planı", "Engel algılama"],
        description:
          "Zirai ilaçlama dronu ulaşılması güç arazilerde bile hassas ve hızlı ilaçlama yapar. Operatör lisansı ile birlikte kiralanabilir.",
        available: true,
      },
    ],
  },
  {
    id: "hasat",
    name: "Hasat",
    image: px(326082),   // combine harvester wheat
    productCount: 5,
    products: [
      {
        id: "bicerdover-1",
        name: "Biçerdöver (Tahıl)",
        image: px(265216),   // combine in wheat field
        dailyPrice: 2800,
        weeklyPrice: 17000,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 112,
        features: ["6.1 m kesim ağzı", "Buğday/Arpa/Çeltik", "Tahıl kaybı sensörü", "Klimali kabin"],
        description:
          "Modern tahıl biçerdöveri yüksek kapasiteli harman ve ayırma sistemiyle saatte 6–8 hektar tarla biçer. Minimum kayıpla yüksek verim sağlar.",
        available: true,
      },
      {
        id: "misir-hasat-1",
        name: "Mısır Hasat Makinesi",
        image: px(547084),   // corn harvest field
        dailyPrice: 2200,
        weeklyPrice: 13500,
        location: "Adana, Türkiye",
        rating: 4.8,
        reviewCount: 67,
        features: ["6 sıralı", "Koçan ve dane seçenek", "Sap öğütücü", "Büyük tahıl deposu"],
        description:
          "Mısır koparma makinesi mısır koçanlarını kırmadan kopararek veya dane olarak harman eder. Yüksek kapasiteli depoyla uzun süreli çalışmaya uygundur.",
        available: true,
      },
      {
        id: "patates-hasat-1",
        name: "Patates Hasat Makinesi",
        image: px(1586179),  // potato field rows
        dailyPrice: 1600,
        weeklyPrice: 9800,
        location: "Niğde, Türkiye",
        rating: 4.7,
        reviewCount: 45,
        features: ["2 sıralı", "Titreşimli eleme bandı", "Minimum zarar", "75 HP traktör"],
        description:
          "Patates hasat makinesi patatesleri toprağı dağıtarak yüzeye çıkarır, bantlı eleme sistemiyle temizler. İşçilik maliyetini 10 kat azaltır.",
        available: false,
      },
      {
        id: "yonca-1",
        name: "Yonca Biçme Makinesi",
        image: px(440731),   // green grass/hay field
        dailyPrice: 500,
        weeklyPrice: 3000,
        location: "Ankara, Türkiye",
        rating: 4.6,
        reviewCount: 38,
        features: ["2.8 m kesim eni", "Kondisyoner dahil", "Hızlı kuruma", "50 HP traktör"],
        description:
          "Yonca biçme ve kondisyonlama makinesi yonca ile kaba yemleri keserek hızlı kurumasını sağlar. Yüksek kaliteli kaba yem üretimi için idealdir.",
        available: true,
      },
      {
        id: "silaj-1",
        name: "Silaj Makinesi",
        image: px(1007991),  // tractor with silage
        dailyPrice: 1800,
        weeklyPrice: 11000,
        location: "Bursa, Türkiye",
        rating: 4.7,
        reviewCount: 29,
        features: ["Saatte 80 ton", "Ayarlanabilir parça boyu", "Mısır/Yonca uyumlu", "140 HP traktör"],
        description:
          "Silaj makinesi mısır ve kaba yemleri kıyarak silaj elde etmek için kullanılır. Hayvancılık işletmeleri için en verimli yem hazırlama çözümüdür.",
        available: true,
      },
    ],
  },
  {
    id: "tasima-yukleme",
    name: "Taşıma ve Yükleme",
    image: px(1595108),  // tractor transport
    productCount: 5,
    products: [
      {
        id: "traktor-1",
        name: "Traktör (100 HP)",
        image: px(2252618),  // large tractor field
        dailyPrice: 1200,
        weeklyPrice: 7500,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 134,
        features: ["100 HP motor", "4WD çekiş", "Klimali kabin", "Ön yükleyici dahil"],
        description:
          "Çok amaçlı tarım traktörü pulluk, ekim, hasat ve taşıma gibi tüm tarımsal işlerde kullanılabilir. Ön yükleyiciyle yükleme işlemleri de yapılır.",
        available: true,
      },
      {
        id: "romork-1",
        name: "Tarım Römorku (10 Ton)",
        image: px(1007991),  // tractor with trailer
        dailyPrice: 350,
        weeklyPrice: 2100,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 57,
        features: ["10 ton kapasite", "Hidrolik boşaltma", "Brandalı", "Hava freni"],
        description:
          "Tek dingilli tarım römorku tahıl, meyve-sebze ve tarımsal malzemelerin taşınması için kullanılır. Hidrolik boşaltma ile hızlı tahliye yapılır.",
        available: true,
      },
      {
        id: "kepce-1",
        name: "Kepçeli Yükleyici",
        image: px(1300375),  // loader
        dailyPrice: 1500,
        weeklyPrice: 9000,
        location: "İzmir, Türkiye",
        rating: 4.7,
        reviewCount: 43,
        features: ["1.2 m³ kepçe", "Hidrolik sistem", "360° dönüş", "Her arazi uyumlu"],
        description:
          "Lastikli kepçeli yükleyici toprak, gübre ve tahıl yükleme-boşaltma işlemlerinde büyük kolaylık sağlar. Dar alanlarda da rahatlıkla manevra yapar.",
        available: true,
      },
      {
        id: "balya-1",
        name: "Balya Makinesi (Büyük Balya)",
        image: px(573253),   // hay bales field
        dailyPrice: 680,
        weeklyPrice: 4200,
        location: "Bursa, Türkiye",
        rating: 4.8,
        reviewCount: 61,
        features: ["1.2 x 1.3 m kare balya", "Saatte 60 balya", "Otomatik bağlama", "60 HP traktör"],
        description:
          "Büyük kare balya makinesi kaba yemleri sıkıştırarak yüksek yoğunluklu balya yapar. Uzun depolama ve kolay taşıma için idealdir.",
        available: false,
      },
      {
        id: "forklift-1",
        name: "Tarım Forklift",
        image: px(573255),   // forklift warehouse
        dailyPrice: 800,
        weeklyPrice: 4900,
        location: "Adana, Türkiye",
        rating: 4.4,
        reviewCount: 25,
        features: ["3 ton kaldırma", "4 m kaldırma yüksekliği", "LPG/Dizel seçenek", "Gıda güvenli çatal"],
        description:
          "Tarım forklift depo ve soğuk hava depolarında palet taşıma, yükleme ve istifleme işlemleri için kullanılır.",
        available: true,
      },
    ],
  },
  {
    id: "hayvancilik",
    name: "Hayvancılık Destek",
    image: px(735968),   // dairy cows in field
    productCount: 3,
    products: [
      {
        id: "yem-karma-1",
        name: "Yem Karma Makinesi",
        image: px(422220),   // cows feeding
        dailyPrice: 480,
        weeklyPrice: 2900,
        location: "Erzurum, Türkiye",
        rating: 4.7,
        reviewCount: 36,
        features: ["8 m³ kapasite", "Dikey vidalı karıştırma", "Tartı sistemi dahil", "TMR yem hazırlama"],
        description:
          "Yem karma (TMR) makinesi silaj, kuru ot, konsantre yem ve katkıları homojen şekilde karıştırarak tek öğünde dengeli rasyonlu yem hazırlar.",
        available: true,
      },
      {
        id: "sagim-1",
        name: "Seyyar Süt Sağım Makinesi",
        image: px(735968),   // dairy cows milking
        dailyPrice: 250,
        weeklyPrice: 1550,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 42,
        features: ["2 başlıklı", "30 lt/dak debi", "Paslanmaz süt bidonu", "Sessiz vakum pompası"],
        description:
          "Seyyar süt sağım makinesi ahır içinde kolay taşınabilir yapısıyla her ineği bulunduğu yerde sağar. Hijyenik ve hızlı sağım sağlar.",
        available: true,
      },
      {
        id: "hayvan-romork-1",
        name: "Hayvan Taşıma Römorku",
        image: px(422220),   // cattle transport
        dailyPrice: 420,
        weeklyPrice: 2600,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 19,
        features: ["6 büyükbaş kapasiteli", "Havalandırmalı", "Kaymaz zemin", "Hızlı biniş rampası"],
        description:
          "Hayvan taşıma römorku büyükbaş ve küçükbaş hayvanların veteriner, fuar ve mezbaha nakillerinde güvenli taşınmasını sağlar.",
        available: false,
      },
    ],
  },
];
