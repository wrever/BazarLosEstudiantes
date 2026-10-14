import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <Button asChild variant="ghost" className="-ml-2 mb-2">
          <Link href="/admin/productos">← Volver</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight">Nuevo producto</h1>
      </div>
      {categories.length === 0 ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Primero crea una categoría en la lista de productos.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
