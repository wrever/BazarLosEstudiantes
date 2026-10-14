import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
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

export const metadata = { title: "Movimientos" };

export default async function MovementsPage() {
  const movements = await prisma.inventoryMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { product: true },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Historial de movimientos
        </h1>
        <p className="text-muted-foreground">
          Últimos 100 registros de inventario.
        </p>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="font-[family-name:var(--font-display)]">
            Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Nota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {m.createdAt.toLocaleString("es-CL")}
                  </TableCell>
                  <TableCell className="font-medium">{m.product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{m.type}</Badge>
                  </TableCell>
                  <TableCell>{m.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {m.note ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {movements.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Sin movimientos registrados.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
