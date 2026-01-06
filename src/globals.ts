// Extend Window interface for the log function
declare global {
  interface Window {
    log: {
      (...args: any[]): void;
      history?: any[];
    };
  }
}

export function initializeGlobals(): void {
  if (typeof window !== 'undefined' && window.log === undefined) {
    window.log = function(...args: any[]) {
      window.log.history = window.log.history || []; // store logs to an array for reference
      window.log.history.push(args);
      if (console) {
        console.log(Array.prototype.slice.call(args));
      }
    };
  }
}

export function noclick(ev: Event): void {
  ev.preventDefault();
}
