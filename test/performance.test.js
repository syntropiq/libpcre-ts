/**
 * OPTIONAL PERFORMANCE TESTS
 * 
 * These tests are machine-dependent and do not run by default.
 * They measure relative performance characteristics, not absolute benchmarks.
 * Results will vary significantly based on:
 * - Hardware capabilities (CPU, memory)
 * - System load and background processes
 * - Node.js version and V8 optimizations
 * - Operating system and architecture
 * 
 * To run these tests:
 * npm run test:performance
 * 
 * Or to include them in regular test runs, remove the .skip from describe.skip below
 */

import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../dist/index.js';

// Performance tests are optional and machine-dependent
// Run with: npm run test:performance
// These tests measure relative performance, not absolute benchmarks
// Results will vary significantly based on hardware and system load
describe.skip('PCRE Performance Benchmarks (Optional)', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  describe('Compilation Performance', () => {
    test('should compile simple patterns quickly', () => {
      const patterns = [
        'test',
        '\\d+',
        '[a-z]+',
        '\\w+@\\w+\\.\\w+',
        '\\b\\w{5,}\\b',
      ];

      const start = Date.now();
      patterns.forEach(pattern => {
        pcre.compile(pattern);
      });
      const duration = Date.now() - start;
      
      console.log(`Compiled ${patterns.length} simple patterns in ${duration}ms`);
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    test('should compile complex patterns efficiently', () => {
      const complexPatterns = [
        '^(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])$',
        '^https?://(?:[-\\w.])+(?:\\:[0-9]+)?(?:/(?:[\\w/_.])*(?:\\?(?:[\\w&=%.])*)?(?:\\#(?:[\\w.])*)?)?$',
        '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        '^\\+?[1-9]\\d{1,14}$',
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      ];

      const start = Date.now();
      complexPatterns.forEach(pattern => {
        pcre.compile(pattern);
      });
      const duration = Date.now() - start;
      
      console.log(`Compiled ${complexPatterns.length} complex patterns in ${duration}ms`);
      expect(duration).toBeLessThan(500); // Should complete within reasonable time
    });

    test('should handle pattern compilation caching effectively', () => {
      const pattern = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
      
      // First compilation
      const start1 = Date.now();
      for (let i = 0; i < 1000; i++) {
        pcre.compile(pattern);
      }
      const duration1 = Date.now() - start1;
      
      console.log(`1000 pattern compilations: ${duration1}ms (${duration1/1000}ms per compilation)`);
      expect(duration1).toBeLessThan(5000); // Should not be excessive
    });
  });

  describe('Execution Performance', () => {
    test('should execute matches on small strings quickly', () => {
      const regex = pcre.compile('\\b\\w{5,}\\b');
      const testStrings = [
        'hello world',
        'testing performance',
        'quick brown fox',
        'performance benchmarking',
        'regular expression matching',
      ];

      const start = Date.now();
      testStrings.forEach(str => {
        for (let i = 0; i < 1000; i++) {
          regex.exec(str);
        }
      });
      const duration = Date.now() - start;
      
      console.log(`5000 small string matches in ${duration}ms`);
      expect(duration).toBeLessThan(1000);
    });

    test('should scale linearly with input size', () => {
      const regex = pcre.compile('performance');
      const baseSizes = [100, 1000, 10000, 100000];
      const results = [];

      baseSizes.forEach(size => {
        const text = 'test '.repeat(size / 5) + 'performance test';
        
        const start = Date.now();
        for (let i = 0; i < 100; i++) {
          regex.exec(text);
        }
        const duration = Date.now() - start;
        
        results.push({ size, duration });
        console.log(`Size ${size}: ${duration}ms for 100 matches`);
      });

      // Check that performance scales reasonably
      for (let i = 1; i < results.length; i++) {
        const ratio = results[i].size / results[i-1].size;
        const timeRatio = results[i].duration / results[i-1].duration;
        
        // Time should not increase more than linearly with size
        expect(timeRatio).toBeLessThan(ratio * 2);
      }
    });

    test('should handle many capture groups efficiently', () => {
      const numGroups = 50;
      const pattern = Array.from({ length: numGroups }, (_, i) => `(\\w${i % 10}?)`).join('');
      const regex = pcre.compile(pattern);
      const testString = Array.from({ length: numGroups }, (_, i) => `w${i % 10}`).join('');

      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        const result = regex.exec(testString);
        if (result) {
          // Access all capture groups to ensure they're processed
          for (let j = 1; j <= numGroups; j++) {
            result[j];
          }
        }
      }
      const duration = Date.now() - start;

      console.log(`1000 matches with ${numGroups} groups: ${duration}ms`);
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Memory Performance', () => {
    test('should maintain stable memory usage', () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Create and use many regex objects
      for (let round = 0; round < 10; round++) {
        const regexes = [];
        
        for (let i = 0; i < 100; i++) {
          regexes.push(pcre.compile(`pattern${round}_${i}`));
        }
        
        regexes.forEach((regex, i) => {
          regex.exec(`test pattern${round}_${i} data`);
        });
        
        // Force garbage collection if available
        if (global.gc && round % 3 === 0) {
          global.gc();
        }
      }
      
      // Final garbage collection
      if (global.gc) global.gc();
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB limit
    });

    test('should handle rapid object creation and destruction', () => {
      const start = Date.now();
      
      for (let i = 0; i < 10000; i++) {
        const regex = pcre.compile('test\\d+');
        regex.exec(`test${i}`);
        // Let regex go out of scope for GC
      }
      
      const duration = Date.now() - start;
      console.log(`10000 rapid create/destroy cycles: ${duration}ms`);
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Throughput Benchmarks', () => {
    test('should achieve high throughput for email validation', () => {
      const emailRegex = pcre.compile('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
      const emails = Array.from({ length: 10000 }, (_, i) => 
        `user${i}@domain${i % 1000}.com`
      );

      const start = Date.now();
      let validCount = 0;
      
      emails.forEach(email => {
        if (emailRegex.exec(email)) {
          validCount++;
        }
      });
      
      const duration = Date.now() - start;
      const throughput = emails.length / duration * 1000; // emails per second
      
      console.log(`Email validation: ${emails.length} emails in ${duration}ms (${Math.round(throughput)} emails/sec)`);
      expect(throughput).toBeGreaterThan(5000); // Should process at least 5000 emails/sec
      expect(validCount).toBe(emails.length);
    });

    test('should achieve high throughput for log parsing', () => {
      const logRegex = pcre.compile('^(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:\\d{2}:\\d{2})\\s+\\[(\\w+)\\]\\s+(.+)$');
      const logs = Array.from({ length: 5000 }, (_, i) => 
        `2023-12-25 10:${String(Math.floor(i/60) % 60).padStart(2, '0')}:${String(i % 60).padStart(2, '0')} [INFO] Log message ${i}`
      );

      const start = Date.now();
      let parsedCount = 0;
      
      logs.forEach(log => {
        const result = logRegex.exec(log);
        if (result) {
          parsedCount++;
          // Access groups to ensure full parsing
          result[1].value; // date
          result[2].value; // time  
          result[3].value; // level
          result[4].value; // message
        }
      });
      
      const duration = Date.now() - start;
      const throughput = logs.length / duration * 1000;
      
      console.log(`Log parsing: ${logs.length} logs in ${duration}ms (${Math.round(throughput)} logs/sec)`);
      expect(throughput).toBeGreaterThan(2000); // Should process at least 2000 logs/sec
      expect(parsedCount).toBe(logs.length);
    });

    test('should achieve high throughput for text search', () => {
      const searchRegex = pcre.compile('\\b(performance|benchmark|test|regex|pattern)\\b', pcre.constants.CASELESS);
      const text = `
        This is a performance test document that contains many instances of 
        benchmark keywords. We are testing the regex pattern matching 
        capabilities and looking for performance optimization opportunities.
        The test should run efficiently and demonstrate good benchmark results.
        Pattern matching is crucial for text processing performance.
      `.repeat(1000); // Create large text

      const start = Date.now();
      let matchCount = 0;
      let lastIndex = 0;
      let result;
      
      while ((result = searchRegex.exec(text.substring(lastIndex))) !== null) {
        matchCount++;
        lastIndex += result.index + result[0].value.length;
        if (lastIndex >= text.length) break;
      }
      
      const duration = Date.now() - start;
      const throughput = text.length / duration * 1000; // characters per second
      
      console.log(`Text search: ${text.length} chars, ${matchCount} matches in ${duration}ms (${Math.round(throughput/1000)}K chars/sec)`);
      expect(throughput).toBeGreaterThan(100000); // Should process at least 100K chars/sec
      expect(matchCount).toBeGreaterThan(0);
    });
  });

  describe('Stress Test Performance', () => {
    test('should handle stress patterns without exponential slowdown', () => {
      const stressPatterns = [
        { name: 'Alternation stress', pattern: Array.from({length: 100}, (_, i) => `option${i}`).join('|'), input: 'option50' },
        { name: 'Quantifier stress', pattern: 'a{1,1000}', input: 'a'.repeat(500) },
        { name: 'Character class stress', pattern: '[a-zA-Z0-9]{10,50}', input: 'abc123XYZ789def456GHI' },
        { name: 'Group stress', pattern: '(' + Array.from({length: 20}, () => '\\w+').join(')\\s+(') + ')', input: Array.from({length: 20}, (_, i) => `word${i}`).join(' ') },
      ];

      stressPatterns.forEach(({ name, pattern, input }) => {
        const regex = pcre.compile(pattern);
        
        const start = Date.now();
        for (let i = 0; i < 1000; i++) {
          regex.exec(input);
        }
        const duration = Date.now() - start;
        
        console.log(`${name}: 1000 executions in ${duration}ms`);
        expect(duration).toBeLessThan(2000); // Should not be excessive
      });
    });

    test('should maintain performance under concurrent load', () => {
      const pattern = '\\b\\w{5,}@\\w+\\.\\w{2,}\\b';
      const regex = pcre.compile(pattern);
      const testData = Array.from({ length: 1000 }, (_, i) => 
        `user${i}@domain${i % 100}.com test${i} more content here`
      );

      const start = Date.now();
      
      // Simulate concurrent usage
      const promises = testData.map(async (data, i) => {
        // Add some variability in timing
        await new Promise(resolve => setTimeout(resolve, i % 10));
        return regex.exec(data);
      });

      return Promise.all(promises).then(results => {
        const duration = Date.now() - start;
        const validResults = results.filter(r => r !== null).length;
        
        console.log(`Concurrent load: ${testData.length} operations in ${duration}ms, ${validResults} matches`);
        expect(validResults).toBeGreaterThan(900); // Most should match
        expect(duration).toBeLessThan(5000); // Should complete in reasonable time
      });
    });
  });

  describe('Comparative Performance', () => {
    test('should compare PCRE vs quick methods performance', () => {
      const pattern = '\\d{3}-\\d{2}-\\d{4}';
      const testStrings = Array.from({ length: 1000 }, (_, i) => 
        `Record ${i}: SSN 123-45-${String(6789 + i).padStart(4, '0')} active`
      );

      // Test compiled regex performance
      const regex = pcre.compile(pattern);
      const start1 = Date.now();
      testStrings.forEach(str => regex.exec(str));
      const compiledDuration = Date.now() - start1;

      // Test quick method performance  
      const start2 = Date.now();
      testStrings.forEach(str => pcre.test(pattern, str));
      const quickDuration = Date.now() - start2;

      console.log(`Compiled regex: ${compiledDuration}ms`);
      console.log(`Quick test: ${quickDuration}ms`);
      console.log(`Speedup: ${(quickDuration/compiledDuration).toFixed(2)}x`);

      // Compiled should generally be faster for repeated use
      expect(compiledDuration).toBeLessThan(quickDuration * 2);
    });

    test('should measure pattern complexity impact', () => {
      const complexityLevels = [
        { name: 'Simple', pattern: 'test', iterations: 10000 },
        { name: 'Medium', pattern: '\\b\\w{5,}\\b', iterations: 5000 },
        { name: 'Complex', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$', iterations: 1000 },
        { name: 'Very Complex', pattern: '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$', iterations: 500 },
      ];

      complexityLevels.forEach(({ name, pattern, iterations }) => {
        const regex = pcre.compile(pattern);
        const testString = 'test123Password@example.com';
        
        const start = Date.now();
        for (let i = 0; i < iterations; i++) {
          regex.exec(testString);
        }
        const duration = Date.now() - start;
        const perMatch = duration / iterations;
        
        console.log(`${name}: ${iterations} matches in ${duration}ms (${perMatch.toFixed(3)}ms per match)`);
        expect(duration).toBeLessThan(5000); // All should complete reasonably
      });
    });
  });
});

/*
 * TO ENABLE PERFORMANCE TESTS:
 * 
 * 1. Remove .skip from the describe.skip above
 * 2. Run: npm run test:performance
 * 
 * Or to include in regular tests:
 * 1. Remove .skip from describe.skip
 * 2. Run: npm test
 * 
 * Note: Performance results are highly machine-dependent and should
 * be used for relative comparisons rather than absolute benchmarks.
 */