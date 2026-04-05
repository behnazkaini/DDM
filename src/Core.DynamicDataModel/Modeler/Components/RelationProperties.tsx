import React, { useEffect } from 'react';
import { translate } from 'didgah/common';
import { Alert, Button, Form, FormComponentProps, FormLayout, Input, InputNumber } from 'didgah/ant-core-component';
import LinkData from '../GraphModels/LinkData';
import { validNameRegex } from '../Utility';

const FormItem = Form.Item;

export interface RelationPropertiesForm {
  name: string;
  bookmark: string;
  label: string;
}

interface Props extends FormComponentProps<RelationPropertiesForm> {
  selectedItem: LinkData;
  onRelationPropertyChange: (fieldName: 'name' | 'bookmark' | 'label' | 'settings', value) => void;
  onDelete: (guid: string) => void;
}

function RelationProperties({ form, selectedItem, onRelationPropertyChange, onDelete }: Props) {
  const { getFieldDecorator } = form;
  const disable = !selectedItem.editable;
  const hasSetting = () => selectedItem?.settings && selectedItem.settings.length > 0

  useEffect(() => {
    form.setFieldsValue({ name: selectedItem.name });
    form.setFieldsValue({ bookmark: selectedItem.bookmark });
    form.setFieldsValue({ label: selectedItem.label });
    if (hasSetting()) {
      selectedItem.settings.forEach(item => {
        form.setFieldsValue({ [item.Guid]: item?.Value })
      });
    }
    // validate on first render
    form.validateFields(() => { });
  }, [])

  function handleFieldChange(fieldName: keyof RelationPropertiesForm | 'settings', value: any) {
    onRelationPropertyChange(fieldName, value);
  }

  function renderSettingsFields() {
    const { settings } = selectedItem;
    return settings.map(({ Label, Guid }) => (
      <FormItem label={translate(Label)} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
        {getFieldDecorator(Guid as any, {})(
          <InputNumber onChange={(value) => {
            const next = settings.map(s => s.Guid === Guid ? { ...s, Value: value } : s)
            handleFieldChange('settings', next)
          }} />
        )}
      </FormItem>
    ));
  }

  return (
    <FormLayout>
      <FormLayout.LayoutContent>
        <Form>
          <FormItem label={translate('Title')} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
            {getFieldDecorator('name', { rules: [{ required: true, pattern: validNameRegex, message: translate('DDMModelerRelationNameincorrect') }] })(
              <Input onChange={(e) => { handleFieldChange('name', (e.target as any).value) }} disabled={disable} />
            )}
          </FormItem>
          <FormItem label={translate('Label')} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
            {getFieldDecorator('label', { rules: [{ required: true }] })(
              <Input onChange={(e) => { handleFieldChange('label', (e.target as any).value) }} />
            )}
          </FormItem>
          <FormItem label={translate('Bookmark')} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
            {getFieldDecorator('bookmark', {})(
              <Input onChange={(e) => { handleFieldChange('bookmark', (e.target as any).value) }} />
            )}
          </FormItem>
          {hasSetting() && [...renderSettingsFields()]}
        </Form>
      </FormLayout.LayoutContent>
      <FormLayout.ActionBar>
        {selectedItem.deletable && <Button onClick={() => { onDelete(selectedItem.key) }}>{translate("Delete")}</Button>}
      </FormLayout.ActionBar>
    </FormLayout>
  );
}
export default Form.create()(RelationProperties);
