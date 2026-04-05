import UseRelation from "../../hooks/useRelation";
import { dragDrop } from "didgah/common";
import * as React from "react";
import { ArrangementType, DesignerItemType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { DragableMetadata } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
const DragElementCol = dragDrop.makeDragElementComponent("col", "div");
const DropElementComposition = dragDrop.makeDragElementComponent("col", "div");

interface RelationList {
  Type: "Aggregation" | "Composition";
}

const RelationList = (props: RelationList) => {
  const AvailableRelation: {
    Aggregation: Array<RelationViewModel>;
    Composition: Array<RelationViewModel>;
  } = UseRelation();

  return (
    <>
      {AvailableRelation[props.Type].map((relation) => {
        const draggableBorderColor =
          relation.Nature === RelationNature.Composition
            ? "orange"
            : "yellow";

        switch (props.Type) {
          case "Aggregation":
            return (
              <DragElementCol
                key={relation.Guid}
                draggable
                metadata={
                  {
                    DesignType: ArrangementType.Column,
                    PayLoadItem: DesignerItemType.DataField,
                    ItemType: LayoutItemType.Reference,
                    attributes: { ...relation },
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
                    borderLeft: `solid 5px ${draggableBorderColor}`,
                  }}
                >
                  {relation.Label}
                </div>
              </DragElementCol>
            );
          case "Composition":
            return (
              <DropElementComposition
                key={relation.Guid}
                draggable
                metadata={
                  {
                    DesignType: ArrangementType.Column,
                    PayLoadItem: DesignerItemType.Composition,
                    ItemType: LayoutItemType.Reference,
                    attributes: { ...relation },
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
                    borderLeft: `solid 5px ${draggableBorderColor}`,
                  }}
                >
                  {relation.Label}
                </div>
              </DropElementComposition>
            );
          default:
            break;
        }
      })}
    </>
  );
};

export default RelationList;
