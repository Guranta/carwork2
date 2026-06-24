import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Select, Space, Button } from 'antd';
import { getAdminClaims } from '../api';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'default', SUBMITTED: 'processing', UNDER_REVIEW: 'processing',
  ASSESSED: 'warning', REPAIRING: 'blue', AWAITING_PAYMENT: 'gold',
  CLOSED: 'success', REJECTED: 'error',
};
const STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿', SUBMITTED: '已提交', UNDER_REVIEW: '审核中',
  ASSESSED: '已定损', REPAIRING: '维修中', AWAITING_PAYMENT: '待支付',
  CLOSED: '已完成', REJECTED: '已拒绝',
};

export default function Claims() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetch = () => {
    setLoading(true);
    getAdminClaims({ status, page, pageSize: 20 })
      .then((res: any) => { setData(res.items); setTotal(res.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [status, page]);

  const columns = [
    { title: '理赔号', dataIndex: 'claimNo', key: 'claimNo' },
    { title: '车牌', render: (_: any, r: any) => r.policy?.vehicle?.plateNo, key: 'plate' },
    { title: '车主', render: (_: any, r: any) => r.owner?.name, key: 'owner' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={STATUS_COLORS[s]}>{STATUS_LABELS[s]}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (t: string) => new Date(t).toLocaleString('zh-CN') },
    { title: '操作', key: 'action', render: (_: any, r: any) => <Button type="link" onClick={() => navigate(`/claims/${r.id}`)}>审核</Button> },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <span>状态筛选：</span>
        <Select
          allowClear
          placeholder="全部"
          style={{ width: 150 }}
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, total, pageSize: 20, onChange: setPage }}
      />
    </div>
  );
}
