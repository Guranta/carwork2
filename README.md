# 车险理赔系统 (CarWork)

> 毕业设计项目 · 全栈车险理赔 H5 应用

## 项目简介

车险理赔系统是一个全栈 Web 应用，包含 H5 车主端、PC 管理后台和后端 API。覆盖车险理赔完整闭环：**查看保单 → 出险报案 → 拍照/AI识损 → 选修理厂 → 理赔审核 → 支付 → 评价**。

## 技术栈

| 模块 | 技术 |
|------|------|
| H5 车主端 | React 18 + Vite + TypeScript + TailwindCSS + Zustand |
| PC 管理后台 | React 18 + Vite + TypeScript + Ant Design |
| 后端 API | NestJS 11 + Prisma 7 + SQLite |
| 部署 | Docker Compose + Nginx |

## 快速开始

### 开发模式

```bash
# 1. 启动后端
cd server
npm install --legacy-peer-deps
cp .env.example .env
npx prisma migrate dev
npx ts-node -r tsconfig-paths/register src/prisma/seed.ts
npm run start:dev

# 2. 启动 H5 前端
cd ../web-mobile
npm install
npm run dev

# 3. 启动管理后台
cd ../web-admin
npm install
npm run dev
```

- H5 前端: http://localhost:5173
- 管理后台: http://localhost:5174
- API 文档: http://localhost:3000/api/docs

### Docker 部署

```bash
docker compose up -d --build
```

- H5 前端: http://localhost
- 管理后台: http://localhost/admin/
- API: http://localhost/api/

## 演示账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 车主 | 13800000001 | 验证码 1234 |
| 理赔员 | adjuster | adjuster123 |
| 管理员 | admin | admin123 |

## 项目结构

```
carwork/
├── server/              # NestJS 后端
│   ├── prisma/          # 数据库 schema + migrations + seed
│   ├── src/
│   │   ├── modules/     # 业务模块
│   │   │   ├── auth/        # JWT 鉴权
│   │   │   ├── sms/         # 短信验证码 Mock
│   │   │   ├── users/       # 用户管理
│   │   │   ├── policies/    # 保单管理
│   │   │   ├── claims/      # 理赔报案
│   │   │   ├── upload/      # 文件上传
│   │   │   ├── damage-ai/   # AI 定损 Mock
│   │   │   ├── ocr/         # OCR 识别 Mock
│   │   │   ├── repair-shops/# 修理厂管理
│   │   │   ├── map/         # 地图距离计算
│   │   │   ├── notifications/# 站内通知
│   │   │   ├── payments/    # 支付 Mock
│   │   │   └── admin/       # 管理后台接口
│   │   ├── common/      # 公共模块（guards/filters/decorators）
│   │   └── prisma/      # Prisma 服务
│   └── Dockerfile
├── web-mobile/          # H5 车主端
│   ├── src/pages/       # 登录/保单/理赔/支付/评价/通知
│   └── Dockerfile
├── web-admin/           # PC 管理后台
│   ├── src/pages/       # Dashboard/理赔审核/用户/修理厂
│   └── Dockerfile
├── nginx/               # Nginx 反向代理配置
└── docker-compose.yml   # 一键部署
```

## 核心业务流程

```
车主登录 → 查看保单 → 出险报案(上传照片)
                          ↓
                    AI 自动定损(Mock)
                          ↓
              理赔员审核 → 定损金额 → 分配修理厂
                          ↓
                    维修完成 → 车主支付
                          ↓
                    站内通知 → 评价修理厂
```

## 理赔状态流转

```
DRAFT → SUBMITTED → UNDER_REVIEW → ASSESSED → REPAIRING → AWAITING_PAYMENT → CLOSED
                         ↓
                     REJECTED
```

## License

MIT
