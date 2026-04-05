import { SelectItem } from '@didgah-components/ant-selectindividual';
import { translate } from "didgah/common";
import { Form, FormComponentProps, SelectEx, SelfOrderedForm, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { LayoutBriefViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutBriefViewModel";

export interface LayoutSelectorViewModel {
  layoutGuid: string;
}

interface LayoutSelectorProps extends FormComponentProps<LayoutSelectorViewModel> {
  layouts: LayoutBriefViewModel[];
  onFormCreated: (form: WrappedFormUtils) => void;
}

function LayoutSelector(props: LayoutSelectorProps) {

  const fieldDecorator = React.useRef(props.form.getFieldDecorator).current;

  React.useEffect(() => {
    props.onFormCreated(props.form);
  }, []);

  return (
    <SelfOrderedForm numberOfColumns={1}>
      <Form.Item label={translate('Layout')} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {fieldDecorator('layoutGuid', { initialValue: !!props.layouts[0] && props.layouts[0].Guid, rules: [{ required: true }] })
          (<SelectEx
            dataSource={props.layouts.map<SelectItem>(x => {
              return { value: x.Guid, key: x.Label };
            })} />)}
      </Form.Item>
    </SelfOrderedForm>
  )
}

export default Form.create()(LayoutSelector);