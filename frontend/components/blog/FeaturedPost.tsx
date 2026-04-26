import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function FeaturedPost({ post, isDark = false }: { post: Post; isDark?: boolean }) {
  return (
    <Card className="group relative overflow-hidden border-none bg-transparent shadow-none">
      <CardContent className="p-0 space-y-6">
        <div className={`relative aspect-video overflow-hidden rounded-2xl border ${isDark ? "border-white/10 bg-white/5" : "border-border bg-muted"}`}>
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className={`flex h-full items-center justify-center text-sm italic ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
              Clear, dense, structured intelligence.
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${isDark ? "bg-white/90 text-slate-950" : "bg-background/80 text-foreground"} backdrop-blur-sm border-none shadow-sm`}>
              Featured
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {post.category ? (
              <Link
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:opacity-80"
                href={`/category/${post.category.slug}`}
              >
                {post.category.name}
              </Link>
            ) : null}
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-white/20" : "text-muted-foreground/50"}`}>
              •
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
              {post.reading_time} min read
            </span>
          </div>

          <h2 className={`font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl ${isDark ? "text-white" : "text-foreground"}`}>
            <Link className="transition-colors duration-500 ease-in-out hover:text-primary" href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
          
          <p className={`text-base leading-8 line-clamp-3 ${isDark ? "text-slate-400" : "text-muted-foreground"}`}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-full flex items-center justify-center border overflow-hidden ${isDark ? "bg-white/10 border-white/10" : "bg-muted border-border"}`}>
                {post.author.avatar ? (
                  <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} />
                ) : (
                  <span className={`text-[10px] font-bold ${isDark ? "text-white" : "text-foreground"}`}>{post.author.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-bold leading-none ${isDark ? "text-white" : "text-foreground"}`}>{post.author.name}</span>
                <span className={`text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-muted-foreground"}`}>{formatDate(post.published_at)}</span>
              </div>
            </div>
            
            <Link
              href={`/blog/${post.slug}`}
              className={`flex size-10 items-center justify-center rounded-full border transition hover:border-primary hover:text-primary ${isDark ? "border-white/20 bg-white/5 text-white" : "border-border bg-background"}`}
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
