import rss, { type RSSFeedItem } from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import { kUrlBase, kSiteTitle, kSiteDescription } from "$consts";

type Kind = "blog" | "archive";
type Item = CollectionEntry<Kind>;
const fromCollection = async (c: Kind, sub: string, suf: string) =>
  (await getCollection(c)).map(
    (item: Item): RSSFeedItem => ({
      title: item.data.title,
      description: item.data.description,
      pubDate: item.data.date,
      categories: item.data.tags,
      link: `${kUrlBase}/${sub}/${item.id}${suf}`,
    })
  );

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("No site URL found");
  }

  const items = await Promise.all([
    fromCollection("blog", "article", "/"),
    fromCollection("archive", "archive", ".pdf"),
  ]);
  return rss({
    title: kSiteTitle,
    description: kSiteDescription,
    site: context.site,
    items: items.flat(),
  });
}
