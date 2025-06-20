#!/usr/bin/env node

/**
 * Sync guard configuration with SITE_CONFIG
 *
 * This script automatically updates scripts/guard-config.js
 * to match the guards configuration in src/config/site.ts
 *
 * Usage: npm run sync:guards
 */

const fs = require('fs')
const path = require('path')

async function syncGuardConfig() {
  try {
    console.log('🔄 Syncing guard configuration with SITE_CONFIG...')

    // Dynamically import the SITE_CONFIG (ES module)
    const { SITE_CONFIG } = await import('../src/config/site.ts')

    const guardConfig = {
      patterns: SITE_CONFIG.guards.patterns,
      excludes: SITE_CONFIG.guards.excludes,
      contentExclusions: SITE_CONFIG.guards.contentExclusions,
    }

    const configContent = `/**
 * Guard configuration for detecting hardcoded values
 * 
 * ⚠️  AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * This file is automatically synced from src/config/site.ts
 * 
 * To update patterns, modify SITE_CONFIG.guards in src/config/site.ts
 * and run: npm run sync:guards
 */

module.exports = ${JSON.stringify(guardConfig, null, 2)};
`

    const configPath = path.join(__dirname, 'guard-config.js')
    fs.writeFileSync(configPath, configContent)

    console.log('✅ Guard configuration synced successfully!')
    console.log(`📁 Updated: ${configPath}`)

    // Verify the sync worked
    const syncedConfig = require('./guard-config.js')
    const originalPatternCount = Object.keys(SITE_CONFIG.guards.patterns).length
    const syncedPatternCount = Object.keys(syncedConfig.patterns).length

    if (originalPatternCount === syncedPatternCount) {
      console.log(
        `✅ Verification passed: ${originalPatternCount} pattern categories synced`
      )
    } else {
      console.error(`❌ Verification failed: Pattern count mismatch`)
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Error syncing guard configuration:', error.message)
    process.exit(1)
  }
}

syncGuardConfig()
