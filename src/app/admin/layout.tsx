import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eef5f4] md:flex-row">
      <AdminNav />
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
