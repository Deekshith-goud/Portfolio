import Image from "next/legacy/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PostType } from "@/types";
import { singlePostQuery } from "@/sanity/lib/sanity.query";
import { PortableText, toPlainText } from "@portabletext/react";
import { CustomPortableText } from "@/components/shared/CustomPortableText";
import { BiChevronRight, BiSolidTime, BiTime } from "react-icons/bi";
import { formatDate } from "@/utils/date";
import SharePost from "@/components/shared/SharePost";
import FeaturedPosts from "@/components/pages/FeaturedPosts";
import { Slide } from "@/animation/Slide";
import { urlFor } from "@/sanity/lib/sanity.image";
import Buymeacoffee from "@/components/shared/Buymeacoffee";
import Comments from "@/components/shared/Comments";
import { HiCalendar, HiChat } from "react-icons/hi";
import { sanityFetch } from "@/sanity/lib/sanity.client";
import { readTime } from "@/utils/readTime";
import PageHeading from "@/components/shared/PageHeading";

type Props = {
  params: Promise<{
    post: string;
  }>;
};

const fallbackImage: string =
  "/images/placeholder-blog.png";

function extractTwitterHandle(url: string | undefined): string {
  if (!url) return "";
  const match = url.match(/(?:twitter\.com\/|x\.com\/)([^/?]+)/);
  if (match) return match[1];
  if (url.startsWith("@")) return url.substring(1);
  return url;
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.post;
  const post: PostType = await sanityFetch({
    query: singlePostQuery,
    tags: ["Post"],
    qParams: { slug },
  });

  if (!post) {
    notFound();
  }

  return {
    title: `${post.title} | Blog | Deekshith Goud`,
    metadataBase: new URL(`https://deekshith-goud.vercel.app/blog/${post.slug}`),
    description: post.description,
    publisher: post?.author?.name || "Unknown Author",
    keywords: post.tags,
    alternates: {
      canonical:
        post.canonicalLink || `https://deekshith-goud.vercel.app/blog/${post.slug}`,
    },
    openGraph: {
      images:
        (post.coverImage && urlFor(post.coverImage).width(1200).height(630).url()) ||
        fallbackImage,
      url: `https://deekshith-goud.vercel.app/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      type: "article",
      siteName: "deekshith-goud.vercel.app",
      authors: post?.author?.name || "Unknown Author",
      tags: post.tags,
      publishedTime: post._createdAt,
      modifiedTime: post._updatedAt || "",
    },
    twitter: {
      title: post.title,
      description: post.description,
      images:
        (post.coverImage && urlFor(post.coverImage).width(680).height(340).url()) ||
        fallbackImage,
      creator: post?.author?.twitterUrl ? `@${extractTwitterHandle(post.author.twitterUrl)}` : "",
      site: post?.author?.twitterUrl ? `@${extractTwitterHandle(post.author.twitterUrl)}` : "",
      card: "summary_large_image",
    },
  };
}

export default async function Post({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.post;
  const post: PostType = await sanityFetch({
    query: singlePostQuery,
    tags: ["Post"],
    qParams: { slug },
  });

  if (!post) {
    notFound();
  }

  const words = toPlainText(post.body || []);

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <header>
        <Slide className="relative flex items-center gap-x-2 border-b dark:border-zinc-800 border-zinc-200 pb-8">
          <Link
            href="/blog"
            className="whitespace-nowrap dark:text-zinc-400 text-zinc-400 hover:dark:text-white hover:text-zinc-700 text-sm border-b dark:border-zinc-700 border-zinc-200"
          >
            cd ..
          </Link>
          <BiChevronRight />
          <p className="text-zinc-400 text-sm truncate">{post.title}</p>
        </Slide>
      </header>

      <article>
        <Slide
          className="grid lg:grid-cols-[75%,25%] grid-cols-1 relative"
          delay={0.1}
        >
          <div className="min-h-full lg:border-r border-r-0 dark:border-zinc-800 border-zinc-200 pt-10 pb-4 lg:pr-6 px-0">
            <div className="flex items-center flex-wrap gap-4 text-md mb-8 dark:text-zinc-400 text-zinc-600">
              <div className="flex items-center gap-x-2">
                <HiCalendar />
                <time dateTime={post.date ? post.date : post._createdAt}>
                  {post.date
                    ? formatDate(post.date)
                    : formatDate(post._createdAt)}
                </time>
              </div>
              <Link
                href="#comments"
                className="flex items-center gap-x-2 dark:text-primary-color text-tertiary-color"
              >
                <HiChat />
                <div className="#comments">Comments</div>
              </Link>
              <div className="flex items-center gap-x-2">
                <BiSolidTime />
                <div className="">{readTime(words)}</div>
              </div>
            </div>

            <PageHeading title={post.title} description={post.description} />

            <div className="relative w-full h-40 pt-[52.5%]">
              <Image
                className="rounded-xl border dark:border-zinc-800 border-zinc-100 object-cover"
                layout="fill"
                src={post.coverImage ? urlFor(post.coverImage).width(1200).url() : fallbackImage}
                quality={95}
                alt={post.coverImage?.alt || post.title}
                placeholder={post.coverImage?.lqip ? `blur` : "empty"}
                blurDataURL={post.coverImage?.lqip || ""}
              />
            </div>

            <div className="mt-8 dark:text-zinc-400 text-zinc-600 leading-relaxed tracking-tight text-lg">
              <PortableText value={post.body} components={CustomPortableText} />
            </div>
          </div>

          <aside className="flex flex-col lg:max-h-full h-max gap-y-8 lg:sticky static top-2 bottom-auto right-0 py-10 lg:px-6 px-0">
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <p className="dark:text-zinc-400 text-zinc-500 text-sm">
                Written By
              </p>
              <address className="flex items-center gap-x-3 mt-4 not-italic">
                <div className="relative w-12 h-12">
                  <Image
                    src={post.author?.photo?.image ? urlFor(post.author.photo.image)
                      .width(80)
                      .height(80)
                      .url() : fallbackImage}
                    alt={post.author?.photo?.alt || post.author?.name || "Author"}
                    layout="fill"
                    className="dark:bg-zinc-800 bg-zinc-300 rounded-full object-cover"
                  />
                </div>
                <div rel="author">
                  <h3 className="font-semibold text-lg tracking-tight">
                    {post?.author?.name || "Unknown Author"}
                  </h3>
                  {post?.author?.twitterUrl && (
                    <a
                      href={post.author.twitterUrl}
                      className="text-blue-500 text-sm"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {`@${extractTwitterHandle(post.author.twitterUrl)}`}
                    </a>
                  )}
                </div>
              </address>
            </section>

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">
                Tags
              </h3>
              <ul className="flex flex-wrap items-center gap-2 tracking-tight">
                {post?.tags?.map((tag, id) => (
                  <li
                    key={id}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            <SharePost
              title={post.title}
              slug={post.slug}
              description={post.description}
            />

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">
                Featured
              </h3>
              <FeaturedPosts params={slug} />
            </section>
          </aside>
        </Slide>
      </article>

      <section
        id="comments"
        className="max-w-3xl mt-10 lg:border-t dark:border-zinc-800 border-zinc-200 lg:py-10 pt-0"
      >
        <h3 className="lg:text-4xl text-3xl font-semibold tracking-tight mb-8">
          Comments
        </h3>
        <Comments />
      </section>

      <section className="max-w-3xl lg:py-10 pt-0">
        <h3 className="lg:text-4xl text-3xl font-semibold tracking-tight mb-8">
          Support
        </h3>
        <Buymeacoffee />
      </section>
    </main>
  );
}
