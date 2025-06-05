// Enhanced error handling utilities for libpcre-ts
// Addresses edge cases and provides better error context

export class PCREError extends Error {
    public readonly code: string;
    public readonly offset?: number;
    public readonly pattern?: string;

    constructor(message: string, code: string = 'PCRE_ERROR', offset?: number, pattern?: string) {
        super(message);
        this.name = 'PCREError';
        this.code = code;
        this.offset = offset;
        this.pattern = pattern;
    }

    static fromNativeError(error: any, pattern?: string): PCREError {
        if (error && typeof error.message === 'string') {
            // Extract offset information from PCRE error messages
            const offsetMatch = error.message.match(/at offset (\d+)/);
            const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : undefined;
            
            // Extract error type
            let code = 'PCRE_ERROR';
            if (error.message.includes('compilation failed')) {
                code = 'PCRE_COMPILATION_ERROR';
            } else if (error.message.includes('study failed')) {
                code = 'PCRE_STUDY_ERROR';
            }
            
            return new PCREError(error.message, code, offset, pattern);
        }
        
        // Fallback for unexpected error types
        return new PCREError(
            `Unexpected PCRE error: ${error}`,
            'PCRE_UNKNOWN_ERROR',
            undefined,
            pattern
        );
    }
}

export function wrapCompileError<T>(fn: () => T, pattern?: string): T {
    try {
        return fn();
    } catch (error) {
        throw PCREError.fromNativeError(error, pattern);
    }
}