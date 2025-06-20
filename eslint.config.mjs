import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const guardConfig = require("./scripts/guard-config.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Generate configurable patterns from guard config
function generateESLintPatterns() {
  const patterns = [];
  
  // Domain patterns
  guardConfig.patterns.domains.forEach(domain => {
    patterns.push({
      test: (value) => typeof value === 'string' && value.includes(domain),
      message: 'Use SITE_CONFIG.url instead of hardcoded domain URL. Import from @/config/site'
    });
  });

  // Email patterns
  guardConfig.patterns.emails.forEach(email => {
    patterns.push({
      test: (value) => typeof value === 'string' && value.includes(email),
      message: 'Use SITE_CONFIG.contact.email instead of hardcoded email. Import from @/config/site'
    });
  });

  // Name patterns
  guardConfig.patterns.names.forEach(name => {
    patterns.push({
      test: (value) => typeof value === 'string' && value.includes(name),
      message: 'Use SITE_CONFIG.name or SITE_CONFIG.author instead of hardcoded name. Import from @/config/site',
      excludeIfContains: guardConfig.contentExclusions
    });
  });

  // Social handle patterns
  guardConfig.patterns.socialHandles.forEach(handle => {
    patterns.push({
      test: (value) => typeof value === 'string' && value === handle,
      message: 'Use SITE_CONFIG.social.twitter instead of hardcoded Twitter handle. Import from @/config/site'
    });
  });

  // Social URL patterns
  guardConfig.patterns.socialUrls.forEach(url => {
    patterns.push({
      test: (value) => typeof value === 'string' && value.includes(url),
      message: url.includes('github') 
        ? 'Use SITE_CONFIG.social.github instead of hardcoded social URLs. Import from @/config/site'
        : 'Use SITE_CONFIG.social.linkedin instead of hardcoded social URLs. Import from @/config/site'
    });
  });

  return patterns;
}

const configurablePatterns = generateESLintPatterns();

// Import custom rules for SITE_CONFIG enforcement using configurable patterns
const customRules = {
  rules: {
    // Prevent hardcoded values based on SITE_CONFIG patterns
    'no-hardcoded-domain': {
      meta: {
        fixable: 'code'
      },
      create: function(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check against all configurable patterns
              configurablePatterns.forEach(pattern => {
                if (pattern.test(node.value)) {
                  // Check content exclusions
                  const sourceCode = context.getSourceCode();
                  const line = sourceCode.lines[node.loc.start.line - 1];
                  
                  if (pattern.excludeIfContains && 
                      pattern.excludeIfContains.some(exclude => line.includes(exclude))) {
                    return;
                  }

                  context.report({
                    node,
                    message: pattern.message,
                    fix: function(fixer) {
                      // Simple fix for domain replacement
                      if (pattern.message.includes('SITE_CONFIG.url')) {
                        const newValue = node.value.replace(/https?:\/\/reggiepangilinan\.com/g, '${SITE_CONFIG.url}');
                        if (newValue !== node.value) {
                          return fixer.replaceText(node, `\`${newValue}\``);
                        }
                      }
                      return null;
                    }
                  });
                }
              });
            }
          },
          
          TemplateElement(node) {
            if (node.value && node.value.raw) {
              // Check template literals against domain patterns
              const domainPatterns = configurablePatterns.filter(p => 
                p.message.includes('SITE_CONFIG.url')
              );
              
              domainPatterns.forEach(pattern => {
                // Simple check for domains in template literals
                if (node.value.raw.includes('reggiepangilinan.com')) {
                  context.report({
                    node,
                    message: pattern.message
                  });
                }
              });
            }
          }
        };
      }
    },
    
    // Ensure SITE_CONFIG is imported when used
    'require-site-config-import': {
      meta: {
        fixable: null
      },
      create: function(context) {
        let hasSiteConfigImport = false;
        let usesSiteConfig = false;
        
        return {
          ImportDeclaration(node) {
            if (node.source.value === '@/config/site' && 
                node.specifiers.some(spec => spec.imported && spec.imported.name === 'SITE_CONFIG')) {
              hasSiteConfigImport = true;
            }
          },
          
          MemberExpression(node) {
            if (node.object.name === 'SITE_CONFIG') {
              usesSiteConfig = true;
            }
          },
          
          'Program:exit'() {
            if (usesSiteConfig && !hasSiteConfigImport) {
              context.report({
                message: 'SITE_CONFIG is used but not imported. Add: import { SITE_CONFIG } from "@/config/site"',
                loc: { line: 1, column: 0 }
              });
            }
          }
        };
      }
    }
  }
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["src/config/site.ts", "scripts/**/*"], // Allow hardcoded values in config and scripts
    plugins: {
      'site-config': customRules
    },
    rules: {
      'site-config/no-hardcoded-domain': 'error',
      'site-config/require-site-config-import': 'error'
    }
  },
  {
    files: ["scripts/**/*.js"],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'site-config/no-hardcoded-domain': 'off',
      'site-config/require-site-config-import': 'off'
    }
  }
];

export default eslintConfig;
