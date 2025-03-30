import sharp from 'sharp';

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: keyof sharp.FormatEnum;
}

export async function optimizeImage(
  buffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const defaultOptions = {
    maxWidth: 500,
    maxHeight: 500,
    quality: 80,
    format: 'webp' as const,
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const optimized = await sharp(buffer)
      .resize(finalOptions.maxWidth, finalOptions.maxHeight, {
        fit: 'inside',
      })
      .toFormat(finalOptions.format, {
        quality: finalOptions.quality,
      })
      .toBuffer();

    return optimized;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

export async function optimizeAvatar(buffer: Buffer): Promise<Buffer> {
  return optimizeImage(buffer, {
    maxWidth: 500,
    maxHeight: 500,
    quality: 80,
    format: 'webp' as const,
  });
}
