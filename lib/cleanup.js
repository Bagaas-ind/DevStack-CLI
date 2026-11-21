// Run a cleanup callback once when the user presses Ctrl+C (SIGINT) or the process gets SIGTERM,
// then exit with the conventional 128+signal code. Returns a dispose() that removes the handlers
// (call it after a successful run so later signals behave normally).
const EXIT_CODES = { SIGINT: 130, SIGTERM: 143 }

export function registerInterruptCleanup(cleanup, { proc = process, exit = (code) => process.exit(code) } = {}) {
  let handled = false
  const handlers = {}
  const dispose = () => {
    handled = true
    for (const [signal, handler] of Object.entries(handlers)) proc.removeListener(signal, handler)
  }
  for (const signal of Object.keys(EXIT_CODES)) {
    handlers[signal] = () => {
      if (handled) return
      handled = true
      try {
        cleanup(signal)
      } finally {
        exit(EXIT_CODES[signal])
      }
    }
    proc.on(signal, handlers[signal])
  }
  return dispose
}
