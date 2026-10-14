import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryItem = {
  name: string;
  slug: string;
  productCount: number;
  image: string;
};

const CATEGORY_IMAGES: Record<string, string> = {
  papeleria:
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
  escritura:
    "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&q=80",
  cuadernos:
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&q=80",
  "articulos-varios":
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
};

export function CategoryShowcase({
  categories,
  className,
}: {
  categories: { name: string; slug: string; _count?: { products: number } }[];
  className?: string;
}) {
  if (categories.length === 0) return null;

  const items: CategoryItem[] = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    productCount: c._count?.products ?? 0,
    image:
      CATEGORY_IMAGES[c.slug] ??
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
  }));

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="mb-8 max-w-2xl animate-rise">
        <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">
          Categorías
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Recorre el local por sección
        </h2>
        <p className="mt-3 text-muted-foreground text-lg">
          Papelería, escritura y más — igual que en Apoquindo, pero desde el
          celular.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((category, index) => (
          <Link
            key={category.slug}
            href={`/?categoria=${category.slug}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl ring-1 ring-border/60",
              "animate-rise",
              index === 0 && "stagger-1",
              index === 1 && "stagger-2",
              index >= 2 && "stagger-3",
            )}
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f24]/90 via-[#0b1f24]/35 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white">
                {category.name}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <span>
                  {category.productCount}{" "}
                  {category.productCount === 1 ? "producto" : "productos"}
                </span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
