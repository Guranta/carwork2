# CarWork - 车险理赔 H5

车险理赔全流程 H5 应用，支持车主报案、AI 识损、修理厂选择、理赔审核、Mock 支付。

## 技术栈

| 层 | 选型 |
|---|---|
| 用户端 H5 | React 18 + Vite + TypeScript + TailwindCSS + Vant + Zustand |
| 管理后台 | React 18 + Vite + TypeScript + TailwindCSS + Ant Design |
| 后端 | NestJS 10 + Prisma + SQLite |
| 部署 | Docker Compose + Nginx |

## 快速启动

```bash
# 后端
cd server && npm install && npm run start:dev

# 用户端 H5
cd web-mobile && npm install && npm run dev

# 管理后台
cd web-admin && npm install && npm run dev
```

## 演示账号

| 角色 | 账号 | 凭证 |
|---|---|---|
| 车主 | 13800000001 | 验证码 1234 |
| 理赔员 | adjuster | adjuster123 |
| 管理员 | admin | admin123 |

## License

MIT
