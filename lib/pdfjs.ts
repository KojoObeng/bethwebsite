/**
 * Shared PDF.js singleton — loaded once for the whole page, not once per card.
 * Each dynamic import() call after the first returns the cached module
 * so the 800KB library and 1.5MB worker are only downloaded once.
 */

type PdfjsLib = typeof import('pdfjs-dist');

let _lib: PdfjsLib | null = null;
let _promise: Promise<PdfjsLib> | null = null;

export function getPdfJs(): Promise<PdfjsLib> {
  if (_lib) return Promise.resolve(_lib);
  if (_promise) return _promise;

  _promise = import('pdfjs-dist').then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    _lib = lib;
    return lib;
  });

  return _promise;
}

/**
 * Render queue — caps concurrent canvas renders so the browser doesn't
 * try to decode + render all PDFs at the same time, which saturates the
 * network and stalls the main thread.
 */
const MAX_CONCURRENT = 2;
let active = 0;
const waiting: Array<() => void> = [];

export function enqueueRender(work: () => Promise<void>): void {
  const run = async () => {
    active++;
    try {
      await work();
    } finally {
      active--;
      const next = waiting.shift();
      if (next) next();
    }
  };

  if (active < MAX_CONCURRENT) {
    run();
  } else {
    waiting.push(run);
  }
}
