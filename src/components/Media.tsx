import Image from 'next/image'

export type MediaDoc = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  focalX?: number | null
  focalY?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null }>
}

/** Image or video from the media library, with reserved dimensions, focal point and lazy loading. */
export function Media({
  media,
  sizes = '(min-width: 1360px) 1300px, 100vw',
  priority = false,
  aspect,
  className,
}: {
  media?: MediaDoc | number | string | null
  sizes?: string
  priority?: boolean
  aspect?: string | null
  className?: string
}) {
  if (!media || typeof media !== 'object' || !media.url) return null
  const position = `${media.focalX ?? 50}% ${media.focalY ?? 50}%`
  if (media.mimeType?.startsWith('video/'))
    return (
      <video
        className={className}
        src={media.url}
        controls
        playsInline
        preload="metadata"
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        style={aspect && aspect !== 'auto' ? { aspectRatio: aspect, objectPosition: position } : undefined}
        aria-label={media.alt ?? undefined}
      />
    )
  return (
    <Image
      className={className}
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width ?? 1600}
      height={media.height ?? 900}
      sizes={sizes}
      priority={priority}
      style={{ objectPosition: position, ...(aspect && aspect !== 'auto' ? { aspectRatio: aspect, objectFit: 'cover', height: 'auto' } : {}) }}
    />
  )
}
