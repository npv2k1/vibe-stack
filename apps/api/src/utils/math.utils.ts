import Big from 'big.js';

/**
 * Safely parses a number into a Big instance.
 * @param number - The number to parse.
 * @param defaultValue - Fallback value in case of error.
 * @returns Big instance.
 */
export const parseNumber = (number: number, defaultValue = 0): Big => {
  try {
    return new Big(number);
  } catch (error) {
    console.error('Error in parseNumber:', { input: number, error });
    return new Big(defaultValue);
  }
};

/**
 * Subtracts numbers from left to right.
 * @param arr - Numbers to subtract.
 * @returns The result of the subtraction.
 */
export const minus = (...arr: number[]): number => {
  if (arr.length === 0) return 0;
  try {
    const [first, ...rest] = arr;
    return Number(
      rest.reduce(
        (acc, curr) => acc.minus(parseNumber(curr)),
        parseNumber(first),
      ),
    );
  } catch (error) {
    console.error('Error in minus:', { inputs: arr, error });
    return 0;
  }
};

/**
 * Adds all the numbers.
 * @param arr - Numbers to add.
 * @returns The result of the addition.
 */
export const plus = (...arr: number[]): number => {
  try {
    return Number(
      arr.reduce((acc, curr) => acc.plus(parseNumber(curr)), new Big(0)),
    );
  } catch (error) {
    console.error('Error in plus:', { inputs: arr, error });
    return 0;
  }
};

/**
 * Multiplies all the numbers.
 * @param arr - Numbers to multiply.
 * @returns The result of the multiplication.
 */
export const mul = (...arr: number[]): number => {
  if (arr.length === 0) return 0;
  try {
    return Number(
      arr.reduce((acc, curr) => acc.mul(parseNumber(curr, 1)), new Big(1)),
    );
  } catch (error) {
    console.error('Error in mul:', { inputs: arr, error });
    return 0;
  }
};

/**
 * Divides numbers from left to right.
 * @param arr - Numbers to divide.
 * @returns The result of the division.
 */
export const div = (...arr: number[]): number => {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];

  try {
    if (arr.slice(1).some((num) => num === 0)) {
      console.error('Error in div: Division by zero in', arr);
      return 0;
    }

    const [first, ...rest] = arr;
    return Number(
      rest.reduce(
        (acc, curr) => acc.div(parseNumber(curr, 1)),
        parseNumber(first),
      ),
    );
  } catch (error) {
    console.error('Error in div:', { inputs: arr, error });
    return 0;
  }
};
