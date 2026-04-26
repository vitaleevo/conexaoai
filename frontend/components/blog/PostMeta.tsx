import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex h-5 items-center space-x-3 text-sm text-muted-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="font-semibold text-foreground">{post.author.name}</span>
        {post.author.credentials && (
          <span className="text-xs text-muted-foreground/60 hidden sm:inline">
            — {post.author.credentials}
          </span>
        )}
      </div>
      <Separator orientation="vertical" />
      <span>{formatDate(post.published_at)}</span>
      <Separator orientation="vertical" />
      <span>{post.reading_time} min read</span>
    </div>
  );
}
