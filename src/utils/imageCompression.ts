import imageCompression from 'browser-image-compression'
import type { Options } from 'browser-image-compression'

type FileInput = File | File[] | FileList

const DEFAULT_OPTIONS: Options = {
  maxWidthOrHeight: 1920,
  initialQuality: 0.75,
  useWebWorker: true
}

const HEIF_MIME_TYPES = new Set(['image/heic', 'image/heif'])
const HEIF_EXTENSIONS = ['.heic', '.heif']

const isHeifFile = (file: File): boolean => {
  const type = file.type?.toLowerCase()
  if (type && HEIF_MIME_TYPES.has(type)) {
    return true
  }

  const name = file.name?.toLowerCase() || ''
  return HEIF_EXTENSIONS.some((ext) => name.endsWith(ext))
}

/**
 * Compresses/resizes images in the browser before upload.
 * HEIF/HEIC files are skipped and handled by the backend.
 */
export const compressImageFiles = async (
  input: FileInput,
  overrides: Partial<Options> = {}
): Promise<File[]> => {
  const files = Array.isArray(input)
    ? input
    : input instanceof File
    ? [input]
    : Array.from(input || [])

  const options: Options = {
    ...DEFAULT_OPTIONS,
    ...overrides
  }

  const compressed = await Promise.all(
    files.map(async (file) => {
      const isImage = file.type?.startsWith('image/') ?? false
      if (!isImage || isHeifFile(file)) {
        if (isHeifFile(file)) {
          console.info(`[imageCompression] Skipping HEIF file ${file.name}; handled on server`)
        }
        return file
      }

      try {
        const output = await imageCompression(file, {
          ...options,
          fileType: file.type || options.fileType
        })

        console.info(
          `[imageCompression] ${file.name}: ${(file.size / 1024).toFixed(1)}KB -> ${(output.size / 1024).toFixed(1)}KB`
        )

        return new File([output], file.name, {
          type: output.type || file.type,
          lastModified: file.lastModified
        })
      } catch (error) {
        console.error(`[imageCompression] Failed to process ${file.name}`, error)
        return file
      }
    })
  )

  return compressed
}
