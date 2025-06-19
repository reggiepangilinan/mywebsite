/* eslint-disable @typescript-eslint/no-explicit-any */
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { ReactNode } from 'react'
import DebugImage from '@/components/DebugImage'
import styles from './RichTextRenderer.module.css'
import { logToLocalStorage } from '@/lib/production-logger'

interface RichTextRendererProps {
  content: Document
}

// Custom rendering options for rich text content
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
      <p className={styles.paragraph} style={{ marginTop: 0 }}>
        {children}
      </p>
    ),
    // Ignore H1 elements - blog post already has an H1 title
    [BLOCKS.HEADING_1]: () => null,
    // Ignore table elements
    [BLOCKS.TABLE]: () => null,
    [BLOCKS.TABLE_ROW]: () => null,
    [BLOCKS.TABLE_CELL]: () => null,
    [BLOCKS.TABLE_HEADER_CELL]: () => null,
    [BLOCKS.HEADING_2]: (node: any, children: ReactNode) => (
      <h2 className={styles.heading2}>{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: ReactNode) => (
      <h3 className={styles.heading3}>{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
      <h4 className={styles.heading4}>{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: ReactNode) => (
      <h5 className={styles.heading5}>{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: ReactNode) => (
      <h6 className={styles.heading6}>{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
      <ul className={styles.unorderedList}>{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: ReactNode) => (
      <ol className={styles.orderedList}>{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
      <li className={styles.listItem}>{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: ReactNode) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className={styles.horizontalRule} />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const asset = node.data.target

      // Enhanced debugging and error handling
      logToLocalStorage('richtext-embedded-asset', {
        hasAsset: !!asset,
        asset: asset
          ? {
              hasFields: !!asset.fields,
              hasFile: !!asset.fields?.file,
              hasUrl: !!asset.fields?.file?.url,
              contentType: asset.fields?.file?.contentType,
              url: asset.fields?.file?.url,
            }
          : null,
      })

      if (!asset) {
        logToLocalStorage(
          'richtext-error',
          'Embedded asset node has no target data'
        )
        return (
          <div className={styles.embeddedImageContainer}>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center' as const,
                color: '#666',
              }}
            >
              Missing asset data
            </div>
          </div>
        )
      }

      if (!asset.fields) {
        logToLocalStorage('richtext-error', {
          message: 'Asset has no fields',
          asset,
        })
        return (
          <div className={styles.embeddedImageContainer}>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center' as const,
                color: '#666',
              }}
            >
              Asset fields missing
            </div>
          </div>
        )
      }

      if (!asset.fields.file) {
        logToLocalStorage('richtext-error', {
          message: 'Asset has no file field',
          fields: asset.fields,
        })
        return (
          <div className={styles.embeddedImageContainer}>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center' as const,
                color: '#666',
              }}
            >
              Asset file missing
            </div>
          </div>
        )
      }

      const { url, fileName, contentType } = asset.fields.file

      if (!url) {
        logToLocalStorage('richtext-error', {
          message: 'Asset file has no URL',
          file: asset.fields.file,
        })
        return (
          <div className={styles.embeddedImageContainer}>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center' as const,
                color: '#666',
              }}
            >
              Image URL missing
            </div>
          </div>
        )
      }

      const imageUrl = url.startsWith('//') ? `https:${url}` : url

      if (contentType?.startsWith('image/')) {
        const dimensions = asset.fields.file.details?.image || {}
        const width = dimensions.width || 800
        const height = dimensions.height || 400
        const alt =
          asset.fields.title ||
          asset.fields.description ||
          fileName ||
          'Embedded image'

        logToLocalStorage('richtext-image', {
          imageUrl,
          alt,
          width,
          height,
          contentType,
        })

        return (
          <figure className={styles.embeddedImageContainer}>
            <DebugImage
              src={imageUrl}
              alt={alt}
              width={width}
              height={height}
              className={styles.embeddedImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
            {asset.fields.description && (
              <figcaption className={styles.embeddedImageCaption}>
                {asset.fields.description}
              </figcaption>
            )}
          </figure>
        )
      } else {
        logToLocalStorage('richtext-error', {
          message: 'Asset is not an image',
          contentType,
          fileName,
        })
        return (
          <div className={styles.embeddedImageContainer}>
            <div
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'center' as const,
                color: '#666',
              }}
            >
              Non-image asset: {fileName || 'Unknown file'}
            </div>
          </div>
        )
      }
    },
    [INLINES.HYPERLINK]: (node: any, children: ReactNode) => (
      <a
        href={node.data.uri}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => (
      <strong className={styles.bold}>{text}</strong>
    ),
    [MARKS.ITALIC]: (text: ReactNode) => (
      <em className={styles.italic}>{text}</em>
    ),
    [MARKS.UNDERLINE]: (text: ReactNode) => (
      <u className={styles.underline}>{text}</u>
    ),
    [MARKS.CODE]: (text: ReactNode) => (
      <code className={styles.inlineCode}>{text}</code>
    ),
  },
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content) {
    logToLocalStorage('richtext-error', 'No content provided')
    return <p>No content available.</p>
  }

  // Enhanced debugging for rich text content
  logToLocalStorage('richtext-content', {
    nodeType: content.nodeType,
    hasContent: !!content.content,
    contentLength: content.content?.length || 0,
  })

  // Look for embedded assets in the content tree
  const findEmbeddedAssets = (node: any): any[] => {
    const assets: any[] = []

    if (node.nodeType === 'embedded-asset-block') {
      assets.push(node)
    }

    if (node.content) {
      for (const child of node.content) {
        assets.push(...findEmbeddedAssets(child))
      }
    }

    return assets
  }

  const embeddedAssets = findEmbeddedAssets(content)
  logToLocalStorage('richtext-assets', {
    count: embeddedAssets.length,
    assets: embeddedAssets.map((asset) => ({
      nodeType: asset.nodeType,
      hasTarget: !!asset.data?.target,
      targetId: asset.data?.target?.sys?.id,
      hasTargetFields: !!asset.data?.target?.fields,
    })),
  })

  return (
    <div className={styles.richTextContent}>
      {documentToReactComponents(content, renderOptions)}
    </div>
  )
}
