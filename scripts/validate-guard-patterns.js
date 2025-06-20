#!/usr/bin/env node

/**
 * Validate SITE_CONFIG Guard Patterns
 *
 * This script validates that all patterns defined in SITE_CONFIG.guards
 * have corresponding properties in SITE_CONFIG that they should reference.
 *
 * Usage: npm run validate:guards
 */

async function validateGuardPatterns() {
  try {
    console.log('🔍 Validating SITE_CONFIG guard patterns...')

    // Dynamically import the SITE_CONFIG (ES module)
    const { SITE_CONFIG } = await import('../src/config/site.ts')

    const validationResults = []
    let hasErrors = false

    // Define expected SITE_CONFIG mappings for each pattern category
    const expectedMappings = {
      domains: ['url'],
      emails: ['contact.email'],
      names: ['name', 'author'],
      socialHandles: ['social.twitter'],
      socialUrls: ['social.github', 'social.linkedin'],
      imagePaths: ['images.profile', 'images.ogDefault'],
    }

    // Validate each pattern category
    for (const [category, patterns] of Object.entries(
      SITE_CONFIG.guards.patterns
    )) {
      const expectedPaths = expectedMappings[category]

      if (!expectedPaths) {
        validationResults.push({
          category,
          status: 'warning',
          message: `No expected SITE_CONFIG mapping defined for category '${category}'`,
        })
        continue
      }

      // Check if the expected SITE_CONFIG paths exist
      const missingPaths = []
      const foundValues = []

      for (const path of expectedPaths) {
        const value = getNestedValue(SITE_CONFIG, path)
        if (value === undefined) {
          missingPaths.push(path)
        } else {
          foundValues.push({ path, value })
        }
      }

      if (missingPaths.length > 0) {
        validationResults.push({
          category,
          status: 'error',
          message: `Missing SITE_CONFIG properties: ${missingPaths.join(', ')}`,
        })
        hasErrors = true
      } else {
        validationResults.push({
          category,
          status: 'success',
          message: `✅ ${patterns.length} patterns mapped to: ${foundValues.map((v) => `${v.path}="${v.value}"`).join(', ')}`,
        })
      }
    }

    // Print results
    console.log('\\n📊 Validation Results:')
    console.log('='.repeat(50))

    for (const result of validationResults) {
      const icon =
        result.status === 'error'
          ? '❌'
          : result.status === 'warning'
            ? '⚠️'
            : '✅'
      console.log(`${icon} ${result.category}: ${result.message}`)
    }

    // Summary
    const successCount = validationResults.filter(
      (r) => r.status === 'success'
    ).length
    const warningCount = validationResults.filter(
      (r) => r.status === 'warning'
    ).length
    const errorCount = validationResults.filter(
      (r) => r.status === 'error'
    ).length

    console.log('\\n' + '='.repeat(50))
    console.log(
      `📈 Summary: ${successCount} ✅ | ${warningCount} ⚠️ | ${errorCount} ❌`
    )

    if (hasErrors) {
      console.log('\\n❌ Validation failed! Please fix the errors above.')
      process.exit(1)
    } else {
      console.log(
        '\\n✅ All guard patterns are properly mapped to SITE_CONFIG properties!'
      )
    }
  } catch (error) {
    console.error('❌ Error validating guard patterns:', error.message)
    process.exit(1)
  }
}

/**
 * Get nested object value by dot notation path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}

validateGuardPatterns()
