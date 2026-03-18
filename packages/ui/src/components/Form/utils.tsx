import { FormConfig, FormType } from './Form.types';
import { flattenObject } from '../utils';
import z from 'zod';

export function generateFormConfig(init: Record<string, any>, prefix?: string): FormConfig[] {
  const jsonData = flattenObject(init);
  const formConfig: FormConfig[] = [];

  for (const [key, value] of Object.entries(jsonData)) {
    const fieldConfig: FormConfig = {
      label: prefix ? `${prefix}.${key}` : key,
      name: prefix ? `${prefix}.${key}` : key,
      defaultValue: value,
    };

    switch (typeof value) {
      case 'string':
        fieldConfig.type = FormType.Text;
        break;
      case 'number':
        fieldConfig.type = FormType.Number;
        break;
      case 'boolean':
        fieldConfig.type = FormType.Switch;
        break;
      default:
        if (Array.isArray(value)) {
          fieldConfig.type = FormType.Text;
        } else if (typeof value === 'object') {
          formConfig.push(...generateFormConfig(value));
          continue; // Skip adding fieldConfig for nested objects
        }
    }

    formConfig.push(fieldConfig);
  }

  return formConfig;
}

type Field = { name: string; schema?: z.ZodTypeAny };

export const makeSchema = (config: Field[]) => {
  const shape: Record<string, any> = {};

  for (const { name, schema } of config) {
    _.set(shape, name, schema ?? z.any());
  }

  const convertToZod = (obj: any): z.ZodTypeAny => {
    if (obj instanceof z.ZodType) return obj;

    const inner: Record<string, z.ZodTypeAny> = {};
    for (const [k, v] of Object.entries(obj)) {
      inner[k] = convertToZod(v);
    }
    return z.object(inner);
  };

  return convertToZod(shape);
};
