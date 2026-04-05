import { ElementType, ExtensionLite, ExtensionLiteItem } from "@didgah-components/ant-modern-extension/utils";
import { Alert, DidgahContextProps, injectContext, Message, useCommandHandler } from "didgah/ant-core-component";
import React from "react";
import MODEL_API, { SaveFileParams } from "./API";
//import { FileReferenceDataModelGuid } from "..";
import { AggregationOneToOneValue } from "../types";
import { translate } from "didgah/common";
import { handleErrors } from "../../../../Utility/helpers";
import { DataModelSettingViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";
const FileUploaderCommand = ExtensionLite.FileUploaderCommand;

interface SettingViewModel extends DataModelSettingViewModel {
  Value?: any
}

interface FileSelectorOneToOneProps {
  ReferenceFieldId: string;
  onInitData: Array<{ value: string, label: string }>;
  onChange: (value: AggregationOneToOneValue) => void;
  value: AggregationOneToOneValue;
  initValue: AggregationOneToOneValue;
  AllowedFileCount: number;
  AllowedExtensions: string[];
  context?: DidgahContextProps;
  dataModelGuid: string;
  primaryKey?: string;
  Disabled: boolean;
  resetForm: () => void;
  Widget: string
  settings?: SettingViewModel[]
}

const emptyObj: AggregationOneToOneValue = {
  key: '',
  label: '',
  metadata: {
    ColumnGuids: [],
    DataModelGuid: "00000000-0000-0000-0000-000000000000"
  },
  rowData: []
}

function FileSelectorOneToOne({ value = emptyObj, AllowedExtensions = [], primaryKey, dataModelGuid, context, onChange, initValue, Disabled, resetForm, Widget, settings }: FileSelectorOneToOneProps) {
  const [tokenItems, setTokenItems] = React.useState<ExtensionLiteItem[]>();
  const [isNewFile, setIsNewFile] = React.useState<boolean>(false);
  const API_Model = new MODEL_API({ ajax: context.ajax });
  const commandHandler = useCommandHandler();

  React.useEffect(() => {
    if (value.key) {
      API_Model.GetFileInfo({ FileGuids: [value.key], SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((filesInfo) => {
        setTokenItems([{ id: filesInfo.result[0].Hash, fileName: filesInfo.result[0].FileName, allowPreview: false, elementType: ElementType.unknowType, fileExtension: filesInfo.result[0].FileName.slice(filesInfo.result[0].FileName.indexOf('.') + 1, filesInfo.result[0].FileName.length), size: 0, comments: filesInfo.result[0].Guid }])
      }).catch(() => {
        Message.error(translate("FileUploadError"));
      });
    } else {
      setTokenItems([]);
    }

  }, [value]);

  const handleOnSuccess = async (token: ExtensionLiteItem) => {
    const softwareGuid = commandHandler.getCurrentSoftwareGuid()
    const DistributedFileSaveParams: SaveFileParams = {
      FileToken: token.id,
      FileName: token.fileName,
      ExtraData: "",
      ReferenceGuid: primaryKey,
      DataModelGuid: dataModelGuid,
      SoftwareGuid: softwareGuid,
    }

    API_Model.DynamicDistributedFileSave(DistributedFileSaveParams).then((Guid) => {
      onChange({
        key: Guid,
        label: token.fileName,
        rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: token.fileName }],
        metadata: initValue.metadata
      });

      setTokenItems([{ ...token }]);
      setIsNewFile(true);
      resetForm();
    }).catch(() => {
      Message.error(translate("FileUploadError"));
    });
  }

  const handleDelete = (deletedFile: ExtensionLiteItem) => {
    onChange(undefined);
    setTokenItems([]);
  }

  const downloadFile = (token: ExtensionLiteItem) => {
    if (!isNewFile) {
      API_Model.GetFileTokenToDownload({ FileGuid: token.comments, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((downloadToken) => {
        window.open(`didgah/core/common/ExtraModel/DynamicDataModelFile/GetFileUrlsToDownload?fileToken=${downloadToken}&fileName=${token.fileName}`);
      }).fail(handleErrors)
    }
  }

  const allowedExtensionsList = !!AllowedExtensions && AllowedExtensions.length > 0 ? AllowedExtensions : undefined;
  const flyOutCommands: React.ReactNode[] = [
    <FileUploaderCommand onSuccess={handleOnSuccess} allowUploadExtensions={allowedExtensionsList} maxUploadableFiles={15} singleFileSizeLimit={settings?.find(s => s.Name === 'SingleFileSizeLimit')?.Value} />,
  ];

  return (
    <ExtensionLite readOnly={Disabled || Widget === 'DisabledWidget'} flyOutCommands={flyOutCommands} fileList={tokenItems} onDeleteFile={handleDelete} allowFileCount={1} onTokenDoubleClick={downloadFile} />
  )

}

export default injectContext(FileSelectorOneToOne);
