import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";

type imageProp = {
  src: {};
  alt: string;
  className?: string;
};

export default function ImageComponent({ src, alt, className }: imageProp) {
  return (
    <Image
      className={className || "rounded-sm object-contain object-left-top aspect-auto duration-300"}
      src={urlFor(src).url()}
      alt={alt}
      loading="lazy"
      width={1920}
      height={1080}
      placeholder={(src as any)?.lqip ? "blur" : "empty"}
      quality={100}
      sizes="100vw"
      blurDataURL={(src as any)?.lqip || ""}
    />
  );
}
