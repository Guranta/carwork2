import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getAdminUsers } from '../api';

export default function Users() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAdminUsers({ page, pageSize: 20 })
      .then((res: any) => { setData(res.items); setTotal(res.total); })
      .finally(() => setLoading(false));
  }, [page]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', render: (t: string) => new Date(t).toLocaleString('zh-CN') },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ current: page, total, pageSize: 20, onChange: setPage }}
    />
  );
}
