import { FieldViewerType } from "@models/didgah-components";
import { translate } from "didgah/common";
import { BooleanViewerField, EnumViewerField, TableEx, TableExColumnProps, TextViewerField } from "didgah/ant-core-component";
import { TableExViewStore }  from "didgah/ant-core-component/providers";
import React from "react";
import { $enum } from "ts-enum-util";
import { LayoutBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { getApiUrl, softwareGuid } from "../../Utility/helpers";

export interface LayoutBriefArchiveProps {
  onRowDoubleClick: () => void;
  onStoreCreated: (store: TableExViewStore<LayoutBriefViewModel, string>) => void;
}

export default function LayoutBriefArchive(props: LayoutBriefArchiveProps) {

  const tableStore = React.useRef(new TableExViewStore<LayoutBriefViewModel, string>({
    metadata: null,
    keyField: 'Guid',
    preventAutoFill: true,
    softwareGuid: softwareGuid,
    defaultSortField: 'Label',
    url: getApiUrl('DynamicDataModel', 'Layout', 'GetBriefPaged')
  }));

  const tableColumns: TableExColumnProps<LayoutBriefViewModel>[] = [
    {
      title: translate('Label'),
      dataIndex: 'Label',
      viewType: new TextViewerField(),
      sortEnabled: true
    },
    {
      title: translate('Type'),
      dataIndex: 'Type',
      viewType: {
        type: FieldViewerType.Custom
      },
      viewComponent: (props: { record: LayoutBriefViewModel }) => {
        return <span>{
          translate(`LayoutType_${$enum(LayoutType).getKeyOrThrow(props.record.Type)}`)
        }</span>
      },
      align: 'center',
      sortEnabled: true
    },
    {
      title: translate('IsDefault'),
      dataIndex: 'IsDefault',
      viewType: new BooleanViewerField(),
      sortEnabled: true
    }
  ];

  React.useEffect(() => {
    props.onStoreCreated(tableStore.current);
  }, []);

  return (
    <TableEx store={tableStore.current} columns={tableColumns} onRowDoubleClick={props.onRowDoubleClick} />
  )
}