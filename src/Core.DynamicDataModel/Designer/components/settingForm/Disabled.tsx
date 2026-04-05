import { Checkbox, Form } from 'didgah/ant-core-component';
import React from 'react'
import { BaseColumnSetting, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { translate } from '../../../../Utility/language';

const Disabled = ({ form, onSave, initialSettingValues, settingName, key }: SettingFormItemProps<BaseColumnSetting>) => {
    const { setFieldsValue } = form;

    const handleOnChange = (value: any) => {
        setFieldsValue({ [settingName]: value });
        onSave();
    };

    return (
        <Form.Item
            key={key}
            label={translate("Disable")}
            labelCol={{ span: 0, offset: 0 }}
            wrapperCol={{ span: 24, offset: 0 }}
        >
            {form.getFieldDecorator(settingName, {
                valuePropName: "checked",
                initialValue: initialSettingValues.Disabled,
            })(<Checkbox onChange={handleOnChange} />)}
        </Form.Item>
    )
}

export default Disabled