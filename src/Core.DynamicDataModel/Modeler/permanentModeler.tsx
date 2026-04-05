import React from 'react';
import Modeler from '../Modeler/Modeler';
import { DataModelType } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType';
interface Props {
  mode: 'add' | 'edit';
  dataModelGuid: string;
  softwareGuid: string;
  scopeGuid: string;
}
function PermanentModeler({ dataModelGuid, softwareGuid, scopeGuid, mode }: Props) {
  return (
    <Modeler dataModelGuid={dataModelGuid} softwareGuid={softwareGuid} scopeGuid={scopeGuid} dataModelType={DataModelType.Permanent} mode={mode} />
  );
}
export default PermanentModeler