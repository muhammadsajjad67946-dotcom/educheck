import test from 'node:test'
import assert from 'node:assert/strict'

import { getInitialDarkMode } from './theme.js'

test('falls back to dark mode when no saved theme exists', () => {
  const original = globalThis.localStorage
  const mockStorage = {
    getItem: () => null,
  }
  globalThis.localStorage = mockStorage
  assert.equal(getInitialDarkMode(), true)
  globalThis.localStorage = original
})

test('returns true when saved theme is dark', () => {
  const original = globalThis.localStorage
  const mockStorage = {
    getItem: (key) => (key === 'educheck_dark_mode' ? 'true' : null),
  }
  globalThis.localStorage = mockStorage
  assert.equal(getInitialDarkMode(), true)
  globalThis.localStorage = original
})
