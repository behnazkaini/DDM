import UseRelation from "../../hooks/useRelation";
import { dragDrop, translate } from "didgah/common";
import * as React from "react";
import { ArrangementType, DesignerItemType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { DragableMetadata } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { Col, Row } from "didgah/ant-core-component";
import { isOdd } from "./fieldList";
const DragElementCol = dragDrop.makeDragElementComponent("col", "div");

const RelationList = () => {
  const { relations } = UseRelation();

  const getMetaData = (relation) => {
    let result: any = {};
    switch (relation.Category) {
      case "PermanentAggregation":
        result = {
          DesignType: ArrangementType.Column,
          PayLoadItem: DesignerItemType.PermanentAggregation,
          ItemType: LayoutItemType.Reference,
          attributes: { ...relation },
        } as DragableMetadata
        break;
      case "SoftwareModelAggregation":
        return (
          result = {
            DesignType: ArrangementType.Column,
            PayLoadItem: DesignerItemType.SoftwareModelAggregation,
            ItemType: LayoutItemType.Reference,
            attributes: { ...relation },
          } as DragableMetadata
        );
      case "TableComposition":
        return (
          result = {
            DesignType: ArrangementType.Column,
            PayLoadItem: DesignerItemType.TableComposition,
            ItemType: LayoutItemType.Reference,
            attributes: { ...relation },
          } as DragableMetadata
        );
      default:
        break;
    }
    return result;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
            {relations.map((relation, index) => {
        return (
          <DragElementCol
            key={index}
            draggable
            metadata={getMetaData(relation)}
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
            > {translate(relation.Category)}

            </div>
          </DragElementCol>

        )
      })}
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
    </div>
  );
};

export default RelationList;
