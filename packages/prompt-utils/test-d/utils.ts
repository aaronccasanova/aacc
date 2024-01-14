export declare function getInputValues<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (inputValues: any) => string,
>(
  format: T,
): T extends (inputValues: infer InputValues) => string ? InputValues : never
