import { CheckboxItem, CheckboxList, CheckboxListStore, injectContext, Spin, useAjax } from "didgah/ant-core-component";
import React, { useRef, useState, useEffect } from "react";
import { IWidget, ComponentProps, AggregationOneToManyValue } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl, handleErrors } from '../../../Utility/helpers';
import { checkIsWidgetDisabled } from "./helper";
import { translate } from "../../../Utility/language";

interface RowColumnDataViewModel {
  KeyValues: Array<{ Key: string, Value: any }>
  PrimaryKey: string
}

const ReferenceCheckBoxList = ({ onChange, value, initValue, mode, Disabled, ReferenceCheckBoxListColumnsConfig, Widget }: ComponentProps<AggregationOneToManyValue>) => {
  const ajax = useAjax();
  const [options, setOptions] = useState<CheckboxItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const checkListStore = useRef<CheckboxListStore>(new CheckboxListStore());
  const formData = useRef<Array<RowColumnDataViewModel>>([]);

  useEffect(() => {
    if (mode === 'render') {
      !formData.current?.length && getRendererInitData()
    } else if (mode === 'design') {
      setupDesignerMockData()
    }
  }, []);

  useEffect(() => {
    !value && options.length > 0 && setOptions(options => options.map(i => ({ ...i, selected: false })))
  }, [value])

  const setupDesignerMockData = () => {
    setOptions([
      {
        text: `${translate("Option")} 1`,
        value: '1',
        selected: false
      },
      {
        text: `${translate("Option")} 2`,
        value: '2',
        selected: true
      },
      {
        text: `${translate("Option")} 3`,
        value: '3',
        selected: false
      },
      {
        text: `${translate("Option")} 4`,
        value: '4',
        selected: true
      }
    ])
  }

  const getRendererInitData = async () => {
    try {
      setLoading(true)
      const options: Array<RowColumnDataViewModel> = await ajax.post({
        url: getApiUrl('DynamicDataModel', 'DataModel', 'SearchByKeyword'),
        data: getApiInitDataFactory()
      });
      formData.current = [...options]
      setupOptions(options)
    } catch (error) {
      handleErrors(error)
    } finally {
      setLoading(false)
    }
  }

  const getApiInitDataFactory = () => {
    return {
      ColumnGuids: initValue?.metadata.ColumnGuids,
      DataModelGuid: initValue?.metadata.DataModelGuid,
      Keyword: '',
    }
  }

  const setupOptions = (checkBoxOptions: Array<RowColumnDataViewModel>) => {
    const mappedData: CheckboxItem[] = checkBoxOptions?.map(i => ({
      text: getRowDataTitleByPrimaryKey(i.PrimaryKey),
      value: i.PrimaryKey,
      selected: getRowDataSelectedStateByPrimaryKey(i.PrimaryKey)
    }))
    setOptions(mappedData)
  }

  const getRowDataTitleByPrimaryKey = (primaryKey: string) => {
    const seperableCharachter = !!ReferenceCheckBoxListColumnsConfig ? ReferenceCheckBoxListColumnsConfig.SeperableCharachter : ','
    const rowTitle = getRowDataByPrimaryKey(primaryKey).KeyValues.map(column => column.Value).join(seperableCharachter)
    return rowTitle
  }

  const getRowDataSelectedStateByPrimaryKey = (primaryKey: string) => !!initValue?.tokens.find(i => i.id === primaryKey)

  const handleChange = (checkedOptions: CheckboxItem[]) => {
    if (mode === 'render') {
      const selectedTokens = checkedOptions
        .filter(i => i.selected)
        .map(i => ({ id: i.value, title: i.text, rowData: getRowDataByPrimaryKey(i.value).KeyValues }))
      onChange({ metadata: initValue.metadata, tokens: selectedTokens })
    }
  }

  const getRowDataByPrimaryKey = (primaryKey: string) => formData.current.find(row => row.PrimaryKey === primaryKey);

  const getColumnCount = () => {
    let columnCount = 4;
    if (ReferenceCheckBoxListColumnsConfig.CheckBoxCoulmnCountInARow) {
      columnCount = ReferenceCheckBoxListColumnsConfig.CheckBoxCoulmnCountInARow;
    }
    return columnCount
  }

  return (
    <Spin spinning={loading} stretch>
      {options?.length &&
        <CheckboxList
          fieldsetTitle={translate('CheckBoxList')}
          hasFieldset={false}
          showSelectAll={false}
          height="100%"
          store={checkListStore.current}
          checkboxItems={options}
          disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
          columnCount={getColumnCount()}
          onChange={handleChange}
        />}
    </Spin>
  );
};

export default {
  component: injectContext(ReferenceCheckBoxList),
} as IWidget;
