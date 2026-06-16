import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, ConfigProvider, theme, Drawer } from 'antd';
import { CarOutlined, FormOutlined, InfoCircleOutlined, HomeOutlined, MenuOutlined } from '@ant-design/icons';
import KatalogKendaraan from './components/KatalogKendaraan';
import JualKendaraan from './components/JualKendaraan';
import TentangKontak from './components/TentangKontak';
import Beranda from './components/Beranda';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { INITIAL_VEHICLES } from './components/mockData';
import { supabase } from './supabaseClient';

const { Header, Content, Footer } = Layout;

export default function App() {
  const [currentKey, setCurrentKey] = useState(() => {
    return localStorage.getItem('currentKey') || 'beranda';
  });

  useEffect(() => {
    localStorage.setItem('currentKey', currentKey);
  }, [currentKey]);

  // Screen width monitoring
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Admin Login State (synchronized with localStorage)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });


  // Dynamic Vehicles State (synchronized with Supabase)
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync admin login status to localStorage
  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Fetch Vehicles from Supabase
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching vehicles:', error);
      } else if (data && data.length > 0) {
        setVehicles(data);
      } else {
        // If database is empty, seed it with initial vehicles
        console.log('Database empty, seeding initial vehicles...');
        await seedDatabase();
      }
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Seed Database with Initial Mock Data
  const seedDatabase = async () => {
    try {
      const formattedVehicles = INITIAL_VEHICLES.map((v) => {
        const copy = { ...v };
        if (copy.hasOwnProperty('soldDate')) {
          copy.solddate = copy.soldDate;
          delete copy.soldDate;
        }
        return copy;
      });

      const { data, error } = await supabase
        .from('vehicles')
        .insert(formattedVehicles)
        .select();

      if (error) {
        console.error('Error seeding database:', error);
      } else if (data) {
        setVehicles(data);
        console.log('Seeded database successfully with', data.length, 'vehicles.');
      }
    } catch (err) {
      console.error('Seeding error:', err);
    }
  };

  // Fetch data on load
  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentKey('beranda');
  };

  // Async DB Callbacks passed to Admin Dashboard
  const handleAddVehicle = async (newVehicle) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([newVehicle])
      .select();

    if (error) {
      console.error('Error inserting vehicle:', error);
      throw error;
    } else if (data) {
      setVehicles((prev) => [data[0], ...prev]);
    }
  };

  const handleToggleStatus = async (id) => {
    const target = vehicles.find((v) => v.id === id);
    if (!target) return;

    const nextStatus = target.status === 'Tersedia' ? 'Laku' : 'Tersedia';
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const nextSoldDate = nextStatus === 'Laku' ? formattedDate : null;

    const { error } = await supabase
      .from('vehicles')
      .update({ status: nextStatus, solddate: nextSoldDate })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      throw error;
    } else {
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: nextStatus, solddate: nextSoldDate } : v))
      );
    }
  };

  const handleDeleteVehicle = async (id) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    } else {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const items = [
    {
      key: 'beranda',
      icon: <HomeOutlined />,
      label: 'Beranda',
    },
    {
      key: 'mobil',
      icon: <CarOutlined />,
      label: 'Katalog Mobil',
    },
    {
      key: 'jual',
      icon: <FormOutlined />,
      label: 'Jual Kendaraan',
    },
    {
      key: 'tentang',
      icon: <InfoCircleOutlined />,
      label: 'Tentang & Kontak',
    },
  ];

  // Dynamic menu items to include Admin Panel link if logged in
  const menuItems = useMemo(() => {
    const defaultItems = [...items];
    if (isAdminLoggedIn) {
      defaultItems.push({
        key: 'admin',
        icon: <span className="material-symbols-outlined" style={{ fontSize: '16px', marginRight: '4px', verticalAlign: 'middle', color: '#ff562d' }}>dashboard</span>,
        label: 'Admin Panel',
      });
    }
    return defaultItems;
  }, [isAdminLoggedIn]);

  const renderContent = () => {
    switch (currentKey) {
      case 'beranda':
        return <Beranda onNavigate={setCurrentKey} vehicles={vehicles} />;
      case 'mobil':
        return <KatalogKendaraan type="Mobil" vehicles={vehicles} />;
      case 'jual':
        return <JualKendaraan />;
      case 'tentang':
        return <TentangKontak />;
      case 'login':
        return <Login onNavigate={setCurrentKey} onLoginSuccess={() => setIsAdminLoggedIn(true)} />;
      case 'admin':
        return isAdminLoggedIn ? (
          <AdminDashboard 
            vehicles={vehicles} 
            loading={loading}
            onAddVehicle={handleAddVehicle} 
            onToggleStatus={handleToggleStatus}
            onDeleteVehicle={handleDeleteVehicle}
            onLogout={handleLogout} 
          />
        ) : (
          <Login onNavigate={setCurrentKey} onLoginSuccess={() => setIsAdminLoggedIn(true)} />
        );
      default:
        return <Beranda onNavigate={setCurrentKey} vehicles={vehicles} />;
    }
  };

  return (
    // Menggunakan ConfigProvider untuk tema premium dengan warna K-Cunk Red (#ff562d) dan Dark Mode
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff562d',
          colorBgBase: '#131315',
          colorBgContainer: '#1b1b1d',
          borderRadius: 16,
          fontFamily: 'Inter, Montserrat, system-ui, Avenir, Helvetica, Arial, sans-serif',
        },
        components: {
          Menu: {
            horizontalItemSelectedColor: '#ff562d',
            itemHoverColor: '#ffb4a2',
          }
        }
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#131315' }}>
        <Header 
          className={isMobile ? "mobile-top-header" : "glass-nav"} 
          style={isMobile ? { lineHeight: '60px' } : { 
            position: 'fixed',
            top: 0,
            zIndex: 1000,
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '72px',
            padding: '0 48px',
            lineHeight: '72px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '26px' : '32px', color: '#ff562d', marginRight: isMobile ? '6px' : '8px', fontVariationSettings: "'FILL' 1" }}>
              directions_car
            </span>
            <span className="font-montserrat" style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 800, color: '#e5e1e4', letterSpacing: '-1px' }}>
              AMANAH BERKAH
            </span>
          </div>

          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[currentKey]}
              onClick={(e) => setCurrentKey(e.key)}
              items={menuItems}
              style={{ 
                flex: 1, 
                borderBottom: 'none', 
                background: 'transparent',
                justifyContent: 'center',
                lineHeight: '72px',
                fontSize: '15px'
              }}
            />
          )}

          {!isMobile && (
            isAdminLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="secondary-btn-outline font-montserrat"
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  fontFamily: 'Inter', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: '1px solid #ff562d',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Keluar
              </button>
            ) : (
              <button 
                onClick={() => setCurrentKey('login')}
                className="primary-btn-gradient font-montserrat"
                style={{ 
                  padding: '10px 24px', 
                  borderRadius: '8px', 
                  fontFamily: 'Inter', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: 'none',
                  lineHeight: '1.2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Masuk
              </button>
            )
          )}

          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                className="mobile-header-icon-btn" 
                onClick={() => setCurrentKey('mobil')}
                title="Cari Mobil"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
              
              <a 
                className="mobile-header-icon-btn" 
                href="https://wa.me/6282393700500" 
                target="_blank" 
                rel="noreferrer"
                title="Chat WhatsApp"
              >
                <span className="material-symbols-outlined wa-green">chat</span>
              </a>

              <button
                className="mobile-header-icon-btn"
                onClick={() => setDrawerVisible(true)}
                title="Opsi Lainnya"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          )}
        </Header>

        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#ff562d', marginRight: '8px', fontVariationSettings: "'FILL' 1" }}>
                directions_car
              </span>
              <span className="font-montserrat" style={{ fontSize: '18px', fontWeight: 800, color: '#e5e1e4', letterSpacing: '-1px' }}>
                AMANAH BERKAH
              </span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{
            body: {
              background: '#131315',
              padding: '24px 16px',
            },
            header: {
              background: '#1b1b1d',
              borderBottom: '1px solid rgba(172, 137, 128, 0.1)',
            }
          }}
          width={280}
        >
          <Menu
            mode="vertical"
            selectedKeys={[currentKey]}
            onClick={(e) => {
              setCurrentKey(e.key);
              setDrawerVisible(false);
            }}
            items={menuItems}
            style={{
              borderRight: 'none',
              background: 'transparent',
              fontSize: '16px',
              marginBottom: '32px'
            }}
          />
          <div style={{ padding: '0 16px' }}>
            {isAdminLoggedIn ? (
              <button 
                onClick={() => {
                  handleLogout();
                  setDrawerVisible(false);
                }}
                className="secondary-btn-outline font-montserrat"
                style={{ 
                  width: '100%',
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  fontFamily: 'Inter', 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: '1px solid #ff562d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Keluar
              </button>
            ) : (
              <button 
                onClick={() => {
                  setCurrentKey('login');
                  setDrawerVisible(false);
                }}
                className="primary-btn-gradient font-montserrat"
                style={{ 
                  width: '100%',
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  fontFamily: 'Inter', 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Masuk
              </button>
            )}
          </div>
        </Drawer>
        
        {/* Margin top to prevent content being covered by the fixed header & padding bottom for mobile nav */}
        <Content style={{ 
          background: '#131315', 
          marginTop: isMobile ? '60px' : '72px',
          paddingBottom: isMobile ? '80px' : '0' 
        }}>
          {renderContent()}
        </Content>

        <Footer style={{ 
          background: '#0e0e10', 
          color: '#e5e1e4', 
          borderTop: '1px solid rgba(172, 137, 128, 0.1)',
          padding: isMobile ? '40px 16px' : '60px 48px 40px 48px'
        }}>
          <div className="premium-container" style={{ padding: 0 }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div style={{ maxWidth: '320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#ff562d', marginRight: '8px' }}>
                    directions_car
                  </span>
                  <span className="font-montserrat" style={{ fontSize: '18px', fontWeight: 'bold', color: '#e5e1e4' }}>
                    AMANAH BERKAH
                  </span>
                </div>
                <p style={{ color: '#ac8980', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                  Pasar mobil premium terbaik di Mamuju. Kualitas terjamin, proses terpercaya.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>Navigasi</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentKey('beranda'); }} style={{ color: '#ac8980', transition: 'color 0.2s' }}>Beranda</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentKey('mobil'); }} style={{ color: '#ac8980', transition: 'color 0.2s' }}>Katalog Mobil</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '14px', marginBottom: '4px' }}>Bantuan</span>
                  <a href="#" style={{ color: '#ac8980', transition: 'color 0.2s' }}>Kebijakan Privasi</a>
                  <a href="#" style={{ color: '#ac8980', transition: 'color 0.2s' }}>Syarat & Ketentuan</a>
                  <a href="#" style={{ color: '#ac8980', transition: 'color 0.2s' }}>Bantuan</a>
                </div>
              </div>

              <div style={{ textAlign: 'left', minWidth: '200px' }}>
                <p style={{ color: '#ac8980', fontSize: '14px', margin: '0 0 16px 0' }}>
                  © 2024 Amanah Berkah. <br /> Premium Automotive Marketplace.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="#" className="bento-card" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ff562d' }}>face</span>
                  </a>
                  <a href="#" className="bento-card" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ff562d' }}>share</span>
                  </a>
                  <a href="#" className="bento-card" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#ff562d' }}>alternate_email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Footer>

        {isMobile && (
          <div className="mobile-bottom-nav">
            <button 
              className={`mobile-nav-item ${currentKey === 'beranda' ? 'active' : ''}`}
              onClick={() => setCurrentKey('beranda')}
            >
              <div className="mobile-nav-icon-container">
                <span className="material-symbols-outlined">home</span>
              </div>
              <span className="mobile-nav-label">Beranda</span>
            </button>

            <button 
              className={`mobile-nav-item ${currentKey === 'jual' ? 'active' : ''}`}
              onClick={() => setCurrentKey('jual')}
            >
              <div className="mobile-nav-icon-container">
                <span className="material-symbols-outlined">sell</span>
              </div>
              <span className="mobile-nav-label">Jual</span>
            </button>

            <button 
              className={`mobile-nav-fab ${currentKey === 'mobil' ? 'active' : ''}`}
              onClick={() => setCurrentKey('mobil')}
            >
              <div className="mobile-nav-fab-circle">
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <span className="mobile-nav-fab-label">Katalog</span>
            </button>

            <button 
              className={`mobile-nav-item ${currentKey === 'tentang' ? 'active' : ''}`}
              onClick={() => setCurrentKey('tentang')}
            >
              <div className="mobile-nav-icon-container">
                <span className="material-symbols-outlined">info</span>
              </div>
              <span className="mobile-nav-label">Tentang</span>
            </button>

            {isAdminLoggedIn ? (
              <button 
                className={`mobile-nav-item ${currentKey === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentKey('admin')}
              >
                <div className="mobile-nav-icon-container">
                  <span className="material-symbols-outlined" style={{ color: '#ff562d' }}>dashboard</span>
                  <span className="admin-badge-dot"></span>
                </div>
                <span className="mobile-nav-label" style={{ color: '#ffb4a2' }}>Admin</span>
              </button>
            ) : (
              <button 
                className={`mobile-nav-item ${currentKey === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentKey('login')}
              >
                <div className="mobile-nav-icon-container">
                  <span className="material-symbols-outlined">login</span>
                </div>
                <span className="mobile-nav-label">Masuk</span>
              </button>
            )}
          </div>
        )}
      </Layout>
    </ConfigProvider>
  );
}
