import React, { useEffect } from 'react';
import { translate } from 'didgah/common';
import { Alert, Button, Form, FormComponentProps, FormLayout, Input, InputNumber } from 'didgah/ant-core-component';

import Table from '../GraphModels/Table';
import { validNameRegex } from '../Utility';
const FormItem = Form.Item;

export interface TablePropertiesForm {
	name: string;
	label: string;

}

 
interface Props extends FormComponentProps<TablePropertiesForm> {
	selectedItem: Table;
	onTablePropertyChange: (fieldName: 'name' | 'label', value) => void;
	onDelete: (guid: string) => void;
}

function TableProperties({ form, selectedItem, onTablePropertyChange, onDelete }: Props) {
	const { getFieldDecorator } = form;
	const disableAllFields = !selectedItem.hardEditable;
	const disableImportantFields = !selectedItem.softEditable || !selectedItem.hardEditable;

	// set initial value of form
	useEffect(() => {
		form.setFieldsValue({ name: selectedItem.name });
		form.setFieldsValue({ label: selectedItem.label });
		// validate on first render
		form.validateFields(() => { });

	}, [])

	function handleFieldChange(fieldName: keyof TablePropertiesForm, value) {
		onTablePropertyChange(fieldName, value);
	}

	return (
		<FormLayout>
			<FormLayout.LayoutContent>
					<Form>
					<FormItem label={translate('Title')} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
						{getFieldDecorator('name', { rules: [{ required: true, pattern: validNameRegex, message: translate('DDMModelerTableNameincorrect') }] })(
							<Input onChange={(e) => { handleFieldChange('name',( e.target as any).value) }} disabled={disableImportantFields} />
							)}
					</FormItem>
						<FormItem label={translate('Label')} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
							{getFieldDecorator('label', { rules: [{ required: true }] })(
								<Input onChange={(e) => { handleFieldChange('label', ( e.target as any).value) }} disabled={disableAllFields}/>
							)}
						</FormItem>
						</Form>
			</FormLayout.LayoutContent>
			{selectedItem.deletable && <FormLayout.ActionBar>
				<Button onClick={() => {onDelete(selectedItem.key)}}>{translate("Delete")}</Button>
			</FormLayout.ActionBar>}
		</FormLayout>
	);
}
export default Form.create()(TableProperties);
