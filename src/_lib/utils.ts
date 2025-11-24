/**
 * 유틸리티 함수
 *
 * 애플리케이션에서 재사용 가능한 유틸리티 함수 모음
 */

import type { Channel } from '@/_types/channel.types'

/**
 * 8자리 소문자 영문 랜덤 문자열을 생성합니다.
 *
 * 사용자 지정 이름이 제공되지 않을 때 랜덤 채널 이름을 생성하는 데 사용됩니다.
 *
 * @returns {string} 소문자(a-z)만 포함하는 8자 문자열
 *
 * @example
 * ```typescript
 * const channelName = generateRandomName()
 * // "xkqpmwjd"와 같은 값을 반환
 * ```
 */
export function generateRandomName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  let result = ''

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length)
    result += letters[randomIndex]
  }

  return result
}

/**
 * 채널을 이름 기준으로 알파벳 순 정렬합니다 (대소문자 구분 없음).
 *
 * 원본 배열을 수정하지 않고 새 배열을 반환합니다.
 * 채널을 알파벳 순으로 표시하는 데 사용됩니다.
 *
 * @param {Channel[]} channels - 정렬할 채널 배열
 * @returns {Channel[]} 이름 기준으로 알파벳 순 정렬된 새 채널 배열
 *
 * @example
 * ```typescript
 * const channels = [
 *   { name: 'Zebra', url: 'z', createdAt: 1000 },
 *   { name: 'apple', url: 'a', createdAt: 2000 }
 * ]
 * const sorted = sortChannels(channels)
 * // 반환: [{ name: 'apple', ... }, { name: 'Zebra', ... }]
 * // 원본 배열은 변경되지 않음
 * ```
 */
export function sortChannels(channels: Channel[]): Channel[] {
  // 원본 배열 변경을 피하기 위해 얕은 복사본 생성
  return [...channels].sort((a, b) => {
    // 대소문자 구분 없는 비교
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
}
