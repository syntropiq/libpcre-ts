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

// https://github.com/devlux76/libpcre/blob/b2d089d6ba626d63949f6f513fdf4e0da67cff4e/pcre.h#L127-L171
export interface PCREConstants {
  // Options
  CASELESS: number; //          0x00000001;  /* C1       */
  MULTILINE: number; //         0x00000002;  /* C1       */
  DOTALL: number; //            0x00000004;  /* C1       */
  EXTENDED: number; //          0x00000008;  /* C1       */
  ANCHORED: number; //          0x00000010;  /* C4 E D   */
  DOLLAR_ENDONLY: number; //    0x00000020;  /* C2       */
  EXTRA: number; //             0x00000040;  /* C1       */
  NOTBOL: number; //            0x00000080;  /*    E D J */
  NOTEOL: number; //            0x00000100;  /*    E D J */
  UNGREEDY: number; //          0x00000200;  /* C1       */
  NOTEMPTY: number; //          0x00000400;  /*    E D J */
  UTF8: number; //              0x00000800;  /* C4        )          */
  UTF16: number; //             0x00000800;  /* C4        ) Synonyms */
  UTF32: number; //             0x00000800;  /* C4        )          */
  NO_AUTO_CAPTURE: number; //   0x00001000;  /* C1       */
  NO_UTF8_CHECK: number; //     0x00002000;  /* C1 E D J  )          */
  NO_UTF16_CHECK: number; //    0x00002000;  /* C1 E D J  ) Synonyms */
  NO_UTF32_CHECK: number; //    0x00002000;  /* C1 E D J  )          */
  AUTO_CALLOUT: number; //      0x00004000;  /* C1       */
  PARTIAL_SOFT: number; //      0x00008000;  /*    E D J  ) Synonyms */
  PARTIAL: number; //           0x00008000;  /*    E D J  )          */
  NEVER_UTF: number; //         0x00010000;  /* C1        ) Overlaid */
  DFA_SHORTEST: number; //      0x00010000;  /*      D    ) Overlaid */
  NO_AUTO_POSSESS: number; //   0x00020000;  /* C1        ) Overlaid */
  DFA_RESTART: number; //       0x00020000;  /*      D    ) Overlaid */
  FIRSTLINE: number; //         0x00040000;  /* C3       */
  DUPNAMES: number; //          0x00080000;  /* C1       */
  NEWLINE_CR: number; //        0x00100000;  /* C3 E D   */
  NEWLINE_LF: number; //        0x00200000;  /* C3 E D   */
  NEWLINE_CRLF: number; //      0x00300000;  /* C3 E D   */
  NEWLINE_ANY: number; //       0x00400000;  /* C3 E D   */
  NEWLINE_ANYCRLF: number; //   0x00500000;  /* C3 E D   */
  BSR_ANYCRLF: number; //       0x00800000;  /* C3 E D   */
  BSR_UNICODE: number; //       0x01000000;  /* C3 E D   */
  JAVASCRIPT_COMPAT: number; // 0x02000000;  /* C5       */
  NO_START_OPTIMIZE: number; // 0x04000000;  /* C2 E D    ) Synonyms */
  NO_START_OPTIMISE: number; // 0x04000000;  /* C2 E D    )          */
  PARTIAL_HARD: number; //      0x08000000;  /*    E D J */
  NOTEMPTY_ATSTART: number; //  0x10000000;  /*    E D J */
  UCP: number; //               0x20000000;  /* C3       */
  
  // Errors
  ERROR_NOMATCH: number; //          (-1)
  ERROR_NULL: number; //             (-2)
  ERROR_BADOPTION: number; //        (-3)
  ERROR_BADMAGIC: number; //         (-4)
  ERROR_UNKNOWN_OPCODE: number; //   (-5)
  ERROR_UNKNOWN_NODE: number; //     (-5)  /* For backward compatibility */
  ERROR_NOMEMORY: number; //         (-6)
  ERROR_NOSUBSTRING: number; //      (-7)
  ERROR_MATCHLIMIT: number; //       (-8)
  ERROR_CALLOUT: number; //          (-9)  /* Never used by PCRE itself */
  ERROR_BADUTF8: number; //         (-10)  /* Same for 8/16/32 */
  ERROR_BADUTF16: number; //        (-10)  /* Same for 8/16/32 */
  ERROR_BADUTF32: number; //        (-10)  /* Same for 8/16/32 */
  ERROR_BADUTF8_OFFSET: number; //  (-11)  /* Same for 8/16 */
  ERROR_BADUTF16_OFFSET: number; // (-11)  /* Same for 8/16 */
  ERROR_PARTIAL: number; //         (-12)
  ERROR_BADPARTIAL: number; //      (-13)
  ERROR_INTERNAL: number; //        (-14)
  ERROR_BADCOUNT: number; //        (-15)
  ERROR_DFA_UITEM: number; //       (-16)
  ERROR_DFA_UCOND: number; //       (-17)
  ERROR_DFA_UMLIMIT: number; //     (-18)
  ERROR_DFA_WSSIZE: number; //      (-19)
  ERROR_DFA_RECURSE: number; //     (-20)
  ERROR_RECURSIONLIMIT: number; //  (-21)
  ERROR_NULLWSLIMIT: number; //     (-22)  /* No longer actually used */
  ERROR_BADNEWLINE: number; //      (-23)
  ERROR_BADOFFSET: number; //       (-24)
  ERROR_SHORTUTF8: number; //       (-25)
  ERROR_SHORTUTF16: number; //      (-25)  /* Same for 8/16 */
  ERROR_RECURSELOOP: number; //     (-26)
  ERROR_JIT_STACKLIMIT: number; //  (-27)
  ERROR_BADMODE: number; //         (-28)
  ERROR_BADENDIANNESS: number; //   (-29)
  ERROR_DFA_BADRESTART: number; //  (-30)
  ERROR_JIT_BADOPTION: number; //   (-31)
  ERROR_BADLENGTH: number; //       (-32)
  ERROR_UNSET: number; //           (-33)
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
  PCRE_UTF16: number;
  PCRE_UTF32: number;
  PCRE_NO_AUTO_CAPTURE: number;
  PCRE_NO_UTF8_CHECK: number;
  PCRE_NO_UTF16_CHECK: number;
  PCRE_NO_UTF32_CHECK: number;
  PCRE_AUTO_CALLOUT: number;
  PCRE_PARTIAL_SOFT: number;
  PCRE_PARTIAL: number;
  PCRE_NEVER_UTF: number;
  PCRE_DFA_SHORTEST: number;
  PCRE_NO_AUTO_POSSESS: number;
  PCRE_DFA_RESTART: number;
  PCRE_FIRSTLINE: number;
  PCRE_DUPNAMES: number;
  PCRE_NEWLINE_CR: number;
  PCRE_NEWLINE_LF: number;
  PCRE_NEWLINE_CRLF: number;
  PCRE_NEWLINE_ANY: number;
  PCRE_NEWLINE_ANYCRLF: number;
  PCRE_BSR_ANYCRLF: number;
  PCRE_BSR_UNICODE: number;
  PCRE_JAVASCRIPT_COMPAT: number;
  PCRE_NO_START_OPTIMIZE: number;
  PCRE_NO_START_OPTIMISE: number;
  PCRE_PARTIAL_HARD: number;
  PCRE_NOTEMPTY_ATSTART: number;
  PCRE_UCP: number;
  
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
  PCRE_ERROR_BADUTF16: number;
  PCRE_ERROR_BADUTF32: number;
  PCRE_ERROR_BADUTF8_OFFSET: number;
  PCRE_ERROR_BADUTF16_OFFSET: number;
  PCRE_ERROR_PARTIAL: number;
  PCRE_ERROR_BADPARTIAL: number;
  PCRE_ERROR_INTERNAL: number;
  PCRE_ERROR_BADCOUNT: number;
  PCRE_ERROR_DFA_UITEM: number;
  PCRE_ERROR_DFA_UCOND: number;
  PCRE_ERROR_DFA_UMLIMIT: number;
  PCRE_ERROR_DFA_WSSIZE: number;
  PCRE_ERROR_DFA_RECURSE: number;
  PCRE_ERROR_RECURSIONLIMIT: number;
  PCRE_ERROR_NULLWSLIMIT: number;
  PCRE_ERROR_BADNEWLINE: number;
  PCRE_ERROR_BADOFFSET: number;
  PCRE_ERROR_SHORTUTF8: number;
  PCRE_ERROR_SHORTUTF16: number;
  PCRE_ERROR_RECURSELOOP: number;
  PCRE_ERROR_JIT_STACKLIMIT: number;
  PCRE_ERROR_BADMODE: number;
  PCRE_ERROR_BADENDIANNESS: number;
  PCRE_ERROR_DFA_BADRESTART: number;
  PCRE_ERROR_JIT_BADOPTION: number;
  PCRE_ERROR_BADLENGTH: number;
  PCRE_ERROR_UNSET: number;
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
      UTF16: this.module.PCRE_UTF16,
      UTF32: this.module.PCRE_UTF32,
      NO_AUTO_CAPTURE: this.module.PCRE_NO_AUTO_CAPTURE,
      NO_UTF8_CHECK: this.module.PCRE_NO_UTF8_CHECK,
      NO_UTF16_CHECK: this.module.PCRE_NO_UTF16_CHECK,
      NO_UTF32_CHECK: this.module.PCRE_NO_UTF32_CHECK,
      AUTO_CALLOUT: this.module.PCRE_AUTO_CALLOUT,
      PARTIAL_SOFT: this.module.PCRE_PARTIAL_SOFT,
      PARTIAL: this.module.PCRE_PARTIAL,
      NEVER_UTF: this.module.PCRE_NEVER_UTF,
      DFA_SHORTEST: this.module.PCRE_DFA_SHORTEST,
      NO_AUTO_POSSESS: this.module.PCRE_NO_AUTO_POSSESS,
      DFA_RESTART: this.module.PCRE_DFA_RESTART,
      FIRSTLINE: this.module.PCRE_FIRSTLINE,
      DUPNAMES: this.module.PCRE_DUPNAMES,
      NEWLINE_CR: this.module.PCRE_NEWLINE_CR,
      NEWLINE_LF: this.module.PCRE_NEWLINE_LF,
      NEWLINE_CRLF: this.module.PCRE_NEWLINE_CRLF,
      NEWLINE_ANY: this.module.PCRE_NEWLINE_ANY,
      NEWLINE_ANYCRLF: this.module.PCRE_NEWLINE_ANYCRLF,
      BSR_ANYCRLF: this.module.PCRE_BSR_ANYCRLF,
      BSR_UNICODE: this.module.PCRE_BSR_UNICODE,
      JAVASCRIPT_COMPAT: this.module.PCRE_JAVASCRIPT_COMPAT,
      NO_START_OPTIMIZE: this.module.PCRE_NO_START_OPTIMIZE,
      NO_START_OPTIMISE: this.module.PCRE_NO_START_OPTIMISE,
      PARTIAL_HARD: this.module.PCRE_PARTIAL_HARD,
      NOTEMPTY_ATSTART: this.module.PCRE_NOTEMPTY_ATSTART,
      UCP: this.module.PCRE_UCP,
      
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
      ERROR_BADUTF16: this.module.PCRE_ERROR_BADUTF16,
      ERROR_BADUTF32: this.module.PCRE_ERROR_BADUTF32,
      ERROR_BADUTF8_OFFSET: this.module.PCRE_ERROR_BADUTF8_OFFSET,
      ERROR_BADUTF16_OFFSET: this.module.PCRE_ERROR_BADUTF16_OFFSET,
      ERROR_PARTIAL: this.module.PCRE_ERROR_PARTIAL,
      ERROR_BADPARTIAL: this.module.PCRE_ERROR_BADPARTIAL,
      ERROR_INTERNAL: this.module.PCRE_ERROR_INTERNAL,
      ERROR_BADCOUNT: this.module.PCRE_ERROR_BADCOUNT,
      ERROR_DFA_UITEM: this.module.PCRE_ERROR_DFA_UITEM,
      ERROR_DFA_UCOND: this.module.PCRE_ERROR_DFA_UCOND,
      ERROR_DFA_UMLIMIT: this.module.PCRE_ERROR_DFA_UMLIMIT,
      ERROR_DFA_WSSIZE: this.module.PCRE_ERROR_DFA_WSSIZE,
      ERROR_DFA_RECURSE: this.module.PCRE_ERROR_DFA_RECURSE,
      ERROR_RECURSIONLIMIT: this.module.PCRE_ERROR_RECURSIONLIMIT,
      ERROR_NULLWSLIMIT: this.module.PCRE_ERROR_NULLWSLIMIT,
      ERROR_BADNEWLINE: this.module.PCRE_ERROR_BADNEWLINE,
      ERROR_BADOFFSET: this.module.PCRE_ERROR_BADOFFSET,
      ERROR_SHORTUTF8: this.module.PCRE_ERROR_SHORTUTF8,
      ERROR_SHORTUTF16: this.module.PCRE_ERROR_SHORTUTF16,
      ERROR_RECURSELOOP: this.module.PCRE_ERROR_RECURSELOOP,
      ERROR_JIT_STACKLIMIT: this.module.PCRE_ERROR_JIT_STACKLIMIT,
      ERROR_BADMODE: this.module.PCRE_ERROR_BADMODE,
      ERROR_BADENDIANNESS: this.module.PCRE_ERROR_BADENDIANNESS,
      ERROR_DFA_BADRESTART: this.module.PCRE_ERROR_DFA_BADRESTART,
      ERROR_JIT_BADOPTION: this.module.PCRE_ERROR_JIT_BADOPTION,
      ERROR_BADLENGTH: this.module.PCRE_ERROR_BADLENGTH,
      ERROR_UNSET: this.module.PCRE_ERROR_UNSET,
    };
  }
}

// Export the module creation function as default
export default createPCREModule;
