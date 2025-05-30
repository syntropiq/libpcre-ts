import { test, expect, beforeAll, describe } from 'vitest';
import { PCRE } from '../../dist/index.js';

describe('Quantifiers', () => {
  let pcre;
  
  beforeAll(async () => {
    pcre = new PCRE();
    await pcre.init();
  });

  test('should handle plus quantifier', () => {
    const regex = pcre.compile('a+');
    expect(regex.exec('aaa')).toBeTruthy();
    expect(regex.exec('bbb')).toBeNull();
  });

  test('should handle star quantifier', () => {
    const regex = pcre.compile('a*');
    expect(regex.exec('aaa')).toBeTruthy();
    expect(regex.exec('bbb')).toBeTruthy(); // * matches zero occurrences
  });

  test('should handle question mark quantifier', () => {
    const regex = pcre.compile('colou?r');
    expect(regex.exec('color')).toBeTruthy();
    expect(regex.exec('colour')).toBeTruthy();
  });

  test('should handle specific count quantifiers', () => {
    const regex = pcre.compile('a{3}');
    expect(regex.exec('aaa')).toBeTruthy();
    expect(regex.exec('aa')).toBeNull();
    expect(regex.exec('aaaa')).toBeTruthy(); // Contains aaa
  });
});
