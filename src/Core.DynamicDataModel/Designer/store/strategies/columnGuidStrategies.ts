import { LayoutItemReferenceSetting } from "../../../../typings/Core.DynamicDataModel/Types";

type ColumnGuidStrategy = (design: LayoutItemReferenceSetting) => string[] | null;
type ReferenceConfigKeyOneToOne = (typeof ReferenceConfigKeyOneToOne)[keyof typeof ReferenceConfigKeyOneToOne];
type ReferenceConfigKeyOneToMany = (typeof ReferenceConfigKeyOneToMany)[keyof typeof ReferenceConfigKeyOneToMany];
type ReferenceConfigKey = ReferenceConfigKeyOneToOne | ReferenceConfigKeyOneToMany;

export const ReferenceConfigKeyOneToOne = {
  ReferenceAutoComplete: "ReferenceAutoCompleteColumnsConfige",
  ReferenceRadioButton: "ReferenceRadioButtonColumnsConfig",
} as const;

export const ReferenceConfigKeyOneToMany = {
  ReferenceTokenContainer: "ReferenceTokenContainerColumnsConfige",
  ReferenceCheckBoxList: "ReferenceCheckBoxListColumnsConfig",
} as const;

const strategyMap = new Map<ReferenceConfigKey, ColumnGuidStrategy>([
  [ReferenceConfigKeyOneToMany.ReferenceTokenContainer, (design) => (ReferenceConfigKeyOneToMany.ReferenceTokenContainer in design ? Object.keys(design[ReferenceConfigKeyOneToMany.ReferenceTokenContainer].Columns) : null)],
  [ReferenceConfigKeyOneToMany.ReferenceCheckBoxList, (design) => (ReferenceConfigKeyOneToMany.ReferenceCheckBoxList in design ? Object.keys(design[ReferenceConfigKeyOneToMany.ReferenceCheckBoxList].Columns) : null)],
  [ReferenceConfigKeyOneToOne.ReferenceAutoComplete, (design) => (ReferenceConfigKeyOneToOne.ReferenceAutoComplete in design ? Object.keys(design[ReferenceConfigKeyOneToOne.ReferenceAutoComplete].Columns) : null)],
  [ReferenceConfigKeyOneToOne.ReferenceRadioButton, (design) => (ReferenceConfigKeyOneToOne.ReferenceRadioButton in design ? Object.keys(design[ReferenceConfigKeyOneToOne.ReferenceRadioButton].Columns) : null)],
]);

const resolveColumnGuidsByStrategies = <TKey extends ReferenceConfigKey>(design: LayoutItemReferenceSetting, strategyKeys: readonly TKey[]): string[] => {
  for (const key of strategyKeys) {
    const strategy = strategyMap.get(key);
    if (!strategy) continue;

    const result = strategy(design);
    if (result) return result;
  }
  return [];
};

const aggregationOneToManyStrategyKeys = [ReferenceConfigKeyOneToMany.ReferenceTokenContainer, ReferenceConfigKeyOneToMany.ReferenceCheckBoxList] as const;

const aggregationOneToOneStrategyKeys = [ReferenceConfigKeyOneToOne.ReferenceAutoComplete, ReferenceConfigKeyOneToOne.ReferenceRadioButton] as const;

export const resolveAggregationOneToManyColumnGuids = (design: LayoutItemReferenceSetting) => resolveColumnGuidsByStrategies(design, aggregationOneToManyStrategyKeys);

export const resolveAggregationOneToOneColumnGuids = (design: LayoutItemReferenceSetting) => resolveColumnGuidsByStrategies(design, aggregationOneToOneStrategyKeys);
