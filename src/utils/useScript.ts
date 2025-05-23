/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
/**
 * By importing this file, you will get a `wasm` module added to your server
 * while it's booting. If it fails to load, your server will hang indefinitely.
 *
 * Use at your own risk.
 */

import { LRUCache } from 'lru-cache'
import { minify as terserMinify } from 'terser'

const verbose = !!Bun.env.SCRIPT_MINIFICATION_DEBUG

const cache = new LRUCache<string, string | Promise<string | null>>({
  max: 100
})

const timings = (js: string) => {
  const start = performance.now()

  return () => {
    const duration = performance.now() - start
    console.log(
      `[script-minification]: ${duration}ms minifiying script ${js
        .slice(0, 38)
        .replace(/(\n|\s)+/g, ' ')}...`
    )
  }
}

const minify = async (js: string) => {
  try {
    const log = verbose ? timings(js) : null

    const result = await terserMinify(js, {
      ecma: 2020,
      mangle: true,
      compress: {
        side_effects: false
      }
    })
    // `?? null` prevents accidental `undefined` propagation
    const code = result?.code?.replace(/;$/, '') ?? null

    log?.()

    return code
  } catch (error) {
    console.error({ error })

    return null
  }
}

/**
 * Hook to create a minified script tag from a function.
 *
 * @template T - Type of the function to be used as script
 * @param {T} fn - The function to be included as a script.
 * @param {...Parameters<T>} params - Parameters to be passed to the function.
 * @returns {string} The minified script tag content.
 */
export function useScript<T extends (...args: any[]) => any>(
  fn: T,
  ...params: Parameters<T>
): string {
  const javascript = fn.toString()
  let cached = cache.get(javascript)

  if (!cached) {
    // Immediately store the promise in the cache to prevent duplicate work
    const minifyPromise = minify(javascript)
    cache.set(javascript, minifyPromise)

    // Handle promise resolution to update cache with actual string value
    minifyPromise.then(minified => {
      if (minified === null) {
        cache.delete(javascript)
      } else {
        cache.set(javascript, minified)
      }
    })

    cached = minifyPromise
  }

  // If cached is a promise, we can't use it directly - fall back to original
  const scriptContent = typeof cached === 'string' ? cached : javascript

  return `(${scriptContent})(${params.map(p => JSON.stringify(p)).join(', ')})`
}

export function useScriptAsDataURI<T extends (...args: any[]) => any>(
  fn: T,
  ...params: Parameters<T>
): string {
  return `data:text/javascript,${encodeURIComponent(useScript(fn, ...params))}`
}
