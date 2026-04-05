import * as React from "react";
import {
  DesignerItemType,
  DefineDesignerTabs,
  WidgetType,
  DesignerMode,
  NoneBindableTypeId,
  NoneBindableWidgetType,
  ArrangementType,
} from "../../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../../store/hook";
import { isDropAllowed } from "../../../Designer/services/widgetManager";
import { Col } from "didgah/ant-core-component";
import { dragDrop, guid } from "didgah/common";
import {
  BaseLayoutItemSetting,
  ColumnItem,
  DragableMetadata,
  FieldMetadata,
  FormValidationError,
  IGetReferenceDefaultSettingResult,
  IWidgetFactory,
} from "../../../../typings/Core.DynamicDataModel/Types";
import Field from "./Field";
import {
  AddColumnAction,
  AddDrawAction,
  AddRelationAction,
  GlobalPropsContext,
  LocalPropsContext,
} from "../../../Designer/store/reducers/designLayoutSlice";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import useFloorStack from "../../../Designer/hooks/useFloorStack";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { SubLayoutActionType } from "../../../Designer/store/localLayoutContext";

const DropArea = dragDrop.makeDropAreaComponent("col", "div");
interface ColProps {
  col: ColumnItem;
  groupItemGuid: string;
  rowId: number;
  widgetFactory: IWidgetFactory;
  designError: FormValidationError[];
  conditionFields: string[];
  eventFields: string[];
}

const ColMock = (props: ColProps) => {
  const dispatch = useAppDispatch();
  const {
    col,
    groupItemGuid,
    rowId,
    widgetFactory,
    designError,
    conditionFields,
    eventFields,
  } = props;
  const globalProps = React.useContext(GlobalPropsContext);
  const { subLayoutDispatch, openPreConfigeModal } =
    React.useContext(LocalPropsContext);
  const { currentFloor } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const canDrop = (Item: DragElementProps) => {
    const { metadata } = Item;
    const Metadata: DragableMetadata = metadata;

    return (
      isDropAllowed(Metadata.PayLoadItem, DesignerItemType.Column) &&
      (col.LayoutItemGuid == null ? true : false)
    );
  };

  const onDrop = (container: DesignerItemType, FieldItem: FieldMetadata) => {
    const { metadata } = FieldItem;
    const { attributes, DesignType, PayLoadItem, ItemType } = metadata;
 
    switch (ItemType) {
      case LayoutItemType.Column:
        const layoutItemGuid = guid.newGuid();
        const validations = widgetFactory.getInitialDefaultValidation({
          layoutItemGuid,
          attributes: attributes as ColumnViewModel,
          type: LayoutItemType.Column,
          simpleDesignerWidgetType: null
        });
        dispatch(
          AddColumnAction({
            LayoutItemGuid: layoutItemGuid,
            LayoutGuid: globalProps.layoutGuid,
            RowId: rowId,
            ColumnId: col.Id,
            ColumnlGuid: (attributes as ColumnViewModel).Guid,
            GroupGuid: groupItemGuid,
            ItemType: LayoutItemType.Column,
            DesignType: DesignType,
            Design: JSON.stringify(
              widgetFactory.getInitialDefaultSetting({
                attribute: attributes as ColumnViewModel,
                type: LayoutItemType.Column,
                settingType: LayoutType.Define,
                widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
              }) as BaseLayoutItemSetting
            ),
            validations: validations 

          })
        ); 
        break;
      case LayoutItemType.Reference:
        switch ((attributes as RelationViewModel).Nature) {
          case RelationNature.Aggregation:
            const itemSetting: IGetReferenceDefaultSettingResult =
              widgetFactory.getInitialDefaultSetting({
                attribute: attributes as RelationViewModel,
                type: LayoutItemType.Reference,
                settingType: LayoutType.Define,
                widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
                dataModelType: currentFloor.LayoutModels.DataModels.find(dm => dm.Guid === (attributes as RelationViewModel).ReferenceDataModelGuid).Type
              }) as IGetReferenceDefaultSettingResult;
            dispatch(
              AddRelationAction({
                LayoutGuid: globalProps.layoutGuid,
                RowId: rowId,
                ColumnId: col.Id,
                ReferenceGuid: (attributes as RelationViewModel).Guid,
                GroupGuid: groupItemGuid,
                ItemType: LayoutItemType.Reference,
                DesignType: DesignType,
                Design: JSON.stringify(itemSetting.Design),
                ColumnGuids: itemSetting.ColumnGuids,
               
              })
            );
            break;
          case RelationNature.Composition:
            switch ((attributes as RelationViewModel).Type) {
              case RelationType.OneToMany:
                subLayoutDispatch({
                  type: SubLayoutActionType.SET_RELATIONVIEWMODEL,
                  payload: {
                    RelationViewModel: attributes,
                    Mode: DesignerMode.add,
                  },
                });
                openPreConfigeModal({
                  rowId,
                  groupGuid: groupItemGuid,
                  colId: col.Id,
                });
                break;
              case RelationType.OneToOne:
                subLayoutDispatch({
                  type: SubLayoutActionType.SET_RELATIONVIEWMODEL,
                  payload: {
                    RelationViewModel: attributes,
                    Mode: DesignerMode.add,
                  },
                });
                openPreConfigeModal({
                  rowId,
                  groupGuid: groupItemGuid,
                  colId: col.Id,
                });
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
        break;
      case LayoutItemType.NoneBindable:
        getNoneBindableOnDropAction({ fieldItem: FieldItem });
        break;
      default:
        break;
    }
  };
  const getNoneBindableOnDropAction = (props: { fieldItem: FieldMetadata }) => {
    const { fieldItem } = props;
    const { metadata }: { metadata: DragableMetadata } = fieldItem;

    switch (metadata.PayLoadItem) {
      case DesignerItemType.HelpBlock:
        const itemSetting: BaseLayoutItemSetting =
          widgetFactory.getDefaultSettingByWidgetId({
            widgetId: NoneBindableTypeId.HelpBlock,
            settingLayoutType: LayoutType.Define,
            widgetType: null,
            attribute: null,
            layoutItemType: LayoutItemType.NoneBindable,
          }) as BaseLayoutItemSetting;

        dispatch(
          AddDrawAction({
            LayoutGuid: globalProps.layoutGuid,
            ColumnId: col.Id,
            RowId: rowId,
            FieldsetGuid: groupItemGuid,
            ItemType: LayoutItemType.NoneBindable,
            DesignType: ArrangementType.Shape,
            NoneBindableType: NoneBindableWidgetType.HelpBlock,
            Design: JSON.stringify(itemSetting),
          })
        );

        break;
      default:
        break;
    }
  };

  const errorStyle =
    designError.length > 0 &&
    currentFloor.ActiveTab !== DefineDesignerTabs.Fields
      ? "DDM-hasError-column-active"
      : designError.length > 0 &&
        currentFloor.ActiveTab !== DefineDesignerTabs.Fields
      ? "DDM-hasError-column-deactive"
      : "";

  const columnStyle =
    col.LayoutItemGuid == null ? "ColumnActive" : "ColumnDeActive";
  return (
    <Col md={col.Col * 2}>
      <div className={`${errorStyle} ${columnStyle}`}>
        <DropArea
          canDrop={canDrop}
          onDrop={onDrop.bind(null, DesignerItemType.Column)}
        >
          <Field
            column={col}
            widgetFactory={widgetFactory}
            error={designError}
            conditionFields={conditionFields}
            eventFields={eventFields}
          />
        </DropArea>
      </div>
    </Col>
  );
};

export default ColMock;
