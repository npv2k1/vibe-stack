import _ from 'lodash';
global._ = _;

export function flattenObject(obj: any): any {
  const result: any = {};

  function recurse(curr: object, key: string) {
    if (_.isObject(curr) && !_.isDate(curr)) {
      if (_.isArray(curr)) {
        if (curr.every((value) => !_.isObject(value))) {
          // Array contains only primitive data; assign as-is
          result[key] = curr;
        } else {
          // Array contains objects; index into elements
          curr.forEach((value, index) => {
            const newKey = key ? `${key}.${index}` : `${index}`;
            recurse(value, newKey);
          });
        }
      } else {
        // Regular object; recurse into properties
        _.forOwn(curr, (value, prop) => {
          const newKey = key ? `${key}.${prop}` : prop;
          recurse(value, newKey);
        });
      }
    } else {
      result[key] = curr;
    }
  }

  recurse(obj, '');
  return result;
}
