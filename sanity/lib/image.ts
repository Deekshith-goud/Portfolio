import imageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder({ projectId, dataset })

export const urlFor = (source: any) => {
  return builder.image(source)
}
