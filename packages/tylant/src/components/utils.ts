import type { PdfArchive } from "../..";

export const archiveUrl = (id: string, base: string) => {
  const baseUrl = base + (base.endsWith("/") ? "" : "/");
  return `${baseUrl}archive/${id}.pdf`;
};

const normArchive = ({ id }: { id: string }) => id.startsWith("blog-");
export const articleArchives = async (
  archives: PdfArchive[],
  articleId: string | undefined
) => {
  return archives
    .filter((m) => articleId && m.data.indices?.includes(articleId))
    .sort((a, b) => {
      if (normArchive(a) || normArchive(b)) {
        // Sort archives that are not blog archives to the end
        return normArchive(a) && normArchive(b)
          ? a.id.localeCompare(b.id)
          : normArchive(a)
            ? 1
            : -1;
      }

      return a.id.localeCompare(b.id);
    });
};
