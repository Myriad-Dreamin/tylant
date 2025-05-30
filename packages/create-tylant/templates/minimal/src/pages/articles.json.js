import { getCollection } from "astro:content";

export async function GET() {
  const rawPosts = await getCollection("blog");

  // only export specified fields
  const posts = rawPosts.map((post) => ({
    id: post.id,
    collection: post.collection,
    data: {
      title: post.data.title,
    },
  }));

  return Response.json(posts);
}
