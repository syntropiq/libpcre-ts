import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../dist/index.js';

describe('PCRE Legal Citation and Real-world Pattern Tests', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  describe('Legal Citation Patterns (Inspired by reporters-db)', () => {
    test('should handle Federal Reporter citations', () => {
      const pattern = '(\\d+)\\s+F\\.\\s*(2d|3d)?\\s+(\\d+)';
      const regex = pcre.compile(pattern);
      
      const testCases = [
        { input: '123 F. 456', expected: ['123 F. 456', '123', undefined, '456'] },
        { input: '789 F.2d 012', expected: ['789 F.2d 012', '789', '2d', '012'] },
        { input: '345 F.3d 678', expected: ['345 F.3d 678', '345', '3d', '678'] },
        { input: '567 F. Supp. 890', expected: null }, // Should not match F. Supp.
      ];

      testCases.forEach(({ input, expected }) => {
        const result = regex.exec(input);
        if (expected) {
          expect(result).toBeTruthy();
          expect(result[0].value).toBe(expected[0]);
          expect(result[1].value).toBe(expected[1]);
          if (expected[2]) expect(result[2].value).toBe(expected[2]);
          expect(result[3].value).toBe(expected[3]);
        } else {
          expect(result).toBeNull();
        }
      });
    });

    test('should handle Supreme Court citations', () => {
      const pattern = '(\\d+)\\s+U\\.?S\\.?\\s+(\\d+)';
      const regex = pcre.compile(pattern);
      
      const testCases = [
        '410 U.S. 113',
        '347 US 483',
        '163 U. S. 537',
        '558 U.S. 310',
      ];

      testCases.forEach(input => {
        const result = regex.exec(input);
        expect(result).toBeTruthy();
        console.log(`Supreme Court: ${input} -> ${result[0].value}`);
      });
    });

    test('should handle state court citations with complex abbreviations', () => {
      const statePatterns = [
        { name: 'California', pattern: '(\\d+)\\s+Cal\\.?\\s*(App\\.?\\s*)?(\\d+d)?\\s+(\\d+)' },
        { name: 'New York', pattern: '(\\d+)\\s+N\\.?Y\\.?\\s*(\\d+d)?\\s+(\\d+)' },
        { name: 'Illinois', pattern: '(\\d+)\\s+Ill\\.?\\s*(App\\.?\\s*)?(\\d+d)?\\s+(\\d+)' },
        { name: 'Texas', pattern: '(\\d+)\\s+Tex\\.?\\s*(App\\.?\\s*)?(\\d+)?\\s+(\\d+)' },
      ];

      const testData = [
        { state: 'California', citations: ['123 Cal. 456', '789 Cal. App. 2d 012', '345 Cal. 3d 678'] },
        { state: 'New York', citations: ['234 N.Y. 567', '890 N.Y.2d 123', '456 NY 789'] },
        { state: 'Illinois', citations: ['345 Ill. 678', '901 Ill. App. 234', '567 Ill. 2d 890'] },
        { state: 'Texas', citations: ['456 Tex. 789', '123 Tex. App. 456', '789 Tex. 012'] },
      ];

      statePatterns.forEach(({ name, pattern }) => {
        const regex = pcre.compile(pattern);
        const stateData = testData.find(d => d.state === name);
        
        stateData.citations.forEach(citation => {
          const result = regex.exec(citation);
          expect(result).toBeTruthy();
          console.log(`${name}: ${citation} -> ${result[0].value}`);
        });
      });
    });

    test('should handle pinpoint citations with complex formatting', () => {
      const pinpointPattern = '(\\d+)\\s+([A-Z][a-z.\\s]+?)\\s+(\\d+),?\\s+(\\d+)(?:-\\d+)?(?:\\s+\\(([^)]+)\\))?';
      const regex = pcre.compile(pinpointPattern);
      
      const pinpointCitations = [
        '410 U.S. 113, 153',
        '347 U.S. 483, 495-96',
        '123 F.3d 456, 789 (9th Cir. 1999)',
        '234 Cal. App. 4th 567, 890 (2010)',
        '345 N.Y.2d 678, 901-05 (App. Div. 2015)',
      ];

      pinpointCitations.forEach(citation => {
        const result = regex.exec(citation);
        expect(result).toBeTruthy();
        console.log(`Pinpoint: ${citation} -> volume: ${result[1].value}, reporter: ${result[2].value}, page: ${result[3].value}, pinpoint: ${result[4].value}`);
      });
    });

    test('should handle law review and journal citations', () => {
      const journalPattern = '(\\d+)\\s+([A-Z][a-z.\\s&]+?)\\s+L\\.?\\s*Rev\\.?\\s+(\\d+)(?:\\s+\\((\\d{4})\\))?';
      const regex = pcre.compile(journalPattern);
      
      const journalCitations = [
        '85 Harv. L. Rev. 1089',
        '123 Yale L.J. 456 (2010)',
        '67 U. Chi. L. Rev. 234',
        '89 Geo. L.J. 567 (2001)',
        '45 Stan. L. Rev. 678',
      ];

      journalCitations.forEach(citation => {
        const result = regex.exec(citation);
        expect(result).toBeTruthy();
        console.log(`Journal: ${citation} -> ${result[0].value}`);
      });
    });
  });

  describe('Complex Real-world Data Patterns', () => {
    test('should handle email addresses with international domains', () => {
      const emailPattern = '[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*';
      const regex = pcre.compile(emailPattern);
      
      const emails = [
        'user@example.com',
        'test.email+tag@sub.domain.co.uk',
        'user_name@example-site.org',
        'special.chars+test@xn--n3h.com', // IDN domain
        'long.email.address@very.long.domain.name.example.com',
        'user@192.168.1.1', // IP address (should not match this pattern)
      ];

      emails.slice(0, -1).forEach(email => { // Skip IP test
        const result = regex.exec(email);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(email);
      });
    });

    test('should handle phone numbers with international formats', () => {
      const phonePattern = '(?:\\+?1[-\\s]?)?\\(?([0-9]{3})\\)?[-\\s]?([0-9]{3})[-\\s]?([0-9]{4})(?:\\s?ext\\.?\\s?(\\d+))?';
      const regex = pcre.compile(phonePattern);
      
      const phoneNumbers = [
        '(555) 123-4567',
        '555-123-4567',
        '555.123.4567',
        '5551234567',
        '+1 555 123 4567',
        '1-555-123-4567',
        '555 123 4567 ext. 123',
        '(555) 123-4567 ext 456',
      ];

      phoneNumbers.forEach(phone => {
        const result = regex.exec(phone);
        expect(result).toBeTruthy();
        console.log(`Phone: ${phone} -> area: ${result[1].value}, exchange: ${result[2].value}, number: ${result[3].value}`);
      });
    });

    test('should handle complex URL patterns', () => {
      const urlPattern = 'https?://(?:[-\\w.])+(?:\\:[0-9]+)?(?:/(?:[\\w/_.])*(?:\\?(?:[\\w&=%.])*)?(?:\\#(?:[\\w.])*)?)?';
      const regex = pcre.compile(urlPattern);
      
      const urls = [
        'http://example.com',
        'https://www.example.com/path/to/page',
        'http://sub.domain.example.com:8080/path?query=value&other=123#anchor',
        'https://api.service.com/v1/endpoint.json?key=abc123',
        'http://localhost:3000/dev/test',
      ];

      urls.forEach(url => {
        const result = regex.exec(url);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(url);
      });
    });

    test('should handle credit card numbers with various formats', () => {
      const ccPattern = '(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})';
      const regex = pcre.compile(ccPattern);
      
      const creditCards = [
        '4111111111111111',    // Visa
        '5555555555554444',    // MasterCard
        '378282246310005',     // American Express
        '6011111111111117',    // Discover
        '30569309025904',      // Diners Club
      ];

      creditCards.forEach(cc => {
        const result = regex.exec(cc);
        expect(result).toBeTruthy();
        expect(result[0].value).toBe(cc);
      });
    });

    test('should handle social security numbers with privacy masking', () => {
      const ssnPattern = '(?:\\*{3}-?\\*{2}-?|\\d{3}-?\\d{2}-?)(\\d{4})';
      const regex = pcre.compile(ssnPattern);
      
      const ssns = [
        '***-**-1234',
        '***-**1234',
        '123-45-6789', // Full SSN should match last 4
      ];

      ssns.forEach(ssn => {
        const result = regex.exec(ssn);
        expect(result).toBeTruthy();
        console.log(`SSN: ${ssn} -> last four: ${result[1].value}`);
      });
    });
  });

  describe('Document Processing Patterns', () => {
    test('should handle complex date formats', () => {
      const datePatterns = [
        { name: 'ISO 8601', pattern: '(\\d{4})-(\\d{2})-(\\d{2})(?:T(\\d{2}):(\\d{2}):(\\d{2})(?:\\.(\\d{3}))?(?:Z|[+-]\\d{2}:\\d{2})?)?' },
        { name: 'US Format', pattern: '(\\d{1,2})/(\\d{1,2})/(\\d{4})' },
        { name: 'European', pattern: '(\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})' },
        { name: 'Long Format', pattern: '(January|February|March|April|May|June|July|August|September|October|November|December)\\s+(\\d{1,2}),?\\s+(\\d{4})' },
      ];

      const testDates = [
        { format: 'ISO 8601', dates: ['2023-12-25', '2023-12-25T10:30:00Z', '2023-12-25T10:30:00.123+05:30'] },
        { format: 'US Format', dates: ['12/25/2023', '1/1/2024', '12/31/1999'] },
        { format: 'European', dates: ['25.12.2023', '1.1.2024', '31.12.1999'] },
        { format: 'Long Format', dates: ['December 25, 2023', 'January 1 2024', 'March 15, 2022'] },
      ];

      datePatterns.forEach(({ name, pattern }) => {
        const regex = pcre.compile(pattern, pcre.constants.CASELESS);
        const formatData = testDates.find(d => d.format === name);
        
        formatData.dates.forEach(date => {
          const result = regex.exec(date);
          expect(result).toBeTruthy();
          console.log(`${name}: ${date} -> ${result[0].value}`);
        });
      });
    });

    test('should handle currency and financial patterns', () => {
      const currencyPattern = '(?:\\$|USD|€|EUR|£|GBP|¥|JPY|₹|INR)\\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?)';
      const regex = pcre.compile(currencyPattern);
      
      const amounts = [
        '$1,234.56',
        'USD 1000.00',
        '€ 2,500.75',
        '£1,000,000.00',
        '¥150,000',
        '₹50,000.50',
      ];

      amounts.forEach(amount => {
        const result = regex.exec(amount);
        expect(result).toBeTruthy();
        console.log(`Currency: ${amount} -> amount: ${result[1].value}`);
      });
    });

    test('should handle IP addresses and network patterns', () => {
      const ipPatterns = [
        { name: 'IPv4', pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' },
        { name: 'IPv6', pattern: '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}' },
        { name: 'MAC Address', pattern: '(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}' },
      ];

      const networkData = [
        { type: 'IPv4', addresses: ['192.168.1.1', '10.0.0.255', '172.16.254.1', '8.8.8.8'] },
        { type: 'IPv6', addresses: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'fe80:0000:0000:0000:0202:b3ff:fe1e:8329'] },
        { type: 'MAC Address', addresses: ['00:1B:44:11:3A:B7', '00-1B-44-11-3A-B7', 'A0:B1:C2:D3:E4:F5'] },
      ];

      ipPatterns.forEach(({ name, pattern }) => {
        const regex = pcre.compile(pattern, pcre.constants.CASELESS);
        const typeData = networkData.find(d => d.type === name);
        
        typeData.addresses.forEach(address => {
          const result = regex.exec(address);
          expect(result).toBeTruthy();
          console.log(`${name}: ${address} -> ${result[0].value}`);
        });
      });
    });
  });

  describe('Code and Markup Pattern Recognition', () => {
    test('should handle programming language constructs', () => {
      const codePatterns = [
        { name: 'Function calls', pattern: '([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(' },
        { name: 'Variable assignments', pattern: '([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*=\\s*([^;\\n]+)' },
        { name: 'Import statements', pattern: 'import\\s+(?:\\{([^}]+)\\}|([a-zA-Z_$][a-zA-Z0-9_$]*))\\s+from\\s+[\'"]([^\'"]+)[\'"]' },
        { name: 'Hex colors', pattern: '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b' },
      ];

      const codeExamples = [
        { type: 'Function calls', examples: ['console.log()', 'Math.max()', 'myFunction(arg1, arg2)'] },
        { type: 'Variable assignments', examples: ['const x = 5', 'let result = getData()', 'var name = "test"'] },
        { type: 'Import statements', examples: ['import { test } from "vitest"', 'import React from "react"'] },
        { type: 'Hex colors', examples: ['#ff0000', '#FFF', '#123abc', 'color: #deadbf'] },
      ];

      codePatterns.forEach(({ name, pattern }) => {
        const regex = pcre.compile(pattern);
        const examples = codeExamples.find(e => e.type === name);
        
        examples.examples.forEach(code => {
          const result = regex.exec(code);
          expect(result).toBeTruthy();
          console.log(`${name}: "${code}" -> "${result[0].value}"`);
        });
      });
    });

    test('should handle HTML/XML patterns', () => {
      const htmlPattern = '<([a-zA-Z][a-zA-Z0-9]*)[^>]*>([^<]*)</\\1>';
      const regex = pcre.compile(htmlPattern);
      
      const htmlElements = [
        '<div>content</div>',
        '<span class="test">text</span>',
        '<p id="para">paragraph</p>',
        '<h1>heading</h1>',
        '<a href="http://example.com">link</a>',
      ];

      htmlElements.forEach(html => {
        const result = regex.exec(html);
        expect(result).toBeTruthy();
        console.log(`HTML: ${html} -> tag: ${result[1].value}, content: ${result[2].value}`);
      });
    });

    test('should handle log file patterns', () => {
      const logPattern = '^(\\d{4}-\\d{2}-\\d{2})\\s+(\\d{2}:\\d{2}:\\d{2})(?:\\.(\\d{3}))?\\s+\\[(\\w+)\\]\\s+(.+)$';
      const regex = pcre.compile(logPattern, pcre.constants.MULTILINE);
      
      const logEntries = [
        '2023-12-25 10:30:45 [INFO] Application started',
        '2023-12-25 10:30:45.123 [ERROR] Database connection failed',
        '2023-12-25 10:30:46 [DEBUG] Processing request ID 12345',
        '2023-12-25 10:30:47 [WARN] High memory usage detected',
      ];

      logEntries.forEach(log => {
        const result = regex.exec(log);
        expect(result).toBeTruthy();
        console.log(`Log: ${log} -> date: ${result[1].value}, time: ${result[2].value}, level: ${result[4].value}`);
      });
    });
  });

  describe('Performance Tests with Real-world Data', () => {
    test('should efficiently process large text documents', () => {
      // Simulate processing a large legal document
      const documentPattern = '(?:(?:§|Section)\\s+(\\d+(?:\\.\\d+)*)|(?:Article\\s+([IVX]+))|(?:Chapter\\s+(\\d+)))';
      const regex = pcre.compile(documentPattern, pcre.constants.CASELESS);
      
      // Generate a large document-like text
      const sections = Array.from({ length: 1000 }, (_, i) => 
        `Section ${i + 1}. This is the content of section ${i + 1}. ` + 
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)
      ).join('\\n\\n');
      
      const start = Date.now();
      let matches = 0;
      let lastIndex = 0;
      let result;
      
      // Find all matches efficiently
      while ((result = regex.exec(sections.substring(lastIndex))) !== null) {
        matches++;
        lastIndex += result.index + result[0].value.length;
        if (lastIndex >= sections.length) break;
        if (matches > 2000) break; // Safety limit
      }
      
      const duration = Date.now() - start;
      console.log(`Processed large document: ${matches} matches in ${duration}ms`);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      expect(matches).toBeGreaterThan(500); // Should find many sections
    });

    test('should handle batch email validation efficiently', () => {
      const emailPattern = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
      const regex = pcre.compile(emailPattern);
      
      // Generate batch of email addresses
      const emails = Array.from({ length: 10000 }, (_, i) => 
        `user${i}@domain${i % 100}.com`
      );
      
      const start = Date.now();
      let validEmails = 0;
      
      emails.forEach(email => {
        if (regex.exec(email)) {
          validEmails++;
        }
      });
      
      const duration = Date.now() - start;
      console.log(`Validated ${emails.length} emails: ${validEmails} valid in ${duration}ms`);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
      expect(validEmails).toBe(emails.length); // All should be valid
    });
  });
});
