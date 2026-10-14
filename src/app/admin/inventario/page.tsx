import { registerMovement } from "../actions";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
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

export const metadata = { title: "Inventario" };

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">
          Entradas, salidas o ajuste a una cantidad exacta. Sin stock negativo.
        </p>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)]">
            Registrar movimiento
          </CardTitle>
          <CardDescription>
            En ajuste, la cantidad es el stock objetivo final.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={registerMovement}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="productId">Producto</Label>
              <select
                id="productId"
                name="productId"
                required
                defaultValue=""
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (stock {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                name="type"
                required
                defaultValue="ENTRADA"
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SALIDA">Salida</option>
                <option value="AJUSTE">Ajuste (dejar en…)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={0}
                step={1}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Nota (opcional)</Label>
              <Input
                id="note"
                name="note"
                placeholder="Ej: compra a proveedor"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="rounded-full px-6">
                Registrar movimiento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)]">
            Resumen de existencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Mínimo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => {
                const low = p.stock > 0 && p.stock <= p.minStock;
                const out = p.stock <= 0;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category.name}</TableCell>
                    <TableCell>
                      <span className="mr-2">{p.stock}</span>
                      {out ? (
                        <Badge variant="destructive">Agotado</Badge>
                      ) : low ? (
                        <Badge variant="outline">Bajo</Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>{p.minStock}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
