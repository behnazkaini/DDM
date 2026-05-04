import { Radio, RadioGroup, Spin, useAjax } from "didgah/ant-core-component";
import React, { useEffect, useRef, useState } from "react";
import { IWidget, ComponentProps, AggregationOneToOneValue } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl, handleErrors } from '../../../Utility/helpers';
import { KeyValueViewModel } from "Scripts/Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";

interface RowColumnDataViewModel {
  KeyValues: Array<{ Key: string, Value: any }>
  PrimaryKey: string
}

const ReferenceRadioButtonViewer = ({ value, initValue, ReferenceRadioButtonColumnsConfig = { SeperableCharachter: ',', Columns: {} }, mode }: ComponentProps<AggregationOneToOneValue>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [radioButtons, setRadioButtons] = useState<Array<KeyValueViewModel<string, string>>>([])
  const formData = useRef<Array<RowColumnDataViewModel>>([]);
  const ajax = useAjax();

  useEffect(() => {
    if (mode === 'render') {
      getInitData()
    }
  }, []);

  const getInitData = async () => {
    try {
      setLoading(true)
      const radioButtonsList: Array<RowColumnDataViewModel> = await ajax.post({
        url: getApiUrl('DynamicDataModel', 'DataModel', 'SearchByKeyword'),
        data: getApiInitDataFactory()
      });
      formData.current = [...radioButtonsList]
      setupRadioButtonsList(radioButtonsList)
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

  const setupRadioButtonsList = (radioButtonsList: Array<RowColumnDataViewModel>) => {
    const mappedData: KeyValueViewModel<string, string>[] = radioButtonsList?.map(i => ({
      Value: getRowDataTitleByPrimaryKey(i.PrimaryKey),
      Key: i.PrimaryKey,
    }))
    setRadioButtons(mappedData)
  }

  const getRowDataTitleByPrimaryKey = (primaryKey: string) => {
    const seperableCharachter = !!ReferenceRadioButtonColumnsConfig ? ReferenceRadioButtonColumnsConfig.SeperableCharachter : ','
    const rowTitle = getRowDataByPrimaryKey(primaryKey).KeyValues.map(column => column.Value).join(seperableCharachter)
    return rowTitle
  }

  const getRowDataByPrimaryKey = (primaryKey: string) => formData.current.find(row => row.PrimaryKey === primaryKey)

  return (
    <Spin spinning={loading} stretch>
      <RadioGroup value={value} style={{ pointerEvents: 'none' }} >
        {radioButtons?.map(i => (
          <Radio key={i.Key} value={i.Value}>
            {i.Value}
          </Radio>
        ))}
      </RadioGroup>
    </Spin>
  );
};

export default {
  component: ReferenceRadioButtonViewer,
} as IWidget;
