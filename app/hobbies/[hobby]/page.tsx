import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/lib/sanity.client";
import { singleHobbyQuery } from "@/lib/sanity.query";
import { HobbyType } from "@/types";
import { CustomPortableText } from "@/app/components/shared/CustomPortableText";
import { Slide } from "@/app/animation/Slide";
import PageHeading from "@/app/components/shared/PageHeading";
import NotFound from "@/app/components/shared/NotFound";
import * as BiIcons from "react-icons/bi";
import { urlFor } from "@/lib/sanity.image";


type Props = {
  params: {
    hobby: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hobby: HobbyType = await sanityFetch({
    query: singleHobbyQuery,
    qParams: { slug: params.hobby },
    tags: ["hobby"],
  });

  if (!hobby) {
    return {
      title: "Hobby Not Found",
    };
  }

  return {
    title: `${hobby.name} | Hobbies`,
    description: hobby.description,
    openGraph: {
      title: hobby.name,
      description: hobby.description,
      images: hobby.thumbnail ? urlFor(hobby.thumbnail).width(1200).height(630).url() : "",
    },
  };
}

export default async function HobbyPage({ params }: Props) {
  const hobby: HobbyType = await sanityFetch({
    query: singleHobbyQuery,
    qParams: { slug: params.hobby },
    tags: ["hobby"],
  });

  if (!hobby) {
    return <NotFound title="Hobby Not Found" description="The hobby you are looking for does not exist." />;
  }

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <Slide>
        <Link
          href="/hobbies"
          className="flex items-center gap-x-2 text-zinc-500 hover:text-primary-color mb-6 group"
        >
          <BiIcons.BiArrowBack className="group-hover:-translate-x-1 duration-300" />
          Back to Hobbies
        </Link>
        <PageHeading title={hobby.name} description={hobby.description} />


        {hobby.thumbnail && (
          <div className="relative w-full h-[400px] lg:h-[600px] overflow-hidden rounded-3xl my-12">
            <Image
              src={urlFor(hobby.thumbnail).url()}
              alt={hobby.name}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={hobby.lqip}
            />
          </div>
        )}


        <div className="max-w-3xl mx-auto dark:text-zinc-400 text-zinc-600 leading-relaxed text-lg">
          {hobby.body && (
            <PortableText value={hobby.body} components={CustomPortableText} />
          )}
        </div>
      </Slide>
    </main>
  );
}
