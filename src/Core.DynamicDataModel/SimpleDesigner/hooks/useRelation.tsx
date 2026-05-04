import { LayoutItemReferenceViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import * as React from "react";
import { SimpleDesignerGlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { translate } from "didgah/common";

const defaultAggrigationRelationParameters: RelationViewModel = {
  Type: RelationType.OneToOne,
  Bookmark: '',
  Guid: '',
  Label: '',
  Name: '',
  Nature: RelationNature.Aggregation,
  ReferenceDataModelGuid: '',
  BookmarkType:0
}

const defaultCompositionRelationParameters: RelationViewModel = {
  Type: RelationType.OneToMany,
  Bookmark: '',
  Guid: '',
  Label: '',
  Name: '',
  Nature: RelationNature.Composition,
  ReferenceDataModelGuid: '',
  BookmarkType:0
}

const useRelation = () => {
  const [relations, setRelations] = React.useState([
    {
      ...defaultAggrigationRelationParameters,
      Category: 'PermanentAggregation',
      Label: translate('PermanentAggregation')
    },
    {
      ...defaultAggrigationRelationParameters,
      Category: 'SoftwareModelAggregation',
      Label:  translate('SoftwareModelAggregation')
    },
    {
      ...defaultCompositionRelationParameters,
      Category: 'TableComposition',
      Label: 'Table'
    }
  ]);

  return { relations };
};

export default useRelation;
