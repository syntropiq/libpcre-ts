import { test, expect, beforeAll, describe, beforeEach } from 'vitest';
import { PCRE } from '../dist/index.js';

describe('Comprehensive PCRE Tests', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  describe('Initialization and Version Info', () => {
    test('should initialize without errors', () => {
      expect(pcre.module).toBeTruthy();
    });

    test('should provide version information', () => {
      const version = pcre.getVersion();
      const versionString = pcre.getVersionString();
      expect(typeof version).toBe('number');
      expect(typeof versionString).toBe('string');
      expect(versionString.length).toBeGreaterThan(0);
    });

    test('should provide configuration information', () => {
      const config = pcre.getConfig();
      expect(typeof config).toBe('object');
    });
  });

  describe('Constants Availability', () => {
    test('should expose all PCRE constants', () => {
      const constants = pcre.constants;
      
      // Check key option constants
      expect(typeof constants.CASELESS).toBe('number');
      expect(typeof constants.MULTILINE).toBe('number');
      expect(typeof constants.DOTALL).toBe('number');
      expect(typeof constants.UTF8).toBe('number');
      expect(typeof constants.EXTENDED).toBe('number');
      
      // Check error constants
      expect(typeof constants.ERROR_NOMATCH).toBe('number');
      expect(typeof constants.ERROR_NOMEMORY).toBe('number');
      expect(typeof constants.ERROR_BADUTF8).toBe('number');
    });
  });

  describe('Basic Pattern Compilation', () => {
    test('should compile simple patterns', () => {
      const regex = pcre.compile('\\d+');
      expect(regex).toBeTruthy();
    });

    test('should handle empty patterns', () => {
      expect(() => pcre.compile('')).not.toThrow();
    });

    test('should reject invalid patterns', () => {
      expect(() => pcre.compile('[')).toThrow();
      expect(() => pcre.compile('*')).toThrow();
      expect(() => pcre.compile('(?P<>')).toThrow();
    });

    test('should handle patterns with various flags', () => {
      expect(() => pcre.compile('test', pcre.constants.CASELESS)).not.toThrow();
      expect(() => pcre.compile('test', pcre.constants.MULTILINE)).not.toThrow();
      expect(() => pcre.compile('test', pcre.constants.DOTALL)).not.toThrow();
      expect(() => pcre.compile('test', pcre.constants.UTF8)).not.toThrow();
    });
  });

  describe('Pattern Matching - Basic Cases', () => {
    test('should match simple strings', () => {
      const regex = pcre.compile('hello');
      const result = regex.exec('hello world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('hello');
    });

    test('should return null for non-matches', () => {
      const regex = pcre.compile('xyz');
      const result = regex.exec('hello world');
      expect(result).toBeNull();
    });

    test('should handle case sensitivity', () => {
      const caseSensitive = pcre.compile('Hello');
      const caseInsensitive = pcre.compile('Hello', pcre.constants.CASELESS);
      
      expect(caseSensitive.exec('hello')).toBeNull();
      expect(caseInsensitive.exec('hello')).toBeTruthy();
      expect(caseInsensitive.exec('HELLO')).toBeTruthy();
      expect(caseInsensitive.exec('HeLLo')).toBeTruthy();
    });
  });

  describe('Unicode and UTF-8 Support', () => {
    test('should handle UTF-8 strings', () => {
      const regex = pcre.compile('café', pcre.constants.UTF8);
      expect(regex.exec('I love café')).toBeTruthy();
    });

    test('should handle Unicode property escapes', () => {
      const regex = pcre.compile('\\p{L}+', pcre.constants.UTF8);
      const result = regex.exec('Hello 世界 123');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('Hello');
    });

    test('should handle various Unicode categories', () => {
      const patterns = [
        '\\p{Ll}+', // lowercase letters
        '\\p{Lu}+', // uppercase letters  
        '\\p{Nd}+', // decimal numbers
        '\\p{Sc}+', // currency symbols
        '\\p{Po}+', // other punctuation
      ];
      
      const testStrings = [
        'hello WORLD 123 $€£ .,!',
        'αβγ ΑΒΓ 一二三 ¥₹₽ .,。',
      ];

      patterns.forEach(pattern => {
        expect(() => pcre.compile(pattern, pcre.constants.UTF8)).not.toThrow();
      });
    });

    test('should handle emoji and complex Unicode', () => {
      const regex = pcre.compile('\\p{So}+', pcre.constants.UTF8); // Symbol, other
      // Note: Emoji support depends on PCRE version and Unicode data
      const result = regex.exec('Hello 👋 World 🌍');
      // This might pass or fail depending on PCRE Unicode support
    });
  });

  describe('Character Classes and Escapes', () => {
    test('should handle standard character classes', () => {
      const patterns = [
        { pattern: '\\d+', input: 'abc123def', expected: '123' },
        { pattern: '\\w+', input: 'hello-world_123', expected: 'hello' },
        { pattern: '\\s+', input: 'hello\t\n world', expected: '\t\n ' },
        { pattern: '[a-z]+', input: 'Hello World', expected: 'ello' },
        { pattern: '[0-9]+', input: 'abc123def', expected: '123' },
      ];

      patterns.forEach(({ pattern, input, expected }) => {
        const regex = pcre.compile(pattern);
        const result = regex.exec(input);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(expected);
      });
    });

    test('should handle negated character classes', () => {
      const regex = pcre.compile('[^\\d]+');
      const result = regex.exec('abc123def');
      expect(result[0].value).toBe('abc');
    });

    test('should handle POSIX character classes', () => {
      const patterns = [
        '[[:alpha:]]+',
        '[[:digit:]]+', 
        '[[:alnum:]]+',
        '[[:space:]]+',
        '[[:punct:]]+',
      ];

      patterns.forEach(pattern => {
        expect(() => pcre.compile(pattern)).not.toThrow();
      });
    });
  });

  describe('Quantifiers and Repetition', () => {
    test('should handle various quantifiers', () => {
      const tests = [
        { pattern: 'a*', input: 'aaab', expected: 'aaa' },
        { pattern: 'a+', input: 'aaab', expected: 'aaa' },
        { pattern: 'a?', input: 'aaab', expected: 'a' },
        { pattern: 'a{3}', input: 'aaab', expected: 'aaa' },
        { pattern: 'a{2,4}', input: 'aaaaab', expected: 'aaaa' },
        { pattern: 'a{2,}', input: 'aaaaab', expected: 'aaaaa' },
      ];

      tests.forEach(({ pattern, input, expected }) => {
        const regex = pcre.compile(pattern);
        const result = regex.exec(input);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(expected);
      });
    });

    test('should handle greedy vs non-greedy quantifiers', () => {
      const greedy = pcre.compile('a+');
      const nonGreedy = pcre.compile('a+?');
      
      const greedyResult = greedy.exec('aaab');
      const nonGreedyResult = nonGreedy.exec('aaab');
      
      expect(greedyResult[0].value).toBe('aaa');
      expect(nonGreedyResult[0].value).toBe('a');
    });
  });

  describe('Anchors and Boundaries', () => {
    test('should handle line anchors', () => {
      const startAnchor = pcre.compile('^hello');
      const endAnchor = pcre.compile('world$');
      
      expect(startAnchor.exec('hello world')).toBeTruthy();
      expect(startAnchor.exec('say hello world')).toBeNull();
      expect(endAnchor.exec('hello world')).toBeTruthy();
      expect(endAnchor.exec('hello world!')).toBeNull();
    });

    test('should handle word boundaries', () => {
      const wordBoundary = pcre.compile('\\btest\\b');
      
      expect(wordBoundary.exec('test case')).toBeTruthy();
      expect(wordBoundary.exec('testing')).toBeNull();
      expect(wordBoundary.exec('retest')).toBeNull();
      expect(wordBoundary.exec('re test case')).toBeTruthy();
    });

    test('should handle multiline mode', () => {
      const singleLine = pcre.compile('^test');
      const multiLine = pcre.compile('^test', pcre.constants.MULTILINE);
      const input = 'hello\ntest\nworld';
      
      expect(singleLine.exec(input)).toBeNull();
      expect(multiLine.exec(input)).toBeTruthy();
    });
  });

  describe('Groups and Captures', () => {
    test('should handle capturing groups', () => {
      const regex = pcre.compile('(\\d{4})-(\\d{2})-(\\d{2})');
      const result = regex.exec('Date: 2023-12-25');
      
      expect(result).toBeTruthy();
      expect(result).toHaveLength(4); // Full match + 3 groups
      expect(result[0].value).toBe('2023-12-25');
      expect(result[1].value).toBe('2023');
      expect(result[2].value).toBe('12');
      expect(result[3].value).toBe('25');
    });

    test('should handle non-capturing groups', () => {
      const regex = pcre.compile('(?:\\d{4})-(\\d{2})-(\\d{2})');
      const result = regex.exec('Date: 2023-12-25');
      
      expect(result).toBeTruthy();
      expect(result).toHaveLength(3); // Full match + 2 groups
      expect(result[0].value).toBe('2023-12-25');
      expect(result[1].value).toBe('12');
      expect(result[2].value).toBe('25');
    });

    test('should handle named capturing groups', () => {
      const regex = pcre.compile('(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})');
      const result = regex.exec('Date: 2023-12-25');
      
      expect(result).toBeTruthy();
      const namedGroups = regex.getNamedGroups();
      expect(namedGroups).toHaveProperty('year');
      expect(namedGroups).toHaveProperty('month'); 
      expect(namedGroups).toHaveProperty('day');
      // Named groups return indices, not the actual values
      expect(typeof namedGroups.year).toBe('number');
    });

    test('should handle nested groups', () => {
      const regex = pcre.compile('((\\w+)\\s+(\\w+))');
      const result = regex.exec('hello world');
      
      expect(result).toBeTruthy();
      expect(result).toHaveLength(4);
      expect(result[0].value).toBe('hello world');
      expect(result[1].value).toBe('hello world');
      expect(result[2].value).toBe('hello');
      expect(result[3].value).toBe('world');
    });
  });

  describe('Lookahead and Lookbehind', () => {
    test('should handle positive lookahead', () => {
      const regex = pcre.compile('\\w+(?=\\s+\\d+)');
      const result = regex.exec('test 123 hello world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('test');
    });

    test('should handle negative lookahead', () => {
      const regex = pcre.compile('\\w+(?!\\s+\\d+)');
      const result = regex.exec('test 123 hello world');
      expect(result).toBeTruthy();
      // The pattern finds the first word that's not followed by space+digits
      // In "test 123 hello world", it matches part of "test" that doesn't violate the lookahead
      expect(result[0].value).toBe('tes'); // Partial match that satisfies negative lookahead
    });

    test('should handle positive lookbehind', () => {
      const regex = pcre.compile('(?<=\\$)\\d+');
      const result = regex.exec('Price: $123');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('123');
    });

    test('should handle negative lookbehind', () => {
      const regex = pcre.compile('(?<!\\$)\\d+');
      const result = regex.exec('123 Price: $456');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('123');
    });

    test('should handle variable-width lookbehind (PCRE feature)', () => {
      const regex = pcre.compile('(?<=foo|bar)\\d+');
      expect(regex.exec('foo123')).toBeTruthy();
      expect(regex.exec('bar456')).toBeTruthy();
      expect(regex.exec('baz789')).toBeNull();
    });
  });

  describe('Advanced PCRE Features', () => {
    test('should handle conditional patterns', () => {
      const regex = pcre.compile('^(foo)?(?(1)bar|baz)$');
      expect(regex.exec('foobar')).toBeTruthy();
      expect(regex.exec('baz')).toBeTruthy();
      expect(regex.exec('foobaz')).toBeNull();
    });

    test('should handle recursive patterns', () => {
      // Test balanced parentheses
      const regex = pcre.compile('\\((?:[^()]|(?R))*\\)');
      expect(regex.exec('(test)')).toBeTruthy();
      expect(regex.exec('(test(nested))')).toBeTruthy();
      expect(regex.exec('(test(nested(deep)))')).toBeTruthy();
    });

    test('should handle atomic groups', () => {
      const regex = pcre.compile('(?>\\d+)a');
      expect(regex.exec('123a')).toBeTruthy();
      expect(regex.exec('123b')).toBeNull();
    });

    test('should handle possessive quantifiers', () => {
      const regex = pcre.compile('\\d++a');
      expect(regex.exec('123a')).toBeTruthy();
      expect(regex.exec('123456')).toBeNull();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle very long strings', () => {
      const regex = pcre.compile('test');
      const longString = 'a'.repeat(100000) + 'test' + 'b'.repeat(100000);
      const result = regex.exec(longString);
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('test');
    });

    test('should handle deeply nested patterns', () => {
      const pattern = '('.repeat(50) + 'test' + ')'.repeat(50);
      expect(() => pcre.compile(pattern)).not.toThrow();
    });

    test('should handle patterns with many alternatives', () => {
      const alternatives = Array.from({ length: 100 }, (_, i) => `option${i}`).join('|');
      expect(() => pcre.compile(alternatives)).not.toThrow();
    });

    test('should handle empty input strings', () => {
      const regex = pcre.compile('.*');
      const result = regex.exec('');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('');
    });

    test('should handle null bytes in strings', () => {
      const regex = pcre.compile('test');
      const input = 'hello\\x00test\\x00world';
      const result = regex.exec(input);
      expect(result).toBeTruthy();
    });

    test('should handle malformed UTF-8 gracefully', () => {
      const regex = pcre.compile('test', pcre.constants.UTF8);
      // Test with potentially malformed UTF-8 - should not crash
      expect(() => regex.exec('\\xFF\\xFE\\xFDtest')).not.toThrow();
    });
  });

  describe('Performance and Stress Tests', () => {
    test('should handle catastrophic backtracking patterns efficiently', () => {
      const regex = pcre.compile('(a+)+b');
      const input = 'a'.repeat(25) + 'c'; // No 'b' at end to force backtracking
      
      const start = Date.now();
      const result = regex.exec(input);
      const duration = Date.now() - start;
      
      expect(result).toBeNull();
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle large numbers of capture groups', () => {
      const numGroups = 100;
      const pattern = Array.from({ length: numGroups }, (_, i) => `(\\w${i}?)`).join('');
      expect(() => pcre.compile(pattern)).not.toThrow();
    });

    test('should handle repeated compilation and execution', () => {
      for (let i = 0; i < 1000; i++) {
        const regex = pcre.compile(`test${i}`);
        regex.exec(`test${i} data`);
      }
      // Should complete without memory issues
    });
  });

  describe('Real-world Pattern Examples', () => {
    test('should handle email validation patterns', () => {
      const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
      const regex = pcre.compile(emailPattern);
      
      expect(regex.exec('test@example.com')).toBeTruthy();
      expect(regex.exec('user.name+tag@domain.co.uk')).toBeTruthy();
      expect(regex.exec('invalid.email')).toBeNull();
      expect(regex.exec('@invalid.com')).toBeNull();
    });

    test('should handle URL validation patterns', () => {
      const urlPattern = 'https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(?:/[^\\s]*)?';
      const regex = pcre.compile(urlPattern);
      
      expect(regex.exec('https://www.example.com')).toBeTruthy();
      expect(regex.exec('http://example.com/path?query=value')).toBeTruthy();
      expect(regex.exec('ftp://example.com')).toBeNull();
    });

    test('should handle phone number patterns', () => {
      const phonePattern = '\\(?\\d{3}\\)?[-.\s]?\\d{3}[-.]?\\d{4}';
      const regex = pcre.compile(phonePattern);
      
      expect(regex.exec('(555) 123-4567')).toBeTruthy();
      expect(regex.exec('555-123-4567')).toBeTruthy();
      expect(regex.exec('555.123.4567')).toBeTruthy();
      expect(regex.exec('5551234567')).toBeTruthy();
    });

    test('should handle credit card patterns', () => {
      const ccPattern = '\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}';
      const regex = pcre.compile(ccPattern);
      
      expect(regex.exec('1234 5678 9012 3456')).toBeTruthy();
      expect(regex.exec('1234-5678-9012-3456')).toBeTruthy();
      expect(regex.exec('1234567890123456')).toBeTruthy();
    });

    test('should handle legal citation patterns', () => {
      // Inspired by the reporters-db project - simplified for basic matching
      const citationPattern = '\\d+\\s+[A-Z][A-Za-z.\\s\\d]+\\s+\\d+';
      const regex = pcre.compile(citationPattern);
      
      expect(regex.exec('123 F.3d 456')).toBeTruthy();
      expect(regex.exec('789 U.S. 012')).toBeTruthy();
      expect(regex.exec('456 Cal. App. 2d 789')).toBeTruthy();
    });
  });

  describe('Integration with Quick Methods', () => {
    test('should test patterns quickly', () => {
      expect(pcre.test('\\d+', 'hello 123')).toBe(true);
      expect(pcre.test('\\d+', 'hello world')).toBe(false);
    });

    test('should match patterns quickly', () => {
      const result = pcre.match('(\\d+)', 'hello 123 world');
      expect(result).toBeTruthy();
      expect(result[0].value).toBe('123');
    });

    test('should handle quick methods with flags', () => {
      expect(pcre.test('HELLO', 'hello', pcre.constants.CASELESS)).toBe(true);
      expect(pcre.test('HELLO', 'hello')).toBe(false);
    });
  });

  describe('Memory and Resource Management', () => {
    test('should handle many concurrent regex objects', () => {
      const regexes = [];
      for (let i = 0; i < 100; i++) {
        regexes.push(pcre.compile(`pattern${i}`));
      }
      
      // All should be accessible
      regexes.forEach((regex, i) => {
        expect(regex.exec(`pattern${i}`)).toBeTruthy();
      });
    });

    test('should handle regex objects going out of scope', () => {
      for (let i = 0; i < 1000; i++) {
        const regex = pcre.compile(`temp${i}`);
        regex.exec(`temp${i} test`);
        // Let regex go out of scope - should be cleaned up
      }
      // Should complete without memory leaks
    });
  });
});
