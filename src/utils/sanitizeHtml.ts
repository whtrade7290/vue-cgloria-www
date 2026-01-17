import DOMPurify from 'dompurify'

const transformMediaEmbeds = (input: string): string => {
  if (!input) return ''

  return input.replace(/<oembed[^>]*url="([^"]+)"[^>]*>(?:<\/oembed>)?/gi, (_, url) => {
    const embedUrl = buildEmbedUrl(url.trim())
    if (!embedUrl) {
      return ''
    }

    const attrs =
      'width="100%" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen'

    return `<div class="embed-responsive"><iframe src="${embedUrl}" ${attrs}></iframe></div>`
  })
}

const buildEmbedUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '').toLowerCase()

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '')
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    if (host.includes('youtube-nocookie.com')) {
      return url
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * DOMPurify를 이용해 스크립트/이벤트 등 위험 요소를 제거한 안전한 HTML을 반환한다.
 * CKEditor에서 생성된 HTML을 그대로 저장/출력하면 XSS 공격에 노출될 수 있으므로,
 * 서버/클라이언트 모두에서 sanitize 과정을 거친다.
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return ''
  const transformed = transformMediaEmbeds(input)
  return DOMPurify.sanitize(transformed, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['src', 'allow', 'allowfullscreen', 'frameborder', 'width', 'height']
  })
}
