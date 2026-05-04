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
const DragElementCol = dragDrop.makeDragElementComponent("mamad2", "div");

export function isOdd(num) {
  return num % 2 === 1;
}

interface FieldList { 
  onDragStart: () => void;
  onDragEnd: () => void;
}

const NotDragableFieldList = (props: FieldList) => {
  const { onDragStart, onDragEnd } = props;
  const [availableWidgets] = UseField();
  const availableColumnWidgets = availableWidgets.filter(w => w.LayoutItemType === LayoutItemType.Column);
  const additionalColumnIsNeedToFixAppreance = availableColumnWidgets.length % 2 === 1;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {availableColumnWidgets.map(((widget, index) => {
        return (
          <DragElementCol
          key={widget.key}
          draggable
          metadata={{
            DesignType: ArrangementType.Column,
            PayLoadItem: DesignerItemType.DataField,
            ItemType: LayoutItemType.Column,
            simpleDesignerWidgetType: widget.WidgetType,
          }}
          id={Math.random()}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
            <div
              className="widget-i"
              style={{
                borderBottom:  '1px solid #d9d9d9',
                borderRight: !isOdd(index +1) ? '1px solid #d9d9d9' : null,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                padding: 5,
                
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
      {additionalColumnIsNeedToFixAppreance && (
          <div
          className="widget-i"
          style={{
            borderRight: '1px solid #d9d9d9' ,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            padding: 5
          }}
        > </div>
      )}
    </div>
  );
};

export default NotDragableFieldList;
