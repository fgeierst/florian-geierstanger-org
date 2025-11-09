import type { MarkdownLayoutProps } from "astro";

export interface BaseFrontmatter {
  title: string;
  lang?: "en" | "de";
  description?: string;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  category?: "post" | "link" | "quote" | "note";
  publishDate: string;
}

export interface BaseLayoutFrontmatter extends BaseFrontmatter {
  hasTitleElement?: boolean;
  date?: string;
}

export type BaseLayoutProps =
  | BaseLayoutFrontmatter
  | MarkdownLayoutProps<BaseLayoutFrontmatter>;

export type BlogLayoutProps = MarkdownLayoutProps<BlogFrontmatter>;
