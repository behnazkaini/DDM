import * as React from "react";
import { SimpleDesignerIStateStack, LayoutsModel, SimpleDesignerLayoutViewModelWithState, StoreType } from "../../../typings/Core.DynamicDataModel/Types";
import { useAppSelector } from "../store/hook";

const useFloorStack = <T extends SimpleDesignerLayoutViewModelWithState>({ layoutGuid }: { layoutGuid: string }) => {

  const currentFloor = useAppSelector<SimpleDesignerIStateStack<T>>(
    (state: any) => {
      return state.layoutDesignerState.find((floor) => floor.LayoutGuid.toLowerCase() === layoutGuid.toLowerCase())
    }
  );

  const currentLayout: T = !!currentFloor ? currentFloor.LayoutModels.Layouts.find(
    (layout) => layout.Guid.toLowerCase() === layoutGuid.toLowerCase()
  ) : null;
  const currentDataModel = currentFloor.LayoutModels.DataModels.find(
    (model) =>
      model.Guid.toLowerCase() === currentLayout.DataModelGuid.toLowerCase()
  );

  return {
    currentFloor,
    currentLayout,
    currentDataModel,
  };
};

export default useFloorStack;
