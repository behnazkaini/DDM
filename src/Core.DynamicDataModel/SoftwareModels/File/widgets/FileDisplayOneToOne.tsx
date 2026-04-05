import { translate } from 'didgah/common';
import { TokenContainer, TokenItem, injectContext, DidgahContextProps, Message, SelectedToken, useCommandHandler } from 'didgah/ant-core-component';
import React from 'react';
import { AggregationOneToOneValue } from '../types';
import MODEL_API from './API';
import { handleErrors } from '../../../../Utility/helpers';

interface FileDisplayOneToOneProps {
  value: AggregationOneToOneValue;
  context?: DidgahContextProps;
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

function FileDisplayOneToOne(props: FileDisplayOneToOneProps) {
  const { value = emptyObj, context } = props;
  const [tokenItems, setTokenItems] = React.useState<Array<TokenItem>>([]);
  const API_Model = new MODEL_API({ ajax: context.ajax });
  const commandHandler = useCommandHandler();

  React.useEffect(() => {

    if (value.key) {
      API_Model.GetFileInfo({ FileGuids: [value.key], SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((filesInfo) => {
        setTokenItems([{ id: filesInfo.result[0].Hash, title: filesInfo.result[0].FileName, metadata: filesInfo.result[0].Guid }]);
      }).catch(() => {
        Message.error(translate("FileUploadError"));
      });
    }
    if (value.key === undefined) {
      setTokenItems(undefined)
    }
  }, [value]);

  const downloadFile = (seletedToken: SelectedToken) => {
    const fileInfo = tokenItems.find(token => (token.id as string).toLowerCase() === seletedToken.id.toLowerCase());
    API_Model.GetFileTokenToDownload({ FileGuid: fileInfo.metadata, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((downloadToken) => {
      window.open(`didgah/core/common/ExtraModel/DynamicDataModelFile/GetFileUrlsToDownload?fileToken=${downloadToken}&fileName=${fileInfo.title}`);
    }).fail(handleErrors)
  }

  return (
    <TokenContainer onTokenDblClick={downloadFile} tokenItems={tokenItems} />
  )
}

export default injectContext(FileDisplayOneToOne);
