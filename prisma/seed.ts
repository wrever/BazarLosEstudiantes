import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "sandra@bazar.local";
  const password = process.env.ADMIN_PASSWORD ?? "sandra123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Sandra Freire" },
    create: { email, name: "Sandra Freire", passwordHash },
  });

  await prisma.businessInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Bazar Los Estudiantes",
      address: "Av. Apoquindo 7490, Las Condes, Santiago",
      hours: "Lunes a viernes 9:00–19:00 · Sábado 10:00–14:00",
      phone: "+56 9 0000 0000",
      whatsapp: "56900000000",
      contactNote:
        "Consulta disponibilidad y retira en el local. No hay pago en línea.",
      mapUrl: "https://maps.google.com/?q=Avenida+Apoquindo+7490+Las+Condes",
    },
  });

  const categories = [
    "Papelería",
    "Escritura",
    "Cuadernos",
    "Artículos varios",
  ];

  const categoryRecords = [];
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
    categoryRecords.push(cat);
  }

  const [papeleria, escritura, cuadernos, varios] = categoryRecords;

  const products = [
    {
      name: "Resma carta 500 hojas",
      description: "Papel bond tamaño carta, ideal para impresiones y trabajos.",
      price: 4500,
      stock: 24,
      minStock: 5,
      categoryId: papeleria.id,
      imageUrl:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
    },
    {
      name: "Lápiz pasta azul BIC",
      description: "Bolígrafo de tinta azul, punta media.",
      price: 350,
      stock: 120,
      minStock: 20,
      categoryId: escritura.id,
      imageUrl:
        "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
    },
    {
      name: "Cuaderno universitario 100 hojas",
      description: "Cuaderno espiral, hoja rayada, tapa dura.",
      price: 2890,
      stock: 18,
      minStock: 6,
      categoryId: cuadernos.id,
      imageUrl:
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    },
    {
      name: "Set corrector líquido",
      description: "Corrector blanco de secado rápido.",
      price: 990,
      stock: 3,
      minStock: 5,
      categoryId: papeleria.id,
      imageUrl:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80",
    },
    {
      name: "Carpeta con elástico",
      description: "Carpeta plástica tamaño oficio con cierre elástico.",
      price: 1590,
      stock: 0,
      minStock: 4,
      categoryId: varios.id,
      imageUrl:
        "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80",
    },
    {
      name: "Marcadores fluorescentes x4",
      description: "Pack de 4 colores: amarillo, rosa, verde y naranja.",
      price: 2490,
      stock: 15,
      minStock: 4,
      categoryId: escritura.id,
      imageUrl:
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80",
    },
  ];

  for (const p of products) {
    const slug = slugify(p.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;

    const product = await prisma.product.create({
      data: { ...p, slug, active: true },
    });

    if (p.stock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: "ENTRADA",
          quantity: p.stock,
          note: "Stock inicial (seed)",
        },
      });
    }
  }

  console.log("Seed OK");
  console.log(`Admin: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
