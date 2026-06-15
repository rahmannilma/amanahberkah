import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Modal,
  Slider,
  Tag,
  Typography,
  Space,
  Carousel,
  Descriptions,
  ConfigProvider,
  theme,
  Empty
} from 'antd';
import {
  SearchOutlined,
  MessageOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Data Mock Kendaraan
export const DUMMY_VEHICLES = [
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
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'
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
      'https://images.unsplash.com/photo-1625232889218-4dfb9870d0bf?w=800',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'
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
      'https://images.unsplash.com/photo-1669023414166-a4cf7c0fd1f2?w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800'
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
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=800'
    ],
    specs: {
      engine: '2.0L TwinPower Turbo 4-Silinder',
      power: '184 HP @ 5000 RPM',
      transmission: '8-Speed Otomatis',
      fuel: 'Bensin',
      seats: '5 Kursi'
    }
  },
  {
    id: 5,
    name: 'Yamaha YZF-R15 V4',
    brand: 'Yamaha',
    type: 'Motor',
    price: 39875000,
    transmission: 'Manual',
    year: 2024,
    status: 'Tersedia',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800'
    ],
    specs: {
      engine: '155cc LC4V SOHC VVA',
      power: '19 HP @ 10000 RPM',
      transmission: '6-Speed Manual',
      fuel: 'Bensin',
      seats: '2 Kursi'
    }
  },
  {
    id: 6,
    name: 'Vespa Sprint S 150 i-get ABS',
    brand: 'Vespa',
    type: 'Motor',
    price: 57400000,
    transmission: 'Otomatis',
    year: 2023,
    status: 'Tersedia',
    images: [
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800',
      'https://images.unsplash.com/photo-1517404212738-196d1a50958d?w=800'
    ],
    specs: {
      engine: '154.8cc i-get 3-valve',
      power: '12.7 HP @ 7750 RPM',
      transmission: 'CVT Otomatis',
      fuel: 'Bensin',
      seats: '2 Kursi'
    }
  },
  {
    id: 7,
    name: 'Honda Rebel 500',
    brand: 'Honda',
    type: 'Motor',
    price: 201680000,
    transmission: 'Manual',
    year: 2023,
    status: 'Tersedia',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'
    ],
    specs: {
      engine: '471cc Parallel-Twin Liquid-Cooled',
      power: '45.5 HP @ 8500 RPM',
      transmission: '6-Speed Manual',
      fuel: 'Bensin',
      seats: '2 Kursi'
    }
  },
  {
    id: 8,
    name: 'Kawasaki Ninja ZX-25R',
    brand: 'Kawasaki',
    type: 'Motor',
    price: 123500000,
    transmission: 'Manual',
    year: 2024,
    status: 'Tersedia',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800'
    ],
    specs: {
      engine: '249.8cc In-Line 4 Liquid-Cooled',
      power: '51 HP @ 15500 RPM',
      transmission: '6-Speed Manual',
      fuel: 'Bensin',
      seats: '2 Kursi'
    }
  }
];

export default function KatalogKendaraan({ type = 'Mobil', vehicles }) {
  const { token } = theme.useToken();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [searchText, setSearchText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTrans, setSelectedTrans] = useState('All');
  const [maxPrice, setMaxPrice] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [dpPercentage, setDpPercentage] = useState(20);
  const [tenor, setTenor] = useState(36);

  // Reset filter ketika tipe kendaraan berubah
  useEffect(() => {
    setSearchText('');
    setSelectedBrand('All');
    setSelectedTrans('All');
    setMaxPrice(null);
  }, [type]);

  // Saring kendaraan berdasarkan Tipe dan status Tersedia
  const typeVehicles = useMemo(() => {
    const activeVehicles = vehicles || DUMMY_VEHICLES;
    return activeVehicles.filter((item) => item.type === type && item.status === 'Tersedia');
  }, [type, vehicles]);

  // Ambil daftar merek yang tersedia untuk tipe kendaraan ini secara dinamis
  const availableBrands = useMemo(() => {
    const brands = typeVehicles.map((item) => item.brand);
    return ['All', ...new Set(brands)];
  }, [typeVehicles]);

  // Opsi harga maksimal yang relevan
  const priceOptions = useMemo(() => {
    return type === 'Mobil'
      ? [
          { value: 350000000, label: 'Rp 350 Juta' },
          { value: 500000000, label: 'Rp 500 Juta' },
          { value: 800000000, label: 'Rp 800 Juta' },
          { value: 1200000000, label: 'Rp 1.2 Miliar' },
          { value: 1500000000, label: 'Rp 1.5 Miliar' },
        ]
      : [
          { value: 40000000, label: 'Rp 40 Juta' },
          { value: 60000000, label: 'Rp 60 Juta' },
          { value: 100000000, label: 'Rp 100 Juta' },
          { value: 150000000, label: 'Rp 150 Juta' },
          { value: 250000000, label: 'Rp 250 Juta' },
        ];
  }, [type]);

  const showDetail = (vehicle) => {
    setSelectedVehicle(vehicle);
    setDpPercentage(20);
    setTenor(36);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const filteredVehicles = useMemo(() => {
    return typeVehicles.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchBrand = selectedBrand === 'All' || item.brand === selectedBrand;
      const matchTrans = selectedTrans === 'All' || item.transmission === selectedTrans;
      const matchPrice = !maxPrice || item.price <= maxPrice;
      return matchSearch && matchBrand && matchTrans && matchPrice;
    });
  }, [typeVehicles, searchText, selectedBrand, selectedTrans, maxPrice]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const creditDetails = useMemo(() => {
    if (!selectedVehicle) return { dpAmount: 0, loanAmount: 0, monthlyInstallment: 0 };
    const price = selectedVehicle.price;
    const dpAmount = (price * dpPercentage) / 100;
    const loanAmount = price - dpAmount;

    const annualInterestRate = 0.06; 
    const totalInterest = loanAmount * annualInterestRate * (tenor / 12);
    const totalLoan = loanAmount + totalInterest;
    const monthlyInstallment = Math.round(totalLoan / tenor);

    return { dpAmount, loanAmount, monthlyInstallment };
  }, [selectedVehicle, dpPercentage, tenor]);

  return (
    <div style={{ padding: isMobile ? '16px 12px' : '24px', background: 'transparent', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700, color: token.colorPrimary }}>
          Katalog {type} Premium
        </Title>
        <Paragraph type="secondary" style={{ fontSize: isMobile ? '13px' : '14px' }}>Temukan {type} Impian Anda dengan Penawaran Kredit Terbaik</Paragraph>
      </div>

      <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input.Search
              placeholder={`Cari ${type}...`}
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          
          <Col xs={12} sm={8} md={5}>
            <Select
              placeholder="Pilih Merek"
              style={{ width: '100%' }}
              value={selectedBrand}
              onChange={setSelectedBrand}
            >
              {availableBrands.map((brand) => (
                <Option key={brand} value={brand}>
                  {brand === 'All' ? 'Semua Merek' : brand}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={8} md={5}>
            <Select
              placeholder="Transmisi"
              style={{ width: '100%' }}
              value={selectedTrans}
              onChange={setSelectedTrans}
            >
              <Option value="All">Semua Transmisi</Option>
              <Option value="Manual">Manual</Option>
              <Option value="Otomatis">Otomatis</Option>
            </Select>
          </Col>

          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Batas Harga Maksimal"
              style={{ width: '100%' }}
              allowClear
              value={maxPrice}
              onChange={(value) => setMaxPrice(value)}
            >
              {priceOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {filteredVehicles.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredVehicles.map((vehicle) => (
            <Col xs={24} sm={12} md={8} lg={6} key={vehicle.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      alt={vehicle.name}
                      src={vehicle.images[0]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Tag
                      color="green"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}
                    >
                      {vehicle.status}
                    </Tag>
                  </div>
                }
                actions={[
                  <Button type="link" icon={<FileTextOutlined />} onClick={() => showDetail(vehicle)}>
                    Detail & Simulasi
                  </Button>
                ]}
                style={{ borderRadius: '12px', overflow: 'hidden' }}
              >
                <Card.Meta
                  title={vehicle.name}
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text type="secondary">{vehicle.brand} • {vehicle.year}</Text>
                      <Text strong style={{ fontSize: '16px', color: token.colorPrimary }}>
                        {formatRupiah(vehicle.price)}
                      </Text>
                      <Space style={{ marginTop: '8px' }}>
                        <Tag icon={<CalendarOutlined />}>{vehicle.year}</Tag>
                        <Tag icon={<DashboardOutlined />}>{vehicle.transmission}</Tag>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Tidak ada kendaraan yang sesuai dengan kriteria filter." style={{ marginTop: '40px' }} />
      )}

      <Modal
        title={selectedVehicle ? `${selectedVehicle.name} (${selectedVehicle.year})` : ''}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={isMobile ? '95%' : 850}
        style={{ top: isMobile ? 10 : 40 }}
      >
        {selectedVehicle && (
          <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
            <Col xs={24} md={12}>
              <Carousel autoplay style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedVehicle.images.map((img, idx) => (
                  <div key={idx} style={{ height: isMobile ? '180px' : '240px' }}>
                    <img src={img} alt={`img-${idx}`} style={{ width: '100%', height: isMobile ? '180px' : '240px', objectFit: 'cover' }} />
                  </div>
                ))}
              </Carousel>

              <Descriptions title="Spesifikasi Teknis" bordered column={1} size="small">
                <Descriptions.Item label="Mesin">{selectedVehicle.specs.engine}</Descriptions.Item>
                <Descriptions.Item label="Tenaga">{selectedVehicle.specs.power}</Descriptions.Item>
                <Descriptions.Item label="Transmisi">{selectedVehicle.specs.transmission}</Descriptions.Item>
                <Descriptions.Item label="Bahan Bakar">{selectedVehicle.specs.fuel}</Descriptions.Item>
                <Descriptions.Item label="Kapasitas">{selectedVehicle.specs.seats}</Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={<span style={{ color: token.colorPrimary }}><DollarOutlined /> Simulasi Kredit Flat (Bunga 6%)</span>}
                bordered={false}
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', height: '100%' }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Uang Muka (DP): <strong>{dpPercentage}%</strong></Text>
                    <Text strong>{formatRupiah(creditDetails.dpAmount)}</Text>
                  </div>
                  <Slider
                    min={10}
                    max={80}
                    step={5}
                    value={dpPercentage}
                    onChange={(val) => setDpPercentage(val)}
                    tooltip={{ formatter: (val) => `${val}%` }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Tenor (Jangka Waktu): <strong>{tenor} Bulan</strong></Text>
                    <Text strong>{tenor / 12} Tahun</Text>
                  </div>
                  <Slider
                    min={12}
                    max={60}
                    step={12}
                    value={tenor}
                    onChange={(val) => setTenor(val)}
                    tooltip={{ formatter: (val) => `${val} Bulan` }}
                    marks={isMobile ? undefined : {
                      12: '1 Thn',
                      24: '2 Thn',
                      36: '3 Thn',
                      48: '4 Thn',
                      60: '5 Thn'
                    }}
                  />
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text type="secondary">Pokok Hutang:</Text>
                    <Text>{formatRupiah(creditDetails.loanAmount)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: '4px' }}>
                    <Text strong style={{ fontSize: '15px' }}>Angsuran per Bulan:</Text>
                    <Text strong style={{ fontSize: '18px', color: token.colorPrimary }}>
                      {formatRupiah(creditDetails.monthlyInstallment)} / bln
                    </Text>
                  </div>
                </div>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#25D366',
                      colorPrimaryHover: '#128C7E',
                      colorPrimaryActive: '#075E54'
                    }
                  }}
                >
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    size="large"
                    block
                    onClick={() => {
                      const messageText = `Halo Sales, saya tertarik dengan unit *${selectedVehicle.name} (${selectedVehicle.year})* seharga *${formatRupiah(selectedVehicle.price)}*.
Simulasi Kredit Pilihan Saya:
- DP: ${dpPercentage}% (${formatRupiah(creditDetails.dpAmount)})
- Tenor: ${tenor} bulan
- Estimasi cicilan: ${formatRupiah(creditDetails.monthlyInstallment)}/bulan.
Mohon info selanjutnya, terima kasih!`;
                      
                      const waUrl = `https://wa.me/6282393700500?text=${encodeURIComponent(messageText)}`;
                      window.open(waUrl, '_blank');
                    }}
                    style={{ fontWeight: 'bold' }}
                  >
                    Hubungi Sales via WhatsApp
                  </Button>
                </ConfigProvider>
              </Card>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
}
