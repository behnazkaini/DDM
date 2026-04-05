import {
  ColumnItem,
  IWidgetFactory,
  RowItem,
  LayoutItemSetting,
  FormValidationError,
  DefineLayoutDesignerViewModel,
  Design,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { dragDrop, translate } from "didgah/common";
import * as React from "react";
import { Form, Modal, Row } from "didgah/ant-core-component";
import ActionBarFrame from "./ActionBarFrame";
import {
  ArrangementType,
  DefineDesignerTabs,
  OptionType,
} from "../../../../typings/Core.DynamicDataModel/Enums";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import ColMock from "./Col";
import {
  GlobalPropsContext,
  RemoveRowAction,
} from "../../../Designer/store/reducers/designLayoutSlice";
import useFloorStack from "../../../Designer/hooks/useFloorStack";
import {
  getAllLayoutItemGuidinEvent,
  getAllValidationFields,
  isExistFromGroupInCondition,
} from "../../../Designer/services/widgetManager";

interface RowMock {
  Id: number;
  rowItem: RowItem;
  groupItemGuid: string;
  children?: any;
  widgetFactory: IWidgetFactory;
  conditionFields: string[];
  eventFields: string[];
  onFindElement: (id) => any;
  onElementMove: (draggedId, overIndex, item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }) => void;
}

const RowMock = (props: RowMock) => {
  const {
    Id,
    rowItem,
    groupItemGuid,
    widgetFactory,
    conditionFields,
    eventFields,
    onFindElement,
    onElementMove,
  } = props;
  const dispatch = useAppDispatch();
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentFloor, currentLayout } =
    useFloorStack<DefineLayoutDesignerViewModel>({
      layoutGuid: globalProps.layoutGuid,
    });
  const { FormValidation, ActiveTab } = currentFloor;

  const onDeleteOptionHandler = (Id: number, parentGroupGuid: string) => {
    const fieldsInValidation = getAllValidationFields(
      currentLayout.ComplexValidations
    );
    const fieldsExistInFormEvent: string[] = getAllLayoutItemGuidinEvent(
      currentLayout.Design
    );

    const fieldsExistInValidation = isExistFromGroupInCondition(
      Id.toString(),
      currentLayout.Design,
      ArrangementType.Row,
      [...fieldsInValidation, ...fieldsExistInFormEvent]
    );

    if (fieldsExistInValidation.length > 0) {
      Modal.info({
        title: translate("DDMFieldExistInLayout"),
        content: translate("DDMFieldExistInLayoutDesc"),
        okText: translate("Ok"),
        cancelText: translate("Cancel"),
        onOk: () => {
          return;
        },
        onCancel: () => {
          return;
        },
      });
      return;
    }

    dispatch(
      RemoveRowAction({
        LayoutGuid: globalProps.layoutGuid,
        RowId: Id,
        LayoutItemGroupGuid: parentGroupGuid,
      })
    );
  };

  const actionFramOptions =
    ActiveTab === DefineDesignerTabs.Sorting
      ? [
          {
            Type: OptionType.Delete,
            onHandler: onDeleteOptionHandler.bind(null, Id, groupItemGuid),
          },
        ]
      : [];

  const columnsDesignError: FormValidationError[] = FormValidation.filter(
    (error) => {
      const column = rowItem.Columns.find((col) => col.Id === error.FormItemId);
      if (column != null) {
        return true;
      } else {
        return false;
      }
    }
  );

  return (
    <ActionBarFrame
      Options={actionFramOptions}
      designError={columnsDesignError.length > 0 ? columnsDesignError : []}
      beActiveTab={[DefineDesignerTabs.Sorting]}
      currentTab={ActiveTab}
      signs={[]}
      sortable={true}
      id={Id}
      type={ArrangementType.Row}
      onFindElement={onFindElement}
      onElementMove={onElementMove}
    >
      <Row className={"DDM-core-Row"}>
        {rowItem.Columns.map((col) => {
          const designError: FormValidationError[] = FormValidation.filter(
            (error) => error.FormItemId === col.Id
          );

          return (
            <ColMock
              designError={designError}
              key={col.Id}
              col={col as ColumnItem}
              groupItemGuid={groupItemGuid}
              rowId={rowItem.Id}
              widgetFactory={widgetFactory}
              conditionFields={conditionFields}
              eventFields={eventFields}
            />
          );
        })}
      </Row>
    </ActionBarFrame>
  );
};

export default RowMock;
