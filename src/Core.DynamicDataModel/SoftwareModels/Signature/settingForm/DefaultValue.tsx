import React from 'react'
import { translate } from 'didgah/common'
import { Checkbox, Form } from 'didgah/ant-core-component'
import { SettingFormItemProps } from '../types'

function DefaultValue({
	form,
	settingName,
	initialSettingValues,
	onSave,
	key
}: SettingFormItemProps<Array<string>>) {
	return (
		<Form.Item
			key={key}
			label={translate("DefaultValue")}
			labelCol={{ span: 0, offset: 0 }}
			wrapperCol={{ span: 24, offset: 0 }}
		>
			{form.getFieldDecorator(settingName, {
				valuePropName: 'checked',
				initialValue: initialSettingValues[settingName],
			})(<Checkbox onChange={onSave} />)}
		</Form.Item>
	)
}

export default DefaultValue