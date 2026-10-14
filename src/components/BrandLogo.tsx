import Image from "next/image";
import { cn } from "@/lib/utils";

/** Fuente: src/app/img/Logo Bazar Los Estudiantes.png (1024×433) */
const LOGO_ASPECT = 1024 / 433;

type BrandLogoProps = {
  className?: string;
  /** Altura visual del logo en px */
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  height = 40,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Image
      src="/img/logo-bazar-los-estudiantes.png"
      alt="Bazar Los Estudiantes"
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain object-left", className)}
      style={{ height, width: "auto" }}
    />
  );
}
