"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProductCardVariant = "default" | "inner";
type ProductCardSize = "sm" | "default" | "lg";

interface ProductCardContextValue {
  variant: ProductCardVariant;
  size: ProductCardSize;
  animated: boolean;
}

const ProductCardContext = React.createContext<ProductCardContextValue | null>(
  null,
);

function useProductCardContext() {
  const context = React.useContext(ProductCardContext);
  if (!context) {
    throw new Error("ProductCard parts must be used within <ProductCard>");
  }
  return context;
}

const cardText: Record<ProductCardSize, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
};

interface ProductCardProps extends React.ComponentProps<"div"> {
  variant?: ProductCardVariant;
  size?: ProductCardSize;
  animated?: boolean;
}

function ProductCard({
  className,
  variant = "default",
  size = "default",
  animated = true,
  children,
  ...props
}: ProductCardProps) {
  return (
    <ProductCardContext.Provider value={{ variant, size, animated }}>
      <div
        data-slot="product-card"
        className={cn(
          "w-full overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm ring-1 ring-border/70 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-md",
          cardText[size],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ProductCardContext.Provider>
  );
}

interface ProductCardImageProps extends React.ComponentProps<"div"> {
  src: string;
  alt: string;
  imageClassName?: string;
}

function ProductCardImage({
  className,
  src,
  alt,
  imageClassName,
  children,
  ...props
}: ProductCardImageProps) {
  const { animated } = useProductCardContext();

  return (
    <div
      data-slot="product-card-image"
      className={cn(
        "group/card-image relative aspect-[4/3] w-full overflow-hidden bg-muted",
        className,
      )}
      {...props}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "https://placehold.co/600x450/e8f1f0/4d6569?text=Producto"}
        alt={alt}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          animated &&
            "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card-image:scale-105",
          imageClassName,
        )}
      />
      {children}
    </div>
  );
}

function ProductCardContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-content"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProductCardHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("min-w-0 flex-1 space-y-0.5", className)} {...props}>
      {children}
    </div>
  );
}

function ProductCardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "truncate font-[family-name:var(--font-display)] text-base font-semibold leading-snug",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

function ProductCardSubtitle({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

function ProductCardMetric({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("shrink-0 font-semibold text-primary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductCardHeader,
  ProductCardTitle,
  ProductCardSubtitle,
  ProductCardMetric,
};
