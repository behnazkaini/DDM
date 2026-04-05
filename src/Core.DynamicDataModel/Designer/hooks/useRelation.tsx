import { LayoutItemReferenceViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import * as React from "react";
import { GlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";

const useRelation = () => {
  const [unusedRelation, setUnusedRelation] = React.useState<{
    Aggregation: Array<RelationViewModel>;
    Composition: Array<RelationViewModel>;
  }>({ Aggregation: [], Composition: [] });
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentFloor, currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { Count } = currentFloor;

  React.useMemo(() => {
    const relationAggregationGUIDs: string[] =
      currentDataModel.Relations.filter(
        (relation) =>
          relation.Nature === RelationNature.Aggregation
      ).map((relation) => relation.Guid.toLowerCase());

    const relationCompositionGUIDs: string[] =
      currentDataModel.Relations.filter(
        (relation) =>
          relation.Nature === RelationNature.Composition
      ).map((relation) => relation.Guid.toLowerCase());

    const itemGUIDs: string[] = !!currentLayout
      ? currentLayout.Items.filter(
          (item) =>
            item.Type === LayoutItemType.Reference ||
            item.Type === LayoutItemType.SubLayout
        ).map((item: LayoutItemReferenceViewModel) =>
          item.RelationGuid.toLowerCase()
        )
      : [];

    const unUsedAggregationGuid = relationAggregationGUIDs.filter(
      (field) => !itemGUIDs.includes(field)
    );
    const unUsedCompositionGuid = relationCompositionGUIDs.filter(
      (field) => !itemGUIDs.includes(field)
    );

    setUnusedRelation({
      Aggregation: currentDataModel.Relations.filter((relation) =>
        unUsedAggregationGuid.includes(relation.Guid.toLowerCase())
      ),
      Composition: currentDataModel.Relations.filter((relation) =>
        unUsedCompositionGuid.includes(relation.Guid.toLowerCase())
      ),
    });
  }, [Count.Field]);

  return { ...unusedRelation };
};

export default useRelation;
