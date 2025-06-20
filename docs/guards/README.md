# SITE_CONFIG Guard System

## 🎯 Overview

A comprehensive guard system that ensures all site-wide values use `SITE_CONFIG` instead of hardcoded values, preventing regressions and maintaining centralized configuration.

## 🚀 Quick Commands

```bash
# Complete guard workflow (recommended)
npm run guards

# Individual operations  
npm run validate:guards    # Validate pattern mappings
npm run sync:guards       # Auto-sync guard configuration
npm run check:site-config # Full lint + hardcoded value check
```

## 🛡️ How It Works

The system provides multiple layers of protection:

1. **Real-time ESLint Rules** - Immediate feedback in your editor
2. **Pre-commit Hooks** - Prevents hardcoded values from being committed  
3. **Comprehensive Scanner** - Deep analysis of all files
4. **Auto-Sync** - Keeps guard configuration in sync with SITE_CONFIG

## 📋 What Gets Detected

| Type | Examples | Use Instead |
|------|----------|-------------|
| **Domains** | `reggiepangilinan.com` | `SITE_CONFIG.url` |
| **Emails** | `me@reggiepangilinan.com` | `SITE_CONFIG.contact.email` |
| **Names** | `"Reggie Pangilinan"` | `SITE_CONFIG.name` |
| **Social** | `@reggiepangilinan`, GitHub/LinkedIn URLs | `SITE_CONFIG.social.*` |
| **Images** | `/profile.webp`, `/og-image.png` | `SITE_CONFIG.images.*` |

## 🔧 Adding New Patterns

1. **Add to SITE_CONFIG** (`src/config/site.ts`):
```typescript
guards: {
  patterns: {
    newCategory: ['pattern1', 'pattern2']
  }
}
```

2. **Update validation** (`scripts/validate-guard-patterns.js`):
```javascript
const expectedMappings = {
  newCategory: ['siteConfigProperty']
};
```

3. **Sync and validate**:
```bash
npm run guards
```

## 💡 Usage Examples

### Using SITE_CONFIG (✅ Correct)
```typescript
import { SITE_CONFIG } from '@/config/site'

// Email link
const emailUrl = `mailto:${SITE_CONFIG.contact.email}`

// Domain reference  
const siteUrl = SITE_CONFIG.url

// Social links
const githubUrl = SITE_CONFIG.social.github
```

### Hardcoded Values (❌ Detected)
```typescript
// These will be flagged by the guard system
const email = 'me@reggiepangilinan.com'
const domain = 'https://reggiepangilinan.com'  
const github = 'https://github.com/reggiepangilinan'
```

## 🔍 Example Detection Output

When hardcoded values are found:
```
❌ Found 1 hardcoded value(s) that should use SITE_CONFIG:

📁 src/example.ts:
  ⚠️  Line 10:8 - Hardcoded value: reggiepangilinan.com
     💡 Use SITE_CONFIG.url

To fix: Import SITE_CONFIG and use the suggested property.
```

When everything is clean:
```
✅ No hardcoded values found! All values are properly using SITE_CONFIG.
```

## 📁 Key Files

- `src/config/site.ts` - Single source of truth for all site configuration
- `scripts/guard-config.js` - Auto-generated CommonJS config (don't edit manually)  
- `eslint.config.mjs` - Real-time ESLint rules for immediate feedback

## 🎯 Benefits

- **Zero Maintenance** - Guards auto-update when SITE_CONFIG changes
- **Regression Prevention** - Impossible to accidentally add hardcoded values
- **Real-time Feedback** - ESLint shows issues as you type
- **CI/CD Ready** - One command validates everything (`npm run guards`)

Your site configuration is fully centralized and protected! 🛡️
