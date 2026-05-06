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

export const categoryData: Category[] = [
  {
    id: "toprak-hazirlama",
    name: "Toprak Hazırlama",
    image:
      "https://images.unsplash.com/photo-1500382134874-f8a4dd5e25b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 5,
    products: [
      {
        id: "pulluk-1",
        name: "Ağır Tip Pulluk",
        image:
          "https://images.unsplash.com/photo-1628352081506-83c43123a1bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 450,
        weeklyPrice: 2800,
        location: "Konya, Türkiye",
        rating: 4.7,
        reviewCount: 38,
        features: ["3 gövdeli", "Hidrolik kumanda", "50–80 HP traktör gerektirir", "25–35 cm sürüm derinliği"],
        description:
          "Ağır tip çevirmeli pulluk, derin toprak işleme için idealdir. Zorlu arazi koşullarında bile verimli çalışır. Çeltik, buğday ve mısır tarlalarında yaygın olarak kullanılır.",
        available: true,
      },
      {
        id: "diskaro-1",
        name: "Diskaro (Diskli Tırmık)",
        image:
          "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 380,
        weeklyPrice: 2300,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 22,
        features: ["24 disk", "Çaplı 510 mm diskler", "Ayarlanabilir derinlik", "60–90 HP traktör uyumlu"],
        description:
          "Diskaro, pulluk sonrası toprak hazırlama ve anız bozmada kullanılır. Toprakları hızla parçalar, ot ve bitki kalıntılarını karıştırarak gübre değerine dönüştürür.",
        available: true,
      },
      {
        id: "rotovayor-1",
        name: "Rotovatör",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 320,
        weeklyPrice: 1950,
        location: "Bursa, Türkiye",
        rating: 4.8,
        reviewCount: 51,
        features: ["180 cm çalışma eni", "Kuyruk mili tahrikli", "Kuru/nemli toprakta çalışır", "40–60 HP traktör uyumlu"],
        description:
          "Rotovatör, toprağı tam anlamıyla ufalayarak ekime hazır hale getirir. Bahçe ve tarla kullanımı için idealdir; hem pulluk hem tırmık görevini tek seferde yapar.",
        available: true,
      },
      {
        id: "kultıvator-1",
        name: "Kültivatör",
        image:
          "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 260,
        weeklyPrice: 1600,
        location: "İzmir, Türkiye",
        rating: 4.4,
        reviewCount: 17,
        features: ["11 ayaklı", "Yaylı koruyucu", "Sıra arası çapa için ideal", "35–55 HP traktör uyumlu"],
        description:
          "Kültivatör, çıkış sonrası çapa ve ikinci sürüm işlemlerinde kullanılır. Yabancı otları etkili biçimde temizler, toprak havalanmasını artırır.",
        available: false,
      },
      {
        id: "tirmik-1",
        name: "Tırmık",
        image:
          "https://images.unsplash.com/photo-1464226184884-fa280b87c399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 200,
        weeklyPrice: 1200,
        location: "Konya, Türkiye",
        rating: 4.3,
        reviewCount: 29,
        features: ["3 m çalışma eni", "Katlanabilir kanatlar", "Tohum yatağı hazırlama", "30–50 HP traktör uyumlu"],
        description:
          "Çekme tırmık, toprak yüzeyini düzleyerek tohum yatağı hazırlar. Pulluk veya diskaro işlemi sonrası kullanılır.",
        available: true,
      },
    ],
  },
  {
    id: "ekim-dikim",
    name: "Ekim ve Dikim",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 4,
    products: [
      {
        id: "ekim-makinesi-1",
        name: "Pnömatik Tahıl Ekim Makinesi",
        image:
          "https://images.unsplash.com/photo-1574323347407-f3ef87f069f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 550,
        weeklyPrice: 3400,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 63,
        features: ["24 sıra", "Mısır/buğday/ayçiçeği uyumlu", "Pnömatik tohum dağıtımı", "GPS destekli"],
        description:
          "Pnömatik ekim makinesi, tohumları hassas aralıklarla ve doğru derinliğe yerleştirir. Gübre deposu ile eş zamanlı gübre uygulaması yapılabilir.",
        available: true,
      },
      {
        id: "fide-1",
        name: "Fide Dikim Makinesi",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 400,
        weeklyPrice: 2500,
        location: "Antalya, Türkiye",
        rating: 4.6,
        reviewCount: 34,
        features: ["4 sıralı", "Domates/biber/patlıcan uyumlu", "Otomatik sulama entegrasyonu", "Saatte 3000 fide"],
        description:
          "Yarı otomatik fide dikim makinesi, sebze fidelerini belirli aralıklarla otomatik olarak diker. İşçilik maliyetini büyük ölçüde azaltır.",
        available: true,
      },
      {
        id: "patates-ekim-1",
        name: "Patates Ekim Makinesi",
        image:
          "https://images.unsplash.com/photo-1595147389795-37094173bfd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 480,
        weeklyPrice: 2900,
        location: "Niğde, Türkiye",
        rating: 4.7,
        reviewCount: 41,
        features: ["2 sıralı", "75 cm sıra arası", "Otomatik tohum yerleştirme", "60–80 HP traktör uyumlu"],
        description:
          "Patates ekim makinesi, tohum patatesleri belirli derinlik ve aralıklarda otomatik olarak toprağa yerleştirir. Üretkenliği en az 5 kat artırır.",
        available: true,
      },
      {
        id: "celtik-ekim-1",
        name: "Çeltik Ekim Makinesi",
        image:
          "https://images.unsplash.com/photo-1599360889420-da1afaba9edc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 520,
        weeklyPrice: 3200,
        location: "Edirne, Türkiye",
        rating: 4.5,
        reviewCount: 19,
        features: ["8 sıralı", "Su içinde çalışabilir", "30 cm sıra arası", "4WD traktör uyumlu"],
        description:
          "Çeltik (pirinç) ekim makinesi, su içinde tarlalarda hassas ekim yapar. Fide şaşırtma veya doğrudan tohum ekimi modlarında çalışabilir.",
        available: false,
      },
    ],
  },
  {
    id: "sulama",
    name: "Sulama",
    image:
      "https://images.unsplash.com/photo-1625246333195-87538734631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 4,
    products: [
      {
        id: "damla-1",
        name: "Damla Sulama Sistemi (5 Dönüm)",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 180,
        weeklyPrice: 1100,
        location: "Antalya, Türkiye",
        rating: 4.8,
        reviewCount: 75,
        features: ["5 dönüm kurulum", "Damlatıcı aralığı 30 cm", "Filtre sistemi dahil", "Zamanlayıcı kontrolü"],
        description:
          "Damla sulama sistemi, suyu doğrudan bitki köküne ulaştırarak su tasarrufu sağlar. %40'a kadar su tasarrufu ve daha az hastalık riski sunar.",
        available: true,
      },
      {
        id: "yagmurlama-1",
        name: "Yağmurlama Sulama Sistemi",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 220,
        weeklyPrice: 1350,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 44,
        features: ["360° döner başlıklar", "15 m sulama yarıçapı", "Taşınabilir boru sistemi", "10 dönüm kapsama"],
        description:
          "Yağmurlama sistemi, yağmur simüle ederek homojen sulama yapar. Buğday, arpa ve çim alanları için idealdir.",
        available: true,
      },
      {
        id: "pompa-1",
        name: "Dalgıç Sulama Pompası",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 150,
        weeklyPrice: 900,
        location: "Şanlıurfa, Türkiye",
        rating: 4.4,
        reviewCount: 28,
        features: ["7.5 HP motor", "Saatte 25 ton debi", "50 m çekiş derinliği", "Otomatik termal koruma"],
        description:
          "Dalgıç pompa, kuyulardan ve su kaynaklarından tarla sulamak için kullanılır. Yüksek verimli motor ile uzun süreli çalışmaya uygundur.",
        available: true,
      },
      {
        id: "tanker-1",
        name: "Su Tankeri (10.000 L)",
        image:
          "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 650,
        weeklyPrice: 4000,
        location: "Adana, Türkiye",
        rating: 4.5,
        reviewCount: 33,
        features: ["10.000 litre kapasite", "Su püskürtme üstü", "Traktör kuyruk mili bağlantısı", "Çift taraf tahliye"],
        description:
          "Su tankeri, uzak tarlalara su taşıma ve gerektiğinde yol sulaması için kullanılır. Büyük tarım işletmelerinde vazgeçilmezdir.",
        available: false,
      },
    ],
  },
  {
    id: "gubreleme-ilacalama",
    name: "Gübreleme ve İlaçlama",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315f8f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 4,
    products: [
      {
        id: "gubre-serpme-1",
        name: "Gübre Serpme Makinesi",
        image:
          "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 290,
        weeklyPrice: 1750,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 48,
        features: ["2 ton kapasite", "24 m çalışma eni", "Elektrikli dozaj kontrolü", "GPS uyumlu"],
        description:
          "Santrifüjlü gübre serpme makinesi, hem granüllü hem toz gübreleri geniş alana homojen dağıtır. Tarla genelinde uniform gübre dağılımı sağlar.",
        available: true,
      },
      {
        id: "pulverizator-1",
        name: "Arazöz Pülverizatör",
        image:
          "https://images.unsplash.com/photo-1574323347407-f3ef87f069f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 420,
        weeklyPrice: 2600,
        location: "İzmir, Türkiye",
        rating: 4.8,
        reviewCount: 56,
        features: ["1000 L tank", "18 m bom genişliği", "Anti-damla valf", "Basınç regülatörü"],
        description:
          "Çekilen tip bom pülverizatör, zirai ilaçları geniş alana homojen ve az ziyanla uygular. Hem böcek ilaçları hem de sıvı gübre uygulamasında kullanılır.",
        available: true,
      },
      {
        id: "sivi-gubre-1",
        name: "Sıvı Gübre Tankeri",
        image:
          "https://images.unsplash.com/photo-1500382134874-f8a4dd5e25b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 380,
        weeklyPrice: 2300,
        location: "Bursa, Türkiye",
        rating: 4.5,
        reviewCount: 21,
        features: ["5.000 L kapasite", "Toprak enjektörü", "Çiftlik gübresi uyumlu", "Paslanmaz çelik tank"],
        description:
          "Sıvı gübre tankeri, hayvan gübresi ve sıvı kimyasal gübreyi doğrudan toprağa enjekte eder. Koku yayılımını minimuma indirir.",
        available: true,
      },
      {
        id: "drone-1",
        name: "Zirai İlaçlama Dronu",
        image:
          "https://images.unsplash.com/photo-1508614589041-895b88991e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 900,
        weeklyPrice: 5500,
        location: "Ankara, Türkiye",
        rating: 4.9,
        reviewCount: 89,
        features: ["16 L ilaç tankı", "Saatte 15 dönüm", "Otomatik uçuş planı", "Engellerden kaçınma"],
        description:
          "Zirai ilaçlama dronu, ulaşılması güç arazilerde bile hassas ve hızlı ilaçlama yapar. Operatör lisansı ile birlikte kiralanabilir.",
        available: true,
      },
    ],
  },
  {
    id: "hasat",
    name: "Hasat",
    image:
      "https://images.unsplash.com/photo-1473973266408-ed4252f18f05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 5,
    products: [
      {
        id: "bicerdover-1",
        name: "Biçerdöver (Tahıl)",
        image:
          "https://images.unsplash.com/photo-1574323347407-f3ef87f069f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 2800,
        weeklyPrice: 17000,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 112,
        features: ["6.1 m kesim ağzı", "Buğday/arpa/çeltik uyumlu", "Tahıl kaybı sensörü", "Klimali kabin"],
        description:
          "Modern tahıl biçerdöveri, yüksek kapasiteli harman ve ayırma sistemiyle saatte 6–8 hektar tarla biçer. Minimum tahıl kaybıyla yüksek verim sağlar.",
        available: true,
      },
      {
        id: "misir-hasat-1",
        name: "Mısır Hasat Makinesi",
        image:
          "https://images.unsplash.com/photo-1516467508483-a7212febe31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 2200,
        weeklyPrice: 13500,
        location: "Adana, Türkiye",
        rating: 4.8,
        reviewCount: 67,
        features: ["6 sıralı", "Koçan ve dane seçeneği", "Sap öğütücü", "Büyük tahıl deposu"],
        description:
          "Mısır koparma makinesi, mısır koçanlarını kırmadan kopararek veya dane olarak harman eder. Yüksek kapasiteli depoyla uzun süreli çalışmaya uygundur.",
        available: true,
      },
      {
        id: "patates-hasat-1",
        name: "Patates Hasat Makinesi",
        image:
          "https://images.unsplash.com/photo-1595147389795-37094173bfd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 1600,
        weeklyPrice: 9800,
        location: "Niğde, Türkiye",
        rating: 4.7,
        reviewCount: 45,
        features: ["2 sıralı", "Titreşimli eleme bandı", "Minimum zarar", "75 HP traktör uyumlu"],
        description:
          "Patates hasat makinesi, patatesleri toprağı dağıtarak yüzeye çıkarır ve bantlı eleme sistemiyle temizler. İşçilik maliyetini 10 kat azaltır.",
        available: false,
      },
      {
        id: "yonca-1",
        name: "Yonca Biçme Makinesi",
        image:
          "https://images.unsplash.com/photo-1599833975787-5c143f373c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 500,
        weeklyPrice: 3000,
        location: "Ankara, Türkiye",
        rating: 4.6,
        reviewCount: 38,
        features: ["2.8 m kesim eni", "Kondisyoner dahil", "Hızlı kuruma", "50 HP traktör uyumlu"],
        description:
          "Yonca biçme ve kondisyonlama makinesi, yonca ve kaba yemleri keserek hızlı kurumasını sağlar. Yüksek kaliteli kaba yem üretimi için idealdir.",
        available: true,
      },
      {
        id: "silaj-1",
        name: "Silaj Makinesi",
        image:
          "https://images.unsplash.com/photo-1574323347407-f3ef87f069f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 1800,
        weeklyPrice: 11000,
        location: "Bursa, Türkiye",
        rating: 4.7,
        reviewCount: 29,
        features: ["Saatte 80 ton kapasite", "Ayarlanabilir parça boyu", "Mısır/yonca uyumlu", "140 HP traktör uyumlu"],
        description:
          "Silaj makinesi, mısır ve kaba yemleri kıyarak silaj elde etmek için kullanılır. Hayvancılık işletmeleri için en verimli yem hazırlama çözümüdür.",
        available: true,
      },
    ],
  },
  {
    id: "tasima-yukleme",
    name: "Taşıma ve Yükleme",
    image:
      "https://images.unsplash.com/photo-1595152452543-eb59b21f4faa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 5,
    products: [
      {
        id: "traktor-1",
        name: "Traktör (100 HP)",
        image:
          "https://images.unsplash.com/photo-1500382134874-f8a4dd5e25b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 1200,
        weeklyPrice: 7500,
        location: "Konya, Türkiye",
        rating: 4.9,
        reviewCount: 134,
        features: ["100 HP motor", "4WD çekiş", "Klimali kabin", "Ön yükleyici dahil"],
        description:
          "Çok amaçlı tarım traktörü, pulluk, ekim, hasat ve taşıma gibi tüm tarımsal işlerde kullanılabilir. Ön yükleyici ekiyle yükleme işlemleri de yapılabilir.",
        available: true,
      },
      {
        id: "romork-1",
        name: "Tarım Römorku (10 Ton)",
        image:
          "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 350,
        weeklyPrice: 2100,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 57,
        features: ["10 ton kapasite", "Hidrolik arkadan boşaltma", "Kapalı brandalı", "Hava freni"],
        description:
          "Tek dingilli tarım römorku, tahıl, meyve-sebze ve tarımsal malzemelerin taşınması için kullanılır. Hidrolik boşaltma sistemi ile hızlı boşaltma yapılır.",
        available: true,
      },
      {
        id: "kepce-1",
        name: "Kepçeli Yükleyici",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 1500,
        weeklyPrice: 9000,
        location: "İzmir, Türkiye",
        rating: 4.7,
        reviewCount: 43,
        features: ["1.2 m³ kepçe", "Hidrolik sistem", "360° dönüş", "Her arazi uyumlu"],
        description:
          "Lastikli kepçeli yükleyici, toprak, gübre ve tahıl yükleme-boşaltma işlemlerinde büyük kolaylık sağlar. Dar alanlarda da rahatlıkla manevra yapar.",
        available: true,
      },
      {
        id: "balya-1",
        name: "Balya Makinesi (Büyük Balya)",
        image:
          "https://images.unsplash.com/photo-1599833975787-5c143f373c30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 680,
        weeklyPrice: 4200,
        location: "Bursa, Türkiye",
        rating: 4.8,
        reviewCount: 61,
        features: ["1.2 x 1.3 m kare balya", "Saatte 60 balya", "Otomatik bağlama", "60 HP traktör uyumlu"],
        description:
          "Büyük kare balya makinesi, kaba yemleri sıkıştırarak yüksek yoğunluklu balya haline getirir. Uzun süreli depolama ve kolay taşıma için idealdir.",
        available: false,
      },
      {
        id: "forklift-1",
        name: "Tarım Forklift",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 800,
        weeklyPrice: 4900,
        location: "Adana, Türkiye",
        rating: 4.4,
        reviewCount: 25,
        features: ["3 ton kaldırma kapasitesi", "4 m kaldırma yüksekliği", "LPG/Dizel seçenek", "Gıda güvenli çatal"],
        description:
          "Tarım forklift, depo ve soğuk hava depolarında palet taşıma, yükleme ve istifleme işlemleri için kullanılır.",
        available: true,
      },
    ],
  },
  {
    id: "hayvancilik",
    name: "Hayvancılık Destek",
    image:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    productCount: 3,
    products: [
      {
        id: "yem-karma-1",
        name: "Yem Karma Makinesi",
        image:
          "https://images.unsplash.com/photo-1516467508483-a7212febe31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 480,
        weeklyPrice: 2900,
        location: "Erzurum, Türkiye",
        rating: 4.7,
        reviewCount: 36,
        features: ["8 m³ kapasite", "Dikey vidalı karıştırma", "Tartı sistemi dahil", "TMR yem hazırlama"],
        description:
          "Yem karma (TMR) makinesi, silaj, kuru ot, konsantre yem ve katkıları homojen şekilde karıştırarak tek öğünde dengeli rasyonlu yem hazırlar.",
        available: true,
      },
      {
        id: "sagim-1",
        name: "Seyyar Süt Sağım Makinesi",
        image:
          "https://images.unsplash.com/photo-1571566882372-1598d88abd90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 250,
        weeklyPrice: 1550,
        location: "Konya, Türkiye",
        rating: 4.6,
        reviewCount: 42,
        features: ["2 başlıklı", "30 lt/dak debi", "Paslanmaz süt bidonu", "Sessiz vakum pompası"],
        description:
          "Seyyar süt sağım makinesi, ahır içinde kolay taşınabilir yapısıyla her ineği bulunduğu yerde sağar. Hijyenik ve hızlı sağım sağlar.",
        available: true,
      },
      {
        id: "hayvan-romork-1",
        name: "Hayvan Taşıma Römorku",
        image:
          "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
        dailyPrice: 420,
        weeklyPrice: 2600,
        location: "Ankara, Türkiye",
        rating: 4.5,
        reviewCount: 19,
        features: ["6 büyük baş kapasiteli", "Havalandırmalı", "Kaymaz zemin", "Hızlı biniş rampası"],
        description:
          "Hayvan taşıma römorku, büyükbaş ve küçükbaş hayvanların veteriner, fuar ve mezbaha nakillerinde güvenli taşınmasını sağlar.",
        available: false,
      },
    ],
  },
];
