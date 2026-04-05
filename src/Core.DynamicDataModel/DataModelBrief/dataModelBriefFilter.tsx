import { translate } from "didgah/common";
import { Button, Form, FormComponentProps, Input, SelectEx, SelectItem, SelfOrderedForm, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import SearchCommandSet from "../../Common/searchCommandSet";
import { DataModelBriefPagedFilterViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefPagedFilterViewModel";
import { ScopeViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeViewModel";

export interface DataModelBriefFilterProps extends FormComponentProps<DataModelBriefPagedFilterViewModel> {
  scopes: ScopeViewModel[];
  handleSearch: () => void;
  onFormCreated: (form: WrappedFormUtils) => void;
  searchDisable?:boolean
}

function DataModelBriefFilter(props: DataModelBriefFilterProps) {

  const fieldDecorator = React.useRef(props.form.getFieldDecorator).current;

  React.useEffect(() => {
    props.onFormCreated(props.form);
  }, []);

  return (
    <>
      <SelfOrderedForm numberOfColumns={3}>
        <Form.Item label={translate('Scope')}>
          {fieldDecorator('ScopeGuid', { initialValue: !!props.scopes[0] && props.scopes[0].Guid })
            (<SelectEx dataSource={props.scopes.map<SelectItem>(x => ({ value: x.Guid, key: x.Name }))} />)}
        </Form.Item>
        <Form.Item label={translate('Name')}>
          {fieldDecorator('Name')
            (<Input onPressEnter={props.handleSearch} />)}
        </Form.Item>
        <Form.Item label={translate('Label')}>
          {fieldDecorator('Label')
            (<Input onPressEnter={props.handleSearch} />)}
        </Form.Item>
      </SelfOrderedForm>
      <SearchCommandSet>
        <Button type='primary' onClick={props.handleSearch} disabled={props.searchDisable}>{translate(props.searchDisable?'SearchDisable_Common':'Search')}</Button>
      </SearchCommandSet>
    </>
  )
}

export default Form.create()(DataModelBriefFilter);