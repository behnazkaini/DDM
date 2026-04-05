import { TokenContainer, injectContext, DidgahContextProps, TokenItem, SelectedToken } from 'didgah/ant-core-component';
import React from 'react';
import { AggregationOneToManyValue } from '../types';
import MODEL_API, { GetFileInfoResult } from './API';
import { useCommandHandler } from 'didgah/ant-core-component';
import { handleErrors } from '../../../../Utility/helpers';

interface FileDisplayOneToManyProps {
  value: AggregationOneToManyValue;
  context?: DidgahContextProps;
}

const emptyObj = {
  metadata: {
    ColumnGuids: [],
    DataModelGuid: "00000000-0000-0000-0000-000000000000"
  },
  tokens: [],
}

function FileDisplayOneToMany(props: FileDisplayOneToManyProps) {
  const { value = emptyObj, context } = props;
  const commandHandler = useCommandHandler();
  const [tokenItems, setTokenItems] = React.useState<Array<TokenItem>>([]);
  const API_Model = new MODEL_API({ ajax: context.ajax });

  const downloadFile = (seletedToken: SelectedToken) => {
    const fileInfo = tokenItems.find(token => (token.id as string).toLowerCase() === seletedToken.id.toLowerCase());

    API_Model.GetFileTokenToDownload({ FileGuid: fileInfo.metadata, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((downloadToken) => {
      window.open(`didgah/core/common/ExtraModel/DynamicDataModelFile/GetFileUrlsToDownload?fileToken=${downloadToken}&fileName=${fileInfo.title}`);
    }).fail(handleErrors)
  }

  React.useEffect(() => {
    if (value.tokens.length > 0) {
      const guids: string[] = value.tokens.map((file) => file.id);
      API_Model.GetFileInfo({ FileGuids: guids, SoftwareGuid: commandHandler.getCurrentSoftwareGuid() }).then((filesInfo) => {
        setTokenItems(filesInfo.result.map((file) => {
          return { id: file.Hash, title: file.FileName, metadata: file.Guid }
        }));
      }).catch(() => {
        console.error("Get File");
      });
    }
    if (value.tokens.length === 0) {
      setTokenItems(undefined)
    }
  }, [value]);

  return (
    <TokenContainer onTokenDblClick={downloadFile} tokenItems={tokenItems} />
  )


}

export default injectContext(FileDisplayOneToMany);
