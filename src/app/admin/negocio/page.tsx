import { saveBusinessInfo } from "../actions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Negocio" };

export default async function BusinessPage() {
  const info = await prisma.businessInfo.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Información del negocio
        </h1>
        <p className="text-muted-foreground">
          Solo publica datos que Sandra autorice mostrar.
        </p>
      </div>

      <form action={saveBusinessInfo}>
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)]">
              Datos públicos
            </CardTitle>
            <CardDescription>
              Horarios, ubicación y contacto del catálogo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={info?.name ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                required
                defaultValue={info?.address ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hours">Horarios</Label>
              <Input
                id="hours"
                name="hours"
                required
                defaultValue={info?.hours ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                required
                defaultValue={info?.phone ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (solo números)</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                required
                defaultValue={info?.whatsapp ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contactNote">Nota / cómo comprar</Label>
              <Textarea
                id="contactNote"
                name="contactNote"
                required
                defaultValue={info?.contactNote ?? ""}
                className="min-h-24 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mapUrl">URL de mapa (opcional)</Label>
              <Input
                id="mapUrl"
                name="mapUrl"
                type="url"
                defaultValue={info?.mapUrl ?? ""}
                className="h-11 rounded-xl"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="rounded-full px-6">
              Guardar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
