// Cloudflare Workers compatible PCRE wrapper
import wasmModule from '../dist/libpcre.wasm';
import createPCREModule from '../dist/libpcre.js';

export class PCRE {
  constructor() {
    this.module = null;
  }
  
  /**
   * Initialize the PCRE module using Cloudflare Workers compatible approach
   * @returns Promise that resolves when the module is ready
   */
  async init() {
    try {
      // Use the proper Cloudflare Workers pattern for WASM loading
      const instance = await WebAssembly.instantiate(wasmModule, {});
      
      // Initialize the Emscripten module with the pre-instantiated WASM
      const result = await createPCREModule({
        wasmBinary: wasmModule,
        instantiateWasm: (imports, successCallback) => {
          // Return the already instantiated module
          successCallback(instance, wasmModule);
          return instance.exports;
        }
      });
      
      console.log('[PCRE.init] Module initialized successfully');
      this.module = result;
      return result;
    } catch (error) {
      console.error('[PCRE.init] Failed to initialize PCRE module:', error);
      throw error;
    }
  }
  
  /**
   * Create a new regex pattern
   * @param pattern The regex pattern string
   * @param options PCRE options flags
   * @returns A new PCRERegex instance
   */
  compile(pattern, options = 0) {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return new this.module.PCRERegex(pattern, options);
  }
  
  /**
   * Quick test if a pattern matches a string
   * @param pattern The regex pattern
   * @param subject The string to test
   * @param options PCRE options flags
   * @returns true if the pattern matches
   */
  test(pattern, subject, options = 0) {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.quickTest(pattern, subject, options);
  }
  
  /**
   * Quick match execution
   * @param pattern The regex pattern
   * @param subject The string to match
   * @param options PCRE options flags
   * @returns Array of matches or null
   */
  match(pattern, subject, options = 0) {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.quickMatch(pattern, subject, options);
  }
  
  /**
   * Get PCRE constants
   */
  get constants() {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.constants || {};
  }
}

export default PCRE;
