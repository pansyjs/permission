import { and, not, or } from './logic';

import type { Authority, PermissionCode } from '../types';

export const operators = ['&', '|', '!', '(', ')'];

export type OperatorString = (typeof operators)[number];

export enum CompilerErrorCode {
  Invalid = 'Invalid',
}

export const CompilerError: { [key: string]: Error } = {
  [CompilerErrorCode.Invalid]: {
    name: CompilerErrorCode.Invalid,
    message: '错误的权限表达式表达式',
  },
};

export const isOperator = (c: string): boolean => operators.indexOf(c) > -1;

export const compile = (expression: Authority | string): Authority => {
  if (expression) {
    if (typeof expression === 'string') {
      const post = mid2Post(expression);
      return calcPostExpression(post);
    } else {
      return expression;
    }
  } else {
    return undefined;
  }
};

const priorityMap = {
  '&': 0,
  '|': 0,
  '!': 1,
};

export function calcPostExpression(post: (PermissionCode | OperatorString)[]): Authority {
  const resultStack: Authority[] = [];
  for (let i = 0; i < post.length; ++i) {
    if (isOperator(post[i])) {
      if (post[i] === '!') {
        if (resultStack.length > 0) {
          const x = resultStack.pop();
          resultStack.push(not(x));
        } else {
          throw new Error(CompilerError[CompilerErrorCode.Invalid].message);
        }
      } else {
        if (resultStack.length > 1) {
          const x = resultStack.pop();
          const y = resultStack.pop();
          if (post[i] === '&') {
            resultStack.push(and(x, y));
          } else if (post[i] === '|') {
            resultStack.push(or(x, y));
          }
        } else {
          throw new Error(CompilerError[CompilerErrorCode.Invalid].message);
        }
      }
    } else {
      resultStack.push(post[i] as PermissionCode);
    }
  }
  if (resultStack.length === 1) {
    return resultStack[0];
  } else {
    throw new Error(CompilerError[CompilerErrorCode.Invalid].message);
  }
}

//将中序表达式处理成后续表达式
export function mid2Post(expression: string): (PermissionCode | OperatorString)[] {
  const operators = [];
  const post = [];
  const expressionLength = expression.length;
  let index = 0;
  while (index < expressionLength) {
    //如果是右括号
    if (expression[index] === ')') {
      if (operators.length > 0) {
        while (operators[operators.length - 1] !== '(') {
          // @ts-ignore
          post.push(operators.pop());
        }
        operators.pop();
      } else {
        throw new Error(CompilerError[CompilerErrorCode.Invalid].message);
      }
      index++;
    } else {
      if (isOperator(expression[index])) {
        if (expression[index] !== '(') {
          while (
            operators.length > 0 &&
            //@ts-ignore
            priorityMap[operators[operators.length - 1]] >= priorityMap[expression[index]]
          ) {
            // @ts-ignore
            post.push(operators.pop());
          }
        }
        // @ts-ignore
        operators.push(expression[index]);
        index++;
      } else {
        let tmp = '';
        while (index < expressionLength && !isOperator(expression[index])) {
          tmp += expression[index];
          index++;
        }
        const trimTmp = tmp.trim();
        if (trimTmp.length > 0) {
          // @ts-ignore
          post.push(trimTmp);
        }
      }
    }
  }

  while (operators.length > 0) {
    // @ts-ignore
    post.push(operators.pop());
  }

  return post as string[];
}
