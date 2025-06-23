# GitHub Gist Embedding Feature

The RichTextRenderer now supports automatic embedding of GitHub Gists when Gist URLs are detected in hyperlinks.

## How It Works

When you include a GitHub Gist URL as a hyperlink in your Contentful rich text content, the RichTextRenderer will automatically detect it and render it as an embedded Gist instead of a regular link.

## Supported URL Formats

The following GitHub Gist URL formats are supported:

```
https://gist.github.com/username/gistId
https://gist.github.com/username/gistId/revision
https://gist.github.com/username/gistId?file=filename.ext
https://gist.github.com/username/gistId/revision?file=filename.ext
```

## Usage Examples

### Basic Gist Embedding

Simply add a link where the link text is the Gist URL:

```
https://gist.github.com/octocat/6cad326836d38bd3a7ae
```

### Specific File from Gist

To embed a specific file from a multi-file Gist:

```
https://gist.github.com/octocat/6cad326836d38bd3a7ae?file=hello.js
```

## When Gists Are Embedded vs. Linked

- **Embedded**: When the link text matches the Gist URL or contains "gist.github.com"
- **Regular Link**: When the link text is different (custom link text)

### Examples

**This will be embedded:**

```
Link text: https://gist.github.com/octocat/6cad326836d38bd3a7ae
URL: https://gist.github.com/octocat/6cad326836d38bd3a7ae
```

**This will be a regular link:**

```
Link text: Check out this code snippet
URL: https://gist.github.com/octocat/6cad326836d38bd3a7ae
```

## Features

### Styling

- Automatic theme adaptation (dark/light mode)
- Responsive design for mobile devices
- Consistent styling with site design system
- Hover effects and proper spacing

### Error Handling

- Graceful fallback for failed Gist loads
- Clear error messages with direct GitHub links
- Loading states with spinner animations
- Displays Gist ID and file information on errors

### Performance

- Lazy loading of Gist content
- Efficient script loading and cleanup
- Client-side rendering for optimal performance

## Implementation Details

The feature consists of:

1. **URL Detection**: Regex-based parsing of GitHub Gist URLs
2. **Conditional Rendering**: Smart detection of when to embed vs. link
3. **GitHubGist Component**: Dedicated React component for embedding
4. **Theme Integration**: CSS that adapts to site's color scheme
5. **Error Boundaries**: Robust error handling and fallbacks

## Browser Compatibility

- Modern browsers with JavaScript enabled
- Graceful degradation for users with JavaScript disabled
- Mobile-responsive design
- Accessibility features included

## Security

- All Gist embeds use HTTPS
- External links include `rel="noopener noreferrer"`
- Content is loaded from GitHub's official Gist service
- No execution of arbitrary code from user input
