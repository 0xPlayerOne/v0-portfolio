// Preload that runs before @testing-library/react is imported.
// Bun's --dom provides window.document but not globalThis.document.
// testing-library's screen needs globalThis.document.
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

if (typeof (globalThis as any).document === 'undefined') {
  Object.defineProperty(globalThis, 'document', {
    value: (globalThis as any).window?.document,
    configurable: true,
    writable: true,
  })
}
if (typeof (globalThis as any).navigator === 'undefined') {
  Object.defineProperty(globalThis, 'navigator', {
    value: (globalThis as any).window?.navigator,
    configurable: true,
    writable: true,
  })
}
