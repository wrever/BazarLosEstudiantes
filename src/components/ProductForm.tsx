import { saveProduct } from "@/app/admin/actions";
import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const isEdit = Boolean(product);

  return (
    <form action={saveProduct}>
      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)]">
            {isEdit ? "Datos del producto" : "Nuevo producto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {product ? <input type="hidden" name="id" value={product.id} /> : null}

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product?.name}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={product?.categoryId}
              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Selecciona…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio (CLP)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={product?.price ?? ""}
              className="h-11 rounded-xl"
            />
          </div>

          {!isEdit ? (
            <div className="space-y-2">
              <Label htmlFor="initialStock">Stock inicial</Label>
              <Input
                id="initialStock"
                name="initialStock"
                type="number"
                min={0}
                step={1}
                defaultValue={0}
                required
                className="h-11 rounded-xl"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="minStock">Stock mínimo (aviso)</Label>
            <Input
              id="minStock"
              name="minStock"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.minStock ?? 5}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imageUrl">URL de imagen</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://..."
              defaultValue={product?.imageUrl ?? ""}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description}
              className="min-h-28 rounded-xl"
            />
          </div>

          {isEdit ? (
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="active"
                name="active"
                type="checkbox"
                defaultChecked={product?.active}
                className="size-4 rounded border-input accent-primary"
              />
              <Label htmlFor="active" className="font-normal">
                Visible en el catálogo
              </Label>
            </div>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="rounded-full px-6">
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
