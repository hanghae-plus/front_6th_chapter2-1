/**
 * DOM 쿼리 셀렉터 유틸리티
 * 성능 최적화를 위한 캐싱 기능 포함
 */

// 쿼리 셀렉터 캐시
const selectorCache = new Map();

/**
 * 캐시된 DOM 쿼리 셀렉터
 * @param {string} selector - CSS 셀렉터
 * @returns {Element|null} DOM 요소 또는 null
 */
export function $(selector) {
  // 캐시에서 확인
  if (selectorCache.has(selector)) {
    return selectorCache.get(selector);
  }

  // DOM에서 찾기
  const element = document.querySelector(selector);

  // 캐시에 저장 (null도 저장하여 불필요한 재검색 방지)
  selectorCache.set(selector, element);

  return element;
}

/**
 * 캐시 무효화 (DOM 변경 시 호출)
 * @param {string} [selector] - 특정 셀렉터만 무효화 (선택사항)
 */
export function clearSelectorCache(selector = null) {
  if (selector) {
    selectorCache.delete(selector);
  } else {
    selectorCache.clear();
  }
}
