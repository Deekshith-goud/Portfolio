import job from "./job";
import profile from "./profile";
import project from "./project";
import post from "./post";
import author from "./author";
import heroe from "./heroe";
import { youtube } from "./youtube";
import { table } from "./table";
import blockContent from "./blockContent";
import quiz from "./quiz";

import photo from "./photo";
import hobby from "./hobby";

export const schemaTypes = [
  profile,
  job,
  project,
  post,
  author,
  heroe,
  photo,
  hobby,

  // Reference types
  blockContent,
  youtube,
  table,
  quiz,
];


