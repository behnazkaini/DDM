import { ElementType, ExtensionLite, ExtensionLiteItem } from "@didgah-components/ant-modern-extension/utils";
import { DidgahContextProps, injectContext, Message, useCommandHandler } from "didgah/ant-core-component";
import React from "react";
import MODEL_API, { GetFileInfoResult, SaveFileParams } from "./API";
import { AggregationOneToManyValue } from "../types";
import { translate } from "didgah/common";
import { AggregationOneToManyValueTokens } from "../../../SoftwareModels/Signature/types";
import { handleErrors } from "../../../../Utility/helpers";
import { DataModelSettingViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";

const FileUploaderCommand = ExtensionLite.FileUploaderCommand;

interface SettingViewModel extends DataModelSettingViewModel {
  Value?: any
}

interface FileSelectorOneToManyProps {
  EntityId: string;
  ReferenceFieldId: string;
  onInitData: Array<{ value: string, label: string }>;
  onChange: (value: AggregationOneToManyValue) => void;
  value: AggregationOneToManyValue;
  AllowedFileCount: number;
  AllowedExtensions: string[];
  context?: DidgahContextProps;
  dataModelGuid: string;
  primaryKey?: string;
  initValue: AggregationOneToManyValue;
  Disabled: boolean;
  resetForm: () => void;
  Widget: string;
  settings?: SettingViewModel[]
}

const emptyObj: AggregationOneToManyValue = {
  metadata: {
    ColumnGuids: [],
    DataModelGuid: "00000000-0000-0000-0000-000000000000"
  },
  tokens: [],
}

function FileSelectorOneToMany({ value = emptyObj, AllowedExtensions = [], AllowedFileCount, primaryKey, dataModelGuid, context, onChange, initValue, Disabled, resetForm, Widget, settings }: FileSelectorOneToManyProps) {
  const [rerender, setRerender] = React.useState<number>(0);
  const valueTokens = React.useRef<AggregationOneToManyValueTokens[]>([]);
  const tokenItems = React.useRef<ExtensionLiteItem[]>([]);
  const newlyAddedFiles = React.useRef<Array<ExtensionLiteItem>>([]);
  const API_Model = new MODEL_API({ ajax: context.ajax });
  const commandHandler = useCommandHandler();


  React.useEffect(() => {
    if (value.tokens.length > 0) {
      const guids: string[] = value.tokens.map((file) => file.id);
      API_Model.GetFileInfo({ FileGuids: guids, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((filesInfo) => {
        tokenItems.current = filesInfo.result.map((file) => {
          return { id: file.Hash, fileName: file.FileName, allowPreview: false, elementType: ElementType.unknowType, fileExtension: file.FileName.slice(file.FileName.indexOf('.') + 1, file.FileName.length), size: 0, comments: file.Guid }
        });
        setRerender(Math.random());
      }).catch((error) => {
        console.error("Get File: ", error);
      });
    } else {
      tokenItems.current = []
      setRerender(Math.random());
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

    try {
      const Guid = await API_Model.DynamicDistributedFileSave(DistributedFileSaveParams);
      newlyAddedFiles.current = [...newlyAddedFiles.current, token];

      const newValueTokens = [...tokenItems.current.map(token => ({
        id: token.comments,
        title: token.fileName,
        rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: token.fileName }]
      })), {
        id: Guid,
        title: token.fileName,
        rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: token.fileName }]
      }]

      onChange({
        tokens: newValueTokens,
        metadata: initValue.metadata,
      });
      resetForm();
      valueTokens.current = newValueTokens;
      tokenItems.current = ([...tokenItems.current, { ...token, comments: Guid }]);
      setRerender(Math.random());
    } catch (error) {
      console.error(error);
      Message.error(translate("FileUploadError"));
    }

  }

  const handleDelete = (deletedFile: ExtensionLiteItem) => {
    const newTokenValue = value.tokens.filter(t => t.id.toLowerCase() !== deletedFile.comments.toLowerCase());
    const newValue = newTokenValue?.length ? {
      tokens: newTokenValue,
      metadata: value.metadata
    } : undefined;
    onChange(newValue);
    valueTokens.current = newTokenValue;
    tokenItems.current = (tokenItems.current.filter((item) => item.id !== deletedFile.id));
  }

  const downloadFile = (token: ExtensionLiteItem) => {
    var isTokenNew = newlyAddedFiles.current.find(x => x.id === token.id);

    if (!isTokenNew) {
      API_Model.GetFileTokenToDownload({ FileGuid: token.comments, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((downloadToken) => {
        window.open(`didgah/core/common/ExtraModel/DynamicDataModelFile/GetFileUrlsToDownload?fileToken=${downloadToken}&fileName=${token.fileName}`);
      }).fail(handleErrors)
    }
  }

  const allowedFileCount = AllowedFileCount === null ? undefined : AllowedFileCount;
  const allowedExtensionsList = !!AllowedExtensions && AllowedExtensions.length > 0 ? AllowedExtensions : undefined;

  const fileUploaderCommandProps = {

  }

  const flyOutCommands: React.ReactNode[] = [
    <FileUploaderCommand onSuccess={handleOnSuccess} allowUploadExtensions={allowedExtensionsList} maxUploadableFiles={15} singleFileSizeLimit={settings?.find(s => s.Name === 'SingleFileSizeLimit')?.Value} />,
  ];

  return (
    <ExtensionLite readOnly={Disabled || Widget === 'DisabledWidget'} flyOutCommands={flyOutCommands} fileList={tokenItems.current} onDeleteFile={handleDelete} allowFileCount={allowedFileCount} onTokenDoubleClick={downloadFile} />
  )

}

export default injectContext(FileSelectorOneToMany);
