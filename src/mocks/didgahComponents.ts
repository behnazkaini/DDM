/**
 * mocks/didgahComponents.ts
 *
 * Stub for "@models/didgah-components" – only used by Designer services
 * which are never rendered in this demo.
 */

export enum ConditionType {
  Equal = 1,
  NotEqual = 2,
  GreaterThan = 3,
  LessThan = 4,
  Contains = 5,
  StartsWith = 6,
  EndsWith = 7,
  IsNull = 8,
  IsNotNull = 9,
  GreaterThanOrEqual = 10,
  LessThanOrEqual = 11,
  In = 12,
}

export type QueryBuilderConditionGroupViewModel = any;
export type QueryBuilderConditionViewModel = any;
export type QueryBuilderViewModel = any;
export default {};
