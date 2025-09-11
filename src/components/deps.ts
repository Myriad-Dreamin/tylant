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
  (await import("@myriaddreamin/tylant")).ThemeInit
  : Stub;

export const ThemeToggle = kEnableTheming
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).ThemeToggle
  : Stub;

export const BackendClientScript = kEnableBackend
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant-backend-client")).default
  : Stub;

export const PostClick = kEnableClick
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).PostClick
  : Stub;

export const LikeReaction = kEnableReaction
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).LikeReaction
  : Stub;

export const CommentList = kEnableComment
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).CommentList
  : Stub;

export const RecentComment = kEnableComment
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).RecentComment
  : Stub;

export const ArchiveButton = kEnableArchive
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).ArchiveButton
  : Stub;

export const ArchiveRef = kEnableArchive
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).ArchiveRef
  : Stub;

export const ArchiveList = kEnableArchive
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant")).ArchiveList
  : Stub;
