// Simple test worker to verify our Cloudflare Workers setup
import { PCRE } from './dist/index.js';

export default {
  async fetch(request, env, ctx) {
    try {
      console.log('Testing PCRE setup...');
      
      // Create PCRE instance but don't initialize it yet  
      const pcre = new PCRE();
      
      // Just test that the class works
      return new Response(JSON.stringify({
        success: true,
        message: 'PCRE class loaded successfully',
        note: 'WASM initialization skipped due to local dev restrictions',
        url: request.url
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error in test worker:', error);
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
