import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@clippulse.com' },
    update: {},
    create: {
      email: 'admin@clippulse.com',
      name: 'Admin User',
      role: 'ADMIN',
      plan: 'AGENCY',
      credits: 1000,
    },
  })

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@clippulse.com' },
    update: {},
    create: {
      email: 'test@clippulse.com',
      name: 'Test User',
      role: 'USER',
      plan: 'FREE',
      credits: 3,
    },
  })

  // Create sample videos
  await prisma.video.createMany({
    data: [
      {
        userId: testUser.id,
        title: 'Cyberpunk City Scene',
        prompt: 'A neon-lit cyberpunk city at night with flying cars',
        engine: 'stepfun',
        voice: 'alloy',
        status: 'COMPLETED',
        progress: 100,
        duration: 5,
        creditsUsed: 2,
        watermarked: true,
      },
      {
        userId: testUser.id,
        title: 'Ocean Waves',
        prompt: 'Peaceful ocean waves at sunset',
        engine: 'qwen',
        voice: 'nova',
        status: 'PROCESSING',
        progress: 65,
        duration: 3,
        creditsUsed: 0,
        watermarked: true,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })