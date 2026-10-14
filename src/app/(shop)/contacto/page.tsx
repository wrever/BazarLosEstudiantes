import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Contacto" };

export default async function ContactPage() {
  const info = await prisma.businessInfo.findUnique({ where: { id: 1 } });

  if (!info) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>
              Información del negocio aún no configurada.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const wa = `https://wa.me/${info.whatsapp}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <section className="mb-10 max-w-2xl animate-rise">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Contacto
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Pasa al local o escribe por el canal autorizado. No se reciben pagos
          por el sitio.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="animate-rise stagger-1 overflow-hidden rounded-3xl border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
              {info.name}
            </CardTitle>
            <CardDescription>{info.contactNote}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <strong className="block text-foreground">Dirección</strong>
                {info.address}
              </span>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <strong className="block text-foreground">Horarios</strong>
                {info.hours}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <span>
                <strong className="block text-foreground">Teléfono</strong>
                {info.phone}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild className="rounded-full">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Abrir WhatsApp
                </a>
              </Button>
              {info.mapUrl ? (
                <Button asChild variant="outline" className="rounded-full">
                  <a href={info.mapUrl} target="_blank" rel="noreferrer">
                    Ver mapa
                  </a>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="animate-rise stagger-2 relative min-h-[280px] overflow-hidden rounded-3xl bg-muted ring-1 ring-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1000&q=80"
            alt="Papelería del bazar"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f24]/70 to-transparent" />
          <p className="absolute bottom-5 left-5 right-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
            Te esperamos en el local
          </p>
        </div>
      </div>
    </div>
  );
}
