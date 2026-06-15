import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, theme } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function Login({ onNavigate, onLoginSuccess }) {
  const { token } = theme.useToken();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Harap masukkan username dan password.');
      return;
    }

    setLoading(true);
    
    // Simulating API request
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'admin') {
        onLoginSuccess(); // Trigger logged in state in App.jsx
        onNavigate('admin'); // Redirect to Admin Dashboard
      } else {
        setError('Username atau password salah. (Gunakan admin / admin)');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #131315 0%, #201f21 50%, #131315 100%)',
      minHeight: 'calc(100vh - 72px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', zIndex: 10 }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('beranda'); }}
            style={{ 
              color: '#ac8980', 
              fontSize: '14px', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ff562d'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ac8980'}
          >
            <ArrowLeftOutlined /> Kembali ke Beranda
          </a>
        </div>

        {/* Login Card */}
        <Card
          bordered={false}
          className="bento-card"
          style={{ 
            background: 'rgba(27, 27, 29, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(172, 137, 128, 0.15)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            padding: '16px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: 'rgba(255, 86, 45, 0.1)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ff562d', 
              marginBottom: '16px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                directions_car
              </span>
            </div>
            <Title level={3} className="font-montserrat" style={{ margin: 0, color: '#ffffff', fontWeight: 800 }}>
              Masuk Admin
            </Title>
            <Paragraph style={{ color: '#ac8980', fontSize: '13px', marginTop: '6px' }}>
              Kelola stok showroom dan pantau analitik penjualan.
            </Paragraph>
          </div>

          {error && (
            <Alert 
              message={error} 
              type="error" 
              showIcon 
              style={{ marginBottom: '20px', borderRadius: '8px' }} 
            />
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#e5e1e4', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Username
              </label>
              <Input 
                prefix={<UserOutlined style={{ color: '#ac8980' }} />} 
                placeholder="Masukkan username" 
                size="large"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(172, 137, 128, 0.2)',
                  color: '#ffffff',
                  borderRadius: '10px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#e5e1e4', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                Password
              </label>
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#ac8980' }} />} 
                placeholder="Masukkan password" 
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(172, 137, 128, 0.2)',
                  color: '#ffffff',
                  borderRadius: '10px'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="primary-btn-gradient font-montserrat"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: '10px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                border: 'none',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Menghubungkan...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', background: 'rgba(255, 86, 45, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255, 86, 45, 0.1)' }}>
            <Text style={{ fontSize: '12px', color: '#ac8980' }}>
              💡 Petunjuk Demo: Gunakan username <strong style={{ color: '#ffb4a2' }}>admin</strong> dan password <strong style={{ color: '#ffb4a2' }}>admin</strong>.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
