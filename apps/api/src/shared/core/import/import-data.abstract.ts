import { BadRequestException } from '@nestjs/common';
import { Buffer } from 'buffer';
import { isEmpty } from 'class-validator';
import { Row, Workbook, Worksheet } from 'exceljs';
import { get, invert } from 'lodash';
import { z } from 'zod';

import { minus } from '@/utils/math.utils';

export const MAX_SIZE_FILE_UPLOAD = {
  EXPORT_PLAN: 5 * 1024 * 1024,
  BASE: 4 * 1024 * 1024,
  SO: 4 * 1024 * 1024,
  IMPORT: 2 * 1024 * 1024,
  SIZE: 5 * 1024 * 1024,
};

export const DEFAULT_SHEET = 'data';

export type ImportOption = {
  request: Express.Multer.File;
  sheetName?: string;
  onRow?: (data: any, rowIndex: number) => Promise<true | string>;
  importLine?: boolean;
};

export abstract class ImportDataAbstract {
  protected constructor() {}

  private async validate(
    request: Express.Multer.File,
    sheetName?: string,
  ): Promise<[Workbook, Worksheet]> {
    const { buffer } = request;
    let workbook = new Workbook();
    const SHEET_NAME = sheetName ? sheetName : DEFAULT_SHEET;
    if (isEmpty(buffer)) {
      throw new BadRequestException();
    }
    const isValidSize =
      minus(buffer.byteLength || 0, MAX_SIZE_FILE_UPLOAD.SIZE) <= 0;

    if (!isValidSize) {
      throw new BadRequestException();
    }

    workbook = await workbook.xlsx.load(Buffer.from(buffer) as any);
    const worksheet = workbook.getWorksheet(SHEET_NAME);
    if (!worksheet) throw new BadRequestException();
    return [workbook, worksheet];
  }

  abstract getColumns(): { [key: string]: string };
  abstract getDataSchema(): z.ZodObject<any>;

  validateHeader(headers) {
    const error: any = [];
    const columnMapping = invert(this.getColumns());

    if (headers.length !== Object.keys(columnMapping).length) {
      error.push('invalid header');
    }

    const headerKeys = headers.map((header) => {
      if (!columnMapping[header]) {
        error.push(`missing columns ${header}`);
      }
      return columnMapping[header];
    });

    if (error.length !== 0) {
      throw new BadRequestException('Invalid template');
    }

    return headerKeys.filter((key) => key !== null);
  }

  protected async importUtil(optional: ImportOption): Promise<any> {
    const { request, sheetName, onRow, importLine } = optional;
    const [workbook, worksheet] = await this.validate(request, sheetName);

    let totalCount = 0;
    let successCount = 0;
    const lines: any = [];
    const logs: string[] = [];

    const dataSchema = this.getDataSchema();

    const headers = (worksheet.getRow(1).values as string[]).filter(
      (key) => key !== null,
    ); // get list header in excel file

    const headerKeys = this.validateHeader(headers);

    const statusColumn = headers.length + 1;
    worksheet.getRow(1).getCell(statusColumn).value = 'Status';

    const headersTitle = this.getColumns();

    // Collect rows to process them asynchronously
    const rows: {
      row: Row;
      rowNumber: number;
    }[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      rows.push({ row, rowNumber });
    });

    // Process each row
    for (const { row, rowNumber } of rows) {
      const rowData: { [key: string]: any } = {};

      // Map row data based on headerKeys
      for (let index = 0; index < headerKeys.length; index++) {
        const key = headerKeys[index];
        if (key) {
          rowData[key] = row.getCell(index + 1).text; // value is raw value, text is formated text
        }
      }

      if (Object.keys(rowData).length > 0) {
        totalCount += 1;
      }

      // Validate data with Zod
      try {
        const parsedData = dataSchema.parse(rowData);
        if (importLine) {
          lines.push(parsedData);
          successCount += 1;
        } else {
          const processedData = await onRow?.(parsedData, rowNumber - 2);
          if (processedData === true) {
            successCount += 1;
            row.getCell(statusColumn).value = 'Success';
          } else {
            processedData && logs.push(processedData);
            row.getCell(statusColumn).value = processedData;
          }
        }
      } catch (error) {
        console.log({ error });
        if (error instanceof z.ZodError) {
          const zError = error.issues.map((e) => {
            const header = get(headersTitle, e.path, null);
            const message = e.message;
            return `${header} - ${message}`;
          });
          logs.push(...zError);
          row.getCell(statusColumn).value = zError.join(', ');
        } else {
          logs.push(error.message);
          row.getCell(statusColumn).value = error.message;
        }
      }

      // Commit changes to the row
      row.commit();
    }

    if (importLine) {
      if (!lines) {
        throw new BadRequestException();
      }
      return lines;
    }

    const response: any = {};
    response.result = await workbook.xlsx.writeBuffer();
    response.totalCount = totalCount;
    response.successCount = successCount;
    return response;
  }
}
