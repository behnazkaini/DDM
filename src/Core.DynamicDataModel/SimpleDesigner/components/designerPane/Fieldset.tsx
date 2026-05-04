import { useAppDispatch, useAppSelector } from "../../store/hook";
import * as React from "react";
import { Fieldset as MainFieldset, Modal } from "didgah/ant-core-component";

import ActionBarFrame from "./ActionBarFrame";
import {
  getAllLayoutItemGuidinEvent,
  getAllValidationFields,
  getParsedDesignValue,
  isDropAllowed,
  isExistFromGroupInCondition,
} from "../../services/widgetManager";
import {
  DesignerItemType,
  DefineDesignerTabs,
  OptionType,
  PropertiesDockTabs,
  ArrangementType,
} from "../../../../typings/Core.DynamicDataModel/Enums";
import {
  AddRowAction,
  DragAndDropElement,
  SimpleDesignerGlobalPropsContext,
  LocalPropsContext,
  RemoveGroupAction,
  openPropertiesItemDockAction,
} from "../../store/reducers/designLayoutSlice";
import RowMock from "./Row";
import { dragDrop, translate } from "didgah/common";
import {
  DefineLayoutDesignerViewModel,
  DefineLayoutSimpleDesignerViewModel,
  Design,
  DragableMetadata,
  FormValidationError,
  GroupHook,
  IWidgetFactory,
  LayoutItemSetting,
  RowMetadata,
} from "../../../../typings/Core.DynamicDataModel/Types";
import useRowSelector from "../../hooks/useRow";

import useFloorStack from "../../../SimpleDesigner/hooks/useFloorStack";
const DropArea = dragDrop.makeDropAreaComponent("row", "div");

interface FieldsetProps {
  item: GroupHook;
  widgetFactory: IWidgetFactory;
  designError: FormValidationError[];
  id: number;
  onFindElement: (id: number) => any;
  onElementMove: (draggedId, overIndex, item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }) => void;
}

const FieldsetMock = (props: FieldsetProps) => {
  const { item, widgetFactory, designError, id, onFindElement, onElementMove } = props;
  const { Label } = getParsedDesignValue(item.LayoutItem);
  const { Row } = useRowSelector(item.LayoutItem.Guid);
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { currentFloor, currentLayout } =
    useFloorStack<DefineLayoutSimpleDesignerViewModel>({
      layoutGuid: globalProps.layoutGuid,
    });
  const { ActiveTab, PropertiesDockItemState } = currentFloor;
  const dispatch = useAppDispatch();
  const fieldsInComplexValidation = getAllValidationFields(
    currentLayout.ComplexValidations
  );
  const fieldsInFormEvent: string[] = getAllLayoutItemGuidinEvent(
    currentLayout.Design
  );

  const fieldsExistInValidation = isExistFromGroupInCondition(
    item.LayoutItem.Guid,
    currentLayout.Design,
    ArrangementType.NoneBindableGroup,
    [...fieldsInComplexValidation, ...fieldsInFormEvent]
  );

  const onDeleteOptionHandler = () => {
    const cancelInfo = () => {
      return;
    };

    if (fieldsExistInValidation.length > 0) {
      Modal.info({
        title: translate("DDMFieldExistInLayout"),
        content: translate("DDMFieldExistInLayoutDesc"),
        okText: translate("Ok"),
        cancelText: translate("Cancel"),
        onOk: cancelInfo,
        onCancel: cancelInfo,
      });
      return;
    }

    dispatch(
      RemoveGroupAction({
        LayoutGuid: globalProps.layoutGuid,
        GroupGuid: item.LayoutItem.Guid,
      })
    );
  };

  const onSettingOptionHandler = () => {
    dispatch(
      openPropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        layoutItemGuid: item.Item.LayoutItemGuid,
      })
    );
  };

  const actionFramOptions =
    ActiveTab === DefineDesignerTabs.Container
      ? [
          { Type: OptionType.Delete, onHandler: onDeleteOptionHandler },
          {
            Type: OptionType.Setting,
            onHandler: onSettingOptionHandler,
          },
        ]
      : [];

  const canDrop = (Item: DragElementProps) => {
    const { metadata } = Item;
    const Metadata: DragableMetadata = metadata;

    return isDropAllowed(Metadata.PayLoadItem, DesignerItemType.Canvas);
  };

  const onDrop = (RowItem: RowMetadata) => {
    const { metadata } = RowItem;
    const { attributes } = metadata;
    dispatch(
      AddRowAction({
        LayoutGuid: globalProps.layoutGuid,
        LayoutItemGroupGuid: item.LayoutItem.Guid,
        Cols: attributes.cols,
        RowId: Math.random(),
      })
    );
  };

  const onFindElementRow = (id: number) => {
    const rowItem = Row.find((item) => item.Id === id);

    return {
      index: Row.indexOf(rowItem),
      rowItem,
    };
  };

  const onElementMoveRow = (
    draggedId,
    overIndex,
    item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }
  ) => {
    const { rowItem, index } = onFindElementRow(draggedId);

    if (overIndex > -1 && index !== overIndex && item.originalIndex === index && index > -1) {
      dispatch(
        DragAndDropElement({
          LayoutGuid: currentLayout.Guid,
          type: item.metadata.type,
          currentIndex: index,
          newIndex: overIndex,
          Id: draggedId,
        })
      );
    }
    
  };

  const isFocused =
    item.LayoutItem.Guid.toLowerCase() ===
      PropertiesDockItemState.FocusedLayoutItemGuid?.toString();

  return (
    <ActionBarFrame
      isFocus={isFocused}
      Options={actionFramOptions}
      designError={designError}
      currentTab={ActiveTab}
      beActiveTab={[DefineDesignerTabs.Container]}
      signs={[]}
      sortable={true}
      design={currentLayout.Design}
      id={id}
      type={ArrangementType.NoneBindableGroup}
      onFindElement={onFindElement}
      onElementMove={onElementMove}
    >
      <MainFieldset
        key={item.LayoutItem.Guid}
        legend={Label}
        className={designError.length > 0 ? "DDM-hasError-fieldset" : null}
      >
        <DropArea
          canDrop={canDrop}
          onDrop={onDrop}
        >
          {Row.map((row) => (
            <RowMock
              key={row.Id}
              Id={row.Id}
              rowItem={row}
              groupItemGuid={item.LayoutItem.Guid}
              widgetFactory={widgetFactory}
              conditionFields={fieldsInComplexValidation}
              eventFields={fieldsInFormEvent}
              onFindElement={onFindElementRow}
              onElementMove={onElementMoveRow}
            />
          ))}
        </DropArea>
      </MainFieldset>
    </ActionBarFrame>
  );
};

export default FieldsetMock;
