/**
 * Guard configuration for detecting hardcoded values
 *
 * ⚠️  AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is automatically synced from src/config/site.ts
 *
 * To update patterns, modify SITE_CONFIG.guards in src/config/site.ts
 * and run: npm run sync:guards
 */

module.exports = {
  patterns: {
    domains: [
      'reggiepangilinan.com',
      'https://reggiepangilinan.com',
      'http://reggiepangilinan.com',
    ],
    emails: ['me@reggiepangilinan.com'],
    names: ['Reggie Pangilinan'],
    socialHandles: ['@reggiepangilinan'],
    socialUrls: [
      'github.com/reggiepangilinan',
      'https://github.com/reggiepangilinan',
      'linkedin.com/in/reggiepangilinan',
      'https://linkedin.com/in/reggiepangilinan',
    ],
    imagePaths: ['/profile.webp', '/og-image.png'],
  },
  excludes: [
    'node_modules',
    '.next',
    'build',
    'dist',
    '.git',
    'src/config/site.ts',
    'eslint.config.mjs',
    'scripts/check-hardcoded-values.js',
    'scripts/guard-config.js',
    'scripts/sync-guard-config.js',
    'scripts/validate-guard-patterns.js',
    'docs/',
    'public/',
    'README.md',
  ],
  contentExclusions: ['CV -', 'Resume -'],
}
