import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { PostCard } from "@/components/blog/PostCard";
import { SearchForm } from "@/components/layout/SearchForm";
import { Pagination } from "@/components/layout/Pagination";
import { api } from "@/lib/api";
import { editorialPillars } from "@/lib/site";

export const revalidate = 3600;

const PAGE_SIZE = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  const [posts, categories] = await Promise.all([
    api.posts
      .list(`page=${currentPage}&page_size=${PAGE_SIZE}`)
      .catch(
        () => ({ count: 0, next: null, previous: null, results: [] }) as Awaited<ReturnType<typeof api.posts.list>>,
      ),
    api.categories.list().catch(() => []),
  ]);

  const totalPages = Math.ceil(posts.count / PAGE_SIZE);

  const topicLinks = categories.length
    ? categories.slice(0, 5).map((category) => ({
        href: `/category/${category.slug}`,
        label: category.name,
      }))
    : editorialPillars.map((pillar) => ({ href: pillar.href, label: pillar.label }));

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:py-14">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Análises</BreadcrumbPage>
              </BreadcrumbItem>

            </BreadcrumbList>
          </Breadcrumb>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Análises

            </p>
            <h1 className="font-display text-5xl leading-[0.96] text-foreground sm:text-6xl">
              Estrutura editorial clara para quem constrói com IA.
            </h1>

            <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
              Cada artigo é desenhado para ser lido em cinco segundos, e profundo o suficiente para 
              prender leitores sérios até o fim.
            </p>

          </div>
          <SearchForm buttonLabel="Buscar" variant="page" />

          <div className="flex flex-wrap gap-3">
            {topicLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-background hover:text-foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        {posts.results.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/blog"
              className="mt-12"
            />
          </>
        ) : (
          <div className="rounded-lg border border-border bg-background p-6 text-sm leading-7 text-muted-foreground">
            Ainda não há artigos publicados. Assim que o conteúdo estiver no ar, esta página se tornará o arquivo editorial primário.
          </div>

        )}
      </section>
    </>
  );
}
