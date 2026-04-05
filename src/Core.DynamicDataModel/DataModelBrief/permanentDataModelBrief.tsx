import React from "react";
import { DataModelType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import DataModelBrief from "./dataModelBrief";

interface PermanentDataModelBriefProps {
  softwareGuid: string;
}

function PermanentDataModelBrief({ softwareGuid}: PermanentDataModelBriefProps) {
  return (
    <DataModelBrief softwareGuid={softwareGuid} dataModelType={DataModelType.Permanent} />
  )
}

export default PermanentDataModelBrief