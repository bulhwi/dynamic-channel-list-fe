/**
 * Unit Tests for Utility Functions
 *
 * TDD approach: Write tests first, then implement
 */

import { generateRandomName, sortChannels } from '@/lib/utils'
import type { Channel } from '@/types/channel.types'

describe('generateRandomName', () => {
  it('should return a string of length 8', () => {
    const name = generateRandomName()
    expect(name).toHaveLength(8)
  })

  it('should contain only lowercase letters', () => {
    const name = generateRandomName()
    expect(name).toMatch(/^[a-z]{8}$/)
  })

  it('should generate different names on multiple calls', () => {
    const name1 = generateRandomName()
    const name2 = generateRandomName()
    const name3 = generateRandomName()

    // Very unlikely to generate the same name twice
    expect(name1).not.toBe(name2)
    expect(name2).not.toBe(name3)
    expect(name1).not.toBe(name3)
  })

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

  it('should handle empty array', () => {
    const channels: Channel[] = []
    const sorted = sortChannels(channels)

    expect(sorted).toEqual([])
    expect(sorted).not.toBe(channels) // Should still return new array
  })

  it('should handle single channel', () => {
    const channels: Channel[] = [createChannel('single')]
    const sorted = sortChannels(channels)

    expect(sorted).toHaveLength(1)
    expect(sorted[0].name).toBe('single')
    expect(sorted).not.toBe(channels) // Should still return new array
  })

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
