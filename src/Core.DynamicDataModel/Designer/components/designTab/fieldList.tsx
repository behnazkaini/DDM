import UseField from "../../hooks/useField";
import { dragDrop } from "didgah/common";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import * as React from "react";
import { ArrangementType, DesignerItemType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { DragableMetadata } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
const DragElementCol = dragDrop.makeDragElementComponent("col", "div");

interface FieldList {}
const FieldList = (props: FieldList) => {
  const AvailableColumns: Array<ColumnViewModel> = UseField();

  return (
    <>
      {AvailableColumns.map((column) => {
        return (
          <DragElementCol
            key={column.Guid}
            draggable
            metadata={
              {
                DesignType: ArrangementType.Column,
                PayLoadItem: DesignerItemType.DataField,
                ItemType: LayoutItemType.Column,
                attributes: { ...column },
              } as DragableMetadata
            }
            id={Math.random()}
          >
            <div
              style={{
                margin: "2px 0px",
                padding: "5px",
                border: "1px dotted gray",
                borderRadius: "5px",
                borderLeft: "solid 5px blue",
              }}
            >
              {column.Label}
            </div>
          </DragElementCol>
        );
      })}
    </>
  );
};

export default FieldList;
