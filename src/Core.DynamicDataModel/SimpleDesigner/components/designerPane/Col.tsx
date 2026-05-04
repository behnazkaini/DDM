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
import { isDropAllowed } from "../../../SimpleDesigner/services/widgetManager";
import { Col } from "didgah/ant-core-component";
import { dragDrop, guid, utility } from "didgah/common";
import {
  BaseLayoutItemSetting,
  ColumnItem,
  DragableMetadata,
  FieldMetadata,
  FormValidationError,
  IGetReferenceDefaultSettingResult,
  IWidgetFactory,
  RichLayoutItem,
} from "../../../../typings/Core.DynamicDataModel/Types";
import Field from "./Field";
import {
  AddColumnAction,
  AddDrawAction,
  AddRelationAction,
  SimpleDesignerGlobalPropsContext,
  LocalPropsContext,
  PushLayoutModelAction,
} from "../../../SimpleDesigner/store/reducers/designLayoutSlice";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import useFloorStack from "../../../SimpleDesigner/hooks/useFloorStack";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { SubLayoutActionType } from "../../../SimpleDesigner/store/localLayoutContext";
import LayoutManager from "../../../LayoutManager";
import { StateManager } from "../../services/StateManager";
import { SubLayoutContext } from "../LayoutDesignerPane";
import { getNextAvailableColumnName } from "../../helper";

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
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { subLayoutState, subLayoutDispatch, openPreConfigeModal } =   
    React.useContext(LocalPropsContext);
  const { currentFloor, currentDataModel} = useFloorStack({
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
    // @ts-ignore
    // fix later - Its for Cascade
    const { attributes, DesignType, PayLoadItem, ItemType, simpleDesignerWidgetType, DataModelType } = metadata;

    switch (ItemType) {
      case LayoutItemType.Column:
        const layoutItemGuid = guid.newGuid();
        const validations = widgetFactory.getInitialDefaultValidation({
          layoutItemGuid,
          attributes: attributes as ColumnViewModel,
          type: LayoutItemType.Column,
          simpleDesignerWidgetType
        });
        dispatch(
          AddColumnAction({
            LayoutItemGuid: layoutItemGuid,
            LayoutGuid: globalProps.layoutGuid,
            RowId: rowId,
            ColumnId: col.Id,
            // Looks like it nowhere used
            ColumnlGuid: '',
            GroupGuid: groupItemGuid,
            ItemType: LayoutItemType.Column,
            DesignType: DesignType,
            Design: JSON.stringify(
              widgetFactory.getInitialDefaultSetting({
                attribute: attributes as ColumnViewModel,
                type: LayoutItemType.Column,
                settingType: LayoutType.Define,
                widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
                simpleDesignerWidgetType
              }) as BaseLayoutItemSetting
            ),
            validations: validations,
            simpleDesignerWidgetType,
            dataModel: currentDataModel
          })
        );
        break;
      case LayoutItemType.Reference:
        switch (PayLoadItem as DesignerItemType) {
          case DesignerItemType.PermanentAggregation:
          case DesignerItemType.SoftwareModelAggregation:
            const itemSetting: IGetReferenceDefaultSettingResult =
              widgetFactory.getInitialDefaultSetting({
                attribute: attributes as RelationViewModel,
                type: LayoutItemType.Reference,
                settingType: LayoutType.Define,
                widgetTypes: [WidgetType.EditWidget, WidgetType.DisplayWidget, WidgetType.SearchWidget],
                isSimpleDesignerMode : true,
                dataModelType: DataModelType
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
                relationNature: (attributes as RelationViewModel).Nature,
                relationType: (attributes as RelationViewModel).Type,
                relationCandidatesType: PayLoadItem
              })
            );
            break;
          case DesignerItemType.TableComposition: 
            const subLayoutGuid = utility.newGuid();
            const relationViewModel =  attributes;
            const layoutManager = new LayoutManager({ context: null, LayoutsModel: null ,isSimpleDesignerMode: true});
            const referenceDataModelGuid = utility.newGuid();
            const newArchiveSubLayout = layoutManager.getNewLayout({
              dataModelGuid: referenceDataModelGuid,
              relationViewModel: relationViewModel,
              layoutType: LayoutType.InlineArchive,
              newLayoutGuid: subLayoutGuid,
            });
            newArchiveSubLayout.State = 'Added';
            const stateManager = StateManager({
              parentLayoutGuid: globalProps.layoutGuid,
              layoutGuid: subLayoutGuid,
              mode: DesignerMode.add,
              layoutType: LayoutType.InlineArchive,
              layoutModels: {
                DataModels: currentFloor.LayoutModels.DataModels,
                Layouts: [newArchiveSubLayout],
              },
              dataModelGuid: referenceDataModelGuid,
              softwareModels: currentFloor.SoftwareModels,
            });
        dispatch(PushLayoutModelAction(stateManager.getNewFloor()));

        subLayoutDispatch({
          type: SubLayoutActionType.SET_SUBLAYOUTGUID,
          payload: {
            SubLayoutGuid: subLayoutGuid
          },
        });
        subLayoutDispatch({
          type: SubLayoutActionType.SET_DROPPEDROWID,
          payload: {
            RowId: props.rowId,
            GroupGuid: groupItemGuid,
            ColId: col.Id,
          },
        });
        subLayoutDispatch({
          type: SubLayoutActionType.SET_RELATIONVIEWMODEL,
          payload: {
            RelationViewModel: attributes,
            Mode: DesignerMode.add,
          },
        });
        subLayoutDispatch({
          type: SubLayoutActionType.SET_MODAL_VISIBLE,
          payload: { IsSubLayoutConfigeModalVisible: true },
        });
        subLayoutDispatch({
          type: SubLayoutActionType.SET_SUBLAYOUT_LOADING,
          payload: { IsSubLayoutLoading: false },
        });
     
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
