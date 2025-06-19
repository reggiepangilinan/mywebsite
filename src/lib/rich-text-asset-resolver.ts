/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from 'contentful'

// Helper function to manually resolve asset references in rich text
export async function resolveRichTextAssets(
  richTextContent: any
): Promise<any> {
  if (!richTextContent || !richTextContent.content) {
    return richTextContent
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

  if (!spaceId || !accessToken) {
    console.warn('Contentful credentials not available for asset resolution')
    return richTextContent
  }

  const client = createClient({
    space: spaceId,
    accessToken: accessToken,
  })

  // Find all asset references in the rich text
  const findAssetReferences = (node: any): string[] => {
    const assetIds: string[] = []

    if (
      node.nodeType === 'embedded-asset-block' &&
      node.data?.target?.sys?.id
    ) {
      assetIds.push(node.data.target.sys.id)
    }

    if (node.content) {
      for (const child of node.content) {
        assetIds.push(...findAssetReferences(child))
      }
    }

    return assetIds
  }

  const assetIds = findAssetReferences(richTextContent)

  if (assetIds.length === 0) {
    return richTextContent
  }

  // Fetch all referenced assets
  try {
    const assets = await client.getAssets({
      'sys.id[in]': assetIds,
    } as any)

    // Create a map of asset ID to asset data
    const assetMap = new Map()
    for (const asset of assets.items) {
      assetMap.set(asset.sys.id, asset)
    }

    // Replace asset references with full asset data
    const replaceAssetReferences = (node: any): any => {
      if (
        node.nodeType === 'embedded-asset-block' &&
        node.data?.target?.sys?.id
      ) {
        const assetId = node.data.target.sys.id
        const fullAsset = assetMap.get(assetId)

        if (fullAsset) {
          return {
            ...node,
            data: {
              ...node.data,
              target: fullAsset,
            },
          }
        }
      }

      if (node.content) {
        return {
          ...node,
          content: node.content.map(replaceAssetReferences),
        }
      }

      return node
    }

    return replaceAssetReferences(richTextContent)
  } catch (error) {
    console.error('Failed to resolve rich text assets:', error)
    return richTextContent
  }
}
