import { ArrangementType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { dragDrop } from "didgah/common";
import React from "react";
const Sortable = dragDrop.makeSortableDragElementComponent("any", "div");

interface SortableBoxProps {
  id: number;
  draggable: boolean;
  children?: any;
  onFindElement?: (id) => any;
  onElementMove?: (
    draggedId,
    overIndex,
    item: {
      originalIndex: number;
      id: number;
      metadata: { type: ArrangementType };
    }
  ) => void;
  type: ArrangementType;
}

const FooFindElement = (id: number) => {
  return { index: -1 };
};

const FooMoveElement = (draggedId: number, overIndex: number, item: any) => {
  return;
};

const SortableBox = (props: SortableBoxProps) => {
  const {
    children,
    id,
    draggable,
    onElementMove = FooMoveElement,
    type,
    onFindElement = FooFindElement,
  } = props;

  return (
    <Sortable
      draggable={draggable}
      style={{ width: "100%", cursor: !!draggable ? "move" : "auto" }}
      key={id}
      id={id}
      findElement={onFindElement}
      onElementMove={onElementMove}
      metadata={{ type: type }}
    >
      {children}
    </Sortable>
  );
};

export default SortableBox;
