module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
    },
  },
  assertions: {
    'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
    'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
    'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
    'total-blocking-time': ['error', { maxNumericValue: 300 }],
    'speed-index': ['error', { maxNumericValue: 3400 }],
    interactive: ['error', { maxNumericValue: 3800 }],
  },
  budgets: [
    {
      resourceSizes: [
        {
          resourceType: 'script',
          budget: 300,
        },
        {
          resourceType: 'image',
          budget: 500,
        },
        {
          resourceType: 'stylesheet',
          budget: 100,
        },
        {
          resourceType: 'total',
          budget: 1000,
        },
      ],
      timings: [
        {
          metric: 'first-contentful-paint',
          budget: 1500,
        },
        {
          metric: 'largest-contentful-paint',
          budget: 2500,
        },
        {
          metric: 'cumulative-layout-shift',
          budget: 0.1,
        },
      ],
    },
  ],
}
