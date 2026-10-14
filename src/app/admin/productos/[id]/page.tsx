import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

type Params = Promise<{ id: string }>;

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <Button asChild variant="ghost" className="-ml-2 mb-2">
          <Link href="/admin/productos">← Volver</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight">
          Editar producto
        </h1>
        <p className="text-muted-foreground">
          Stock actual: <strong>{product.stock}</strong> — usa Inventario para
          movimientos.
        </p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
