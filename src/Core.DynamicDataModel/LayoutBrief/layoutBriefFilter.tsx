import { translate } from "didgah/common";
import { Button, Form, FormComponentProps, Input, Radio, SelectEx, SelectItem, SelfOrderedForm, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { $enum } from "ts-enum-util";
import SearchCommandSet from "../../Common/searchCommandSet";
import { LayoutBriefPagedFilterViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefPagedFilterViewModel";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

export interface LayoutFilterProps extends FormComponentProps<LayoutBriefPagedFilterViewModel> {
  handleSearch: () => void;
  onFormCreated: (form: WrappedFormUtils) => void;
  searchDisable?:boolean
}

function LayoutBriefFilter(props: LayoutFilterProps) {

  const fieldDecorator = React.useRef(props.form.getFieldDecorator).current;

  React.useEffect(() => {
    props.onFormCreated(props.form);
  }, []);

  return (
    <>
      <SelfOrderedForm numberOfColumns={3}>
        <Form.Item label={translate('Label')}>
          {fieldDecorator('Label')
            (<Input onPressEnter={props.handleSearch} />)}
        </Form.Item>
        <Form.Item label={translate('Type')}>
          {fieldDecorator('Type')
            (<SelectEx allowClear
              dataSource={$enum(LayoutType).getValues().map<SelectItem>(x => {
                return {
                  value: x,
                  key: translate(`LayoutType_${$enum(LayoutType).getKeyOrThrow(x)}`)
                }
              })}
            />)}
        </Form.Item>
        <Form.Item label={translate('IsDefault')}>
          {fieldDecorator('IsDefault', { initialValue: null })
            (<Radio.Group>
              <Radio value={null}>{translate('Both')}</Radio>
              <Radio value='true'>{translate('Yes')}</Radio>
              <Radio value='false'>{translate('No')}</Radio>
            </Radio.Group>)
          }
        </Form.Item>
      </SelfOrderedForm>
      <SearchCommandSet>
        <Button type='primary' onClick={props.handleSearch} disabled={props.searchDisable}>{translate(props.searchDisable?'SearchDisable_Common':'Search')}</Button>
      </SearchCommandSet>
    </>
  )
}

export default Form.create()(LayoutBriefFilter);