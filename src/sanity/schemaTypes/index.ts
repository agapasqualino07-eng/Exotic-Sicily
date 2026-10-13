import type { SchemaTypeDefinition } from "sanity";
import { article } from "./article";
import { category } from "./category";
import { faqItem } from "./faqItem";
import { homePage, storePage } from "./homePage";
import { order } from "./order";
import { page } from "./page";
import { product } from "./product";
import { sectionTypes } from "./sections";
import { siteSettings } from "./siteSettings";
import { subscriber } from "./subscriber";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  storePage,
  product,
  category,
  page,
  article,
  faqItem,
  testimonial,
  order,
  subscriber,
  ...sectionTypes,
];
