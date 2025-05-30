import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { kEnablePrinting } from "$consts";
import { renderMonthlyPdf } from "@myriaddreamin/tylant";

export async function getStaticPaths() {
  if (!kEnablePrinting) {
    return [];
  }

  const archive = await getCollection("archive");
  return archive.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export async function GET({ params }: APIContext) {
  // props: Props
  return new Response(
    await renderMonthlyPdf(`content/archive/${params.slug}.typ`)
  );
}
