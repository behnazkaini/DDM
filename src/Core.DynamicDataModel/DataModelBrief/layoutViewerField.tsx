import { LayoutBriefProps } from "../../Core.DynamicDataModel/LayoutBrief/layoutBrief";
import { Button, useCommandHandler } from "didgah/ant-core-component";
import React from "react";
import { Controls } from "../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { DataModelBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";

interface LayoutViewerFieldProps {
  record: DataModelBriefViewModel;
  onClose: () => void;
  isSimpleDesignerMode: boolean;
}

export default function LayoutViewerField(props: LayoutViewerFieldProps) {

  const commandHandler = useCommandHandler();

  function showLayouts(): void {
    commandHandler.openControlFormByCode(
      {
        controlCode: Controls.DDM_LayoutBrief,
        options: {
          alwaysOnTop: true,
        },
        dtoObject: {
          dataModelGuid: props.record.Guid,
          dataModelLabel: props.record.Label,
          onClose: props.onClose,
          isSimpleDesignerMode: props.isSimpleDesignerMode
        } as LayoutBriefProps
      }
    );
  }

  return (
    <Button onClick={showLayouts} />
  )
}