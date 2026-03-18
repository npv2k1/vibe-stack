import { ChangeEvent, useEffect, useRef, useState } from 'react';

export type AvatarInputProps = {
  value?: string;
  onChange?: (file: File) => void;
  resolveImage?: (key: string) => Promise<string>;
};

export const AvatarInput = ({ value, onChange, resolveImage }: AvatarInputProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value || isResolved) return;

    if (resolveImage) {
      setIsLoading(true);
      resolveImage(value).then((url) => {
        setPreview(url);
        setIsLoading(false);
      });
      setIsResolved(true);
    } else {
      setPreview(value);
    }
  }, [value, isResolved]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange?.(file);

    setIsLoading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="group relative cursor-pointer" onClick={handleClick}>
        {isLoading ? (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Avatar preview"
              className="h-32 w-32 rounded-full border-4 border-gray-200 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="text-sm text-white">Change Photo</p>
            </div>
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-gray-300 bg-gray-200 transition-colors duration-200 group-hover:border-gray-400">
            <svg
              className="h-8 w-8 text-gray-400 group-hover:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

      {preview && (
        <button
          onClick={handleRemove}
          className="text-sm font-medium text-red-500 transition-colors duration-200 hover:text-red-600"
        >
          Remove Photo
        </button>
      )}

      <p className="mt-2 text-center text-sm text-gray-500">
        Click to upload or drag and drop
        <br />
        PNG, JPG up to 10MB
      </p>
    </div>
  );
};
