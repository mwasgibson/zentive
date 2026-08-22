import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getBlogPost, getSiteConfig } from "@/lib/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: post.cover_image_url
      ? { images: [post.cover_image_url] }
      : undefined,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, siteConfig] = await Promise.all([
    getBlogPost(slug),
    getSiteConfig(),
  ]);

  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: siteConfig.companyName },
    publisher: { "@type": "Organization", name: siteConfig.companyName },
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <SiteHeader />
      <main>
        <article className="section max-w-2xl py-16">
          <p className="font-mono text-xs text-muted">
            {formatDate(post.published_at)}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            {post.title}
          </h1>

          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-8 aspect-video w-full rounded-lg object-cover"
            />
          )}

          {/*
            post.body is sanitized server-side by the CMS (HtmlSanitizer, an
            allowlist of tags/attributes) before it's ever stored — this
            render trusts that sanitization rather than re-sanitizing on the
            client. If the CMS's sanitizer is ever weakened, this becomes a
            live XSS surface, so treat that file as security-critical.
          */}
          <div
            className="prose prose-sm sm:prose-base mt-8 max-w-none prose-headings:font-display prose-a:text-signal-dark prose-blockquote:border-wire"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
