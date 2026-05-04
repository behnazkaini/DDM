import UseField from "../../hooks/useField";
import { dragDrop } from "didgah/common";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import * as React from "react";
import { ArrangementType, DesignerItemType, EditWidget } from "../../../../typings/Core.DynamicDataModel/Enums";
import { DragableMetadata } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { DragElementGroup } from "../LayoutDesigner";
import { translate } from "../../../../Utility/language";
import { EditWidgetIcon } from "../../../TS/Widgets";
import { CustomIcon, Icon } from "didgah/ant-core-component";
const DragElementCol = dragDrop.makeDragElementComponent("col", "div");

export function isOdd(num) {
  return num % 2 === 1;
}

interface FieldList { }
const FieldList = (props: FieldList) => {
  const [availableWidgets] = UseField();
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {availableWidgets.map(((widget, index) => {
        let dragAndDropMetadata;

        switch(widget.LayoutItemType) {
          case LayoutItemType.Column: 
          dragAndDropMetadata  = {
            DesignType: ArrangementType.Column,
            PayLoadItem: DesignerItemType.DataField,
            ItemType: LayoutItemType.Column,
            WidgetType: widget.WidgetType,
            simpleDesignerWidgetType: widget.WidgetType
          } as DragableMetadata;
          break;
          case LayoutItemType.NoneBindable:
            dragAndDropMetadata = {
              DesignType: ArrangementType.Shape,
              ItemType: LayoutItemType.NoneBindable,
              PayLoadItem: DesignerItemType.HelpBlock,
            } as DragableMetadata;
            break;
          }
        return (
          <DragElementCol
            key={widget.key}
            draggable
            metadata={dragAndDropMetadata}
            id={Math.random()}
          >
            <div
              className="widget-i"
              style={{
                borderBottom:  '1px solid #d9d9d9',
                borderRight: !isOdd(index +1) ? '1px solid #d9d9d9' : null,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                padding: 5
              }}
            > 
              <div style={{ width: 16, marginLeft: 10, display: 'flex', alignItems: 'center' }}>
                {widget.iconType === 'CustomIcon' ? <CustomIcon type={EditWidgetIcon[widget.id]} style={{ fontSize: 16 }}/>  : <Icon type={EditWidgetIcon[widget.id]} style={{ fontSize: 16 }}/>}
              </div>
              {translate(`DDM_SimpleDesigner_${widget.id}`)}
            </div> 
          </DragElementCol>
        );
      }))}
    </div>
  );
};

export default FieldList;
