import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getAdminShops } from '../api';

export default function Shops() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAdminShops()
      .then((res: any) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '认证', dataIndex: 'certification', key: 'certification' },
    { title: '评分', dataIndex: 'rating', key: 'rating', sorter: (a: any, b: any) => b.rating - a.rating },
    { title: '评价数', dataIndex: 'reviewCount', key: 'reviewCount' },
    { title: '起步价', dataIndex: 'basePrice', key: 'basePrice', render: (v: number) => `¥${v}` },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />;
}
