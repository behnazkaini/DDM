import { translate } from 'didgah/common'
import { Form, InputNumber } from 'didgah/ant-core-component'
import React from 'react'
import { SettingFormItemProps } from '../types'

function AllowedFileCount({
	form,
	settingName,
	initialSettingValues,
	onSave,
	key
}: SettingFormItemProps<Array<string>>) {
	return (
		<Form.Item
			key={key}
			label={translate('AllowedFileCount')}
			labelCol={{ span: 0 }}
			wrapperCol={{ span: 24 }}>
			{form.getFieldDecorator(settingName, { initialValue: initialSettingValues[settingName] })(<InputNumber max={15} min={0} onChange={onSave} />)}
		</Form.Item>
	)
}

export default AllowedFileCount