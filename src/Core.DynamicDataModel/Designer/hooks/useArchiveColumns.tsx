import { CheckboxItem } from "didgah/ant-core-component";
import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import * as React from "react";
import { GlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";
import { LayoutItemReferenceViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";

const useArchiveColumns = (): Array<CheckboxItem> => {
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const allCheckedBox: CheckboxItem[] = [];

  currentDataModel.Columns.forEach((column) => {
    const isSelected: boolean =
      currentLayout.Items.filter((item)=> item.Type === LayoutItemType.Column).findIndex(
        (item) =>
          (item as LayoutItemColumnViewModel).ColumnGuid.toLowerCase() ===
          column.Guid.toLowerCase()
      ) > -1
        ? true
        : false;
    allCheckedBox.push({
      value: column.Guid,
      text: column.Label,
      selected: isSelected,
    });
  });

  (currentDataModel.Relations as RelationViewModel[]).filter((rel)=> rel.Nature === RelationNature.Aggregation).forEach((relation) => {
    const isSelected: boolean =
      currentLayout.Items.filter((item)=> item.Type === LayoutItemType.Reference ).findIndex(
        (item) =>
          (item as LayoutItemReferenceViewModel).RelationGuid.toLowerCase() ===
          relation.Guid.toLowerCase()
      ) > -1
        ? true
        : false;
    allCheckedBox.push({
      value: relation.Guid,
      text: relation.Label,
      selected: isSelected,
    });
  });

  return [...allCheckedBox];
};

export default useArchiveColumns;
