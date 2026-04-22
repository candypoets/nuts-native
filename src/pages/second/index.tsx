// Original: Template file (no direct equivalent in nuts-cash)
import { root } from '@lynx-js/react'

import { App } from './App.js'

root.render(<App />)

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
}
