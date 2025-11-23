/**
 * Unit Tests for Utility Functions
 *
 * TDD approach: Write tests first, then implement
 */

import { generateRandomName } from '@/lib/utils'

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
