import { createSpmbSocialImage, socialImageSize, spmbSocialImageAlt } from "@/lib/social-image";

export const runtime = "nodejs";
export const alt = spmbSocialImageAlt;
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createSpmbSocialImage();
}
