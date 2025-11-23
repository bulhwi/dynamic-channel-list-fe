/**
 * Unit Tests for Utility Functions
 *
 * TDD approach: Write tests first, then implement
 */

import { generateRandomName, sortChannels } from '@/lib/utils'
import type { Channel } from '@/types/channel.types'

describe('generateRandomName', () => {
  // 길이가 8인 문자열을 반환해야 함
  it('should return a string of length 8', () => {
    const name = generateRandomName()
    expect(name).toHaveLength(8)
  })

  // 소문자만 포함해야 함
  it('should contain only lowercase letters', () => {
    const name = generateRandomName()
    expect(name).toMatch(/^[a-z]{8}$/)
  })

  // 여러 번 호출 시 다른 이름을 생성해야 함
  it('should generate different names on multiple calls', () => {
    const name1 = generateRandomName()
    const name2 = generateRandomName()
    const name3 = generateRandomName()

    // Very unlikely to generate the same name twice
    expect(name1).not.toBe(name2)
    expect(name2).not.toBe(name3)
    expect(name1).not.toBe(name3)
  })

  // a-z 문자만 포함해야 함
  it('should only contain characters a-z', () => {
    // Run multiple times to increase confidence
    for (let i = 0; i < 10; i++) {
      const name = generateRandomName()
      for (const char of name) {
        const charCode = char.charCodeAt(0)
        expect(charCode).toBeGreaterThanOrEqual(97) // 'a'
        expect(charCode).toBeLessThanOrEqual(122) // 'z'
      }
    }
  })
})

describe('sortChannels', () => {
  // Helper function to create test channels
  const createChannel = (name: string, url: string = name): Channel => ({
    url,
    name,
    createdAt: Date.now(),
  })

  // 채널을 이름순으로 알파벳 정렬해야 함
  it('should sort channels alphabetically by name', () => {
    const channels: Channel[] = [
      createChannel('zebra'),
      createChannel('apple'),
      createChannel('mango'),
      createChannel('banana'),
    ]

    const sorted = sortChannels(channels)

    expect(sorted[0].name).toBe('apple')
    expect(sorted[1].name).toBe('banana')
    expect(sorted[2].name).toBe('mango')
    expect(sorted[3].name).toBe('zebra')
  })

  // 정렬 시 대소문자를 구분하지 않아야 함
  it('should be case-insensitive when sorting', () => {
    const channels: Channel[] = [
      createChannel('Zebra'),
      createChannel('apple'),
      createChannel('MANGO'),
      createChannel('Banana'),
    ]

    const sorted = sortChannels(channels)

    expect(sorted[0].name).toBe('apple')
    expect(sorted[1].name).toBe('Banana')
    expect(sorted[2].name).toBe('MANGO')
    expect(sorted[3].name).toBe('Zebra')
  })

  // 원본 배열을 변경하지 않아야 함
  it('should not mutate the original array', () => {
    const channels: Channel[] = [
      createChannel('zebra'),
      createChannel('apple'),
      createChannel('mango'),
    ]

    const original = [...channels]
    const sorted = sortChannels(channels)

    // Original array should be unchanged
    expect(channels).toEqual(original)
    expect(channels[0].name).toBe('zebra')

    // Sorted array should be different
    expect(sorted).not.toBe(channels)
    expect(sorted[0].name).toBe('apple')
  })

  // 빈 배열을 처리해야 함
  it('should handle empty array', () => {
    const channels: Channel[] = []
    const sorted = sortChannels(channels)

    expect(sorted).toEqual([])
    expect(sorted).not.toBe(channels) // Should still return new array
  })

  // 단일 채널을 처리해야 함
  it('should handle single channel', () => {
    const channels: Channel[] = [createChannel('single')]
    const sorted = sortChannels(channels)

    expect(sorted).toHaveLength(1)
    expect(sorted[0].name).toBe('single')
    expect(sorted).not.toBe(channels) // Should still return new array
  })

  // 이름 외의 채널 속성을 보존해야 함
  it('should preserve channel properties other than name', () => {
    const channels: Channel[] = [
      {
        url: 'url-z',
        name: 'zebra',
        createdAt: 1000,
        customType: 'type-z',
        data: 'data-z',
      },
      {
        url: 'url-a',
        name: 'apple',
        createdAt: 2000,
        customType: 'type-a',
        data: 'data-a',
      },
    ]

    const sorted = sortChannels(channels)

    expect(sorted[0]).toEqual({
      url: 'url-a',
      name: 'apple',
      createdAt: 2000,
      customType: 'type-a',
      data: 'data-a',
    })
    expect(sorted[1]).toEqual({
      url: 'url-z',
      name: 'zebra',
      createdAt: 1000,
      customType: 'type-z',
      data: 'data-z',
    })
  })

  // 동일한 이름을 가진 채널들을 처리해야 함
  it('should handle channels with identical names', () => {
    const channels: Channel[] = [
      createChannel('same', 'url-1'),
      createChannel('same', 'url-2'),
      createChannel('same', 'url-3'),
    ]

    const sorted = sortChannels(channels)

    expect(sorted).toHaveLength(3)
    expect(sorted[0].name).toBe('same')
    expect(sorted[1].name).toBe('same')
    expect(sorted[2].name).toBe('same')
  })
})
