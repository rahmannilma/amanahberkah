export const INITIAL_VEHICLES = [
  {
    id: 1,
    name: 'Honda Civic Type R',
    brand: 'Honda',
    type: 'Mobil',
    price: 1399000000,
    transmission: 'Manual',
    year: 2024,
    status: 'Tersedia',
    images: [
      '/image/car_civic.png'
    ],
    specs: {
      engine: '2.0L VTEC Turbo',
      power: '315 HP @ 6500 RPM',
      transmission: '6-Speed Manual',
      fuel: 'Bensin (RON 98)',
      seats: '4 Kursi'
    }
  },
  {
    id: 2,
    name: 'Toyota Raize GR Sport',
    brand: 'Toyota',
    type: 'Mobil',
    price: 305000000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Tersedia',
    images: [
      '/image/car_raize.png'
    ],
    specs: {
      engine: '1.0L 3-Silinder Turbo',
      power: '98 HP @ 6000 RPM',
      transmission: 'CVT Otomatis',
      fuel: 'Bensin',
      seats: '5 Kursi'
    }
  },
  {
    id: 3,
    name: 'Hyundai Ioniq 5 Signature',
    brand: 'Hyundai',
    type: 'Mobil',
    price: 782000000,
    transmission: 'Otomatis',
    year: 2024,
    status: 'Tersedia',
    images: [
      '/image/car_ioniq.png'
    ],
    specs: {
      engine: 'Permanent Magnet Synchronous Motor (Electric)',
      power: '217 HP (Electric Motor)',
      transmission: 'Single Speed Reduction',
      fuel: 'Listrik (Baterai 72.6 kWh)',
      seats: '5 Kursi'
    }
  },
  {
    id: 4,
    name: 'BMW 320i Sport',
    brand: 'BMW',
    type: 'Mobil',
    price: 1080000000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Tersedia',
    images: [
      '/image/car_bmw.png'
    ],
    specs: {
      engine: '2.0L TwinPower Turbo 4-Silinder',
      power: '184 HP @ 5000 RPM',
      transmission: '8-Speed Otomatis',
      fuel: 'Bensin',
      seats: '5 Kursi'
    }
  },
  // PREPOPULATED SOLD VEHICLES FOR SALES ANALYTICS (Current date context is 2026-06-15)
  {
    id: 9,
    name: 'Toyota Avanza Veloz',
    brand: 'Toyota',
    type: 'Mobil',
    price: 290000000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Laku',
    soldDate: '2026-06-12', // Sold this month, this year
    images: ['/image/car_mpv.png'],
    specs: { engine: '1.5L DOHC Dual VVT-i', power: '106 HP', transmission: 'CVT', fuel: 'Bensin', seats: '7 Kursi' }
  },
  {
    id: 10,
    name: 'Mitsubishi Xpander Ultimate',
    brand: 'Mitsubishi',
    type: 'Mobil',
    price: 312000000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Laku',
    soldDate: '2026-06-02', // Sold this month, this year
    images: ['/image/car_mpv.png'],
    specs: { engine: '1.5L MIVEC DOHC', power: '105 HP', transmission: 'CVT', fuel: 'Bensin', seats: '7 Kursi' }
  },
  {
    id: 11,
    name: 'Honda Brio Satya E',
    brand: 'Honda',
    type: 'Mobil',
    price: 180000000,
    transmission: 'Manual',
    year: 2022,
    status: 'Laku',
    soldDate: '2026-02-14', // Sold this year, but not this month
    images: ['/image/car_hatchback.png'],
    specs: { engine: '1.2L i-VTEC', power: '90 HP', transmission: '5-Speed Manual', fuel: 'Bensin', seats: '5 Kursi' }
  },
  {
    id: 12,
    name: 'Suzuki Ertiga Hybrid',
    brand: 'Suzuki',
    type: 'Mobil',
    price: 270000000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Laku',
    soldDate: '2025-11-20', // Sold last year (not this year, not this month)
    images: ['/image/car_mpv.png'],
    specs: { engine: '1.5L K15B Smart Hybrid', power: '103 HP', transmission: '4-Speed Automatic', fuel: 'Bensin', seats: '7 Kursi' }
  }
];
