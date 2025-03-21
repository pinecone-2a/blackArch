import { PrismaClient } from '@prisma/client';
import { saveRecordsToAlgolia } from '../lib/algolia.js';

const prisma = new PrismaClient();

const uploadData = async () => {
  const products = await prisma.product.findMany();
  await saveRecordsToAlgolia(products);
};

uploadData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
