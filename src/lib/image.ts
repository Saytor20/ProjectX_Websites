// Image handling utilities for the editor

/**
 * Validates if a URL points to a valid image
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Validates image URL and provides a promise that resolves when image loads
 */
export function validateAndLoadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!isValidImageUrl(url)) {
      reject(new Error('Invalid image URL format'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Set timeout to prevent hanging
    setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 10000);
    
    img.src = url;
  });
}

/**
 * Sets image source on an element (img tag or background image)
 */
export async function setImageSrc(element: HTMLElement, url: string): Promise<void> {
  if (!url) {
    // Clear image
    if (element.tagName === 'IMG') {
      (element as HTMLImageElement).src = '';
    } else {
      element.style.backgroundImage = '';
    }
    return;
  }

  try {
    // Validate and load image first
    await validateAndLoadImage(url);
    
    // Apply to element
    if (element.tagName === 'IMG') {
      (element as HTMLImageElement).src = url;
    } else {
      element.style.backgroundImage = `url("${url}")`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundPosition = 'center';
      element.style.backgroundRepeat = 'no-repeat';
    }
    
    console.log('Image set successfully:', url);
  } catch (error) {
    console.error('Failed to set image:', error);
    throw error;
  }
}

/**
 * Gets current image source from an element
 */
export function getImageSrc(element: HTMLElement): string {
  if (element.tagName === 'IMG') {
    return (element as HTMLImageElement).src || '';
  } else {
    const bgImage = element.style.backgroundImage;
    const match = bgImage.match(/url\(['"]?([^'"]*)['"]?\)/);
    return match ? (match[1] || '') : '';
  }
}

/**
 * Generates a placeholder image URL using a service
 */
export function getPlaceholderImage(width: number = 400, height: number = 300, text?: string): string {
  const baseUrl = 'https://via.placeholder.com';
  const dimensions = `${width}x${height}`;
  const color = '9CA3AF'; // Gray color
  const textColor = 'FFFFFF';
  
  let url = `${baseUrl}/${dimensions}/${color}/${textColor}`;
  
  if (text) {
    url += `?text=${encodeURIComponent(text)}`;
  }
  
  return url;
}

/**
 * Creates an image upload handler (basic file input)
 */
export function createImageUploader(
  onImageSelected: (dataUrl: string, file: File) => void,
  acceptTypes: string = 'image/*'
): () => void {
  return () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptTypes;
    input.multiple = false;
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file must be smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        onImageSelected(dataUrl, file);
      };
      
      reader.onerror = () => {
        alert('Failed to read image file.');
      };
      
      reader.readAsDataURL(file);
    };
    
    // Trigger file selection
    input.click();
  };
}

/**
 * Extracts dominant colors from an image
 */
export async function extractImageColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas to analyze image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Resize for performance
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        
        ctx.drawImage(img, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size);
        
        // Simple color extraction (sample center pixels)
        const colors: string[] = [];
        const data = imageData.data;
        const step = 4 * 5; // Sample every 5th pixel
        
        for (let i = 0; i < data.length; i += step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (r !== undefined && g !== undefined && b !== undefined) {
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            
            if (!colors.includes(hex) && hex !== '#000000') {
              colors.push(hex);
            }
            
            if (colors.length >= 5) break;
          }
        }
        
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for color extraction'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Optimizes image URL for better performance
 */
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  // For external URLs, try to add optimization parameters if supported
  try {
    const urlObj = new URL(url);
    
    // Common image optimization services
    if (urlObj.hostname.includes('cloudinary.com')) {
      // Cloudinary optimization
      if (width || height) {
        const params = new URLSearchParams();
        if (width) params.set('w', width.toString());
        if (height) params.set('h', height.toString());
        params.set('c', 'fill');
        params.set('q', 'auto');
        params.set('f', 'auto');
        
        // Insert parameters into Cloudinary URL
        const parts = url.split('/upload/');
        if (parts.length === 2) {
          return `${parts[0]}/upload/${params.toString().replace(/&/g, ',')}/${parts[1]}`;
        }
      }
    } else if (urlObj.hostname.includes('unsplash.com')) {
      // Unsplash optimization
      urlObj.searchParams.set('auto', 'format');
      if (width) urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      return urlObj.toString();
    }
    
    return url;
  } catch {
    return url;
  }
}