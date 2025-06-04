// Test script for Cloudflare Workers compatibility
import { PCRE } from './dist/index.js';

export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Initializing PCRE in Cloudflare Worker...');
      
      const pcre = new PCRE();
      await pcre.init();
      
      console.log('PCRE initialized successfully!');
      console.log('Version:', pcre.getVersionString());
      
      // Test basic functionality
      const pattern = 'hello.*world';
      const subject = 'hello beautiful world';
      const isMatch = pcre.test(pattern, subject);
      
      console.log(`Pattern: ${pattern}`);
      console.log(`Subject: ${subject}`);
      console.log(`Match: ${isMatch}`);
      
      // Test match extraction
      const matches = pcre.match('(\\w+)\\s+(\\w+)', 'hello world');
      console.log('Matches:', matches);
      
      return new Response(JSON.stringify({
        success: true,
        version: pcre.getVersionString(),
        testPattern: pattern,
        testSubject: subject,
        isMatch: isMatch,
        matches: matches
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error in Cloudflare Worker:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
