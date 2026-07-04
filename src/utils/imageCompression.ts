import imageCompression from 'browser-image-compression'
import type { Options } from 'browser-image-compression'
import { heicTo } from 'heic-to'

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

const convertHeicToJpeg = async (file: File): Promise<File> => {
  try {
    const blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 })
    const jpegName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
    console.info(
      `[heic-to] ${file.name}: ${(file.size / 1024).toFixed(1)}KB -> ${(blob.size / 1024).toFixed(1)}KB`
    )
    return new File([blob], jpegName, { type: 'image/jpeg', lastModified: file.lastModified })
  } catch (error) {
    console.error(`[heic-to] Failed to convert ${file.name}`, error)
    return file
  }
}

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
      let target = file

      if (isHeifFile(file)) {
        target = await convertHeicToJpeg(file)
      }

      const isImage = target.type?.startsWith('image/') ?? false
      if (!isImage) {
        return target
      }

      try {
        const output = await imageCompression(target, {
          ...options,
          fileType: target.type || options.fileType
        })

        console.info(
          `[imageCompression] ${target.name}: ${(target.size / 1024).toFixed(1)}KB -> ${(output.size / 1024).toFixed(1)}KB`
        )

        return new File([output], target.name, {
          type: output.type || target.type,
          lastModified: file.lastModified
        })
      } catch (error) {
        console.error(`[imageCompression] Failed to process ${target.name}`, error)
        return target
      }
    })
  )

  return compressed
}
