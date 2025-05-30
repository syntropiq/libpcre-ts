# libpcre-ts

A WebAssembly build of the original PCRE (Perl Compatible Regular Expressions) library with TypeScript bindings. This provides full PCRE functionality in JavaScript/TypeScript environments, including features not available in JavaScript's built-in regex engine.

## Features

- **Full PCRE compatibility** - Real PCRE regex engine, not a JavaScript reimplementation
- **WebAssembly performance** - Near-native performance in browsers and Node.js
- **TypeScript support** - Complete type definitions included
- **Multiple APIs** - Both simple convenience functions and full regex objects
- **Capture groups** - Full support for named and numbered capture groups
- **Unicode support** - UTF-8 and Unicode properties enabled
- **All PCRE flags** - Case insensitive, multiline, dotall, extended, and more

## Quick Start

### Prerequisites

- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html) (for building)
- CMake 3.10+
- Git

### Installation & Building

```bash
# Clone the repository
git clone git@github.com:syntropiq/libpcre-ts.git
cd libpcre-ts

# Initialize and update the PCRE submodule
git submodule init
git submodule update

# Build the WebAssembly module
mkdir build
cd build
emcmake cmake ..
emmake make -j4
cd ..

# Compile to WebAssembly with JavaScript bindings
emcc -O2 -I build/libpcre -I libpcre \
  build/libpcre/libpcre.a build/libpcre/libpcreposix.a \
  wasm-wrapper.cpp -o build/libpcre.js \
  --bind -s MODULARIZE=1 -s EXPORT_NAME=PCRE \
  -s ENVIRONMENT=web,node -s ALLOW_MEMORY_GROWTH=1
```

### Build Script

For convenience, you can use the build script:

```bash
./build.sh
```

## Usage

### Node.js

```javascript
const PCRE = require('./build/libpcre.js');

async function example() {
  const pcre = await PCRE();
  
  // Simple test
  const hasMatch = pcre.quickTest('[a-z]+', 'hello world', 0);
  console.log('Has match:', hasMatch); // true
  
  // Get match details
  const match = pcre.quickMatch('([a-z]+)\\s+([a-z]+)', 'hello world', 0);
  console.log('Match:', match);
  // { success: true, match: 'hello world', start: 0, end: 11, groups: ['hello', 'world'] }
  
  // Full regex object
  const regex = new pcre.PCRERegex('[A-Z]+', pcre.PCRE_CASELESS);
  const result = regex.exec('Hello World', 0);
  console.log('Result:', result);
  regex.delete(); // Clean up memory
}

example();
```

### TypeScript

```typescript
import PCREModule from './build/libpcre.js';

interface PCREInstance {
  quickTest(pattern: string, text: string, options: number): boolean;
  quickMatch(pattern: string, text: string, options: number): MatchResult;
  PCRERegex: new (pattern: string, options: number) => PCRERegex;
  // ... constants and other methods
}

async function example() {
  const pcre: PCREInstance = await PCREModule();
  
  // Use with full type safety
  const regex = new pcre.PCRERegex('\\d+', 0);
  const result = regex.exec('Found 123 numbers', 0);
  
  if (result.success) {
    console.log(`Matched: ${result.match} at position ${result.start}`);
  }
  
  regex.delete();
}
```

### Browser

```html
<!DOCTYPE html>
<html>
<head>
  <title>PCRE WebAssembly Example</title>
</head>
<body>
  <script type="module">
    import PCRE from './build/libpcre.js';
    
    async function demo() {
      const pcre = await PCRE();
      
      // Test complex regex patterns not supported by JavaScript
      const result = pcre.quickMatch(
        '(?P<protocol>https?)://(?P<domain>[^/]+)',
        'Visit https://example.com for more info',
        0
      );
      
      console.log('Parsed URL:', result);
    }
    
    demo();
  </script>
</body>
</html>
```

## API Reference

### Quick Functions

#### `quickTest(pattern: string, text: string, options: number): boolean`
Returns true if the pattern matches the text.

#### `quickMatch(pattern: string, text: string, options: number): MatchResult`
Returns detailed match information including capture groups.

```typescript
interface MatchResult {
  success: boolean;
  match?: string;      // Full match text
  start?: number;      // Start position
  end?: number;        // End position
  groups?: string[];   // Capture groups
}
```

### PCRERegex Class

#### `new PCRERegex(pattern: string, options: number)`
Creates a compiled regex object.

#### `exec(text: string, startOffset: number): MatchResult`
Executes the regex against the text starting at the given offset.

#### `delete(): void`
Frees the compiled regex memory. Important for preventing memory leaks.

### PCRE Options

| Constant | Description |
|----------|-------------|
| `PCRE_CASELESS` | Case insensitive matching |
| `PCRE_MULTILINE` | ^ and $ match newlines |
| `PCRE_DOTALL` | . matches newlines |
| `PCRE_EXTENDED` | Ignore whitespace and # comments |
| `PCRE_ANCHORED` | Match only at start of subject |
| `PCRE_UTF8` | Enable UTF-8 mode |
| `PCRE_UNGREEDY` | Make quantifiers non-greedy by default |
| `PCRE_NO_AUTO_CAPTURE` | Disable automatic capturing |

### Utility Functions

#### `getVersionString(): string`
Returns the PCRE version string.

#### `getConfigInfo(): object`
Returns PCRE build configuration information.

## Advanced Features

### Named Capture Groups

```javascript
const regex = new pcre.PCRERegex(
  '(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})',
  0
);
const result = regex.exec('Date: 2023-12-25', 6);
// result.groups will contain named captures
```

### Look-ahead and Look-behind

```javascript
// Positive lookbehind (not supported in JavaScript regex)
const regex = new pcre.PCRERegex('(?<=\\$)\\d+\\.\\d{2}', 0);
const result = regex.exec('Price: $19.99', 0);
```

### Recursive Patterns

```javascript
// Match balanced parentheses (impossible with JavaScript regex)
const regex = new pcre.PCRERegex('\\((?:[^()]++|(?R))*\\)', 0);
```

## Error Handling

```javascript
try {
  const regex = new pcre.PCRERegex('[invalid', 0);
} catch (error) {
  console.error('Compilation failed:', error.message);
}

const result = regex.exec('test', 0);
if (!result.success) {
  console.log('No match found');
}
```

## Performance Tips

1. **Reuse compiled regexes** - Don't create new PCRERegex objects for each match
2. **Call delete()** - Always clean up PCRERegex objects to prevent memory leaks
3. **Use quickTest()** - For simple boolean tests, it's faster than creating objects
4. **Study patterns** - PCRE automatically optimizes frequently used patterns

## Building from Source

### Requirements

- Emscripten SDK 3.1.6+
- CMake 3.10+
- Git

### Custom Build Options

You can customize the build by modifying the CMake options in `CMakeLists.txt`:

```cmake
# Enable 16-bit and 32-bit PCRE variants
set(PCRE_BUILD_PCRE16 ON)
set(PCRE_BUILD_PCRE32 ON)

# Enable JIT compilation (may not work in all environments)
set(PCRE_SUPPORT_JIT ON)
```

### Development Build

For development with debug symbols:

```bash
emcc -g -I build/libpcre -I libpcre \
  build/libpcre/libpcre.a build/libpcre/libpcreposix.a \
  wasm-wrapper.cpp -o build/libpcre.js \
  --bind -s MODULARIZE=1 -s EXPORT_NAME=PCRE \
  -s ENVIRONMENT=web,node -s ALLOW_MEMORY_GROWTH=1 \
  -s ASSERTIONS=1
```

## License

This project combines:
- PCRE library: BSD-style license
- WebAssembly wrapper: MIT license

See the individual license files for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### Common Issues

**Module loading fails in browser:**
Ensure you're serving files over HTTP/HTTPS, not file:// protocol.

**Memory errors:**
Make sure to call `.delete()` on PCRERegex objects when done.

**Pattern compilation fails:**
PCRE uses slightly different syntax than JavaScript. Check the [PCRE documentation](https://www.pcre.org/original/doc/html/pcrepattern.html).

### Getting Help

- [PCRE Documentation](https://www.pcre.org/original/doc/html/)
- [WebAssembly Troubleshooting](https://emscripten.org/docs/porting/Debugging.html)
- [GitHub Issues](https://github.com/syntropiq/libpcre-ts/issues)

## Examples

See the `examples/` directory for more detailed usage examples:
- Basic pattern matching
- Complex regex features
- Performance benchmarks
- Browser integration
- Node.js applications
