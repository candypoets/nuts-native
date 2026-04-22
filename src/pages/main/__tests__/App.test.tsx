// Original: /root/code/nuts-cash/src/routes/+page.svelte (main entry test)
import '@testing-library/jest-dom'
import { expect, test, vi } from 'vitest'
import { render, getQueriesForElement } from '@lynx-js/react/testing-library'

vi.mock('src/app.css', () => ({}))

import App from '../App.js'

vi.mock('sparkling-navigation', () => ({ open: vi.fn() }))

test('App renders tab shell', async () => {
  render(<App />)

  const { findByText } = getQueriesForElement(elementTree.root!)
  const exploreTab = await findByText('Explore')
  expect(exploreTab).toBeInTheDocument()
})
