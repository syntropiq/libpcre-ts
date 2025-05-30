#!/bin/bash

# Fix common API issues in modular test files
cd test/modules/

echo "Fixing API usage in modular test files..."

# Fix pcre.exec() -> regex.exec()
sed -i 's/pcre\.exec(regex,/regex.exec(/g' *.test.js

# Fix result.value -> result[0].value  
sed -i 's/result\.value/result[0].value/g' *.test.js
sed -i 's/result1\.value/result1[0].value/g' *.test.js
sed -i 's/result2\.value/result2[0].value/g' *.test.js

# Fix quickMatch calls (these need to be removed or replaced)
sed -i 's/pcre\.quickMatch(/pcre./* FIXME: quickMatch not available *\/ /g' *.test.js
sed -i 's/pcre\.quickTest(/pcre./* FIXME: quickTest not available *\/ /g' *.test.js  
sed -i 's/pcre\.quickReplace(/pcre./* FIXME: quickReplace not available *\/ /g' *.test.js
sed -i 's/pcre\.quickSplit(/pcre./* FIXME: quickSplit not available *\/ /g' *.test.js

echo "API fixes applied to modular test files"
