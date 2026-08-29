// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss'
  ],

  image: {
    // Configuración del módulo de imagen
    provider: 'none'
  },

  // Experimental performance features
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
    // Critical CSS extraction for better FCP
    preloadComponentsInlineStyles: true
  },

  // Vite optimization
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router']
          }
        }
      },
      // Inline small CSS chunks to reduce critical path
      assetsInlineLimit: 8192
    },
    optimizeDeps: {
      include: ['vue', 'vue-router']
    }
  },

  app: {
    head: {
      title: 'Hermes Logistics - Fleet Management & Route Optimization',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#01051D' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }
      ],
      // Inline critical CSS to improve FCP/LCP
      style: [
        {
          children: `
            :root { --font-sans: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
            html, body { font-family: var(--font-sans); background-color: #01051D; margin: 0; padding: 0; overflow-x: hidden; }
            .min-h-screen { min-height: 100vh; }
            * { box-sizing: border-box; }
          `
        }
      ]
    }
  },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    },
    compressPublicAssets: true,
    minify: true,
    // Hook to optimize critical CSS and add deferring script
    hooks: {
      'render:html': (html) => {
        // Add inline script to defer non-critical CSS loading
        // This defers /_nuxt/entry.*.css to avoid blocking render
        const deferCssScript = `
          <script>
            (function() {
              var links = document.querySelectorAll('link[rel="stylesheet"][href*="_nuxt/entry"]');
              links.forEach(function(link) {
                link.media = 'print';
                link.onload = function() {
                  this.media = 'all';
                };
                var preload = link.cloneNode(true);
                preload.rel = 'preload';
                preload.as = 'style';
                preload.onload = null;
                document.head.appendChild(preload);
              });
            })();
          </script>
        `
        // Insert before closing head
        html.head = html.head.replace('</head>', deferCssScript + '</head>')
      }
    }
  },

  // Route rules for caching
  routeRules: {
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  }
})