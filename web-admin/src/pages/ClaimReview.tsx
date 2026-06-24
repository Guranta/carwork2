import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Space, InputNumber, Modal, Image, message } from 'antd';
import { getAdminClaimDetail, updateClaimStatus } from '../api';

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

export default function ClaimReview() {
  const { id } = useParams();
  const [claim, setClaim] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getAdminClaimDetail(Number(id)).then((res: any) => setClaim(res));
  }, [id]);

  const handleAction = async (status: string) => {
    let values: any = { status };
    if (status === 'ASSESSED') {
      const amount = await new Promise<number>((resolve) => {
        let val = claim?.damageReport?.totalEstimate || 0;
        Modal.confirm({
          title: '定损金额',
          content: <InputNumber defaultValue={val} min={0} onChange={(v) => { val = v || 0; }} style={{ width: '100%', marginTop: 8 }} />,
          onOk: () => resolve(val),
        });
      });
      values.assessmentAmount = amount;
    }
    await updateClaimStatus(Number(id), values);
    message.success('操作成功');
    const res: any = await getAdminClaimDetail(Number(id));
    setClaim(res);
  };

  if (!claim) return <div>加载中...</div>;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title={`理赔审核 - ${claim.claimNo}`}>
        <Descriptions column={2}>
          <Descriptions.Item label="状态">
            <Tag color={STATUS_COLORS[claim.status]}>{STATUS_LABELS[claim.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="车牌">{claim.policy?.vehicle?.plateNo}</Descriptions.Item>
          <Descriptions.Item label="车主">{claim.policy?.owner?.name} {claim.policy?.owner?.phone}</Descriptions.Item>
          <Descriptions.Item label="保单号">{claim.policy?.policyNo}</Descriptions.Item>
          <Descriptions.Item label="事故描述" span={2}>{claim.description}</Descriptions.Item>
          {claim.damageReport && (
            <>
              <Descriptions.Item label="AI定损部位">{claim.damageReport.parts}</Descriptions.Item>
              <Descriptions.Item label="AI预估费用">¥{claim.damageReport.totalEstimate}</Descriptions.Item>
            </>
          )}
          {claim.assessmentAmount && <Descriptions.Item label="定损金额">¥{claim.assessmentAmount}</Descriptions.Item>}
          {claim.shop && <Descriptions.Item label="修理厂">{claim.shop.name}</Descriptions.Item>}
        </Descriptions>

        {claim.images?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>现场照片</h4>
            <Image.PreviewGroup>
              <Space>
                {claim.images.map((img: any) => (
                  <Image key={img.id} width={100} height={100} src={img.url} style={{ objectFit: 'cover' }} />
                ))}
              </Space>
            </Image.PreviewGroup>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Space>
            {claim.status === 'SUBMITTED' && (
              <Button type="primary" onClick={() => handleAction('UNDER_REVIEW')}>开始审核</Button>
            )}
            {claim.status === 'UNDER_REVIEW' && (
              <>
                <Button type="primary" onClick={() => handleAction('ASSESSED')}>定损通过</Button>
                <Button danger onClick={() => handleAction('REJECTED')}>拒绝</Button>
              </>
            )}
            {claim.status === 'ASSESSED' && (
              <Button type="primary" onClick={() => handleAction('REPAIRING')}>开始维修</Button>
            )}
            {claim.status === 'REPAIRING' && (
              <Button type="primary" onClick={() => handleAction('AWAITING_PAYMENT')}>维修完成</Button>
            )}
            {claim.status === 'AWAITING_PAYMENT' && (
              <Button type="primary" onClick={() => handleAction('CLOSED')}>确认付款完成</Button>
            )}
            <Button onClick={() => navigate('/claims')}>返回列表</Button>
          </Space>
        </div>
      </Card>
    </Space>
  );
}
