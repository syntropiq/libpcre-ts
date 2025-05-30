// PCRE vs JavaScript RegExp feature comparison
const { PCRE } = require('../dist');

async function run() {
    const pcre = new PCRE();
    await pcre.init();

    console.log('--- Named Capture Groups with Duplicate Names ---');
    // NOTE: PCRE WASM wrapper may not support duplicate named groups. This is a known limitation.
    try {
        const pattern = '(?<word>\\w+)-(?<word>\\w+)';
        const input = 'foo-bar';
        const regex = pcre.compile(pattern);
        const matches = regex.exec(input);
        console.log('PCRE:', matches, 'Named groups:', regex.getNamedGroups());
        // JS RegExp will throw
        try {
            new RegExp(pattern);
        } catch (e) {
            console.log('JS RegExp: Error:', e.message);
        }
    } catch (e) {
        console.log('PCRE: Error:', e.message, '(Duplicate named groups may not be supported in this build)');
    }

    console.log('\n--- Conditional Patterns ---');
    try {
        const pattern = '(foo)?(?(1)bar|baz)';
        const inputs = ['foobar', 'foobaz', 'baz'];
        const regex = pcre.compile(pattern);
        for (const input of inputs) {
            const matches = regex.exec(input);
            console.log(`PCRE: ${input} =>`, matches);
        }
        // JS RegExp will throw
        try {
            new RegExp(pattern);
        } catch (e) {
            console.log('JS RegExp: Error:', e.message);
        }
    } catch (e) {
        console.log('PCRE: Error:', e.message);
    }

    console.log('\n--- Variable-width Lookbehind ---');
    try {
        const pattern = '(?<=foo|bar)\\d+';
        const inputs = ['foo123', 'bar456', 'baz789'];
        const regex = pcre.compile(pattern);
        for (const input of inputs) {
            const matches = regex.exec(input);
            console.log(`PCRE: ${input} =>`, matches);
        }
        // JS RegExp: only fixed-width supported
        try {
            const jsRegex = new RegExp(pattern);
            for (const input of inputs) {
                console.log(`JS RegExp: ${input} =>`, jsRegex.exec(input));
            }
        } catch (e) {
            console.log('JS RegExp: Error:', e.message);
        }
    } catch (e) {
        console.log('PCRE: Error:', e.message);
    }

    console.log('\n--- Unicode Properties ---');
    try {
        const pattern = '\\p{L}+';
        const input = 'abc αβγ';
        const regex = pcre.compile(pattern, pcre.constants.UTF8);
        const matches = regex.exec(input);
        console.log('PCRE:', matches);
        // JS RegExp: limited support
        try {
            const jsRegex = new RegExp(pattern, 'gu');
            console.log('JS RegExp:', jsRegex.exec(input));
        } catch (e) {
            console.log('JS RegExp: Error:', e.message);
        }
    } catch (e) {
        console.log('PCRE: Error:', e.message);
    }

    console.log('\n--- Subroutine Calls/Recursion ---');
    try {
        const pattern = '(\\w+)(?R)?';
        const input = 'abc';
        const regex = pcre.compile(pattern);
        const matches = regex.exec(input);
        console.log('PCRE:', matches);
        // JS RegExp will throw
        try {
            new RegExp(pattern);
        } catch (e) {
            console.log('JS RegExp: Error:', e.message);
        }
    } catch (e) {
        console.log('PCRE: Error:', e.message);
    }
}

run().catch(console.error);
