"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  Warehouse,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/inventario", label: "Inventario", icon: Warehouse },
  { href: "/admin/movimientos", label: "Movimientos", icon: ClipboardList },
  { href: "/admin/negocio", label: "Negocio", icon: Store },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col bg-sidebar text-sidebar-foreground md:min-h-screen md:w-64 md:shrink-0">
      <div className="border-b border-sidebar-border bg-white px-4 py-4">
        <Link href="/" className="block">
          <BrandLogo height={42} />
        </Link>
        <p className="mt-2 text-xs font-medium text-[#0b1f24]/55">
          Panel de administración
        </p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-3 md:flex-col">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
