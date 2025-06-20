# Open to Work Mode Feature

This feature allows you to conditionally show or hide job search related content on the About page based on an environment variable.

## Configuration

Add the following environment variable to your `.env.local` file:

```bash
# Job Search Mode Configuration
# Set to 'true' to show Key Skills, Tech Stack, Recent Experience, and Download Resume sections
# Set to 'false' or omit entirely to hide job search related content
OPEN_TO_WORK_MODE=false
```

## Behavior

### When `OPEN_TO_WORK_MODE=true`

The About page will display:

- ✅ **Open to Work announcement** - Prominent section with contact information
- ✅ **Key Skills** section
- ✅ **Tech Stack** section
- ✅ **Recent Experience** section
- ✅ **Download Resume** button

### When `OPEN_TO_WORK_MODE=false` or not set (default)

The About page will display:

- ❌ **Open to Work announcement** (hidden)
- ❌ **Key Skills** section (hidden)
- ❌ **Tech Stack** section (hidden)
- ❌ **Recent Experience** section (hidden)
- ❌ **Download Resume** button (hidden)

## Key Benefits

� **Build-Time Optimization**: Environment variable is read at build time for optimal performance
🔒 **Server-Side**: Environment variable is not exposed to client-side code  
🎯 **Static Generation**: Page is statically generated for fast loading
🔧 **Configuration Control**: Easy toggle between job search and portfolio modes

## Use Cases

- **Job Searching**: Set to `true` to show prominent "Open to Work" announcement with contact details, plus all professional content including skills, experience, and resume
- **Personal Mode**: Set to `false` to hide all career-related content and show only the personal introduction
- **Privacy**: Hide detailed professional information when not actively job searching
- **Portfolio Focus**: Keep the page minimal with just the personal introduction

## Implementation Details

The feature uses a **server-side environment variable** with static generation:

```tsx
// Server component reads environment variable at build time
export default function About() {
  const isOpenToWork = process.env.OPEN_TO_WORK_MODE === 'true'
  return <AboutContent isOpenToWork={isOpenToWork} />
}

// Client component receives the value as a prop
;('use client')
function AboutContent({ isOpenToWork }: { isOpenToWork: boolean }) {
  return (
    <div>
      {isOpenToWork && (
        <div className={styles.keySkillsSection}>
          {/* Key Skills content */}
        </div>
      )}
      {isOpenToWork && (
        <div className={styles.skillsSection}>{/* Tech Stack content */}</div>
      )}
      {isOpenToWork && (
        <div className={styles.experienceWrapper}>
          {/* Recent Experience and Download Resume content */}
        </div>
      )}
    </div>
  )
}
```

## Environment Variable Requirements

- **Variable Name**: `OPEN_TO_WORK_MODE` (no NEXT*PUBLIC* prefix needed)
- **Type**: String
- **Valid Values**: `'true'` or `'false'`
- **Default**: `false` (when not set or any other value)
- **Scope**: Server-side only (not exposed to client)

## Deployment

When deploying to Netlify or other hosting providers, make sure to set the environment variable in your deployment configuration:

### Netlify

1. Go to Site Settings → Environment Variables
2. Add `OPEN_TO_WORK_MODE` with value `true` or `false`
3. **Trigger a rebuild** for changes to take effect (since the page is statically generated)

### Local Development

1. Add the variable to your `.env.local` file
2. **Restart dev server or rebuild** for changes to take effect

**Important**: Since the About page is statically generated, changes to the `OPEN_TO_WORK_MODE` environment variable require a rebuild and redeploy to take effect.

## Testing

To test the feature locally:

```bash
# Test with feature enabled
OPEN_TO_WORK_MODE=true npm run build && npm run start

# Test with feature disabled (default)
npm run build && npm run start
```

Or during development:

```bash
# Set in .env.local then restart dev server
echo "OPEN_TO_WORK_MODE=true" >> .env.local
npm run dev
```

Navigate to `/about` to see the difference in content display.

**Note**: Since the page is statically generated, you need to rebuild after changing the environment variable.
