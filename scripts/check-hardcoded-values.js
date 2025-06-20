/**
 * Utility script to scan for hardcoded values that should use SITE_CONFIG
 *
 * This script can be run as part of CI/CD to catch hardcoded values
 * that slip through the ESLint rules.
 *
 * Usage:
 *   node scripts/check-hardcoded-values.js
 *   npm run check:hardcoded
 */

const fs = require('fs')
const path = require('path')
const guardConfig = require('./guard-config.js')

class HardcodedValueChecker {
  constructor() {
    this.issues = []

    // Use dedicated guard configuration
    this.excludedFiles = guardConfig.excludes
    this.contentExclusions = guardConfig.contentExclusions
    this.hardcodedPatterns = this.buildPatternsFromConfig(guardConfig.patterns)
  }

  buildPatternsFromConfig(patterns) {
    const builtPatterns = []

    // Domain patterns
    patterns.domains.forEach((domain) => {
      builtPatterns.push({
        pattern: new RegExp(domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        suggestion: 'Use SITE_CONFIG.url',
      })
    })

    // Email patterns
    patterns.emails.forEach((email) => {
      builtPatterns.push({
        pattern: new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        suggestion: 'Use SITE_CONFIG.contact.email',
      })
    })

    // Name patterns (with quotes)
    patterns.names.forEach((name) => {
      builtPatterns.push({
        pattern: new RegExp(
          `(["'\`])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`,
          'g'
        ),
        suggestion: 'Use SITE_CONFIG.name or SITE_CONFIG.author',
        excludeIfContains: this.contentExclusions,
      })
    })

    // Social handle patterns (with quotes)
    patterns.socialHandles.forEach((handle) => {
      builtPatterns.push({
        pattern: new RegExp(
          `(["'\`])${handle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`,
          'g'
        ),
        suggestion: 'Use SITE_CONFIG.social.twitter',
      })
    })

    // Social URL patterns
    patterns.socialUrls.forEach((url) => {
      builtPatterns.push({
        pattern: new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        suggestion: url.includes('github')
          ? 'Use SITE_CONFIG.social.github'
          : 'Use SITE_CONFIG.social.linkedin',
      })
    })

    // Image path patterns (with quotes)
    patterns.imagePaths.forEach((imagePath) => {
      builtPatterns.push({
        pattern: new RegExp(
          `(["'\`])${imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`,
          'g'
        ),
        suggestion: imagePath.includes('profile')
          ? 'Use SITE_CONFIG.images.profile'
          : 'Use SITE_CONFIG.images.ogDefault',
      })
    })

    return builtPatterns
  }

  shouldExcludeFile(filePath) {
    return this.excludedFiles.some((excluded) => filePath.includes(excluded))
  }

  scanFile(filePath) {
    if (this.shouldExcludeFile(filePath)) {
      return
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      lines.forEach((line, lineIndex) => {
        this.hardcodedPatterns.forEach(
          ({ pattern, suggestion, excludeIfContains }) => {
            // Reset regex lastIndex for global patterns
            pattern.lastIndex = 0

            let match
            while ((match = pattern.exec(line)) !== null) {
              // Check if we should exclude this match
              if (
                excludeIfContains &&
                excludeIfContains.some((exclude) => line.includes(exclude))
              ) {
                continue
              }

              this.issues.push({
                file: path.relative(process.cwd(), filePath),
                line: lineIndex + 1,
                column: match.index + 1,
                issue: `Hardcoded value: ${match[0]}`,
                suggestion,
              })
            }
          }
        )
      })
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error)
    }
  }

  scanDirectory(dirPath) {
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
          if (!this.shouldExcludeFile(fullPath)) {
            this.scanDirectory(fullPath)
          }
        } else if (entry.isFile()) {
          // Only scan relevant file types
          if (/\.(ts|tsx|js|jsx|md|json)$/.test(entry.name)) {
            this.scanFile(fullPath)
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error)
    }
  }

  scan() {
    const projectRoot = path.resolve(__dirname, '..')
    this.scanDirectory(projectRoot)
    return this.issues
  }

  printReport() {
    const issues = this.scan()

    if (issues.length === 0) {
      console.log(
        '✅ No hardcoded values found! All values are properly using SITE_CONFIG.'
      )
      return
    }

    console.log(
      `❌ Found ${issues.length} hardcoded value(s) that should use SITE_CONFIG:\n`
    )

    const groupedByFile = issues.reduce((acc, issue) => {
      if (!acc[issue.file]) {
        acc[issue.file] = []
      }
      acc[issue.file].push(issue)
      return acc
    }, {})

    Object.entries(groupedByFile).forEach(([file, fileIssues]) => {
      console.log(`📁 ${file}:`)
      fileIssues.forEach((issue) => {
        console.log(`  ⚠️  Line ${issue.line}:${issue.column} - ${issue.issue}`)
        console.log(`     💡 ${issue.suggestion}`)
      })
      console.log('')
    })

    console.log('To fix these issues:')
    console.log(
      '1. Import SITE_CONFIG: import { SITE_CONFIG } from "@/config/site"'
    )
    console.log('2. Replace hardcoded values with SITE_CONFIG properties')
    console.log('3. Run this script again to verify fixes')

    process.exit(1)
  }
}

// Run the checker if this script is executed directly
if (require.main === module) {
  const checker = new HardcodedValueChecker()
  checker.printReport()
}

module.exports = { HardcodedValueChecker }
