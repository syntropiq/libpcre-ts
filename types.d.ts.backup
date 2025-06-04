// TypeScript definitions for libpcre-ts

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

export interface EmscriptenModule {
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

export interface PCRERegex {
  /**
   * Test if the pattern matches the subject string
   * @param subject The string to test against
   * @param startOffset Starting offset in the subject string
   * @returns true if the pattern matches, false otherwise
   */
  test(subject: string, startOffset?: number): boolean;
  
  /**
   * Execute the regex and return match information
   * @param subject The string to match against
   * @param startOffset Starting offset in the subject string
   * @returns Array of match objects or null if no match
   */
  exec(subject: string, startOffset?: number): PCREMatch[] | null;
  
  /**
   * Get named capture groups and their indices
   * @returns Object mapping group names to their indices
   */
  getNamedGroups(): { [name: string]: number };
  
  /**
   * Find all matches in the subject string
   * @param subject The string to search
   * @returns Array of all match arrays
   */
  globalMatch(subject: string): PCREMatch[][];
  
  /**
   * Replace matches in the subject string
   * @param subject The string to perform replacement on
   * @param replacement The replacement string
   * @param global Whether to replace all matches or just the first
   * @returns The string with replacements made
   */
  replace(subject: string, replacement: string, global?: boolean): string;
  
  /**
   * Get the original pattern string
   * @returns The pattern used to create this regex
   */
  getPattern(): string;
  
  /**
   * Get the options used to compile this regex
   * @returns The options flags
   */
  getOptions(): number;
}

declare function createPCREModule(): Promise<EmscriptenModule>;
export default createPCREModule;

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

/**
 * High-level convenience class for easier usage
 */
export declare class PCRE {
  private module: EmscriptenModule | null;
  
  /**
   * Initialize the PCRE module
   * @returns Promise that resolves when the module is ready
   */
  init(): Promise<void>;
  
  /**
   * Create a new regex pattern
   * @param pattern The regex pattern string
   * @param options PCRE options flags
   * @returns A new PCRERegex instance
   */
  compile(pattern: string, options?: number): PCRERegex;
  
  /**
   * Quick test if a pattern matches a string
   * @param pattern The regex pattern
   * @param subject The string to test
   * @param options PCRE options flags
   * @returns true if the pattern matches
   */
  test(pattern: string, subject: string, options?: number): boolean;
  
  /**
   * Quick match execution
   * @param pattern The regex pattern
   * @param subject The string to match
   * @param options PCRE options flags
   * @returns Array of matches or null
   */
  match(pattern: string, subject: string, options?: number): PCREMatch[] | null;
  
  /**
   * Get PCRE version information
   * @returns Version number
   */
  getVersion(): number;
  
  /**
   * Get PCRE version string
   * @returns Version string
   */
  getVersionString(): string;
  
  /**
   * Get PCRE configuration information
   * @returns Configuration object
   */
  getConfig(): PCREConfig;
  
  /**
   * Access to all PCRE constants
   */
  readonly constants: PCREConstants;
}
