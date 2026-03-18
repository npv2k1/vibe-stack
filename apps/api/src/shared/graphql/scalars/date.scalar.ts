import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import moment from 'moment';

// @Scalar('Date', (type) => Date)
// export class DateScalar implements CustomScalar<Date, string> {
//   description = 'Date custom scalar type';

//   parseValue(value: number): Date {
//     console.log("🚀 ~ file: date.scalar.ts:9 ~ DateScalar ~ parseValue ~ value:", value)
//     return new Date(value); // value from the client
//   }

//   serialize(value: Date  ): string {

//     return moment(value).toDate(); // value sent to the client
//   }

//   parseLiteral(ast: ValueNode): Date {
//     if (ast.kind === Kind.INT) {
//       return new Date(ast.value);
//     }
//     return null;
//   }
// }
