import { CheckboxItem, CheckboxList, CheckboxListStore, injectContext, Spin, useAjax } from "didgah/ant-core-component";
import React, { useEffect, useState, useRef } from "react";
import { IWidget, ComponentProps, AggregationOneToManyValue } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl, handleErrors } from '../../../Utility/helpers';
import { translate } from "../../../Utility/language";

interface RowColumnDataViewModel {
  KeyValues: Array<{ Key: string, Value: any }>
  PrimaryKey: string
}

const ReferenceCheckBoxListViewer = ({ initValue, mode, ReferenceCheckBoxListColumnsConfig }: ComponentProps<AggregationOneToManyValue>) => {
  const ajax = useAjax();
  const [options, setOptions] = useState<CheckboxItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const checkListStore = useRef<CheckboxListStore>(new CheckboxListStore());
  const formData = useRef<Array<RowColumnDataViewModel>>([]);

  useEffect(() => {
    if (mode === 'render') {
      getInitData()
    }
  }, []);

  const getInitData = async () => {
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

  const getRowDataByPrimaryKey = (primaryKey: string) => formData.current.find(row => row.PrimaryKey === primaryKey)

  return (
    <Spin spinning={loading} stretch>
      <div className="DDM_Pointer_Event_None">
        {options?.length >= 1 &&
          <CheckboxList
            fieldsetTitle={translate('CheckBoxList')}
            hasFieldset={false}
            showSelectAll={false}
            height="100%"
            store={checkListStore.current}
            checkboxItems={options}
            columnCount={!!ReferenceCheckBoxListColumnsConfig ? ReferenceCheckBoxListColumnsConfig.CheckBoxCoulmnCountInARow : 4}
          />}
      </div>
    </Spin>
  );
};

export default {
  component: injectContext(ReferenceCheckBoxListViewer),
} as IWidget;
