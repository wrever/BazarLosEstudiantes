import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { availabilityLabel, formatCLP } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, active: true },
    include: { category: true },
  });

  if (!product) notFound();

  const info = await prisma.businessInfo.findUnique({ where: { id: 1 } });
  const available = product.stock > 0;
  const wa = info?.whatsapp
    ? `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(
        `Hola, consulto por: ${product.name}`,
      )}`
    : "/contacto";

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:gap-12 md:px-6 md:py-14">
      <div className="animate-rise overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            product.imageUrl ||
            "https://placehold.co/800x800/e8f1f0/4d6569?text=Producto"
          }
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="animate-rise stagger-1 flex flex-col justify-center">
        <Button asChild variant="ghost" className="mb-4 w-fit -ml-2 gap-2 px-2">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Volver al catálogo
          </Link>
        </Button>

        <p className="text-sm font-medium text-primary">{product.category.name}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
          {product.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-2xl font-bold text-primary">
            {formatCLP(product.price)}
          </span>
          <Badge variant={available ? "default" : "destructive"}>
            {availabilityLabel(product.stock)}
          </Badge>
        </div>

        <Separator className="my-6" />

        <p className="text-lg leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-6">
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              Consultar por WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/contacto">Ver ubicación</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Compra en el local. Este sitio no procesa pagos en línea.
        </p>
      </div>
    </div>
  );
}
