import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Typography, Input, Select, Button, Modal, Tag, Table, Form, InputNumber, Space, message, theme } from 'antd';
import { PlusOutlined, SearchOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function AdminDashboard({ vehicles, loading, onAddVehicle, onToggleStatus, onDeleteVehicle, onLogout }) {
  const { token } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Get current date context
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonthNum = now.getMonth() + 1;
  const currentMonth = currentMonthNum.toString().padStart(2, '0');
  const currentYearMonth = `${currentYear}-${currentMonth}`; // e.g. "2026-06"

  // 1. ANALYTICS CALCULATIONS
  const stats = useMemo(() => {
    // Filter out sold vehicles
    const soldVehicles = vehicles.filter((v) => v.status === 'Laku' && v.soldDate);

    // This Month Sales
    const soldThisMonth = soldVehicles.filter((v) => v.soldDate.startsWith(currentYearMonth));
    const totalRevenueThisMonth = soldThisMonth.reduce((sum, v) => sum + v.price, 0);

    // This Year Sales
    const soldThisYear = soldVehicles.filter((v) => v.soldDate.startsWith(currentYear));
    const totalRevenueThisYear = soldThisYear.reduce((sum, v) => sum + v.price, 0);

    return {
      totalSoldUnits: soldVehicles.length,
      unitsSoldThisMonth: soldThisMonth.length,
      revenueThisMonth: totalRevenueThisMonth,
      unitsSoldThisYear: soldThisYear.length,
      revenueThisYear: totalRevenueThisYear,
    };
  }, [vehicles, currentYearMonth, currentYear]);

  // Monthly breakdown for SVG Chart (this year sales breakdown)
  const chartData = useMemo(() => {
    const months = [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 },
      { name: 'Mei', value: 0 },
      { name: 'Jun', value: 0 },
      { name: 'Jul', value: 0 },
      { name: 'Agu', value: 0 },
      { name: 'Sep', value: 0 },
      { name: 'Okt', value: 0 },
      { name: 'Nov', value: 0 },
      { name: 'Des', value: 0 }
    ];

    const soldThisYearVehicles = vehicles.filter(
      (v) => v.status === 'Laku' && v.soldDate && v.soldDate.startsWith(currentYear)
    );

    soldThisYearVehicles.forEach((v) => {
      const monthIndex = parseInt(v.soldDate.split('-')[1], 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        months[monthIndex].value += v.price;
      }
    });

    const maxValue = Math.max(...months.map((m) => m.value), 100000000); // minimum scale

    return months.map((m) => ({
      ...m,
      heightPercentage: (m.value / maxValue) * 100
    }));
  }, [vehicles, currentYear]);

  // 2. TOGGLE VEHICLE SOLD STATUS (ASYNC WITH SUPABASE)
  const handleToggleStatus = async (id) => {
    try {
      await onToggleStatus(id);
      message.success('Status unit kendaraan berhasil diperbarui!');
    } catch (err) {
      message.error('Gagal mengubah status unit di Supabase.');
    }
  };

  // 3. DELETE VEHICLE (ASYNC WITH SUPABASE)
  const handleDeleteVehicle = (id) => {
    Modal.confirm({
      title: 'Hapus Kendaraan',
      content: 'Apakah Anda yakin ingin menghapus unit kendaraan ini dari katalog?',
      okText: 'Hapus',
      okType: 'danger',
      cancelText: 'Batal',
      async onOk() {
        try {
          await onDeleteVehicle(id);
          message.success('Unit kendaraan berhasil dihapus.');
        } catch (err) {
          message.error('Gagal menghapus unit dari Supabase.');
        }
      }
    });
  };

  // 4. ADD NEW VEHICLE (ASYNC WITH SUPABASE)
  const handleAddVehicleSubmit = async (values) => {
    setSubmitting(true);
    const newVehicle = {
      name: values.name,
      brand: values.brand,
      type: 'Mobil',
      price: values.price,
      transmission: values.transmission,
      year: values.year,
      status: 'Tersedia',
      soldDate: null,
      images: [
        values.imageUrl || '/image/car_civic.png'
      ],
      specs: {
        engine: values.engine || 'N/A',
        power: values.power || 'N/A',
        transmission: values.transmission,
        fuel: values.fuel || 'Bensin',
        seats: values.seats || '5 Kursi'
      }
    };

    try {
      await onAddVehicle(newVehicle);
      setIsAddModalOpen(false);
      form.resetFields();
      message.success('Unit kendaraan baru berhasil ditambahkan ke katalog!');
    } catch (err) {
      message.error('Gagal menyimpan unit ke Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered list for the admin table
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch = 
        v.name.toLowerCase().includes(searchText.toLowerCase()) ||
        v.brand.toLowerCase().includes(searchText.toLowerCase());
      return matchSearch;
    });
  }, [vehicles, searchText]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: 'Unit Kendaraan',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={record.images && record.images[0] ? record.images[0] : '/image/car_civic.png'} alt={text} style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
          <div>
            <Text strong style={{ color: '#ffffff' }}>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.brand} • {record.year} • {record.type}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong style={{ color: '#ff562d' }}>{formatRupiah(price)}</Text>,
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={status === 'Tersedia' ? 'green' : 'volcano'} style={{ fontWeight: 'bold' }}>
            {status.toUpperCase()}
          </Tag>
          {status === 'Laku' && record.soldDate && (
            <Text style={{ fontSize: '11px', color: '#ac8980' }}>Laku: {record.soldDate}</Text>
          )}
        </Space>
      )
    },
    {
      title: 'Aksi Kontrol',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type={record.status === 'Tersedia' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleToggleStatus(record.id)}
            style={{ 
              background: record.status === 'Tersedia' ? 'linear-gradient(to right, #ff562d, #ff8a00)' : 'transparent',
              border: record.status === 'Tersedia' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '6px'
            }}
          >
            {record.status === 'Tersedia' ? 'Tandai Laku' : 'Tersedia Kembali'}
          </Button>
          <Button 
            type="text" 
            danger 
            size="small"
            onClick={() => handleDeleteVehicle(record.id)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
          </Button>
        </Space>
      )
    }
  ];

  // Return Loading Spinner if DB is loading
  if (loading && vehicles.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 72px)', background: '#131315', color: '#ffffff' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ff562d', animation: 'pulse-animation 2s infinite' }}>
          sync
        </span>
        <Text style={{ fontSize: '16px', color: '#ac8980' }} className="font-montserrat">Menghubungkan ke Database Supabase...</Text>
      </div>
    );
  }

  return (
    <div style={{ background: '#131315', minHeight: '100vh', color: '#e5e1e4', padding: '40px 0' }}>
      <div className="premium-container">
        
        {/* Header Dashboard */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff562d', marginBottom: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span className="font-montserrat" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                ADMIN CONTROL PANEL
              </span>
            </div>
            <Title level={2} className="font-montserrat" style={{ margin: 0, color: '#ffffff', fontWeight: 800 }}>
              Dashboard Penjualan Showroom
            </Title>
          </div>
          
          <Button 
            type="primary" 
            danger 
            icon={<PoweroffOutlined />} 
            onClick={onLogout}
            style={{ borderRadius: '8px', fontWeight: 'bold' }}
          >
            Keluar (Logout)
          </Button>
        </div>

        {/* 1. ANALYTICS STATS CARDS */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          {/* Month Stats */}
          <Col xs={24} md={8}>
            <div className="bento-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Text style={{ color: '#ac8980', fontSize: '14px', fontWeight: 600 }}>PENJUALAN BULAN INI</Text>
                <span className="material-symbols-outlined" style={{ color: '#ff562d', fontSize: '24px' }}>calendar_month</span>
              </div>
              <div className="font-montserrat" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                {formatRupiah(stats.revenueThisMonth)}
              </div>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Total terbayar untuk <strong style={{ color: '#ffb4a2' }}>{stats.unitsSoldThisMonth} Unit</strong> kendaraan laku.
              </Text>
            </div>
          </Col>

          {/* Year Stats */}
          <Col xs={24} md={8}>
            <div className="bento-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Text style={{ color: '#ac8980', fontSize: '14px', fontWeight: 600 }}>PENJUALAN TAHUN INI</Text>
                <span className="material-symbols-outlined" style={{ color: '#ff562d', fontSize: '24px' }}>trending_up</span>
              </div>
              <div className="font-montserrat" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                {formatRupiah(stats.revenueThisYear)}
              </div>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Akumulasi penjualan <strong style={{ color: '#ffb4a2' }}>{stats.unitsSoldThisYear} Unit</strong> laku di tahun {currentYear}.
              </Text>
            </div>
          </Col>

          {/* Total Sold Unit Stats */}
          <Col xs={24} md={8}>
            <div className="bento-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Text style={{ color: '#ac8980', fontSize: '14px', fontWeight: 600 }}>TOTAL KENDARAAN LAKU</Text>
                <span className="material-symbols-outlined" style={{ color: '#ff562d', fontSize: '24px' }}>sell</span>
              </div>
              <div className="font-montserrat" style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                {stats.totalSoldUnits} <span style={{ fontSize: '18px', fontWeight: 500, color: '#ac8980' }}>Unit</span>
              </div>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Jumlah total kendaraan dari seluruh database yang berstatus <strong style={{ color: '#ffb4a2' }}>Laku</strong>.
              </Text>
            </div>
          </Col>
        </Row>

        {/* 2. SALES CHART & INVENTORY QUICK SUMMARY */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          {/* Chart Card */}
          <Col xs={24} lg={16}>
            <div className="bento-card" style={{ padding: '32px', height: '100%' }}>
              <Title level={4} className="font-montserrat" style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>
                Grafik Omset Penjualan Bulanan ({currentYear})
              </Title>
              <Paragraph style={{ color: '#ac8980', fontSize: '13px', marginBottom: '32px' }}>
                Nilai transaksi penjualan unit kendaraan laku per bulan dalam rupiah.
              </Paragraph>

              {/* SVG Dynamic Bar Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '240px', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', height: '200px', width: '100%', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
                  {chartData.map((month, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div 
                        style={{ 
                          width: '100%', 
                          maxWidth: '28px',
                          height: `${month.heightPercentage || 2}px`, 
                          background: month.value > 0 ? 'linear-gradient(to top, #ff562d, #ff8a00)' : 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px 4px 0 0',
                          position: 'relative',
                          transition: 'height 0.8s ease'
                        }}
                        title={`${month.name}: ${formatRupiah(month.value)}`}
                      >
                        {month.value > 0 && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '-32px', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            background: '#1b1b1d', 
                            border: '1px solid #ff562d',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            whiteSpace: 'nowrap',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            zIndex: 10
                          }}>
                            {month.value >= 1000000000 ? `${(month.value / 1000000000).toFixed(1)}M` : `${(month.value / 1000000).toFixed(0)}Jt`}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: '#ac8980', marginTop: '8px', fontWeight: 600 }}>{month.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Col>

          {/* Quick Info card */}
          <Col xs={24} lg={8}>
            <div className="bento-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Title level={4} className="font-montserrat" style={{ color: '#ffffff', margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
                  Ringkasan Stok Aktif
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' }}>
                    <Text style={{ color: '#ac8980' }}>Total Unit di Database</Text>
                    <Text strong style={{ color: '#ffffff' }}>{vehicles.length} Unit</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' }}>
                    <Text style={{ color: '#ac8980' }}>Unit Mobil Tersedia</Text>
                    <Text strong style={{ color: '#ffffff' }}>{vehicles.filter(v => v.type === 'Mobil' && v.status === 'Tersedia').length} Unit</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                    <Text style={{ color: '#ac8980' }}>Total Unit Terjual (Laku)</Text>
                    <Text strong style={{ color: '#ffb4a2' }}>{vehicles.filter(v => v.status === 'Laku').length} Unit</Text>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 86, 45, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 86, 45, 0.1)' }}>
                <Text style={{ fontSize: '12px', color: '#ac8980', lineHeight: '1.5', display: 'block' }}>
                  📢 <strong>Informasi Admin:</strong> Data penjualan dan status mobil tersinkronisasi otomatis dengan katalog yang dilihat oleh pelanggan di database cloud Supabase.
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        {/* 3. VEHICLE INVENTORY CONTROL TABLE */}
        <Card 
          bordered={false} 
          className="bento-card"
          style={{ 
            background: 'rgba(27, 27, 29, 0.8)',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <Title level={4} className="font-montserrat" style={{ color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: 700 }}>
              Daftar Stok & Inventori
            </Title>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '500px', justifyContent: 'flex-end' }}>
              <Input
                placeholder="Cari unit atau merek..."
                prefix={<SearchOutlined style={{ color: '#ac8980' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(172, 137, 128, 0.2)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  width: '240px'
                }}
              />
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="primary-btn-gradient font-montserrat"
                style={{
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff'
                }}
              >
                <PlusOutlined /> Tambah Unit Baru
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <Table
              dataSource={filteredVehicles}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              style={{ background: 'transparent' }}
              className="premium-table"
            />
          </div>
        </Card>
      </div>

      {/* 4. ADD VEHICLE MODAL */}
      <Modal
        title={<span className="font-montserrat" style={{ color: '#ff562d', fontWeight: 'bold' }}>Tambah Unit Kendaraan Baru</span>}
        open={isAddModalOpen}
        onCancel={() => { setIsAddModalOpen(false); form.resetFields(); }}
        footer={null}
        width={650}
        style={{ top: 50 }}
        bodyStyle={{ background: '#1b1b1d', color: '#e5e1e4' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVehicleSubmit}
          initialValues={{
            transmission: 'Otomatis',
            year: 2024,
            fuel: 'Bensin',
            seats: '5 Kursi'
          }}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="transmission"
                label={<span style={{ color: '#e5e1e4' }}>Transmisi</span>}
                rules={[{ required: true }]}
              >
                <Select style={{ borderRadius: '8px' }}>
                  <Option value="Manual">Manual</Option>
                  <Option value="Otomatis">Otomatis</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="brand"
                label={<span style={{ color: '#e5e1e4' }}>Merek</span>}
                rules={[{ required: true, message: 'Merek wajib diisi!' }]}
              >
                <Input placeholder="Contoh: Toyota, Honda, Mitsubishi" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label={<span style={{ color: '#e5e1e4' }}>Nama Unit (Model)</span>}
                rules={[{ required: true, message: 'Nama unit wajib diisi!' }]}
              >
                <Input placeholder="Contoh: Avanza Veloz 1.5, Xpander Sport" style={{ borderRadius: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label={<span style={{ color: '#e5e1e4' }}>Harga (Rupiah)</span>}
                rules={[{ required: true, message: 'Harga wajib diisi!' }]}
              >
                <InputNumber
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(, *)/g, '')}
                  style={{ width: '100%', borderRadius: '8px' }}
                  placeholder="Contoh: 250000000"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="year"
                label={<span style={{ color: '#e5e1e4' }}>Tahun Kendaraan</span>}
                rules={[{ required: true, message: 'Tahun wajib diisi!' }]}
              >
                <InputNumber style={{ width: '100%', borderRadius: '8px' }} placeholder="Contoh: 2023" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="imageUrl"
            label={<span style={{ color: '#e5e1e4' }}>URL Gambar Unit (Opsional)</span>}
          >
            <Input placeholder="Masukkan URL gambar. Contoh: /image/car_civic.png" style={{ borderRadius: '8px' }} />
          </Form.Item>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px', marginBottom: '16px' }}>
            <Title level={5} style={{ color: '#ff562d', margin: '0 0 16px 0', fontSize: '14px' }}>Spesifikasi Teknis (Detail)</Title>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Form.Item name="engine" label={<span style={{ color: '#e5e1e4', fontSize: '12px' }}>Kapasitas Mesin</span>}>
                  <Input placeholder="Contoh: 1.5L, 2.0L" style={{ borderRadius: '6px' }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item name="power" label={<span style={{ color: '#e5e1e4', fontSize: '12px' }}>Tenaga (HP/RPM)</span>}>
                  <Input placeholder="Contoh: 106 HP" style={{ borderRadius: '6px' }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item name="fuel" label={<span style={{ color: '#e5e1e4', fontSize: '12px' }}>Bahan Bakar</span>}>
                  <Input placeholder="Bensin, Listrik" style={{ borderRadius: '6px' }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item name="seats" label={<span style={{ color: '#e5e1e4', fontSize: '12px' }}>Kapasitas Kursi</span>}>
                  <Input placeholder="7 Kursi, 5 Kursi" style={{ borderRadius: '6px' }} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Form.Item style={{ margin: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => { setIsAddModalOpen(false); form.resetFields(); }} style={{ borderRadius: '8px' }} disabled={submitting}>
                Batal
              </Button>
              <button 
                type="submit" 
                className="primary-btn-gradient font-montserrat"
                disabled={submitting}
                style={{
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '8px 24px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#ffffff',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Menyimpan...' : 'Simpan Unit'}
              </button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Styled css overrides for custom scroll and clean tables */}
      <style>{`
        .ant-table {
          background: transparent !important;
          color: #e5e1e4 !important;
        }
        .ant-table-thead > tr > th {
          background: rgba(255, 255, 255, 0.02) !important;
          color: #ac8980 !important;
          border-bottom: 1px solid rgba(172, 137, 128, 0.1) !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid rgba(172, 137, 128, 0.05) !important;
          color: #e5e1e4 !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: rgba(255, 86, 45, 0.04) !important;
        }
        .ant-pagination-item {
          background: transparent !important;
          border-color: rgba(172, 137, 128, 0.2) !important;
        }
        .ant-pagination-item-active {
          border-color: #ff562d !important;
        }
        .ant-pagination-item-active a {
          color: #ff562d !important;
        }
        .ant-pagination-item a {
          color: #ac8980 !important;
        }
        .ant-pagination-prev .ant-pagination-item-link,
        .ant-pagination-next .ant-pagination-item-link {
          background: transparent !important;
          color: #ac8980 !important;
          border-color: rgba(172, 137, 128, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
