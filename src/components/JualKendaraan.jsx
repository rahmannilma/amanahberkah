import React from 'react';
import { Card, Form, Input, Select, Button, Typography, Space, message, theme } from 'antd';
import { FileTextOutlined, PhoneOutlined, UserOutlined, DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function JualKendaraan() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFinish = (values) => {
    const { nama, wa, type, brand_model, year_km, lokasi, harga, kondisi } = values;

    // Formatting price to Rupiah text
    const priceText = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(harga);

    // Message template
    const textMessage = `Halo AMANAH BERKAH,

Saya ingin menjual kendaraan saya dengan rincian berikut:
- *Nama Pemilik*: ${nama}
- *No. WhatsApp*: ${wa}
- *Jenis Kendaraan*: ${type}
- *Merek & Tipe*: ${brand_model}
- *Tahun & Odometer*: ${year_km}
- *Lokasi*: ${lokasi}
- *Harga Harapan*: ${priceText}
- *Kondisi Kendaraan*: ${kondisi || '-'}

Mohon informasi estimasi harga dan kelayakan untuk unit saya. Terima kasih!`;

    // WhatsApp URL (using official K-Cunk Motor number or customizable)
    const adminNumber = '6282393700500';
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(textMessage)}`;
    
    window.open(waUrl, '_blank');
    message.success('Membuka WhatsApp untuk mengirim data kendaraan!');
  };

  return (
    <div style={{ padding: isMobile ? '24px 12px' : '40px 24px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 800, color: token.colorPrimary }}>
          Jual Kendaraan Anda
        </Title>
        <Paragraph style={{ color: token.colorTextSecondary, marginTop: '8px', fontSize: isMobile ? '13px' : '15px' }}>
          Isi detail kendaraan Anda di bawah ini. Tim AMANAH BERKAH akan meninjau dan menghubungi Anda kembali via WhatsApp.
        </Paragraph>
      </div>

      <Card
        bordered={false}
        styles={{ body: { padding: isMobile ? '16px' : '24px' } }}
        style={{
          background: token.colorBgContainer,
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ type: 'Mobil' }}
          size="large"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 24px' }}>
            <Form.Item
              name="nama"
              label="Nama Lengkap"
              rules={[{ required: true, message: 'Harap masukkan nama lengkap Anda!' }]}
            >
              <Input placeholder="Contoh: Suryono Hadi" prefix={<UserOutlined style={{ color: token.colorTextDescription }} />} />
            </Form.Item>

            <Form.Item
              name="wa"
              label="Nomor WhatsApp"
              rules={[
                { required: true, message: 'Harap masukkan nomor WhatsApp aktif!' },
                { pattern: /^[0-9]+$/, message: 'Hanya boleh diisi angka!' },
                { min: 10, message: 'Minimal 10 digit!' }
              ]}
            >
              <Input placeholder="Contoh: 6282393700500" prefix={<PhoneOutlined style={{ color: token.colorTextDescription }} />} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Jenis Kendaraan"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Mobil">Mobil</Option>
                <Option value="Motor">Motor</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="brand_model"
              label="Merek & Tipe Unit"
              rules={[{ required: true, message: 'Harap masukkan merek & tipe kendaraan!' }]}
            >
              <Input placeholder="Contoh: Toyota Yaris TRD / Honda Vario 150" prefix={<FileTextOutlined style={{ color: token.colorTextDescription }} />} />
            </Form.Item>

            <Form.Item
              name="year_km"
              label="Tahun & Odometer"
              rules={[{ required: true, message: 'Harap masukkan tahun & odometer!' }]}
            >
              <Input placeholder="Contoh: 2018 - 45.000 km" />
            </Form.Item>

            <Form.Item
              name="lokasi"
              label="Lokasi Unit"
              rules={[{ required: true, message: 'Harap masukkan lokasi unit saat ini!' }]}
            >
              <Input placeholder="Contoh: Mamuju / Majene" prefix={<EnvironmentOutlined style={{ color: token.colorTextDescription }} />} />
            </Form.Item>
          </div>

          <Form.Item
            name="harga"
            label="Harga Harapan (Rp)"
            rules={[
              { required: true, message: 'Harap masukkan harga harapan Anda!' },
              { type: 'number', transform: (value) => Number(value), message: 'Harap masukkan angka yang valid!' }
            ]}
          >
            <Input
              type="number"
              placeholder="Contoh: 180000000"
              prefix={<DollarOutlined style={{ color: token.colorTextDescription }} />}
              suffix="IDR"
            />
          </Form.Item>

          <Form.Item
            name="kondisi"
            label="Kondisi Kendaraan (Ceritakan Singkat)"
          >
            <TextArea
              rows={4}
              placeholder="Contoh: Tangan pertama dari baru, servis rutin berkala, cat 95% orisinil, pajak panjang s.d. Maret depan, surat lengkap dan siap jalan."
            />
          </Form.Item>

          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '24px' }}>
            * Catatan: Data yang Anda kirimkan akan disusun menjadi format WhatsApp otomatis. Anda dapat langsung mengirimkannya ke nomor sales marketing resmi kami.
          </Text>

          <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                padding: '0 40px',
                height: '48px',
                borderRadius: '24px',
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${token.colorPrimary}, #f97316)`,
                border: 'none',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Kirim ke WhatsApp Sales
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
