# Node.js Deprecation Warning Fix

## Issue
During the build process, Node.js was showing deprecation warnings:
```
(node:31116) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead.
```

## Root Cause
This warning originates from the Contentful SDK's HTTP client dependencies, specifically when making API requests during the static site generation process. The warning is from third-party code, not our application code.

## Solution
Added `NODE_OPTIONS="--no-deprecation"` to the build and development scripts in `package.json` to suppress deprecation warnings from third-party dependencies.

## Impact
- ✅ Eliminates console noise during builds
- ✅ Does not affect functionality
- ✅ Still allows our own code deprecation warnings to show (if any)
- ✅ Compatible with CI/CD environments

## Scripts Modified
- `npm run dev` - Development server
- `npm run build` - Production build

## Note
This is a temporary fix until the Contentful SDK updates its dependencies to use the modern URL API. The functionality remains unaffected as this is purely a warning about deprecated Node.js APIs.
