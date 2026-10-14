import { MovementType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ApplyMovementInput = {
  productId: string;
  type: MovementType;
  quantity: number;
  note?: string;
};

export async function applyStockMovement(input: ApplyMovementInput) {
  const { productId, type, quantity, note } = input;

  if (!Number.isInteger(quantity)) {
    throw new Error("La cantidad debe ser un entero.");
  }
  if (type !== "AJUSTE" && quantity <= 0) {
    throw new Error("La cantidad debe ser un entero positivo.");
  }
  if (type === "AJUSTE" && quantity < 0) {
    throw new Error("El stock objetivo no puede ser negativo.");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Producto no encontrado.");

    let nextStock = product.stock;

    if (type === "ENTRADA") {
      nextStock = product.stock + quantity;
    } else if (type === "SALIDA") {
      nextStock = product.stock - quantity;
    } else if (type === "AJUSTE") {
      // quantity = stock objetivo
      nextStock = quantity;
    }

    if (nextStock < 0) {
      throw new Error("No se permiten existencias negativas.");
    }

    const movementQty =
      type === "AJUSTE" ? Math.abs(nextStock - product.stock) : quantity;

    await tx.inventoryMovement.create({
      data: {
        productId,
        type,
        quantity: movementQty,
        note:
          type === "AJUSTE"
            ? note
              ? `${note} (ajuste a ${nextStock})`
              : `Ajuste a ${nextStock}`
            : note,
      },
    });

    return tx.product.update({
      where: { id: productId },
      data: { stock: nextStock },
    });
  });
}

export function isPrismaUniqueError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}
