require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/db');

async function seedPengelola() {
  console.log('Seeding PENGELOLA users...');
  const knmps = await prisma.knmp.findMany();
  const hashedPassword = await bcrypt.hash('password123', 10);

  for (const knmp of knmps) {
    const baseName = knmp.name.replace('KNMP ', '').toLowerCase().replace(/\s+/g, '');
    const email = `pengelola.${baseName}@smarthub.go.id`;
    const name = `Pengelola - ${knmp.name.replace('KNMP ', '')}`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role: 'PENGELOLA',
        knmpId: knmp.id,
        password: hashedPassword,
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'PENGELOLA',
        knmpId: knmp.id,
      },
    });

    console.log(`✅ Upserted Pengelola: ${user.email} (${user.name})`);
  }

  console.log('Seeding PENGELOLA users completed!');
  process.exit(0);
}

seedPengelola().catch((err) => {
  console.error('Error seeding pengelola:', err);
  process.exit(1);
});
