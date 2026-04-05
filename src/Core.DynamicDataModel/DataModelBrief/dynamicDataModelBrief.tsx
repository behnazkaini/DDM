import React from "react";
import { DataModelType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import DataModelBrief from "./dataModelBrief";

interface DynamicDataModelBriefProps {
  softwareGuid: string;
}

export default function DynamicDataModelBrief(props: DynamicDataModelBriefProps) {
  return (
    <DataModelBrief softwareGuid={props.softwareGuid} dataModelType={DataModelType.Dynamic} />
  )
}