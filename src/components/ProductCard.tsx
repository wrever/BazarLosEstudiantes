import Link from "next/link";
import { availabilityLabel, formatCLP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  ProductCard as UiProductCard,
  ProductCardContent,
  ProductCardHeader,
  ProductCardImage,
  ProductCardMetric,
  ProductCardSubtitle,
  ProductCardTitle,
} from "@/components/ui/product-card";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryName: string;
};

export function ProductCard({
  slug,
  name,
  price,
  stock,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  const available = stock > 0;

  return (
    <Link href={`/producto/${slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
      <UiProductCard className="max-w-none">
        <ProductCardImage
          src={
            imageUrl ||
            "https://placehold.co/600x450/e8f1f0/4d6569?text=Producto"
          }
          alt={name}
        >
          <Badge
            className="absolute left-3 top-3"
            variant={available ? "default" : "destructive"}
          >
            {availabilityLabel(stock)}
          </Badge>
        </ProductCardImage>
        <ProductCardContent>
          <div className="flex items-start justify-between gap-3">
            <ProductCardHeader>
              <ProductCardSubtitle>{categoryName}</ProductCardSubtitle>
              <ProductCardTitle>{name}</ProductCardTitle>
            </ProductCardHeader>
            <ProductCardMetric>{formatCLP(price)}</ProductCardMetric>
          </div>
        </ProductCardContent>
      </UiProductCard>
    </Link>
  );
}
