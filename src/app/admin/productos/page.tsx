import Link from "next/link";
import { formatCLP } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { createCategory, toggleProductActive } from "../actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  disponibilidad?: string;
}>;

export const metadata = { title: "Productos" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const categoria = (params.categoria ?? "").trim();
  const disponibilidad = (params.disponibilidad ?? "").trim();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categoria ? { categoryId: categoria } : {}),
      ...(disponibilidad === "disponible"
        ? { stock: { gt: 0 } }
        : disponibilidad === "agotado"
          ? { stock: 0 }
          : {}),
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Alta, edición y visibilidad en el catálogo.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/admin/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="pt-6">
          <form
            method="get"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-2">
              <Label htmlFor="q">Buscar</Label>
              <Input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Nombre"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <select
                id="categoria"
                name="categoria"
                defaultValue={categoria}
                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="disponibilidad">Disponibilidad</Label>
              <select
                id="disponibilidad"
                name="disponibilidad"
                defaultValue={disponibilidad}
                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
              >
                <option value="">Todas</option>
                <option value="disponible">Disponible</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full rounded-full">
                Filtrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Nueva categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="flex flex-wrap gap-2">
            <Input
              name="name"
              placeholder="Nombre de categoría"
              required
              className="max-w-xs rounded-xl"
            />
            <Button type="submit" variant="outline" className="rounded-full">
              Agregar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.name}
                    {p.stock > 0 && p.stock <= p.minStock ? (
                      <Badge variant="outline" className="ml-2">
                        Bajo
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell>{p.category.name}</TableCell>
                  <TableCell>{formatCLP(p.price)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    <Badge variant={p.active ? "default" : "secondary"}>
                      {p.active ? "Activo" : "Oculto"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-full">
                        <Link href={`/admin/productos/${p.id}`}>Editar</Link>
                      </Button>
                      <form action={toggleProductActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={String(p.active)}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="rounded-full"
                        >
                          {p.active ? "Desactivar" : "Activar"}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay productos con esos filtros.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
