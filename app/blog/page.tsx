import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getBlogPosts, getSiteConfig } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  return {
    title: "Blog",
    description: `Notes on bulk SMS infrastructure in Kenya, from the ${siteConfig.productName} team.`,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="section py-16">
          <p className="eyebrow">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            Notes on bulk SMS infrastructure in Kenya
          </h1>

          {posts.length === 0 ? (
            <p className="mt-10 text-muted">Nothing published yet — check back soon.</p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card block transition hover:border-ink/30"
                >
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
                    />
                  )}
                  <p className="font-mono text-xs text-muted">{formatDate(post.published_at)}</p>
                  <h2 className="mt-2 font-display text-lg font-semibold text-ink">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
