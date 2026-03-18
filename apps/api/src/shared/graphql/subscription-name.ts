export const SubEventName = {
  hello: 'hello',
  time: 'time',
} as const;
export type SubEventNameType = keyof typeof SubEventName & string;
