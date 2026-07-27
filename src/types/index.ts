import type { TableRow } from "@sanity/table";
import type { PortableTextBlock, Image } from "sanity";

type SanityImage = Image & {
  alt?: string;
  lqip?: string;
};

interface Table {
  rows?: TableRow[];
  title?: string;
}

export interface TableValueProps {
  table?: Table;
  caption?: string;
}

export interface QuizValueProps {
  _key: string;
  question: string;
  answer: string;
}

export type ProfileType = {
  _id: string;
  fullName: string;
  headline: string;
  profileImage: SanityImage;
  profileImageDark?: SanityImage;
  lqip?: string;
  shortBio: string;
  email: string;
  fullBio: PortableTextBlock[];
  location: string;
  resumeURL: string;
  og: string;
};

export type JobType = {
  _id: string;
  name: string;
  jobTitle: string;
  logo?: SanityImage;
  url?: string;
  description: string;
  startDate: string;
  endDate?: string;
};

export type ProjectType = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  projectUrl?: string;
  repository?: string;
  logo?: string;
  coverImage?: SanityImage;
  description: PortableTextBlock[];
};

export type PostType = {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  description: string;
  canonicalLink?: string;
  date?: string;
  coverImage: SanityImage;
  tags: string[];
  author: {
    name: string;
    photo?: SanityImage;
    twitterUrl?: string;
  };
  body: PortableTextBlock[];
  featured?: boolean;
  isPublished?: boolean;
};

export type HeroeType = {
  _id: string;
  _createdAt: string;
  name: string;
  url: string;
  met?: boolean;
};

export type PhotoType = {
  _id: string;
  image: SanityImage;
  lqip?: string;
  alt: string;
  caption?: string;
};

export type HobbyType = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  body: PortableTextBlock[];
  iconName: string;
  thumbnail?: SanityImage;
  lqip?: string;
};
