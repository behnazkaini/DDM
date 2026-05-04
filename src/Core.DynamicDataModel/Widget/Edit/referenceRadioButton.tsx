import { Radio, RadioGroup, Spin, useAjax } from "didgah/ant-core-component";
import React, { useEffect, useRef, useState } from "react";
import { IWidget, ComponentProps, AggregationOneToOneValue } from "../../../typings/Core.DynamicDataModel/Types";
import { getApiUrl, handleErrors } from '../../../Utility/helpers';
import { checkIsWidgetDisabled } from "./helper";
import { KeyValueViewModel } from "Scripts/Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { translate } from '../../../Utility/language';

interface RowColumnDataViewModel {
  KeyValues: Array<{ Key: string, Value: any }>
  PrimaryKey: string
}

const ReferenceRadioButton = ({ value, onChange, initValue, Disabled, ReferenceRadioButtonColumnsConfig = { SeperableCharachter: ',', Columns: {} }, mode, Widget, rules, validationRules, ...rest }: ComponentProps<AggregationOneToOneValue>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [radioButtons, setRadioButtons] = useState<Array<KeyValueViewModel<string, string>>>([])
  const formData = useRef<Array<RowColumnDataViewModel>>([]);
  const ajax = useAjax();

  useEffect(() => {
    if (mode === 'render') {
      !formData.current?.length && getRendererInitData()
    } else if (mode === 'design') {
      setupDesignerMockData()
    }
  }, [rules]);

  const setupDesignerMockData = () => {
    setRadioButtons([
      {
        Key: `${translate("Option")} 1`,
        Value: '1',
      },
      {
        Key: `${translate("Option")} 2`,
        Value: '2',
      },
      {
        Key: `${translate("Option")} 3`,
        Value: '3',
      },
      {
        Key: `${translate("Option")} 4`,
        Value: '4',
      }
    ])
  }

  const getRendererInitData = async () => {
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
    const isRequired = checkIsRequired();
    const mappedData: KeyValueViewModel<string, string>[] = radioButtonsList?.map(i => ({
      Key: getRowDataTitleByPrimaryKey(i.PrimaryKey),
      Value: i.PrimaryKey,
    }))
    !isRequired && mappedData.push({ Key: translate('None'), Value: null, })
    setRadioButtons(mappedData)
  }

  const getRowDataTitleByPrimaryKey = (primaryKey: string) => {
    const seperableCharachter = !!ReferenceRadioButtonColumnsConfig ? ReferenceRadioButtonColumnsConfig.SeperableCharachter : ','
    const rowTitle = getRowDataByPrimaryKey(primaryKey)?.KeyValues.map(column => column.Value).join(seperableCharachter) || translate('None')
    return rowTitle
  }

  const handleChange = (e: any) => {//RadioChangeEvent
    const selectedButtonPrimaryKey = e.target.value;
    onChange({
      key: selectedButtonPrimaryKey,
      label: getRowDataTitleByPrimaryKey(selectedButtonPrimaryKey),
      metadata: initValue?.metadata,
      rowData: getRowDataByPrimaryKey(selectedButtonPrimaryKey)?.KeyValues || []
    })
  }

  const getRowDataByPrimaryKey = (primaryKey: string) => formData.current.find(row => row.PrimaryKey === primaryKey)

  const getRadioButtonValue = () => {
    let selectedValue = value?.key;
    if (!value && radioButtons?.length && !checkIsRequired()) {
      selectedValue = radioButtons[radioButtons?.length - 1]?.Value
    }
    return selectedValue;
  }

  const checkIsRequired = () => rules?.length && rules?.every(i => i?.required)

  const rendererRadioGroupProps = () => {
    if (mode === 'render') {
      return {
        onChange: handleChange,
        value: getRadioButtonValue()
      }
    }
  }

  return (
    <Spin spinning={loading} stretch>
      <RadioGroup
        disabled={checkIsWidgetDisabled(Disabled, Widget, mode)}
        {...rendererRadioGroupProps()}
      >
        {radioButtons?.map(i => (
          <Radio
            key={i.Key}
            value={i.Value}>
            {i.Key}
          </Radio>
        ))}
      </RadioGroup>
    </Spin>
  );
};

export default {
  component: ReferenceRadioButton,
} as IWidget;
