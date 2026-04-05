import {
  DesignerComplexValidationViewModel,
  LayoutDesignerPermission,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { translate } from "didgah/common";
import { Fieldset, TableEx } from "didgah/ant-core-component";
import React from "react";

interface ValidationTableProps {
  onRowDoubleClick: (record: DesignerComplexValidationViewModel) => void;
  onBeforeAdd: (records: DesignerComplexValidationViewModel[]) => boolean;
  onAfterDelete: (deletedRecords: DesignerComplexValidationViewModel[]) => void;
  store: any;
  columns: any;
  permission: LayoutDesignerPermission;
}

const ValidationTable = (props: ValidationTableProps) => {
  const {
    store,
    columns,
    onBeforeAdd,
    onRowDoubleClick,
    onAfterDelete,
    permission,
  } = props;

  return (
    <div style={{ height: "100%" }}>
      <Fieldset legend={translate("ConditionList")} style={{ height: "100%" }}>
        <TableEx
          store={store}
          columns={columns}
          onBeforeAdd={onBeforeAdd}
          allowAdd={true}
          showAddRemoveColumn={!permission.readOnly}
          onRowDoubleClick={onRowDoubleClick}
          onAfterDelete={onAfterDelete}
        />
      </Fieldset>
    </div>
  );
};

export default ValidationTable;
