// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import CommentList from "./src/CommentList.astro";
import RecentComment from "./src/RecentComment.astro";

export type BlogComment = {
  id: string;
  articleId: string;
  content: string;
  email: string;
  authorized?: boolean;
  createdAt: number;
};

export interface CommentHost {
  renderComment: (content: string) => Promise<string>;
}

export { RecentComment, CommentList };
