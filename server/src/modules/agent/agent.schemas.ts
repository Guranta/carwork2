// Agent 工具的 OpenAI function-calling schema，喂给 DeepSeek 的 tools 参数。
// 移植自 carwork/backend/app/ai/agent/schemas.py

export interface ToolSchema {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export const AGENT_TOOLS: ToolSchema[] = [
  {
    type: 'function',
    function: {
      name: 'query_policy',
      description:
        '查询保单条款(险种/免赔额/赔付比例/保额/是否承保车辆损失)。' +
        '用于判断能否理赔本车损伤、计算报销价。至少提供 policy_no / plate_no 之一。',
      parameters: {
        type: 'object',
        properties: {
          policy_no: { type: 'string', description: '保单号' },
          plate_no: { type: 'string', description: '车牌号，如 京A12345' },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_claim_status',
      description: '按理赔编号查询理赔案件当前阶段与进度、估损/赔付金额。',
      parameters: {
        type: 'object',
        properties: {
          claim_no: { type: 'string', description: '理赔编号，如 CL2024...' },
        },
        required: ['claim_no'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_repair_shop',
      description:
        '按用户当前经纬度查找最近的合作修理厂(直线距离排序)，返回名称/资质/距离/基础价/评分。',
      parameters: {
        type: 'object',
        properties: {
          lat: { type: 'number', description: '用户纬度' },
          lng: { type: 'number', description: '用户经度' },
          top_n: { type: 'integer', description: '返回数量，默认 3', default: 3 },
        },
        required: ['lat', 'lng'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'estimate_cost',
      description:
        '按损伤清单估算【自费维修价】(工时费+配件费，不含保险理赔)。' +
        '通常先用 assess_damage 识别损伤，再把其 damages 传入本工具算价。',
      parameters: {
        type: 'object',
        properties: {
          damages: {
            type: 'array',
            description: '损伤清单',
            items: {
              type: 'object',
              properties: {
                part: { type: 'string', description: '部位，如 前保险杠' },
                repair: { type: 'string', description: '维修方式: 喷漆/钣金/更换' },
              },
            },
          },
        },
        required: ['damages'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'assess_damage',
      description:
        '识别用户刚上传的车辆损伤照片，输出损伤清单(部位/类型/程度/建议维修方式)与置信度。' +
        '无需传图片参数(系统自动使用用户最近上传的图片)。可在 focus 指定重点部位。',
      parameters: {
        type: 'object',
        properties: {
          focus: { type: 'string', description: '可选，重点关注部位，如 前保险杠' },
        },
        additionalProperties: false,
      },
    },
  },
];
