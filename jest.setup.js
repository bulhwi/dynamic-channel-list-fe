// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock IntersectionObserver (needed for infinite scroll tests)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock window.matchMedia (needed for responsive tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Sendbird SDK
jest.mock('@sendbird/chat', () => ({
  SendbirdChat: {
    init: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}))

jest.mock('@sendbird/chat/groupChannel', () => ({
  GroupChannelModule: jest.fn(),
}))