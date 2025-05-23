import React from 'react';
import { Row, Col, Progress, Tag, Card } from 'antd';
import { InfoCard } from '../../molecules';
import { FormattedCurrency, FormattedDate } from '../../atoms';

interface RoomInfoCardProps {
  room: any;
  residents?: any[];
}

const RoomInfoCard: React.FC<RoomInfoCardProps> = ({ room, residents = [] }) => {
  const occupancyRate = room.capacity ? (residents.length / room.capacity) * 100 : 0;

  // Safe amenities parsing
  const getAmenities = (amenities: any) => {
    if (!amenities) return [];
    
    // If it's already an array
    if (Array.isArray(amenities)) {
      return amenities;
    }
    
    // If it's a string, try to parse as JSON
    if (typeof amenities === 'string') {
      try {
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If parsing fails, treat as comma-separated string
        return amenities.split(',').map(item => item.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  const amenitiesList = getAmenities(room.amenities);

  const basicInfoItems = [
    { label: "Tòa nhà", value: room.buildingName },
    { label: "Số phòng", value: room.roomNumber },
    { label: "Tầng", value: room.floorNumber },
    { label: "Loại phòng", value: room.roomType === "male" ? "Nam" : "Nữ" },
    { label: "Sức chứa", value: `${room.capacity} người` },
    { label: "Hiện tại", value: `${residents.length} người` },
    { label: "Diện tích", value: room.roomArea ? `${room.roomArea} m²` : "N/A" },
    { label: "Giá phòng/tháng", value: <FormattedCurrency amount={room.pricePerMonth} /> },
  ];

  return (
    <div style={{ padding: '0' }}>
      <Row gutter={[16, 16]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={16}>
          <InfoCard 
            title="Thông tin cơ bản" 
            items={basicInfoItems}
            column={{ xs: 1, sm: 2, md: 2 }}
            bordered={false}
          />
        </Col>

        {/* Tình trạng phòng */}
        <Col xs={24} lg={8}>
          <Card title="Tình trạng" bordered={false}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666' }}>
                  Tỷ lệ lấp đầy
                </div>
                <Progress 
                  percent={Math.round(occupancyRate)} 
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  {residents.length}/{room.capacity} người
                </div>
              </div>

              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Ngày tạo</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      <FormattedDate date={room.createdAt} format="DD/MM/YYYY" />
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Cập nhật cuối</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      <FormattedDate date={room.updatedAt} format="DD/MM/YYYY" />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        {/* Tiện nghi & Mô tả */}
        <Col span={24}>
          <Card title="Tiện nghi & Mô tả" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '8px', color: '#333' }}>
                    Tiện nghi:
                  </div>
                  <div>
                    {amenitiesList.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {amenitiesList.map((amenity: string, idx: number) => (
                          <Tag key={idx} color="blue">
                            {amenity}
                          </Tag>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Không có</span>
                    )}
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '8px', color: '#333' }}>
                    Mô tả:
                  </div>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    {room.description || "Không có mô tả"}
                  </div>
                </div>
              </Col>

              {room.notes && (
                <Col span={24}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '8px', color: '#333' }}>
                      Ghi chú:
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {room.notes}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RoomInfoCard; 