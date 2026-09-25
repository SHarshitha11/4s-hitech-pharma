import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Breadcrumb } from "@/components/navigation/breadcrumb";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <Breadcrumb />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
