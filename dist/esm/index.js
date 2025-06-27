// TypeScript implementation for the PCRE convenience class
import createPCREModule from './libpcre-npm';
export class PCRE {
    constructor() {
        this.module = null;
    }
    /**
     * Initialize the PCRE module
     * @returns Promise that resolves when the module is ready
     */
    async init() {
        const result = await createPCREModule();
        this.module = result;
    }
    /**
     * Create a new regex pattern
     * @param pattern The regex pattern string
     * @param options PCRE options flags
     * @returns A new PCRERegex instance
     */
    compile(pattern, options = 0) {
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
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
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
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
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
        return this.module.quickMatch(pattern, subject, options);
    }
    /**
     * Get PCRE version information
     * @returns Version number
     */
    getVersion() {
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
        return this.module.getVersion();
    }
    /**
     * Get PCRE version string
     * @returns Version string
     */
    getVersionString() {
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
        return this.module.getVersionString();
    }
    /**
     * Get PCRE configuration information
     * @returns Configuration object
     */
    getConfig() {
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
        return this.module.getConfigInfo();
    }
    /**
     * Access to all PCRE constants
     */
    get constants() {
        if (!this.module)
            throw new Error('PCRE module not initialized. Call init() first.');
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
