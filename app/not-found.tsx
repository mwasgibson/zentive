import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSiteConfig } from "@/lib/cms";

export default async function NotFound() {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <SiteHeader productName={siteConfig.productName} />
      <main className="section flex min-h-[60vh] flex-col items-start justify-center py-20">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-ink">
          This page is not on the route.
        </h1>
        <p className="mt-4 max-w-md text-muted">
          The link may be broken, or the page was moved. Head back to the
          homepage and start from there.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to homepage
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
