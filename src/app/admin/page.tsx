import Link from "next/link";
import { AlertTriangle, PackagePlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const metadata = { title: "Admin" };

export default async function AdminDashboardPage() {
  const [productCount, activeCount, outOfStock, products, recentMoves] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: true, stock: 0 } }),
      prisma.product.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      }),
      prisma.inventoryMovement.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { product: true },
      }),
    ]);

  const low = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);

  const stats = [
    { label: "Productos", value: productCount },
    { label: "Activos", value: activeCount },
    { label: "Stock bajo", value: low.length },
    { label: "Agotados", value: outOfStock },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Resumen</h1>
          <p className="text-muted-foreground">
            Inventario y actividad reciente del bazar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="rounded-full">
            <Link href="/admin/productos/nuevo">
              <PackagePlus className="size-4" />
              Nuevo producto
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/inventario">Registrar movimiento</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="font-[family-name:var(--font-display)] text-3xl">
                {s.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {low.length > 0 ? (
        <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-amber-900">
              <AlertTriangle className="size-4" />
              Aviso de stock bajo
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {low.map((p) => (
              <Badge
                key={p.id}
                variant="outline"
                className="border-amber-300 bg-white text-amber-900"
              >
                {p.name} ({p.stock})
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)]">
            Últimos movimientos
          </CardTitle>
          <CardDescription>Entradas, salidas y ajustes recientes</CardDescription>
        </CardHeader>
        <CardContent>
          {recentMoves.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay movimientos.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMoves.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {m.createdAt.toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell className="font-medium">{m.product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{m.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
