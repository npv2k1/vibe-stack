# Preview Component

A comprehensive React component for previewing various file types from user uploads or URLs.

## Features

- 📄 **Text Files**: Preview and edit text files with syntax highlighting
- 🖼️ **Images**: View images with optional canvas-based editing
- 🎵 **Audio**: Play audio files with HTML5 controls
- 🎥 **Video**: Play video files with HTML5 controls
- 📑 **PDF**: View PDF documents in an iframe
- 📊 **Office Documents**: Preview Word, Excel, and PowerPoint files
- 🔗 **URL Support**: Preview files from URLs or File objects
- 💾 **Memory Management**: Automatic cleanup of object URLs
- ⚡ **TypeScript**: Full TypeScript support with type definitions
- 🎨 **Customizable**: Apply custom styles and control visibility

## Installation

The Preview component is part of the `@vdailyapp/ui` package:

```bash
npm install @vdailyapp/ui
# or
pnpm add @vdailyapp/ui
```

## Basic Usage

```tsx
import { Preview } from '@vdailyapp/ui';

function MyComponent() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (newFile: File) => {
    console.log('File modified:', newFile);
  };

  return (
    <Preview 
      file={file} 
      onChange={handleFileChange}
      showControls={true}
    />
  );
}
```

## Props

### Main Preview Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File` | required | The file to preview |
| `onChange` | `(file: File) => void` | `undefined` | Callback when file is modified (for editable previews) |
| `className` | `string` | `''` | Custom CSS class |
| `showControls` | `boolean` | `true` | Whether to show preview controls |

## Supported File Types

### Text Files
- Plain text (`.txt`)
- Markdown (`.md`)
- JSON (`.json`)
- JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
- CSS/SCSS (`.css`, `.scss`)
- HTML/XML (`.html`, `.xml`)
- YAML (`.yaml`, `.yml`)
- CSV (`.csv`)

**Features:**
- Syntax highlighting via CodeInput
- In-place editing
- Save functionality

### Image Files
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)
- BMP (`.bmp`)
- WebP (`.webp`)
- SVG (`.svg`)

**Features:**
- Canvas-based editing
- Draw annotations
- Save edited images

### Audio Files
- MP3 (`.mp3`)
- WAV (`.wav`)
- OGG (`.ogg`)
- M4A (`.m4a`)
- AAC (`.aac`)
- FLAC (`.flac`)

**Features:**
- HTML5 audio player
- Standard playback controls

### Video Files
- MP4 (`.mp4`)
- WebM (`.webm`)
- OGG (`.ogg`)
- AVI (`.avi`)
- MOV (`.mov`)
- WMV (`.wmv`)
- FLV (`.flv`)

**Features:**
- HTML5 video player
- Full-screen modal view
- Standard playback controls

### PDF Files
- PDF (`.pdf`)

**Features:**
- Iframe-based viewer
- Full-screen modal view

### Microsoft Office Documents
- Word (`.doc`, `.docx`)
- Excel (`.xls`, `.xlsx`)
- PowerPoint (`.ppt`, `.pptx`)

**Features:**
- Microsoft Office Online Viewer (for URLs)
- Download option (for File objects)

### Unsupported Files
- Any other file type

**Features:**
- File information display
- Download option

## Compound Components

The Preview component also exports individual sub-components for direct use:

```tsx
import { Preview } from '@vdailyapp/ui';

// Use individual components
<Preview.Image value={file} onSave={handleSave} isOpen={true} onClose={handleClose} />
<Preview.Audio value={file} />
<Preview.Video value={file} />
<Preview.PDF value={file} height="600px" />
<Preview.Document value={file} height="600px" />
<Preview.Text value={file} onSave={handleSave} isOpen={true} onClose={handleClose} />
<Preview.Unsupported value={file} />
```

### Sub-component Props

#### Preview.Image

| Prop | Type | Description |
|------|------|-------------|
| `value` | `File \| string` | File or URL to preview |
| `isOpen` | `boolean` | Whether the preview modal is open |
| `onClose` | `() => void` | Callback to close the modal |
| `onSave` | `(file: File) => void` | Callback when saving changes |

#### Preview.Audio / Preview.Video

| Prop | Type | Description |
|------|------|-------------|
| `value` | `File \| string` | File or URL to preview |
| `className` | `string` | Custom CSS class |
| `style` | `React.CSSProperties` | Custom styles |

#### Preview.PDF / Preview.Document

| Prop | Type | Description |
|------|------|-------------|
| `value` | `File \| string` | File or URL to preview |
| `height` | `string \| number` | Height of the viewer (default: `600px`) |
| `className` | `string` | Custom CSS class |
| `style` | `React.CSSProperties` | Custom styles |

#### Preview.Text

| Prop | Type | Description |
|------|------|-------------|
| `value` | `File \| string` | File or URL to preview |
| `isOpen` | `boolean` | Whether the preview modal is open |
| `onClose` | `() => void` | Callback to close the modal |
| `onSave` | `(file: File) => void` | Callback when saving changes |

#### Preview.Unsupported

| Prop | Type | Description |
|------|------|-------------|
| `value` | `File \| string` | File or URL to display |
| `className` | `string` | Custom CSS class |
| `style` | `React.CSSProperties` | Custom styles |

## Advanced Usage

### URL-based Preview

```tsx
import { Preview } from '@vdailyapp/ui';

function URLPreview() {
  // Create a File object from a URL
  const loadFileFromUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'remote-file.pdf', { type: blob.type });
  };

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadFileFromUrl('https://example.com/document.pdf')
      .then(setFile);
  }, []);

  return file ? <Preview file={file} /> : <div>Loading...</div>;
}
```

### Custom Styling

```tsx
<Preview 
  file={file}
  className="my-custom-preview"
  showControls={true}
/>
```

### Disable Controls

```tsx
<Preview 
  file={file}
  showControls={false}
/>
```

### Direct Component Usage

```tsx
import { Preview } from '@vdailyapp/ui';
import { useState } from 'react';

function DirectComponentExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Preview</button>
      
      <Preview.Image
        value={imageFile}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(file) => {
          console.log('Saved:', file);
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

## Utility Functions

### getFileType

Detect file type from MIME type or file extension:

```tsx
import { getFileType } from '@vdailyapp/ui';
// or more specifically:
// import { getFileType } from '@vdailyapp/ui/Preview';

const type = getFileType(file); // 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'text' | 'unknown'
```

### getPreviewUrl

Get a preview URL from a File object or URL string:

```tsx
import { getPreviewUrl } from '@vdailyapp/ui';
// or more specifically:
// import { getPreviewUrl } from '@vdailyapp/ui/Preview';

const url = getPreviewUrl(file); // returns object URL or original URL string
```

## Technical Details

### Memory Management

The component automatically handles memory cleanup:
- Object URLs created from File objects are revoked when the component unmounts
- URL strings are not revoked (assumed to be managed externally)

### Type Detection

File types are detected using:
1. MIME type (primary method)
2. File extension (fallback for unknown MIME types)

### Browser Compatibility

- HTML5 audio/video support required for media playback
- Modern browser recommended for full feature support
- PDF preview requires iframe support
- Office document preview requires internet connection (uses Microsoft Office Online Viewer)

## Examples

See the Storybook stories for live examples:

```bash
pnpm storybook
```

Navigate to `UI/Preview` to see all file type examples.

## License

MIT
