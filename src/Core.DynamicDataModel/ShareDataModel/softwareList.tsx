import { translate } from "didgah/common";
import { Form, FormComponentProps, SelectEx, SelectItem, SelectValue, SelfOrderedForm, WrappedFormUtils } from "didgah/ant-core-component";
import React from "react";
import { SoftwareScopeStateViewModel } from "./models";


export interface SoftwareListProps extends FormComponentProps {
  softwareScopes: SoftwareScopeStateViewModel[];
  onChange: (softwareGuid: string) => void;
}

function SoftwareList(props: SoftwareListProps) {

  const fieldDecorator = React.useRef(props.form.getFieldDecorator).current;

  React.useEffect(() => {
    props.onChange(props.softwareScopes[0].softwareGuid);
  }, []);

  function onSoftwareChanged(value: SelectValue) {
    props.onChange(value.toString());
  }

  return (
    <SelfOrderedForm numberOfColumns={1}>
      <Form.Item label={translate('Software')}>
        {fieldDecorator('softwareGuid', { initialValue: props.softwareScopes[0].softwareGuid, })
          (<SelectEx
            onChange={onSoftwareChanged}
            dataSource={props.softwareScopes.map<SelectItem>(x => {
              return {
                value: x.softwareGuid,
                key: x.softwareTitle
              }
            })} />)}
      </Form.Item>
    </SelfOrderedForm>
  )
}

export default Form.create()(SoftwareList);