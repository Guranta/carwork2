import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany()
  await prisma.damageReport.deleteMany()
  await prisma.claimImage.deleteMany()
  await prisma.claim.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.user.deleteMany()

  const users = await Promise.all([
    prisma.user.create({
      data: { phone: '13800000001', name: '张三', avatar: null, role: 'OWNER' },
    }),
    prisma.user.create({
      data: { phone: '13800000002', name: '李四', avatar: null, role: 'OWNER' },
    }),
    prisma.user.create({
      data: { phone: '13800000003', name: '王五', avatar: null, role: 'OWNER' },
    }),
  ])

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: { ownerId: users[0].id, plateNo: '京A12345', brand: '丰田', model: '卡罗拉 2024款', vin: 'LSVNV2182E2100001' },
    }),
    prisma.vehicle.create({
      data: { ownerId: users[0].id, plateNo: '京B67890', brand: '本田', model: '思域 2023款', vin: 'LSVNV2182E2100002' },
    }),
    prisma.vehicle.create({
      data: { ownerId: users[1].id, plateNo: '京C11111', brand: '大众', model: '朗逸 2024款', vin: 'LSVNV2182E2100003' },
    }),
  ])

  const policies = await Promise.all([
    prisma.policy.create({
      data: { policyNo: 'POL20240001', ownerId: users[0].id, vehicleId: vehicles[0].id, type: '交强险+商业险', startDate: new Date('2024-01-01'), endDate: new Date('2025-01-01'), coverageAmount: 200000, deductible: 0, payoutRatio: 1.0, coverageTypes: '["交强险","车辆损失险","第三者责任险","不计免赔"]', status: 'ACTIVE' },
    }),
    prisma.policy.create({
      data: { policyNo: 'POL20240002', ownerId: users[0].id, vehicleId: vehicles[1].id, type: '商业险', startDate: new Date('2024-03-15'), endDate: new Date('2025-03-15'), coverageAmount: 150000, deductible: 500, payoutRatio: 0.85, coverageTypes: '["车辆损失险","不计免赔"]', status: 'ACTIVE' },
    }),
    prisma.policy.create({
      data: { policyNo: 'POL20240003', ownerId: users[1].id, vehicleId: vehicles[2].id, type: '交强险+商业险', startDate: new Date('2024-06-01'), endDate: new Date('2025-06-01'), coverageAmount: 180000, deductible: 0, payoutRatio: 0.9, coverageTypes: '["交强险","车辆损失险","不计免赔"]', status: 'ACTIVE' },
    }),
    prisma.policy.create({
      data: { policyNo: 'POL20230004', ownerId: users[1].id, vehicleId: vehicles[2].id, type: '交强险', startDate: new Date('2023-01-01'), endDate: new Date('2024-01-01'), coverageAmount: 122000, deductible: 0, payoutRatio: 1.0, coverageTypes: '["交强险"]', status: 'EXPIRED' },
    }),
    prisma.policy.create({
      data: { policyNo: 'POL20240005', ownerId: users[0].id, vehicleId: vehicles[0].id, type: '第三者责任险', startDate: new Date('2024-05-01'), endDate: new Date('2025-05-01'), coverageAmount: 500000, deductible: 0, payoutRatio: 1.0, coverageTypes: '["第三者责任险","不计免赔"]', status: 'ACTIVE' },
    }),
  ])

  const shops = await Promise.all([
    prisma.repairShop.create({ data: { name: '途虎养车（西三旗店）', lat: 39.9671, lng: 116.3527, certification: '认证维修', rating: 4.7, reviewCount: 328, basePrice: 800 } }),
    prisma.repairShop.create({ data: { name: '4S店（一汽丰田海淀店）', lat: 39.9556, lng: 116.3105, certification: '4S店', rating: 4.9, reviewCount: 512, basePrice: 1800 } }),
    prisma.repairShop.create({ data: { name: '快修达人（五道口店）', lat: 39.9929, lng: 116.3380, certification: '快修连锁', rating: 4.5, reviewCount: 186, basePrice: 600 } }),
    prisma.repairShop.create({ data: { name: '京车汇（中关村店）', lat: 39.9839, lng: 116.3165, certification: '认证维修', rating: 4.6, reviewCount: 245, basePrice: 900 } }),
    prisma.repairShop.create({ data: { name: '安达车服（上地店）', lat: 40.0350, lng: 116.3120, certification: '快修连锁', rating: 4.3, reviewCount: 132, basePrice: 550 } }),
    prisma.repairShop.create({ data: { name: '4S店（广汽本田海淀店）', lat: 39.9420, lng: 116.3580, certification: '4S店', rating: 4.8, reviewCount: 389, basePrice: 1600 } }),
    prisma.repairShop.create({ data: { name: '车享家（清河店）', lat: 40.0280, lng: 116.3420, certification: '认证维修', rating: 4.4, reviewCount: 198, basePrice: 750 } }),
    prisma.repairShop.create({ data: { name: '精典汽车（北太平庄店）', lat: 39.9710, lng: 116.3680, certification: '快修连锁', rating: 4.2, reviewCount: 95, basePrice: 500 } }),
    prisma.repairShop.create({ data: { name: '4S店（上汽大众海淀店）', lat: 39.9580, lng: 116.2980, certification: '4S店', rating: 4.7, reviewCount: 421, basePrice: 1700 } }),
    prisma.repairShop.create({ data: { name: '养车无忧（回龙观店）', lat: 40.0750, lng: 116.3420, certification: '认证维修', rating: 4.5, reviewCount: 156, basePrice: 700 } }),
  ])

  // 演示理赔单（给 13800000001，覆盖多种状态）
  const claims = await Promise.all([
    prisma.claim.create({
      data: {
        claimNo: 'CL20240620001',
        policyId: policies[0].id,
        ownerId: users[0].id,
        status: 'UNDER_REVIEW',
        incidentTime: new Date('2024-06-18'),
        incidentLat: 39.9847,
        incidentLng: 116.3186,
        description: '三车追尾，前保险杠 + 左前大灯受损',
      },
    }),
    prisma.claim.create({
      data: {
        claimNo: 'CL20240515002',
        policyId: policies[0].id,
        ownerId: users[0].id,
        shopId: shops[0].id,
        status: 'REPAIRING',
        incidentTime: new Date('2024-05-13'),
        description: '左前门凹陷，需钣金喷漆',
        assessmentAmount: 3500,
      },
    }),
    prisma.claim.create({
      data: {
        claimNo: 'CL20240401003',
        policyId: policies[1].id,
        ownerId: users[0].id,
        shopId: shops[1].id,
        status: 'CLOSED',
        incidentTime: new Date('2024-03-28'),
        description: '后保险杠刮蹭，喷漆处理',
        assessmentAmount: 4200,
        finalAmount: 4200,
      },
    }),
  ])

  // 演示通知（给 13800000001）
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'CLAIM_STATUS',
        title: '理赔进度更新',
        body: '您的理赔单 CL20240620001 已受理，正在定损审核中。',
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'SYSTEM',
        title: '欢迎使用车险理赔助手',
        body: '点击底部 Agent，可随时向我咨询理赔、保单、修理厂等问题。',
        isRead: false,
      },
    }),
  ])

  const admins = await Promise.all([
    prisma.admin.create({
      data: { username: 'adjuster', passwordHash: await bcrypt.hash('adjuster123', 10), name: '理赔员小刘', role: 'ADJUSTER' },
    }),
    prisma.admin.create({
      data: { username: 'admin', passwordHash: await bcrypt.hash('admin123', 10), name: '系统管理员', role: 'ADMIN' },
    }),
    prisma.admin.create({
      data: { username: 'adjuster2', passwordHash: await bcrypt.hash('adjuster123', 10), name: '理赔员小王', role: 'ADJUSTER' },
    }),
  ])

  console.log('Seed data created:')
  console.log(`  Users: ${users.length}`)
  console.log(`  Vehicles: ${vehicles.length}`)
  console.log(`  Policies: ${policies.length}`)
  console.log(`  RepairShops: ${shops.length}`)
  console.log(`  Claims: ${claims.length}`)
  console.log(`  Admins: ${admins.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
