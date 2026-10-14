import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ q?: string; categoria?: string }>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const categoria = (params.categoria ?? "").trim();
  const browsing = Boolean(q || categoria);

  const [categories, products, info] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    }),
    prisma.product.findMany({
      where: {
        active: true,
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(categoria ? { category: { slug: categoria } } : {}),
      },
      include: { category: true },
      orderBy: [{ stock: "desc" }, { name: "asc" }],
    }),
    prisma.businessInfo.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <>
      {/* Hero — full-bleed, brand first */}
      {!browsing ? (
        <section className="relative isolate min-h-[78vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1800&q=80"
            alt="Mostrador de papelería"
            className="absolute inset-0 size-full object-cover animate-fade"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f24]/92 via-[#0b1f24]/70 to-[#0b1f24]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f24]/50 via-transparent to-transparent" />

          <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end px-4 pb-14 pt-28 md:px-6 md:pb-20">
            <p className="animate-rise text-sm font-medium uppercase tracking-[0.18em] text-teal-200/90">
              Las Condes · Apoquindo
            </p>
            <h1 className="animate-rise stagger-1 mt-3 max-w-[12ch] font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-7xl">
              Bazar Los Estudiantes
            </h1>
            <p className="animate-rise stagger-2 mt-5 max-w-md text-lg text-white/80">
              Mira precios y disponibilidad antes de pasar a comprar al local.
            </p>
            <div className="animate-rise stagger-3 mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-6 text-[#0b1f24] hover:bg-teal-50"
              >
                <a href="#catalogo">Ver catálogo</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contacto">Cómo llegar</Link>
              </Button>
            </div>
            {info ? (
              <p className="mt-8 flex items-center gap-2 text-sm text-white/65">
                <MapPin className="size-4" />
                {info.address}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {!browsing ? <CategoryShowcase categories={categories} /> : null}

        <section id="catalogo" className={cn("pb-16", browsing ? "pt-10" : "pt-2")}>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="animate-rise">
              <h2 className="text-3xl font-semibold tracking-tight">
                {browsing ? "Resultados" : "Catálogo"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {products.length}{" "}
                {products.length === 1 ? "producto" : "productos"}
                {categoria
                  ? ` en ${categories.find((c) => c.slug === categoria)?.name ?? categoria}`
                  : ""}
              </p>
            </div>

            <form
              method="get"
              className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center"
            >
              {categoria ? (
                <input type="hidden" name="categoria" value={categoria} />
              ) : null}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar por nombre…"
                  className="h-11 rounded-full bg-card pl-9"
                />
              </div>
              <Button type="submit" className="h-11 rounded-full px-5">
                Buscar
              </Button>
            </form>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <Link href={q ? `/?q=${encodeURIComponent(q)}` : "/#catalogo"}>
              <Badge
                variant={!categoria ? "default" : "outline"}
                className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium"
              >
                Todas
              </Badge>
            </Link>
            {categories.map((cat) => {
              const href = q
                ? `/?categoria=${cat.slug}&q=${encodeURIComponent(q)}`
                : `/?categoria=${cat.slug}`;
              return (
                <Link key={cat.id} href={href}>
                  <Badge
                    variant={categoria === cat.slug ? "default" : "outline"}
                    className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium"
                  >
                    {cat.name}
                  </Badge>
                </Link>
              );
            })}
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <p className="text-lg font-medium">Sin resultados</p>
              <p className="mt-2 text-muted-foreground">
                Prueba otra búsqueda o categoría.
              </p>
              <Button asChild variant="outline" className="mt-6 rounded-full">
                <Link href="/">Ver todo el catálogo</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  stock={p.stock}
                  imageUrl={p.imageUrl}
                  categoryName={p.category.name}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
