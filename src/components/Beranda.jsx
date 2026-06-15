import React, { useMemo, useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Tag, theme } from 'antd';
import { DUMMY_VEHICLES } from './KatalogKendaraan';

const { Title, Paragraph, Text } = Typography;

export default function Beranda({ onNavigate, vehicles }) {
  const { token } = theme.useToken();

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter 3 mobil pertama yang bertipe Mobil dan berstatus Tersedia
  const featuredCars = useMemo(() => {
    const activeVehicles = vehicles || DUMMY_VEHICLES;
    return activeVehicles.filter((item) => item.type === 'Mobil' && item.status === 'Tersedia').slice(0, 3);
  }, [vehicles]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div style={{ background: '#131315', minHeight: '100vh', color: '#e5e1e4', overflowX: 'hidden' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? 'auto' : 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: isMobile ? '60px' : '40px',
        paddingBottom: isMobile ? '60px' : '40px',
        overflow: 'hidden'
      }}>
        {/* Background Overlay & Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #131315 0%, rgba(19, 19, 21, 0.8) 50%, rgba(19, 19, 21, 0.4) 100%)',
            zIndex: 10
          }}></div>
          <img
            alt="Premium Luxury Car"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_dCFv6NsidAb_xeybmoYoP3KHjBA3BKCfGMHHNiNXZp5gMPawjPgfOAww_C5Y8vFIOYM9tAR5gH9NiixJLIRjCeCpovZsNmM49QpqyKmL7IB_BX8x4cHMpzrewfUo2_w5wuaYXXyQI04PjXl-BaFybSLYIiGJSQie-RDX8Y00HdfFJdzI68rFcVYo-vbcxQvJgiBVu2mdIpt4wHnvvQvVvZHygI1kdQmzNYS80ad9QGMKs1B_XCpbpmoDb9Gb5FhgAbEcxcIzvcI"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, transform: 'scale(1.05)' }}
          />
        </div>

        {/* Content */}
        <div className="premium-container" style={{ position: 'relative', zIndex: 20, width: '100%' }}>
          <div style={{ maxWidth: '720px' }}>
            {/* Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(53, 52, 55, 0.5)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '9999px',
              marginBottom: isMobile ? '20px' : '32px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <span className="pulse-dot"></span>
              <span className="font-montserrat" style={{ fontSize: '11px', fontWeight: 'bold', color: '#e5beb4', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Showroom Mobil Bekas Terpercaya
              </span>
            </div>

            {/* Title */}
            <h1 className="font-montserrat" style={{
              fontSize: isMobile ? '28px' : '44px',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '24px',
              lineHeight: '1.2',
              letterSpacing: '-1px'
            }}>
              Mobil Bekas Berkualitas, <br />
              <span style={{ color: '#ff562d' }}>Harga Realistis, Proses Tanpa Drama.</span>
            </h1>

            {/* Paragraph */}
            <Paragraph className="font-inter" style={{
              color: '#e5beb4',
              fontSize: isMobile ? '14px' : '18px',
              lineHeight: '1.6',
              maxWidth: '600px',
              marginBottom: isMobile ? '28px' : '40px'
            }}>
              AMANAH BERKAH menghadirkan unit kendaraan bekas pilihan dengan kondisi terbaik, dokumen lengkap, dan review yang transparan langsung dari showroom kami di <strong style={{ color: '#ffffff' }}>Mamuju</strong>.
            </Paragraph>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
              <button
                onClick={() => onNavigate('mobil')}
                className="primary-btn-gradient font-montserrat"
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
                Lihat Katalog Mobil
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('jual')}
                className="secondary-btn-outline font-montserrat"
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                <span className="material-symbols-outlined">sell</span>
                Jual Kendaraan Anda
              </button>
            </div>
          </div>
        </div>

        {/* Decorative MAMUJU Background Text */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            right: '48px',
            opacity: 0.15,
            userSelect: 'none',
            pointerEvents: 'none'
          }} className="font-montserrat">
            <div style={{ fontSize: '120px', fontWeight: 900, color: '#ac8980', letterSpacing: '4px' }}>MAMUJU</div>
          </div>
        )}
      </section>


      {/* 2. TENTANG KAMI & BENTO GRID SECTION */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0', borderTop: '1px solid rgba(172, 137, 128, 0.1)' }}>
        <div className="premium-container">
          <Row gutter={isMobile ? [24, 24] : [32, 32]}>
            {/* Left Column - Info & Statistics */}
            <Col xs={24} lg={8}>
              <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff562d', marginBottom: '16px' }}>
                  <span className="material-symbols-outlined">info</span>
                  <span className="font-montserrat" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Tentang Kami</span>
                </div>
                <h2 className="font-montserrat" style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: '#ffffff', marginBottom: '24px', lineHeight: '1.3' }}>
                  Transparansi Adalah <span style={{ color: '#ff562d' }}>Prioritas Kami.</span>
                </h2>
                <p className="font-inter" style={{ color: '#ac8980', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                  Kami bukan sekadar perantara, kami adalah partner Anda dalam menemukan kendaraan impian. Beroperasi di Mamuju, Amanah Berkah membangun kepercayaan melalui seleksi unit yang ketat.
                </p>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ padding: isMobile ? '16px' : '24px', borderRadius: '16px', background: '#1b1b1d', border: '1px solid rgba(172, 137, 128, 0.1)' }}>
                      <div className="font-montserrat" style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#ff562d', marginBottom: '4px' }}>500+</div>
                      <div className="font-inter" style={{ fontSize: '13px', color: '#ac8980', fontWeight: 600 }}>Unit Terjual</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: isMobile ? '16px' : '24px', borderRadius: '16px', background: '#1b1b1d', border: '1px solid rgba(172, 137, 128, 0.1)' }}>
                      <div className="font-montserrat" style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#ff562d', marginBottom: '4px' }}>4.9/5</div>
                      <div className="font-inter" style={{ fontSize: '13px', color: '#ac8980', fontWeight: 600 }}>Rating Konsumen</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Right Column - Bento Grid Features */}
            <Col xs={24} lg={16}>
              <Row gutter={[24, 24]}>
                {/* Bento Card 1 */}
                <Col xs={24} md={12}>
                  <div className="bento-card" style={{ padding: isMobile ? '20px' : '32px', height: '100%' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255, 86, 45, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff562d',
                      marginBottom: '24px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>verified</span>
                    </div>
                    <h3 className="font-montserrat" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Seleksi Unit Ketat</h3>
                    <p className="font-inter" style={{ color: '#ac8980', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                      Setiap kendaraan melewati 150+ titik inspeksi untuk menjamin performa mesin dan kualitas eksterior.
                    </p>
                  </div>
                </Col>

                {/* Bento Card 2 */}
                <Col xs={24} md={12}>
                  <div className="bento-card" style={{ padding: isMobile ? '20px' : '32px', height: '100%' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255, 86, 45, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff562d',
                      marginBottom: '24px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>description</span>
                    </div>
                    <h3 className="font-montserrat" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Dokumen Sah & Lengkap</h3>
                    <p className="font-inter" style={{ color: '#ac8980', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                      Garansi keaslian surat-surat (BPKB, STNK, Faktur) untuk kenyamanan dan keamanan hukum pembeli.
                    </p>
                  </div>
                </Col>

                {/* Bento Card 3 (Full width bento) */}
                <Col xs={24}>
                  <div className="bento-card" style={{ padding: isMobile ? '20px' : '32px' }}>
                    <Row gutter={isMobile ? [16, 16] : [24, 24]} align="middle">
                      <Col xs={24} md={12}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 86, 45, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ff562d',
                          marginBottom: '24px'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>visibility</span>
                        </div>
                        <h3 className="font-montserrat" style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Review Video Transparan</h3>
                        <p className="font-inter" style={{ color: '#ac8980', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                          Kami menyertakan video detail kondisi mobil tanpa filter, menunjukkan setiap detail hingga goresan terkecil secara transparan di media sosial kami.
                        </p>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{
                          height: isMobile ? '150px' : '200px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <img
                            alt="Inspection Service"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_Q3Hy7F1vnOLYQDOV-upgZpiissg_RuV4ZhkDViove0NPxU1gFpNE1LG0LnNFdMXXhb3GftRbl_sboOVSPyN0YnZce2x1Dd_IRNOkWSHNPvJTh-OhNFnFbNf2TucgbkyCVH-FTCa5LdiIPG4cEk8UOKrZPqXu8laGjCHoIoPUBHwVkDeBTYQoDxMpgyYkyv9HYu5Qp9M5Z5GM7AdQJ4y4cpbBkUoEk4_e-nZo6ICF3B1rQITYqIAS7ZXl_qOftsHaWK4Kp-fTrQ"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 86, 45, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '56px', color: '#ffffff', cursor: 'pointer' }}>play_circle</span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </section>

      {/* 3. MOBIL PILIHAN TERBARU (DYNAMIC) */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0', borderTop: '1px solid rgba(172, 137, 128, 0.1)' }}>
        <div className="premium-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'flex-end', 
            marginBottom: '40px', 
            flexWrap: 'wrap', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px' 
          }}>
            <div>
              <span className="font-montserrat" style={{ color: '#ff562d', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontSize: '12px' }}>STOK TERBARU</span>
              <h2 className="font-montserrat" style={{ margin: 0, fontWeight: 800, color: '#ffffff', fontSize: isMobile ? '24px' : '30px' }}>Mobil Pilihan Terbaik</h2>
            </div>
            <button
              onClick={() => onNavigate('mobil')}
              className="primary-btn-gradient font-montserrat"
              style={{
                borderRadius: '8px',
                fontWeight: 'bold',
                padding: '12px 24px',
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center'
              }}
            >
              Katalog Lengkap
            </button>
          </div>

          <Row gutter={[24, 24]}>
            {featuredCars.map((vehicle) => (
              <Col xs={24} sm={12} md={8} key={vehicle.id}>
                <div className="bento-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: isMobile ? '180px' : '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      alt={vehicle.name}
                      src={vehicle.images[0]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <Tag
                      color="green"
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        background: '#131315',
                        borderColor: '#ff562d',
                        color: '#ffb4a2'
                      }}
                    >
                      {vehicle.status}
                    </Tag>
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="font-montserrat" style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{vehicle.name}</h3>
                      <Text style={{ fontSize: '13px', color: '#ac8980', display: 'block', marginBottom: '16px' }}>{vehicle.brand} • {vehicle.year}</Text>
                    </div>
                    <div>
                      <div className="font-montserrat" style={{ fontSize: '20px', fontWeight: 800, color: '#ff562d', marginBottom: '16px' }}>
                        {formatRupiah(vehicle.price)}
                      </div>
                      <Space size={8}>
                        <Tag style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#ac8980', border: '1px solid rgba(172, 137, 128, 0.1)', borderRadius: '4px' }}>{vehicle.year}</Tag>
                        <Tag style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#ac8980', border: '1px solid rgba(172, 137, 128, 0.1)', borderRadius: '4px' }}>{vehicle.transmission}</Tag>
                      </Space>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              onClick={() => onNavigate('mobil')}
              className="secondary-btn-outline font-montserrat"
              style={{
                borderRadius: '30px',
                padding: '16px 36px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'transparent',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Lihat Semua Mobil Bekas ({(vehicles || DUMMY_VEHICLES).filter(v => v.type === 'Mobil' && v.status === 'Tersedia').length} Unit)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
