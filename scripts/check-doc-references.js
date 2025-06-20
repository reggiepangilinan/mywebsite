#!/usr/bin/env node

/**
 * Check document cross-reference validity
 * Scans all documentation files for broken internal links
 */

const fs = require('fs')
const path = require('path')

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

class DocumentCrossReferenceChecker {
  constructor() {
    this.projectRoot = process.cwd()
    this.docsRoot = path.join(this.projectRoot, 'docs')
    this.brokenLinks = []
    this.validLinks = []
    this.checkedFiles = new Set()
  }

  /**
   * Get all markdown files in the project
   */
  getAllMarkdownFiles() {
    const files = []

    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return

      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          scanDirectory(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(fullPath)
        }
      }
    }

    scanDirectory(this.docsRoot)
    return files
  }

  /**
   * Extract all markdown links from file content
   */
  extractLinks(content, filePath) {
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
    const links = []
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, linkText, linkPath] = match
      const lineNumber = content.substring(0, match.index).split('\n').length

      links.push({
        text: linkText,
        path: linkPath,
        fullMatch,
        lineNumber,
        sourceFile: filePath,
      })
    }

    return links
  }

  /**
   * Resolve relative paths and check if files exist
   */
  checkLinkValidity(link) {
    const { path: linkPath, sourceFile } = link

    // Skip external URLs
    if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
      return { valid: true, type: 'external' }
    }

    // Skip anchor links
    if (linkPath.startsWith('#')) {
      return { valid: true, type: 'anchor' }
    }

    // Skip email links
    if (linkPath.startsWith('mailto:')) {
      return { valid: true, type: 'email' }
    }

    // Resolve relative path
    const sourceDir = path.dirname(sourceFile)
    let resolvedPath

    if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
      // Relative to current file
      resolvedPath = path.resolve(sourceDir, linkPath)
    } else if (linkPath.startsWith('/')) {
      // Absolute from project root
      resolvedPath = path.join(this.projectRoot, linkPath.substring(1))
    } else {
      // Relative to docs root
      resolvedPath = path.resolve(sourceDir, linkPath)
    }

    // Remove fragment identifier
    const fragmentIndex = resolvedPath.indexOf('#')
    if (fragmentIndex !== -1) {
      resolvedPath = resolvedPath.substring(0, fragmentIndex)
    }

    const exists = fs.existsSync(resolvedPath)

    return {
      valid: exists,
      type: 'internal',
      resolvedPath,
      exists,
    }
  }

  /**
   * Check all links in a file
   */
  checkFileLinks(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const links = this.extractLinks(content, filePath)

      for (const link of links) {
        const validity = this.checkLinkValidity(link)

        if (validity.valid) {
          this.validLinks.push({ ...link, ...validity })
        } else {
          this.brokenLinks.push({ ...link, ...validity })
        }
      }

      this.checkedFiles.add(filePath)
    } catch (error) {
      console.error(
        `${colors.red}Error reading file ${filePath}:${colors.reset}`,
        error.message
      )
    }
  }

  /**
   * Generate report
   */
  generateReport() {
    console.log(
      `\n${colors.bold}${colors.cyan}Document Cross-Reference Validation Report${colors.reset}`
    )
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`)

    console.log(`${colors.blue}Summary:${colors.reset}`)
    console.log(`- Files checked: ${this.checkedFiles.size}`)
    console.log(`- Valid links: ${this.validLinks.length}`)
    console.log(`- Broken links: ${this.brokenLinks.length}\n`)

    if (this.brokenLinks.length > 0) {
      console.log(
        `${colors.red}${colors.bold}Broken Links Found:${colors.reset}`
      )
      console.log(`${colors.red}${'─'.repeat(30)}${colors.reset}`)

      // Group by source file
      const groupedByFile = {}
      this.brokenLinks.forEach((link) => {
        const relativePath = path.relative(this.projectRoot, link.sourceFile)
        if (!groupedByFile[relativePath]) {
          groupedByFile[relativePath] = []
        }
        groupedByFile[relativePath].push(link)
      })

      Object.entries(groupedByFile).forEach(([file, links]) => {
        console.log(`\n${colors.yellow}${file}:${colors.reset}`)
        links.forEach((link) => {
          console.log(
            `  ${colors.red}✗${colors.reset} Line ${link.lineNumber}: [${link.text}](${link.path})`
          )
          if (link.resolvedPath) {
            console.log(
              `    ${colors.gray}→ ${path.relative(this.projectRoot, link.resolvedPath)}${colors.reset}`
            )
          }
        })
      })
    }

    if (this.validLinks.length > 0) {
      console.log(
        `\n${colors.green}${colors.bold}Valid Links Summary:${colors.reset}`
      )
      const typeCount = {}
      this.validLinks.forEach((link) => {
        typeCount[link.type] = (typeCount[link.type] || 0) + 1
      })

      Object.entries(typeCount).forEach(([type, count]) => {
        console.log(`- ${type}: ${count}`)
      })
    }

    // Return exit code
    return this.brokenLinks.length === 0 ? 0 : 1
  }

  /**
   * Run the check
   */
  run() {
    console.log(
      `${colors.cyan}Checking document cross-references...${colors.reset}\n`
    )

    const markdownFiles = this.getAllMarkdownFiles()

    if (markdownFiles.length === 0) {
      console.log(
        `${colors.yellow}No markdown files found in docs directory.${colors.reset}`
      )
      return 0
    }

    console.log(`Found ${markdownFiles.length} markdown files to check.\n`)

    markdownFiles.forEach((file) => {
      const relativePath = path.relative(this.projectRoot, file)
      console.log(`Checking: ${relativePath}`)
      this.checkFileLinks(file)
    })

    return this.generateReport()
  }
}

// Run the checker
const checker = new DocumentCrossReferenceChecker()
const exitCode = checker.run()
process.exit(exitCode)
