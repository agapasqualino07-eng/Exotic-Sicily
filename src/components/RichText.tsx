import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { SanityImage } from "./SanityImage";

export function RichText({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value?.length) return null;
  return (
    <PortableText
      value={value}
      components={{
        types: {
          image: ({ value: v }) => <SanityImage image={v} alt={v.alt} sizes="(min-width: 800px) 720px, 100vw" widths={[480, 720, 1080]} className="rich-img" />,
        },
        marks: {
          link: ({ value: v, children }) => {
            const href: string = v?.href ?? "#";
            const external = /^https?:/.test(href);
            return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
          },
        },
      }}
    />
  );
}
