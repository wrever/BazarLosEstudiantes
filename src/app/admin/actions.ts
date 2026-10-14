"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MovementType } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { applyStockMovement, isPrismaUniqueError } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");
  return session;
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const price = Number(formData.get("price"));
  const minStock = Number(formData.get("minStock") ?? 5);
  const active = formData.get("active") === "on" || formData.get("active") === "true";
  const initialStock = Number(formData.get("initialStock") ?? 0);

  if (!name || !description || !categoryId) {
    throw new Error("Completa nombre, descripción y categoría.");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Precio inválido.");
  }
  if (!Number.isInteger(minStock) || minStock < 0) {
    throw new Error("Stock mínimo inválido.");
  }

  const slug = slugify(name);

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          categoryId,
          imageUrl,
          price,
          minStock,
          active,
        },
      });
    } else {
      if (!Number.isInteger(initialStock) || initialStock < 0) {
        throw new Error("Stock inicial inválido.");
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          description,
          categoryId,
          imageUrl,
          price,
          minStock,
          active: true,
          stock: 0,
        },
      });

      if (initialStock > 0) {
        await applyStockMovement({
          productId: product.id,
          type: "ENTRADA",
          quantity: initialStock,
          note: "Stock inicial",
        });
      }
    }
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      throw new Error("Ya existe un producto con un nombre muy similar.");
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/inventario");
  redirect("/admin/productos");
}

export async function toggleProductActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";

  await prisma.product.update({
    where: { id },
    data: { active: !active },
  });

  revalidatePath("/");
  revalidatePath("/admin/productos");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Nombre de categoría requerido.");

  try {
    await prisma.category.create({
      data: { name, slug: slugify(name) },
    });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      throw new Error("Esa categoría ya existe.");
    }
    throw error;
  }

  revalidatePath("/admin/productos");
  revalidatePath("/");
}

export async function registerMovement(formData: FormData) {
  await requireAdmin();

  const productId = String(formData.get("productId") ?? "");
  const type = String(formData.get("type") ?? "") as MovementType;
  const quantity = Number(formData.get("quantity"));
  const note = String(formData.get("note") ?? "").trim() || undefined;

  if (!["ENTRADA", "SALIDA", "AJUSTE"].includes(type)) {
    throw new Error("Tipo de movimiento inválido.");
  }

  await applyStockMovement({ productId, type, quantity, note });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/movimientos");
  revalidatePath("/admin/productos");
  redirect("/admin/inventario");
}

export async function saveBusinessInfo(formData: FormData) {
  await requireAdmin();

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    hours: String(formData.get("hours") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    contactNote: String(formData.get("contactNote") ?? "").trim(),
    mapUrl: String(formData.get("mapUrl") ?? "").trim() || null,
  };

  await prisma.businessInfo.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/");
  revalidatePath("/contacto");
  revalidatePath("/admin/negocio");
  redirect("/admin/negocio");
}
