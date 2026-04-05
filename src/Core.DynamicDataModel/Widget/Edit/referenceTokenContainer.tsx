import { injectContext, TokenContainer } from "didgah/ant-core-component";
import * as React from "react";
import { IWidget, ComponentProps, AggregationOneToManyValue, AggregationOneToManyValueTokens } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl } from '../../../Utility/helpers';
import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { checkIsWidgetDisabled } from "./helper";

const ReferenceTokenContainer = (props: ComponentProps<AggregationOneToManyValue>) => {
  const { value, onChange, initValue, mode, Disabled, ReferenceTokenContainerColumnsConfige, Widget } = props;
  const [tokenItems, setTokenItems] = React.useState<Array<AggregationOneToManyValueTokens>>([]);
  const formData = React.useRef([]);

  React.useEffect(() => {
    if (mode === 'render') {
      setTokenItems(setupTokenItems());
    }
  }, [props.value]);

  function defineCustomDataLabelName(result): string {
    const values: string[] = (result.KeyValues as Array<{ Value: string; Key: string }>).map((column) => column.Value);
    formData.current.push(result);
    const SeperableCharachter = !!ReferenceTokenContainerColumnsConfige ? ReferenceTokenContainerColumnsConfige.SeperableCharachter : ','
    return (values).join(SeperableCharachter);
  }

  function setupTokenItems(): Array<AggregationOneToManyValueTokens> {
    const tokens = value?.tokens ?? [];
    const currentTokens = [];
    if (!!tokens.length) {
      tokens.forEach((val) => {
        currentTokens.push(val)
      })
    }
    return currentTokens
  }

  function handleTokenDelete(id): void {
    const tempList = [...tokenItems]
    const itemIndex = tempList.findIndex(item => item.id === id);
    tempList.splice(itemIndex, 1);
    if (tempList.length) {
      onChange({
        tokens: [...tempList],
        metadata: initValue.metadata
      });
    }
    else {
      onChange(undefined)
    }
    setTokenItems([...tempList]);
  }

  function handleAutoCompleteItemSelect({ label, value }): void {
    const rowData = formData.current.find((data) => data.PrimaryKey === value);
    if (tokenItems.find(item => item.id === value) == null) {
      const tokensList = [...tokenItems, {
        id: value,
        title: label,
        rowData: rowData.KeyValues
      }];
      onChange({
        tokens: tokensList,
        metadata: initValue.metadata
      });
      formData.current = [];
      setTokenItems(tokensList)
    }

  }

  return (
    <TokenContainer
      tokenItems={tokenItems}
      onTokenClose={handleTokenDelete}
      closeable={true}
      remoteDataSource={[
        {
          url: getApiUrl('DynamicDataModel', 'DataModel', 'SearchByKeyword'),
          metadata: {
            ColumnGuids: initValue?.metadata.ColumnGuids,
            DataModelGuid: initValue?.metadata.DataModelGuid,
          },
          dataValueName: "PrimaryKey",
          dataLabelName: 'KeyValues',
          defineCustomDataLabelName: defineCustomDataLabelName
        }
      ]}
      onAutoCompleteItemSelect={handleAutoCompleteItemSelect}
      readOnly={checkIsWidgetDisabled(Disabled, Widget, mode)}
    />
  );
};

export default {
  component: injectContext(ReferenceTokenContainer),
} as IWidget;
