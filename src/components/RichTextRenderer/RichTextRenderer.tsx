/* eslint-disable @typescript-eslint/no-explicit-any */
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { ReactNode } from 'react'
import Image from 'next/image'
import styles from './RichTextRenderer.module.css'

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
      if (asset?.fields?.file) {
        const { url, fileName, contentType } = asset.fields.file
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

          return (
            <figure className={styles.embeddedImageContainer}>
              <Image
                src={imageUrl}
                alt={alt}
                width={width}
                height={height}
                className={styles.embeddedImage}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                unoptimized
              />
              {asset.fields.description && (
                <figcaption className={styles.embeddedImageCaption}>
                  {asset.fields.description}
                </figcaption>
              )}
            </figure>
          )
        }
      }
      return null
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
    return <p>No content available.</p>
  }

  return (
    <div className={styles.richTextContent}>
      {documentToReactComponents(content, renderOptions)}
    </div>
  )
}
