import Link from "next/link";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import type { BusinessInfo } from "@prisma/client";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteFooter({ info }: { info: BusinessInfo | null }) {
  const wa = info?.whatsapp ? `https://wa.me/${info.whatsapp}` : "/contacto";

  return (
    <footer className="mt-8 border-t border-border/70 bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:px-6">
        <div className="animate-fade">
          <BrandLogo height={48} className="mb-4" />
          <h2 className="sr-only">
            {info?.name ?? "Bazar Los Estudiantes"}
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            {info?.contactNote ??
              "Consulta disponibilidad y retira en el local. No hay pago en línea."}
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              {info?.address ?? "Av. Apoquindo 7490, Las Condes"}
            </p>
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              {info?.hours ?? "Consulta horarios en el local"}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Cómo comprar
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Escríbenos o pásate al bazar. Sin carrito digital ni pagos
              electrónicos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full">
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/contacto">Ver contacto</Link>
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-6xl justify-between px-4 py-4 text-xs text-muted-foreground md:px-6">
        <span>Bazar Los Estudiantes</span>
        <span>Catálogo informativo</span>
      </div>
    </footer>
  );
}
