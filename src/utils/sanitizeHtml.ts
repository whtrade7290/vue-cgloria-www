import DOMPurify from 'dompurify'

/**
 * DOMPurify를 이용해 스크립트/이벤트 등 위험 요소를 제거한 안전한 HTML을 반환한다.
 * CKEditor에서 생성된 HTML을 그대로 저장/출력하면 XSS 공격에 노출될 수 있으므로,
 * 서버/클라이언트 모두에서 sanitize 과정을 거친다.
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return ''
  return DOMPurify.sanitize(input, {
    USE_PROFILES: { html: true }
  })
}
