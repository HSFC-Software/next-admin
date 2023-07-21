type Obj = {
  [key: string]: unknown;
};

/** Using global variable is a bad practice. 
    We should use them sparingly since they can introduce bugs and reduce our code’s modularity.
    However, we can safely use global variables to share constants across functions.
    Adding these method for tracking purposes. With these method we will easily identify 
    which part of the code uses a global variable.
    **Use this with caution**
 */

export const UNSAFE_registerProperty = (key: string, value: unknown): void => {
  if (Boolean((global as Obj)[key])) {
    console.warn(
      "file: global/index.ts:15 ~ UNSAFE_registerMethod:",
      "Overwriting existing property. [PROPERTY_NAME]:",
      key
    );
  }
  (global as Obj)[key] = value;
};

export const UNSAFE_registerMethod = (
  key: string,
  handler: () => void
): void => {
  if (Boolean((global as Obj)[key])) {
    console.warn(
      "file: global/index.ts:15 ~ UNSAFE_registerMethod:",
      "Overwriting existing method. [METHOD_NAME]:",
      key
    );
  }
  (global as Obj)[key] = handler;
};

// NOTE: All registered properties and methods must be declared in index.d.ts

export const UNSAFE_retrieveProperty = <I = undefined>(key: string): I => {
  return (global as Obj)?.[key] as I;
};

type Methods = {
  [key: string]: () => void;
};

export const UNSAFE_run = (key: string): unknown => {
  return (global as unknown as Methods)?.[key]?.();
};

export const UNSAFE_removeProperty = (key: string): void => {
  delete (global as Obj)?.[key];
};
