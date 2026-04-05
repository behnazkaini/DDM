import { FieldViewerType } from "@models/didgah-components";
import { translate } from "didgah/common";
import { TableEx, TableExColumnProps, TextViewerField } from "didgah/ant-core-component";
import { TableExViewStore }  from "didgah/ant-core-component/providers";
import React from "react";
import { DataModelBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";
import { getApiUrl, softwareGuid } from "../../Utility/helpers";
import DataEntryViewerField from "./dataEntryViewerField";
import LayoutViewerField from "./layoutViewerField";
import ShareDataModelViewerField from "./shareDataModelViewerField";

export interface DataModelBriefArchiveProps {
  shareable: boolean;
  handleSearch: () => void;
  onStoreCreated: (store: TableExViewStore<DataModelBriefViewModel, string>) => void;
  onRowDoubleClick: () => void;
  isSimpleDesignerMode: boolean;
}

export default function DataModelBriefArchive(props: DataModelBriefArchiveProps) {

  const tableStore = React.useRef(new TableExViewStore<DataModelBriefViewModel, string>({
    metadata: null,
    keyField: 'Guid',
    preventAutoFill: true,
    softwareGuid: softwareGuid,
    defaultSortField: 'Name',
    url: getApiUrl('DynamicDataModel', 'DataModel', 'GetBriefPaged')
  }));

  const tableColumns: TableExColumnProps<DataModelBriefViewModel | any>[] = [
    {
      title: translate('Name'),
      dataIndex: 'Name',
      viewType: new TextViewerField(),
      sortEnabled: true
    },
    {
      title: translate('Label'),
      dataIndex: 'Label',
      viewType: new TextViewerField(),
      sortEnabled: true
    },
    {
      title: translate('DataEntry'),
      dataIndex: 'DataEntry',
      viewType: {
        type: FieldViewerType.Custom
      },
      viewComponent: DataEntryViewerField,
      align: 'center',
      sortEnabled: false
    },
    {
      title: translate('Layouts'),
      dataIndex: 'Layouts',
      viewType: {
        type: FieldViewerType.Custom
      },
      viewComponent: LayoutViewerField,
      align: 'center',
      sortEnabled: false,
      getDynamicProps: () => {
        return {
          onClose: () => props.handleSearch(),
          isSimpleDesignerMode: props.isSimpleDesignerMode
        }
      }
    }
  ];

  if (props.shareable) {
    tableColumns.push({
      title: translate('Share'),
      dataIndex: 'Share',
      viewType: {
        type: FieldViewerType.Custom
      },
      viewComponent: ShareDataModelViewerField,
      align: 'center',
      sortEnabled: false
    });
  }

  React.useEffect(() => {
    props.onStoreCreated(tableStore.current);
  }, []);

  return (
    <TableEx store={tableStore.current} columns={tableColumns} onRowDoubleClick={props.onRowDoubleClick} />
  )
}