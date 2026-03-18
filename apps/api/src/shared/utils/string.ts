const DEFAULT_SLUG_DELIMITER = '-';

export const toSlug = (value: string, delimiter = DEFAULT_SLUG_DELIMITER): string => {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, delimiter)
    .replace(/-+/g, delimiter)
    .replace(/^-+|-+$/g, '');
};
