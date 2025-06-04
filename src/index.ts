// TypeScript implementation for the PCRE convenience class

import createPCREModule from './libpcre-npm.js';

// Type imports - these will be resolved during compilation
export interface PCREMatch {
  value: string;
  index: number;
  length: number;
}

export interface PCREConfig {
  utf8: boolean;
  unicodeProperties: boolean;
  jit: boolean;
  newline: number;
  linkSize: number;
  matchLimit: number;
}

export interface PCREConstants {
  // Options
  CASELESS: number;
  MULTILINE: number;
  DOTALL: number;
  EXTENDED: number;
  ANCHORED: number;
  DOLLAR_ENDONLY: number;
  EXTRA: number;
  NOTBOL: number;
  NOTEOL: number;
  UNGREEDY: number;
  NOTEMPTY: number;
  UTF8: number;
  NO_AUTO_CAPTURE: number;
  NO_UTF8_CHECK: number;
  AUTO_CALLOUT: number;
  PARTIAL_SOFT: number;
  PARTIAL: number;
  PARTIAL_HARD: number;
  NOTEMPTY_ATSTART: number;
  BSR_ANYCRLF: number;
  BSR_UNICODE: number;
  JAVASCRIPT_COMPAT: number;
  
  // Errors
  ERROR_NOMATCH: number;
  ERROR_NULL: number;
  ERROR_BADOPTION: number;
  ERROR_BADMAGIC: number;
  ERROR_UNKNOWN_OPCODE: number;
  ERROR_UNKNOWN_NODE: number;
  ERROR_NOMEMORY: number;
  ERROR_NOSUBSTRING: number;
  ERROR_MATCHLIMIT: number;
  ERROR_CALLOUT: number;
  ERROR_BADUTF8: number;
  ERROR_BADUTF8_OFFSET: number;
  ERROR_PARTIAL: number;
  ERROR_BADPARTIAL: number;
  ERROR_INTERNAL: number;
  ERROR_BADCOUNT: number;
  ERROR_RECURSIONLIMIT: number;
  ERROR_BADNEWLINE: number;
  ERROR_BADOFFSET: number;
  ERROR_SHORTUTF8: number;
}

export interface PCRERegex {
  test(subject: string, startOffset?: number): boolean;
  exec(subject: string, startOffset?: number): PCREMatch[] | null;
  getNamedGroups(): { [name: string]: number };
  globalMatch(subject: string): PCREMatch[][];
  replace(subject: string, replacement: string, global?: boolean): string;
  getPattern(): string;
  getOptions(): number;
}

interface EmscriptenModule {
  PCRERegex: new (pattern: string, options?: number) => PCRERegex;
  quickTest: (pattern: string, subject: string, options?: number) => boolean;
  quickMatch: (pattern: string, subject: string, options?: number) => PCREMatch[] | null;
  getVersion: () => number;
  getVersionString: () => string;
  getConfigInfo: () => PCREConfig;
  
  // PCRE Constants
  PCRE_CASELESS: number;
  PCRE_MULTILINE: number;
  PCRE_DOTALL: number;
  PCRE_EXTENDED: number;
  PCRE_ANCHORED: number;
  PCRE_DOLLAR_ENDONLY: number;
  PCRE_EXTRA: number;
  PCRE_NOTBOL: number;
  PCRE_NOTEOL: number;
  PCRE_UNGREEDY: number;
  PCRE_NOTEMPTY: number;
  PCRE_UTF8: number;
  PCRE_NO_AUTO_CAPTURE: number;
  PCRE_NO_UTF8_CHECK: number;
  PCRE_AUTO_CALLOUT: number;
  PCRE_PARTIAL_SOFT: number;
  PCRE_PARTIAL: number;
  PCRE_PARTIAL_HARD: number;
  PCRE_NOTEMPTY_ATSTART: number;
  PCRE_BSR_ANYCRLF: number;
  PCRE_BSR_UNICODE: number;
  PCRE_JAVASCRIPT_COMPAT: number;
  
  // Error codes
  PCRE_ERROR_NOMATCH: number;
  PCRE_ERROR_NULL: number;
  PCRE_ERROR_BADOPTION: number;
  PCRE_ERROR_BADMAGIC: number;
  PCRE_ERROR_UNKNOWN_OPCODE: number;
  PCRE_ERROR_UNKNOWN_NODE: number;
  PCRE_ERROR_NOMEMORY: number;
  PCRE_ERROR_NOSUBSTRING: number;
  PCRE_ERROR_MATCHLIMIT: number;
  PCRE_ERROR_CALLOUT: number;
  PCRE_ERROR_BADUTF8: number;
  PCRE_ERROR_BADUTF8_OFFSET: number;
  PCRE_ERROR_PARTIAL: number;
  PCRE_ERROR_BADPARTIAL: number;
  PCRE_ERROR_INTERNAL: number;
  PCRE_ERROR_BADCOUNT: number;
  PCRE_ERROR_RECURSIONLIMIT: number;
  PCRE_ERROR_BADNEWLINE: number;
  PCRE_ERROR_BADOFFSET: number;
  PCRE_ERROR_SHORTUTF8: number;
}

export class PCRE {
  private module: EmscriptenModule | null = null;
  
  /**
   * Initialize the PCRE module
   * @returns Promise that resolves when the module is ready
   */
  async init(): Promise<void> {
    const result = await createPCREModule();
    this.module = result;
  }
  
  /**
   * Create a new regex pattern
   * @param pattern The regex pattern string
   * @param options PCRE options flags
   * @returns A new PCRERegex instance
   */
  compile(pattern: string, options: number = 0): PCRERegex {
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
  test(pattern: string, subject: string, options: number = 0): boolean {
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
  match(pattern: string, subject: string, options: number = 0): PCREMatch[] | null {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.quickMatch(pattern, subject, options);
  }
  
  /**
   * Get PCRE version information
   * @returns Version number
   */
  getVersion(): number {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.getVersion();
  }
  
  /**
   * Get PCRE version string
   * @returns Version string
   */
  getVersionString(): string {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.getVersionString();
  }
  
  /**
   * Get PCRE configuration information
   * @returns Configuration object
   */
  getConfig(): PCREConfig {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return this.module.getConfigInfo();
  }
  
  /**
   * Access to all PCRE constants
   */
  get constants(): PCREConstants {
    if (!this.module) throw new Error('PCRE module not initialized. Call init() first.');
    return {
      // Options
      CASELESS: this.module.PCRE_CASELESS,
      MULTILINE: this.module.PCRE_MULTILINE,
      DOTALL: this.module.PCRE_DOTALL,
      EXTENDED: this.module.PCRE_EXTENDED,
      ANCHORED: this.module.PCRE_ANCHORED,
      DOLLAR_ENDONLY: this.module.PCRE_DOLLAR_ENDONLY,
      EXTRA: this.module.PCRE_EXTRA,
      NOTBOL: this.module.PCRE_NOTBOL,
      NOTEOL: this.module.PCRE_NOTEOL,
      UNGREEDY: this.module.PCRE_UNGREEDY,
      NOTEMPTY: this.module.PCRE_NOTEMPTY,
      UTF8: this.module.PCRE_UTF8,
      NO_AUTO_CAPTURE: this.module.PCRE_NO_AUTO_CAPTURE,
      NO_UTF8_CHECK: this.module.PCRE_NO_UTF8_CHECK,
      AUTO_CALLOUT: this.module.PCRE_AUTO_CALLOUT,
      PARTIAL_SOFT: this.module.PCRE_PARTIAL_SOFT,
      PARTIAL: this.module.PCRE_PARTIAL,
      PARTIAL_HARD: this.module.PCRE_PARTIAL_HARD,
      NOTEMPTY_ATSTART: this.module.PCRE_NOTEMPTY_ATSTART,
      BSR_ANYCRLF: this.module.PCRE_BSR_ANYCRLF,
      BSR_UNICODE: this.module.PCRE_BSR_UNICODE,
      JAVASCRIPT_COMPAT: this.module.PCRE_JAVASCRIPT_COMPAT,
      
      // Errors
      ERROR_NOMATCH: this.module.PCRE_ERROR_NOMATCH,
      ERROR_NULL: this.module.PCRE_ERROR_NULL,
      ERROR_BADOPTION: this.module.PCRE_ERROR_BADOPTION,
      ERROR_BADMAGIC: this.module.PCRE_ERROR_BADMAGIC,
      ERROR_UNKNOWN_OPCODE: this.module.PCRE_ERROR_UNKNOWN_OPCODE,
      ERROR_UNKNOWN_NODE: this.module.PCRE_ERROR_UNKNOWN_NODE,
      ERROR_NOMEMORY: this.module.PCRE_ERROR_NOMEMORY,
      ERROR_NOSUBSTRING: this.module.PCRE_ERROR_NOSUBSTRING,
      ERROR_MATCHLIMIT: this.module.PCRE_ERROR_MATCHLIMIT,
      ERROR_CALLOUT: this.module.PCRE_ERROR_CALLOUT,
      ERROR_BADUTF8: this.module.PCRE_ERROR_BADUTF8,
      ERROR_BADUTF8_OFFSET: this.module.PCRE_ERROR_BADUTF8_OFFSET,
      ERROR_PARTIAL: this.module.PCRE_ERROR_PARTIAL,
      ERROR_BADPARTIAL: this.module.PCRE_ERROR_BADPARTIAL,
      ERROR_INTERNAL: this.module.PCRE_ERROR_INTERNAL,
      ERROR_BADCOUNT: this.module.PCRE_ERROR_BADCOUNT,
      ERROR_RECURSIONLIMIT: this.module.PCRE_ERROR_RECURSIONLIMIT,
      ERROR_BADNEWLINE: this.module.PCRE_ERROR_BADNEWLINE,
      ERROR_BADOFFSET: this.module.PCRE_ERROR_BADOFFSET,
      ERROR_SHORTUTF8: this.module.PCRE_ERROR_SHORTUTF8
    };
  }
}

// Export the module creation function as default
export default createPCREModule;
