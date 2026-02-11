require('dotenv').config();
const { prisma } = require('./lib/db');

async function test() {
  try {
    const userCount = await prisma.user.count();
    console.log('Successfully connected! User count:', userCount);
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

test();
