import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { UserOutlined, FileTextOutlined, ShopOutlined, AlertOutlined } from '@ant-design/icons';
import { getDashboard } from '../api';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'default',
  SUBMITTED: 'processing',
  UNDER_REVIEW: 'processing',
  ASSESSED: 'warning',
  REPAIRING: 'blue',
  AWAITING_PAYMENT: 'gold',
  CLOSED: 'success',
  REJECTED: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  UNDER_REVIEW: '审核中',
  ASSESSED: '已定损',
  REPAIRING: '维修中',
  AWAITING_PAYMENT: '待支付',
  CLOSED: '已完成',
  REJECTED: '已拒绝',
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getDashboard().then((res: any) => setData(res));
  }, []);

  if (!data) return <div>加载中...</div>;

  const statusColumns = [
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={STATUS_COLORS[s]}>{STATUS_LABELS[s]}</Tag> },
    { title: '数量', dataIndex: 'count' },
  ];

  const statusData = Object.entries(data.statusBreakdown).map(([status, count]: any) => ({ key: status, status, count }));

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="总用户数" value={data.totalUsers} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="总保单数" value={data.totalPolicies} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="理赔总数" value={data.totalClaims} prefix={<FileTextOutlined />} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="修理厂数" value={data.totalShops} prefix={<ShopOutlined />} /></Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Card><Statistic title="待审核理赔" value={data.pendingReview} prefix={<AlertOutlined />} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="处理中理赔" value={data.activeClaims} valueStyle={{ color: '#1677ff' }} /></Card>
        </Col>
        <Col span={12}>
          <Card title="理赔状态分布">
            <Table columns={statusColumns} dataSource={statusData} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
