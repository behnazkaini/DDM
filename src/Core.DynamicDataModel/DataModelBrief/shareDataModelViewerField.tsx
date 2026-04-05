import { ShareDataModelProps } from "../../Core.DynamicDataModel/ShareDataModel/shareDataModel";
import { Button, useCommandHandler } from "didgah/ant-core-component";
import React from "react";
import { Controls } from "../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { DataModelBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";

interface ShareDataModelViewerFieldProps {
  record: DataModelBriefViewModel;
}

export default function ShareDataModelViewerField(props: ShareDataModelViewerFieldProps) {

  const commandHandler = useCommandHandler();

  function showShareDataModel(): void {
    commandHandler.openControlFormByCode(
      {
        controlCode: Controls.DDM_ShareDataModel,
        options: {
          alwaysOnTop: true
        },
        dtoObject: {
          dataModelGuid: props.record.Guid,
          softwareGuid: props.record.SoftwareGuid,
          dataModelLabel: props.record.Label,
        } as ShareDataModelProps
      }
    );
  }

  return (
    <Button onClick={showShareDataModel} />
  )
}