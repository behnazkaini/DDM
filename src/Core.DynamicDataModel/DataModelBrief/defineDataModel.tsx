import { translate } from "didgah/common";
import { Form, FormComponentProps, SelectEx, SelectItem, SelfOrderedForm, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { ScopeViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ScopeViewModel";

export interface DefineDataModelViewModel {
  scopeGuid: string
}

export interface DefineDataModel extends FormComponentProps<DefineDataModelViewModel> {
  scopes: ScopeViewModel[];
  onFormCreated: (form: WrappedFormUtils) => void;
}

function DefineDataModel(props: DefineDataModel) {

  const fieldDecorator = React.useRef(props.form.getFieldDecorator).current;

  React.useEffect(() => {
    props.onFormCreated(props.form);
  }, []);

  return (
    <SelfOrderedForm numberOfColumns={1}>
      <Form.Item label={translate('Scope')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {fieldDecorator('scopeGuid', { initialValue: !!props.scopes[0] && props.scopes[0].Guid, rules: [{ required: true }] })
          (<SelectEx dataSource={props.scopes.map<SelectItem>(x => ({ value: x.Guid, key: x.Name }))} />)}
      </Form.Item>
    </SelfOrderedForm>
  )
}

export default Form.create()(DefineDataModel);