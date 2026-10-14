import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const info = await prisma.businessInfo.findUnique({ where: { id: 1 } });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter info={info} />
    </div>
  );
}
