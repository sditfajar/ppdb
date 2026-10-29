import { createHomeSocialImage, homeSocialImageAlt, socialImageSize } from "@/lib/social-image";

export const runtime = "nodejs";
export const alt = homeSocialImageAlt;
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createHomeSocialImage();
}
