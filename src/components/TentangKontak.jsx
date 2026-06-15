import React from 'react';
import { Card, Row, Col, Typography, Space, theme, Divider, Image } from 'antd';
import {
  InstagramOutlined,
  FacebookOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function TentangKontak() {
  const { token } = theme.useToken();

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const galleryImages = [
    '/image/gallery1.png',
    '/image/gallery2.png',
    '/image/gallery3.png',
    '/image/gallery4.png'
  ];

  return (
    <div style={{ padding: isMobile ? '24px 12px' : '40px 24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '50px' }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 800, color: token.colorPrimary }}>
          Profil Showroom AMANAH BERKAH
        </Title>
        <Paragraph style={{ color: token.colorTextSecondary, marginTop: '8px', fontSize: isMobile ? '13px' : '15px' }}>
          Showroom Mobil & Motor Bekas Terpercaya dari Mamuju, Sulawesi Barat.
        </Paragraph>
      </div>

      <Row gutter={[32, 32]}>
        {/* Profile / History Column */}
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            title={<span style={{ color: token.colorPrimary, fontWeight: 'bold', fontSize: '18px' }}>Profil & Sejarah Singkat</span>}
            style={{
              background: token.colorBgContainer,
              borderRadius: '16px',
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Paragraph style={{ fontSize: '14px', lineHeight: '1.6', color: token.colorTextSecondary }}>
              <Text strong style={{ color: token.colorText }}>AMANAH BERKAH</Text> adalah showroom kendaraan bekas terkemuka yang berbasis di Mamuju, Sulawesi Barat. Usaha ini dirintis sejak tahun 2023 oleh <Text strong style={{ color: token.colorText }}>Rezky Akbar</Text> yang akrab disapa dengan nama panggilan <Text strong style={{ color: token.colorText }}>Resky</Text>.
            </Paragraph>
            <Paragraph style={{ fontSize: '14px', lineHeight: '1.6', color: token.colorTextSecondary }}>
              Perjalanan AMANAH BERKAH berawal dari skala kecil dengan menjual motor bekas, sebelum perlahan melakukan ekspansi besar-besaran ke dunia jual beli mobil bekas. Meskipun sempat mengalami pasang surut dan tantangan finansial yang berat, komitmen untuk terus berbenah secara manajemen, seleksi kelayakan unit, serta efisiensi stok membawa AMANAH BERKAH bertumbuh menjadi showroom dengan volume penjualan unit yang luar biasa tinggi.
            </Paragraph>
            <Paragraph style={{ fontSize: '14px', lineHeight: '1.6', color: token.colorTextSecondary }}>
              Saat ini, AMANAH BERKAH dikenal luas di seluruh Indonesia, didukung oleh transparansi konten review harga di media sosial (TikTok, Instagram, dan YouTube). Showroom ini melayani transaksi jual beli, tukar tambah, dan pembiayaan dengan prinsip kejujuran, harga realistis, dan kenyamanan tanpa drama.
            </Paragraph>

            <Divider style={{ margin: '20px 0' }} />

            <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
              <Space align="start">
                <SafetyCertificateOutlined style={{ fontSize: '24px', color: token.colorPrimary, marginTop: '2px' }} />
                <div>
                  <Text strong style={{ color: token.colorPrimary, display: 'block', marginBottom: '4px' }}>Waspada Penipuan Akun Palsu!</Text>
                  <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
                    AMANAH BERKAH tidak pernah mengadakan undian berhadiah yang meminta uang muka atau biaya transfer. Seluruh transaksi resmi disarankan dilakukan secara langsung di showroom fisik atau menghubungi kontak marketing yang terverifikasi di media sosial resmi kami.
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Sidebar Info & Kontak */}
        <Col xs={24} lg={10}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            {/* Jam Kerja & Kontak */}
            <Card
              bordered={false}
              style={{
                background: token.colorBgContainer,
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Title level={4} style={{ marginTop: 0, marginBottom: '20px', color: token.colorPrimary }}>Hubungi Kami</Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <ClockCircleOutlined style={{ color: token.colorPrimary, fontSize: '16px', marginTop: '4px' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>Jam Operasional</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Senin – Sabtu: 08:00 – 20:00 WIB</Text>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <PhoneOutlined style={{ color: token.colorPrimary, fontSize: '16px', marginTop: '4px' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>WhatsApp Admin Marketing</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>+62 823-9370-0500</Text>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <EnvironmentOutlined style={{ color: token.colorPrimary, fontSize: '16px', marginTop: '4px' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>Alamat Showroom Utama</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      Mutiara Gading Residence, Karema, Kec. Mamuju, Kabupaten Mamuju, Sulawesi Barat 91512
                    </Text>
                  </div>
                </div>
              </Space>

              <Divider style={{ margin: '16px 0' }} />

              <Title level={5} style={{ marginTop: 0, marginBottom: '12px', fontSize: '14px' }}>Media Sosial Resmi</Title>
              <Space size={16} style={{ flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer" style={{ color: '#e1306c', fontSize: '24px' }}>
                  <InstagramOutlined />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" style={{ color: '#1877f2', fontSize: '24px' }}>
                  <FacebookOutlined />
                </a>
              </Space>
            </Card>

            {/* Google Maps Card */}
            <Card
              bordered={false}
              styles={{ body: { padding: 0 } }}
              style={{
                background: token.colorBgContainer,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <iframe
                title="Peta Lokasi AMANAH BERKAH"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.4203048759114!2d118.88039509999999!3d-2.6904774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d92d9003a1b051f%3A0x2abec7cee07daba9!2sShow%20room%20Amanah%20Berkah!5e0!3m2!1sid!2sid!4v1781537302435!5m2!1sid!2sid"
                width="100%"
                height="230"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Gallery Section */}
      <div style={{ marginTop: '50px' }}>
        <Title level={isMobile ? 4 : 3} style={{ marginBottom: '24px', color: token.colorPrimary, fontWeight: 'bold' }}>Galeri Showroom & Unit</Title>
        <Row gutter={[16, 16]}>
          {galleryImages.map((imgUrl, index) => (
            <Col xs={12} md={6} key={index}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Image
                  src={imgUrl}
                  alt={`Galeri Unit K-Cunk ${index + 1}`}
                  width="100%"
                  height={isMobile ? 120 : 160}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
