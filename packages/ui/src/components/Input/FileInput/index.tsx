import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone-esm';
import { v4 as uuidv4 } from 'uuid';

import { Icon } from '../../Icon';
import { Preview } from '../../Preview/Preview';
import { InputProps } from '../Input.type';
import { Button } from '../../Button';

export interface FileInputProps extends Omit<InputProps<File | File[] | null>, 'value'> {
  value?: File | File[] | null;
  accept?: Accept;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  clearOnUpload?: boolean;
  errorMessages?: {
    maxSize?: string;
    maxFiles?: string;
    fileType?: string;
  };
}

interface FileWithDetails {
  file: File;
  preview?: string | null;
  id: string;
  error?: string;
}

const FileInput = ({
  value,
  onChange,
  accept,
  multiple = true,
  maxSize,
  maxFiles,
  clearOnUpload = false,
  errorMessages,
  ...props
}: FileInputProps) => {
  const [files, setFiles] = useState<FileWithDetails[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Use a ref to store the previous valid files so we don't call onChange unnecessarily
  const prevValidFilesRef = useRef<File[] | File | null>(null);

  const cleanupPreviews = useCallback((filesToClean: FileWithDetails[]) => {
    filesToClean.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }, []);

  // Only call onChange when the computed valid files actually change.
  useEffect(() => {
    const validFiles = files.filter((f) => !f.error).map((f) => f.file);
    const newValue = multiple ? validFiles : validFiles[0] || null;
    if (JSON.stringify(newValue) !== JSON.stringify(prevValidFilesRef.current)) {
      prevValidFilesRef.current = newValue;
      onChange?.(newValue);
    }
  }, [files, multiple, onChange]);

  // Clear files on upload if enabled.
  useEffect(() => {
    if (clearOnUpload && files.length > 0) {
      const validFiles = files.filter((f) => !f.error).map((f) => f.file);
      if (validFiles.length > 0) {
        cleanupPreviews(files);
        setFiles([]);
      }
    }
  }, [clearOnUpload, files, cleanupPreviews]);

  // Cleanup previews on unmount.
  useEffect(() => {
    return () => cleanupPreviews(files);
  }, [cleanupPreviews, files]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      const newErrors: string[] = [];

      rejectedFiles.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          switch (error.code) {
            case 'file-too-large':
              newErrors.push(
                errorMessages?.maxSize ||
                  `File ${rejection.file.name} is larger than ${
                    maxSize ? Math.round(maxSize / 1024 / 1024) : 'allowed'
                  } MB`,
              );
              break;
            case 'file-invalid-type':
              newErrors.push(errorMessages?.fileType || `File ${rejection.file.name} has an invalid file type`);
              break;
            default:
              newErrors.push(`Error with file ${rejection.file.name}: ${error.message}`);
          }
        });
      });

      if (maxFiles && files.length + acceptedFiles.length > maxFiles) {
        newErrors.push(errorMessages?.maxFiles || `Maximum number of files allowed is ${maxFiles}`);
        setErrors(newErrors);
        return;
      }

      setErrors(newErrors);

      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        id: uuidv4(),
      }));

      setFiles((prev) => {
        // Filter out duplicates based on file name and size.
        const uniqueFiles = newFiles.filter(
          (newFile) =>
            !prev.some(
              (existingFile) =>
                existingFile.file.name === newFile.file.name && existingFile.file.size === newFile.file.size,
            ),
        );
        return [...prev, ...uniqueFiles];
      });
    },
    [files.length, maxFiles, errorMessages],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.filter((file) => {
        if (file.id === id && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
        return file.id !== id;
      }),
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  const dropzoneClassName = useMemo(
    () =>
      `rounded-xl border-2 border-dashed p-6 sm:p-8 transition-all duration-200 cursor-pointer ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 scale-[1.02]'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
      }`,
    [isDragActive],
  );

  return (
    <div className="w-full space-y-4">
      <div className={dropzoneClassName} {...getRootProps()}>
        <input {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)} />
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={`rounded-full p-3 transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Icon
              name="FaUpload:fa6"
              className={`h-6 w-6 transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-500'}`}
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? (
                'Drop the files here'
              ) : (
                <>
                  Drag & drop files here, or{' '}
                  <span className="text-blue-600 hover:text-blue-700 font-semibold">browse</span>
                </>
              )}
            </p>
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max file size: {Math.round(maxSize / 1024 / 1024)}MB
                {maxFiles && ` • Max files: ${maxFiles}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4 shadow-sm">
          <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Uploaded Files ({files.length})</p>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {files.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-row items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 sm:p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow"
              >
                <div className="flex-1">
                  <Preview
                    file={item.file}
                    onChange={(file) => {
                      setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, file, preview: f.preview } : f)));
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeFile(item.id)}
                  className="flex-shrink-0 rounded-full p-2 text-red-600 transition-all hover:bg-red-50 hover:text-red-700"
                  aria-label="Remove file"
                >
                  <Icon name="Trash" className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { FileInput };
