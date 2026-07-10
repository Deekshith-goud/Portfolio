import Link from "next/link";
import Image from "next/image";
import { postsQuery } from "@/lib/sanity.query";
import type { PostType } from "@/types";
import { sanityFetch } from "@/lib/sanity.client";
import { urlFor } from "@/lib/sanity.image";

export default async function FeaturedPosts({ params }: { params?: string }) {
  const featuredPosts: PostType[] = await sanityFetch({
    query: postsQuery,
    tags: ["Post"],
  });

  return (
    <>
      {featuredPosts.map((post) =>
        post.featured !== true || post.isPublished !== true ? null : (
          <article
            key={post._id}
            className={`mb-4 ${
              post.slug === params ? "hidden" : "flex lg:flex-row flex-col"
            }`}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="relative overflow-hidden group flex flex-col gap-4 dark:bg-primary-bg bg-secondary-bg p-5 rounded-lg border dark:border-zinc-800 border-zinc-200"
            >
              <Image
                src={urlFor(post.coverImage).width(400).height(230).url()}
                className="dark:bg-zinc-800 bg-zinc-100 rounded-md object-cover"
                alt={post.coverImage?.alt || post.title}
                width={400}
                height={230}
                placeholder={post.coverImage?.lqip ? "blur" : "empty"}
                blurDataURL={post.coverImage?.lqip || ""}
                quality={95}
                loading="lazy"
              />
              <div className="max-w-lg">
                <h2 className="max-w-sm text-lg tracking-tight mb-4">
                  {post.title}
                </h2>
                <p className="dark:text-zinc-400 text-zinc-600 text-sm">
                  {post.description.slice(0, 80).padEnd(83, "...")}
                </p>
              </div>
              {/* Rainbow hover underline */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </article>
        )
      )}
    </>
  );
}
