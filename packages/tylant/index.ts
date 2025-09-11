// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import { renderComment, renderMonthlyPdf } from "./src/components/Typst";
import TagList from "./src/components/TagList.astro";
import PostClick from "./src/components/PostClick.astro";
import LikeReaction from "./src/components/LikeReaction.astro";
import Search from "./src/components/Search.astro";
import CommentList from "./src/components/CommentList.astro";
import RecentComment from "./src/components/RecentComment.astro";
import ThemeInit from "./src/components/ThemeInit.astro";
import ThemeToggle from "./src/components/ThemeToggle.astro";

import ArchiveList from "./src/components/ArchiveList.astro";
import ArchiveButton from "./src/components/ArchiveButton.astro";
import ArchiveRef from "./src/components/ArchiveRef.astro";

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

export interface PdfArchive {
    id: string;
    data: {
        title: string;
        date: Date;
        indices?: string[];
    };
}

export interface ArchiveProps {
    pdfArchives: PdfArchive[];
}


export {
    renderComment, renderMonthlyPdf, TagList, PostClick, LikeReaction, Search, RecentComment, CommentList,
    ThemeInit, ThemeToggle, ArchiveList, ArchiveButton, ArchiveRef
};
