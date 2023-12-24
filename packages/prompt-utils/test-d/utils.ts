export declare function getInputValues<T extends (inputValues: any) => string>(
  format: T,
): T extends (inputValues: infer InputValues) => string ? InputValues : never
