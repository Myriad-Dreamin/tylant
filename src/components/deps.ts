import {
  kEnableArchive,
  kEnableBackend,
  kEnableClick,
  kEnableComment,
  kEnableReaction,
  kEnableTheming,
} from "$consts";
import Stub from "./Stub.astro";

export const ThemeInit = kEnableTheming
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-theme-toggle")).ThemeInit
  : Stub;

export const ThemeToggle = kEnableTheming
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-theme-toggle")).ThemeToggle
  : Stub;

export const BackendClientScript = kEnableBackend
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-backend-client")).default
  : Stub;

export const PostClick = kEnableClick
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-click")).PostClick
  : Stub;

export const LikeReaction = kEnableReaction
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-like-reaction")).LikeReaction
  : Stub;

export const CommentList = kEnableComment
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-comment")).CommentList
  : Stub;

export const RecentComment = kEnableComment
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-comment")).RecentComment
  : Stub;

export const ArchiveButton = kEnableArchive
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-pdf-archive")).ArchiveButton
  : Stub;

export const ArchiveRef = kEnableArchive
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-pdf-archive")).ArchiveRef
  : Stub;

export const ArchiveList = kEnableArchive
  ? // @ts-ignore
    (await import("@myriaddreamin/tylant-pdf-archive")).ArchiveList
  : Stub;
