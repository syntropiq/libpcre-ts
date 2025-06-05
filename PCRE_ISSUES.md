# libpcre-ts Library Issues

This file documents issues that have been identified in the libpcre-ts library, particularly in its implementation of PCRE (Perl Compatible Regular Expressions). The issues are categorized by priority and include specific test cases, error messages, root causes, and recommendations for resolution.

User Reported Issues:
following the readme to retrieve error messages
I was instead given a number
in which accessing the property message on it results in undefined

try {
	const regex = pcre.compile('[invalid pattern');
} catch (error) {
	console.error('Pattern compilation failed:', error.message);
	// error.message returns undefined
	// error returns a long number like 1146056
}
 Image

compile() and test() work fine

const PCRERegex = pcre.compile('a.c');
PCRERegex.test('abc');
// returns true


Automated Testing Issues:
The following issues were identified during automated testing of the libpcre-ts library. Each issue includes a description, test cases, error messages, root causes, impacts, and recommendations for resolution.
## 1. Unicode Escape Sequence Support

**Issue**: libpcre-ts doesn't support `\u{xxxx}` Unicode escape sequences that are used in some tests.

**Test Cases**:
```javascript
// Fails with: "PCRE does not support \L, \l, \N{name}, \U, or \u at offset 12"
const pattern = '(?P<emoji>[\\u{1F600}-\\u{1F64F}])';
const pattern2 = '(?P<unicode>[\\u0000-\\uFFFF]+)';
```

**Error Message**: 
```
PCRE compilation failed: PCRE does not support \L, \l, \N{name}, \U, or \u at offset 12
```

**Root Cause**: The underlying PCRE library used by libpcre-ts doesn't support Unicode escape sequences in the `\u{xxxx}` format.

**Impact**: High - affects any patterns that need to match specific Unicode ranges or characters.

**Recommendation**: 
- Check if libpcre-ts can be configured with different Unicode support options
- Consider using alternative Unicode syntax supported by PCRE
- Document this limitation for users

## 2. Duplicate Named Groups Restriction

**Issue**: libpcre-ts/PCRE doesn't allow multiple named groups with the same name, which Python regex does support.

**Test Cases**:
```javascript
// Fails with: "two named subpatterns have the same name at offset 26"
const pattern1 = '(?P<item>\\w+)(?:\\s+(?P<item>\\w+))*';
const pattern2 = '(?P<type>email):(?P<email>[^\\s]+)|(?P<type>phone):(?P<phone>[^\\s]+)';
const pattern3 = '(?P<same>\\w+)\\s+(?P<same>\\w+)';
```

**Error Message**: 
```
PCRE compilation failed: two named subpatterns have the same name at offset 26
```

**Root Cause**: This is a fundamental difference between Python's regex engine and PCRE. Python allows duplicate named groups (the last match wins), while PCRE requires unique names.

**Impact**: Medium - affects patterns that rely on Python's duplicate named group behavior.

**Recommendation**: 
- Document this as a known limitation
- Suggest workarounds using numbered groups or unique names
- Consider implementing a pre-processing step to rename duplicate groups

## 3. Character Class Unicode Behavior

**Issue**: PCRE's `\w` and `\s` character classes may not be Unicode-aware by default, causing differences with Python's behavior.

**Test Cases**:
```javascript
// Python expects \w to match Unicode letters, but PCRE may not
const pattern = '\\w+';
expect(pattern.test('café')).toBe(true); // Expected: true, Actual: false
expect(pattern.test('测试')).toBe(true); // Expected: true, Actual: false

// Python expects \s to match tab characters differently  
const pattern2 = '\\s+';
expect(pattern2.test('\\t')).toBe(true); // Expected: true, Actual: false
```

**Root Cause**: PCRE's character classes may not be configured for full Unicode support, or may interpret character classes differently than Python.

**Impact**: Medium - affects internationalization and Unicode text processing.

**Recommendation**: 
- Check if libpcre-ts supports PCRE_UTF8 or PCRE_UCP options for Unicode character properties
- Consider if additional PCRE compilation flags are needed
- Document character class differences between Python and PCRE

## 4. Empty Named Group Handling

**Issue**: Some named group edge cases involving empty groups may not behave the same as Python.

**Test Cases**:
```javascript
// Expected empty string for optional group, but got different result
const pattern = '(?P<optional>\\d*)(?P<required>\\d+)';
const match = pattern.match('123');
expect(match?.groups.optional).toBe(''); // Expected: '', Actual: '12'
```

**Root Cause**: This could be either a libpcre-ts issue with group extraction or a difference in how PCRE handles optional groups compared to Python.

**Impact**: Low to Medium - affects specific edge cases with optional named groups.

**Recommendation**: 
- Test with simpler patterns to isolate if this is a PCRE behavior difference
- Check libpcre-ts documentation for group extraction behavior
- May require wrapper-level handling if this is a fundamental PCRE difference

ISSUES.md
Categorized all issues by priority (Critical/High/Medium/Low)
Marked diagnosed issues as validated
Added specific error patterns observed
Created actionable fix roadmap
PCRE_ISSUES.md
Documented confirmed PCRE vs Python differences
Separated external issues from internal fixes needed
Added investigation notes for libpcre-ts unidecode fixes
Prioritized what to fix internally vs report upstream
🎯 Key Diagnostic Findings
Named group validation was fundamentally broken - empty groups passing validation
Group capture extraction was using wrong pattern reference - using compiled vs original
Pattern validation was too permissive - missing edge case handling
Unicode escapes need preprocessing - PCRE doesn't support Python \u{...} syntax
The fixes address the "beam in our own eye" - strengthening our validation and capture logic before reporting issues upstream to libpcre-ts. The remaining Unicode and duplicate named group issues are confirmed PCRE limitations that need upstream solutions.