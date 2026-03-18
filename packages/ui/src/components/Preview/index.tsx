export * from './Preview';
export { default as AudioPreview } from './AudioPreview';
export { default as DocumentPreview } from './DocumentPreview';
export { default as ImagePreview } from './ImagePreview';
export { default as PDFPreview } from './PDFPreview';
export { default as TextPreview } from './TextPreview';
export { default as UnsupportedPreview } from './UnsupportedPreview';
export { default as VideoPreview } from './VideoPreview';
export * from './Preview.types';

// Re-export for compound component pattern
import { Preview as PreviewComponent } from './Preview';
import AudioPreview from './AudioPreview';
import DocumentPreview from './DocumentPreview';
import ImagePreview from './ImagePreview';
import PDFPreview from './PDFPreview';
import TextPreview from './TextPreview';
import UnsupportedPreview from './UnsupportedPreview';
import VideoPreview from './VideoPreview';

// Attach sub-components to main component
const Preview = PreviewComponent as typeof PreviewComponent & {
  Audio: typeof AudioPreview;
  Document: typeof DocumentPreview;
  Image: typeof ImagePreview;
  PDF: typeof PDFPreview;
  Text: typeof TextPreview;
  Video: typeof VideoPreview;
  Unsupported: typeof UnsupportedPreview;
};

Preview.Audio = AudioPreview;
Preview.Document = DocumentPreview;
Preview.Image = ImagePreview;
Preview.PDF = PDFPreview;
Preview.Text = TextPreview;
Preview.Video = VideoPreview;
Preview.Unsupported = UnsupportedPreview;

export { Preview };

