import { Equipment, Notification } from '../types';

export const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'John Deere 6155R Traktör',
    category: 'Traktör',
    image: 'https://images.unsplash.com/photo-1618346976725-71ee4a1ecc89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKb2huJTIwRGVlcmUlMjB0cmFjdG9yJTIwZ3JlZW58ZW58MXx8fHwxNzY2Nzc5MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 2500,
    pricePerHour: 150,
    location: 'Ankara, Polatlı',
    neighborhood: 'Merkez Mahallesi',
    status: 'Müsait',
    description: '155 HP güçte, 2020 model John Deere traktör. Toprak işleme, ekim ve hasat işlerinde kullanılabilir. Düzenli bakımları yapılmaktadır.',
    owner: 'Ahmet Yılmaz',
    rating: 4.8,
    reviews: [
      {
        id: 'r1',
        author: 'Mehmet Kaya',
        rating: 5,
        comment: 'Çok temiz ve güçlü bir traktör. Bakımlı olduğu belli oluyor.',
        date: '2025-10-15'
      },
      {
        id: 'r2',
        author: 'Ali Demir',
        rating: 4,
        comment: 'Gayet iyi, tavsiye ederim.',
        date: '2025-09-20'
      }
    ],
    lastMaintenance: '2025-10-01',
    unavailablePeriods: [
      {
        startDate: '2025-12-28',
        endDate: '2025-12-30'
      },
      {
        startDate: '2026-01-05',
        endDate: '2026-01-07',
        startTime: '09:00',
        endTime: '17:00'
      }
    ]
  },
  {
    id: '2',
    name: 'Claas Lexion 780 Biçerdöver',
    category: 'Biçerdöver',
    image: 'https://images.unsplash.com/photo-1691088107567-5034cb97d3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDbGFhcyUyMGNvbWJpbmUlMjBoYXJ2ZXN0ZXJ8ZW58MXx8fHwxNzY2Nzc5MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 4500,
    pricePerHour: 280,
    location: 'Konya, Ereğli',
    neighborhood: 'Kazımkarabekir Mahallesi',
    status: 'Müsait',
    description: 'Yüksek kapasiteli modern biçerdöver. Buğday, arpa ve mısır hasadı için ideal. GPS destekli.',
    owner: 'Mustafa Çelik',
    rating: 4.9,
    reviews: [
      {
        id: 'r3',
        author: 'Hasan Öztürk',
        rating: 5,
        comment: 'Harika bir makine, çok verimli çalışıyor.',
        date: '2025-08-10'
      }
    ],
    lastMaintenance: '2025-09-15',
    unavailablePeriods: [
      {
        startDate: '2026-01-02',
        endDate: '2026-01-04',
        startTime: '14:00',
        endTime: '18:00'
      }
    ]
  },
  {
    id: '3',
    name: 'Damla Sulama Sistemi (5 Dönüm)',
    category: 'Sulama Sistemi',
    image: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmlwJTIwaXJyaWdhdGlvbiUyMHN5c3RlbSUyMGZhcm18ZW58MXx8fHwxNzY2Nzc5MTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 800,
    pricePerHour: 50,
    location: 'Antalya, Serik',
    neighborhood: 'Beşkonak Mahallesi',
    status: 'Müsait',
    description: 'Modern damla sulama sistemi. 5 dönümlük alan için yeterli. Kurulum desteği sağlanır.',
    owner: 'Fatma Aydın',
    rating: 4.6,
    reviews: [],
    lastMaintenance: '2025-10-20'
  },
  {
    id: '4',
    name: 'Pulluk (Ağır Toprak)',
    category: 'Toprak İşleme',
    image: 'https://images.unsplash.com/photo-1758482396367-fc331a89f3c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBwbG93JTIwZmllbGR8ZW58MXx8fHwxNzY2Nzc5MTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 1200,
    pricePerHour: 80,
    location: 'Edirne, Keşan',
    neighborhood: 'Yenimuhacir Mahallesi',
    status: 'Kiralıkta',
    description: '5 gövdeli ağır toprak pulluğu. Derin sürüm için idealdir.',
    owner: 'İbrahim Şahin',
    rating: 4.7,
    reviews: [],
    lastMaintenance: '2025-09-05'
  },
  {
    id: '5',
    name: 'Tarım Römork (8 Ton)',
    category: 'Römork',
    image: 'https://images.unsplash.com/photo-1760229103296-2f0e7ead8a4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdHJhaWxlciUyMGFncmljdWx0dXJhbHxlbnwxfHx8fDE3NjY3NzkxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 900,
    pricePerHour: 60,
    location: 'İzmir, Ödemiş',
    neighborhood: 'Cumhuriyet Mahallesi',
    status: 'Müsait',
    description: '8 ton kapasiteli tarım römork. Tahıl ve ürün taşıma için ideal.',
    owner: 'Hüseyin Arslan',
    rating: 4.5,
    reviews: [],
    lastMaintenance: '2025-10-10'
  },
  {
    id: '7',
    name: 'Hidrolik Kepçe (Kazıcı)',
    category: 'Kepçe',
    image: 'https://images.unsplash.com/photo-1763054763616-d2d2ed2312b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY2Njk1ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 3500,
    pricePerHour: 220,
    location: 'Adana, Ceyhan',
    neighborhood: 'Kahraman Mahallesi',
    status: 'Müsait',
    description: '20 ton hidrolik kepçe. Kanal açma, temel kazısı ve zemin düzenleme işleri için.',
    owner: 'Veli Öz',
    rating: 4.9,
    reviews: [],
    lastMaintenance: '2025-10-05'
  },
  {
    id: '8',
    name: 'Tarım Römork (12 Ton)',
    category: 'Römork',
    image: 'https://images.unsplash.com/photo-1760229103296-2f0e7ead8a4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwdHJhaWxlciUyMGFncmljdWx0dXJhbHxlbnwxfHx8fDE3NjY3NzkxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 1100,
    pricePerHour: 75,
    location: 'Manisa, Salihli',
    neighborhood: 'Durasıllı Mahallesi',
    status: 'Müsait',
    description: '12 ton kapasiteli büyük römork. Ağır yük taşıma için ideal.',
    owner: 'Ayşe Kara',
    rating: 4.6,
    reviews: [],
    lastMaintenance: '2025-09-30'
  },
  {
    id: '9',
    name: 'Pnömatik Ekim Makinesi',
    category: 'Ekim Ekipmanları',
    image: 'https://images.unsplash.com/photo-1742219834354-e865378292d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWVkJTIwcGxhbnRlciUyMG1hY2hpbmV8ZW58MXx8fHwxNzY2Nzc5MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 1800,
    pricePerHour: 110,
    location: 'Şanlıurfa, Viranşehir',
    neighborhood: 'Yenişehir Mahallesi',
    status: 'Müsait',
    description: '8 sıra pnömatik ekim makinesi. Hassas ekim için GPS destekli.',
    owner: 'Mahmut Tunç',
    rating: 4.7,
    reviews: [],
    lastMaintenance: '2025-10-12'
  },
  {
    id: '10',
    name: 'Gübre Dağıtıcı (Hidrolik)',
    category: 'Gübre Dağıtıcı',
    image: 'https://images.unsplash.com/photo-1758608951483-0cbeef303869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJ0aWxlizyerJTIwc3ByZWFkZXIlMjBhZ3JpY3VsdHVyYWx8ZW58MXx8fHwxNzY2Nzc5MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 1300,
    pricePerHour: 85,
    location: 'Çorum, Sungurlu',
    neighborhood: 'Çay Mahallesi',
    status: 'Müsait',
    description: '2 ton kapasiteli hidrolik gübre dağıtıcı. Tarla ve bahçe kullanımı için.',
    owner: 'Zeynep Bulut',
    rating: 4.4,
    reviews: [],
    lastMaintenance: '2025-09-18'
  },
  {
    id: '12',
    name: 'Diskli Tırmık (3m)',
    category: 'Toprak İşleme',
    image: 'https://images.unsplash.com/photo-1762291347492-c15634c64f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjJTIwaGFycm93JTIwZmFybWluZ3xlbnwxfHx8fDE3NjY3NzkxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    pricePerDay: 950,
    pricePerHour: 65,
    location: 'Adıyaman, Merkez',
    neighborhood: 'Bahçelievler Mahallesi',
    status: 'Müsait',
    description: '3 metre diskli tırmık. Toprak işleme ve yüzey hazırlığı için.',
    owner: 'Gülşen Kılıç',
    rating: 4.5,
    reviews: [],
    lastMaintenance: '2025-10-08'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    message: 'Kiralama süresi 2 gün içinde doluyor.',
    date: '2025-11-01',
    read: false
  },
  {
    id: 'n2',
    message: 'Ekipman başarıyla iade edildi.',
    date: '2025-10-28',
    read: true
  },
  {
    id: 'n3',
    message: 'Yeni bir kiralama talebi aldınız.',
    date: '2025-10-25',
    read: true
  }
];