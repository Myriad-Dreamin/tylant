import {
  kEnableArchive,
  kEnableBackend,
  kEnableClick,
  kEnableComment,
  kEnableReaction,
  kEnableTheming,
} from "$consts";
import Stub from "./Stub.astro";

export const BackendClientScript = kEnableBackend
  ? // @ts-ignore
  (await import("@myriaddreamin/tylant-backend-client")).default
  : Stub;
