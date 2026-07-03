import { groq } from "next-sanity";

// Reusable post fields
const postField = groq`
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  description,
  coverImage,
  "lqip": coverImage.asset->metadata.lqip,
  featured,
  isPublished
`;

export const profileQuery = groq`*[_type == "profile"][0]{
  _id,
  fullName,
  headline,
  profileImage,
  profileImageDark,
  "lqip": profileImage.asset->metadata.lqip,
  shortBio,
  location,
  fullBio,
  email,
  "resumeURL": resumeURL.asset->url,
  socialLinks
}`;

export const jobQuery = groq`*[_type == "job"] | order(_createdAt desc){
  _id,
  name,
  jobTitle,
  logo,
  url,
  description,
  startDate,
  endDate,
}`;

export const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc){
  _id, 
  name,
  "slug": slug.current,
  tagline,
  logo,
}`;

export const singleProjectQuery = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  name,
  projectUrl,
  repository,
  coverImage,
  "lqip": coverImage.asset->metadata.lqip,
  tagline,
  description
}`;

export const postsQuery = groq`*[_type == "Post"] | order(_createdAt desc){
  ${postField},
  date,
  "author": author-> {
    name, 
    photo, 
    twitterUrl
  },
  body,
}`;

export const featuredPostsQuery = groq`*[_type == "Post" && featured == true] | order(_createdAt desc) {
  ${postField}
}`;

export const singlePostQuery = groq`*[_type == "Post" && slug.current == $slug][0]{
  ${postField},
  _updatedAt,
  canonicalLink,
  date,
  tags,
  "author": author-> {
    name, 
    photo {
      "image": asset->url,
      alt
    }, 
    twitterUrl
  },
  body,
}`;

export const heroesQuery = groq`*[_type == "heroe"] | order(_createdAt asc) { _id, _createdAt, name, url, met }`;

export const photosQuery = groq`*[_type == "photo"] | order(_createdAt desc){
  _id,
  image,
  "lqip": image.asset->metadata.lqip,
  caption,
}`;


export const hobbiesQuery = groq`*[_type == "hobby"] | order(_createdAt asc){
  _id,
  name,
  "slug": slug.current,
  description,
  thumbnail,
  "lqip": thumbnail.asset->metadata.lqip,
}`;

export const singleHobbyQuery = groq`*[_type == "hobby" && slug.current == $slug][0]{
  _id,
  name,
  description,
  body,
  thumbnail,
  "lqip": thumbnail.asset->metadata.lqip,
}`;


