import LIB_PCRE from "./libpcre-npm.wasm";

// Instantiate the PCRE module at the top level for Cloudflare Workers
const instance = await WebAssembly.instantiate(LIB_PCRE);
const pcreModule = instance.exports;

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;


    // Handle OPTIONS requests for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path === '/test' && request.method === 'POST') {
        return handleTest(request, corsHeaders);
      } else if (path === '/match' && request.method === 'POST') {
        return handleMatch(request, corsHeaders);
      } else if (path === '/compile' && request.method === 'POST') {
        return handleCompile(request, corsHeaders);
      } else if (path === '/version' && request.method === 'GET') {
        return handleVersion(corsHeaders);
      } else if (path === '/config' && request.method === 'GET') {
        return handleConfig(corsHeaders);
      } else {
        return new Response(JSON.stringify({ 
          error: 'Not found',
          availableEndpoints: ['/test', '/match', '/compile', '/version', '/config']
        }), { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleTest(request, corsHeaders) {
  const body = await request.json();
  const { pattern, subject, options = 0 } = body;
  
  if (!pattern || !subject) {
    return new Response(JSON.stringify({ 
      error: 'Missing required parameters: pattern and subject' 
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const result = pcreModule.quickTest(pattern, subject, options);
  return new Response(JSON.stringify({ 
    result,
    pattern,
    subject,
    options
  }), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleMatch(request, corsHeaders) {
  const body = await request.json();
  const { pattern, subject, options = 0 } = body;
  
  if (!pattern || !subject) {
    return new Response(JSON.stringify({ 
      error: 'Missing required parameters: pattern and subject' 
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const matches = pcreModule.quickMatch(pattern, subject, options);
  return new Response(JSON.stringify({ 
    matches,
    pattern,
    subject,
    options
  }), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleCompile(request, corsHeaders) {
  const body = await request.json();
  const { pattern, options = 0, subject, operation = 'test' } = body;
  
  if (!pattern) {
    return new Response(JSON.stringify({ 
      error: 'Missing required parameter: pattern' 
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const regex = new pcreModule.PCRERegex(pattern, options);
    let result = null;
    
    if (subject && operation) {
      switch (operation) {
        case 'test':
          result = regex.test(subject);
          break;
        case 'exec':
          result = regex.exec(subject);
          break;
        case 'globalMatch':
          result = regex.globalMatch(subject);
          break;
        case 'replace':
          const { replacement = '', global = false } = body;
          result = regex.replace(subject, replacement, global);
          break;
        default:
          result = { error: 'Invalid operation. Use: test, exec, globalMatch, or replace' };
      }
    }
    
    return new Response(JSON.stringify({ 
      pattern: regex.getPattern(),
      options: regex.getOptions(),
      namedGroups: regex.getNamedGroups(),
      result,
      operation
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: `Compilation failed: ${error.message}` 
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleVersion(corsHeaders) {
  const version = pcreModule.getVersion();
  const versionString = pcreModule.getVersionString();
  
  return new Response(JSON.stringify({ 
    version,
    versionString
  }), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleConfig(corsHeaders) {
  const config = pcreModule.getConfigInfo();
  
  // Also include available constants
  const constants = {
    PCRE_CASELESS: pcreModule.PCRE_CASELESS,
    PCRE_MULTILINE: pcreModule.PCRE_MULTILINE,
    PCRE_DOTALL: pcreModule.PCRE_DOTALL,
    PCRE_EXTENDED: pcreModule.PCRE_EXTENDED,
    PCRE_ANCHORED: pcreModule.PCRE_ANCHORED,
    PCRE_DOLLAR_ENDONLY: pcreModule.PCRE_DOLLAR_ENDONLY,
    PCRE_UTF8: pcreModule.PCRE_UTF8,
    PCRE_NO_AUTO_CAPTURE: pcreModule.PCRE_NO_AUTO_CAPTURE,
    PCRE_JAVASCRIPT_COMPAT: pcreModule.PCRE_JAVASCRIPT_COMPAT,
  };
  
  return new Response(JSON.stringify({ 
    config,
    constants
  }), { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}