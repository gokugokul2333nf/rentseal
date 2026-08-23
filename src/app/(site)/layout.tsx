import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
