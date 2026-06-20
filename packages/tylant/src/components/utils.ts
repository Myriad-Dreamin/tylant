import type { PdfArchive } from "../..";

const unsafeCommentUserNamePattern = /[\p{C}<>\[\]]/u;

export const kAnonymousCommentUser = "Anonymous";

export const normalizeCommentUserName = (name: string | null | undefined) => {
  return (name || "").trim().replace(/[ \t]+/g, " ");
};

export const isSafeCommentUserName = (name: string) => {
  return name.length > 0 && !unsafeCommentUserNamePattern.test(name);
};

export const publicCommentUserName = (name: string | null | undefined) => {
  const normalized = normalizeCommentUserName(name);
  return isSafeCommentUserName(normalized)
    ? normalized
    : kAnonymousCommentUser;
};

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
