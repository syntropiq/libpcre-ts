import createPCREModule from './libpcre-npm';
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
    getNamedGroups(): {
        [name: string]: number;
    };
    globalMatch(subject: string): PCREMatch[][];
    replace(subject: string, replacement: string, global?: boolean): string;
    getPattern(): string;
    getOptions(): number;
}
export declare class PCRE {
    private module;
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
    get constants(): PCREConstants;
}
export default createPCREModule;
