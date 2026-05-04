import { translate } from 'didgah/common';
import { Alert, Button, Checkbox, Form, FormComponentProps, FormLayout, Input, InputNumber } from 'didgah/ant-core-component';
import { ColumnDataType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SelectDataType from '../../Modeler/Components/SelectDataType';
import Column from '../../Modeler/GraphModels/Column';
import { validNameRegex } from '../../Modeler/Utility';
import Table from '../../Modeler/GraphModels/Table';
import { getDefaultDataTypeSetting } from '../../TS/Validations';

const FormItem = Form.Item;

export interface ColumnPropertiesForm {
	name: string;
	dataType: number;
	label: string;
	bookmark: string;
	maxLength: number;
	precision: number;
	scale: number;
	max: boolean;
}

interface Props extends FormComponentProps<ColumnPropertiesForm> {
	hostSoftwareGuid: string;
	table: Table;
	selectedItem: Column;
	onColumnPropertyChange: (value: any) => void;
	inline?: boolean;
	useFormLayoutWrapper?: boolean;
	availableDataTypes?: number[];
}

export function createEmptyDDMTable(): Table {
	return {
		added: false,
		columns: [],
		dataModelType: 1,
		deletable: false,
		guid: '',
		hardEditable: true,
		isNew: true,
		key: '',
		label: '',
		name: '',
		relations: [],
		scopeGuid: '',
		selected: true,
		softEditable: true,
		softwareGuid: '',
		type: 'table',
	}
}


export function createEmptyDDMColumn(): Column {
	return {
		added: false,
		guid: '',
		key: '',
		label: '',
		name: '',
		selected: true,
		type: 'column',
		bookmark: '',
		dataType: 1,
		editable: true,
		setting: '',
		tableKey: '',
    bookmarkType:0
	}
}

function SimpleDesignerColumnProperties({ form, selectedItem, onColumnPropertyChange, hostSoftwareGuid, table, inline = true, useFormLayoutWrapper = true, }: Props) {
	const tableSoftwareGuid = table.softwareGuid;
	const { setFieldsValue, getFieldDecorator, getFieldValue } = form;
	const disableAllFields = hostSoftwareGuid.toLowerCase() !== tableSoftwareGuid.toLowerCase();
	const disableImportantFields = disableAllFields || !selectedItem.editable;
	const lastSettingValues = useRef({ precision: getDefaultDataTypeSetting(ColumnDataType.Decimal).precision, scale: getDefaultDataTypeSetting(ColumnDataType.Decimal).scale });
	const availableDataTypes = useMemo(() => {
		let result;
		switch (selectedItem.dataType) {
			case ColumnDataType.String:
				result = [ColumnDataType.String];
				break;
			case ColumnDataType.DateTime:
				result = [ColumnDataType.DateTime];
				break;
			case ColumnDataType.Boolean:
				result = [ColumnDataType.Boolean];
				break;
			case ColumnDataType.Integer:
			case ColumnDataType.Decimal:
			case ColumnDataType.BigInteger:
				result = [ColumnDataType.Integer, ColumnDataType.Decimal, ColumnDataType.BigInteger];
				break;
		}
		return result;
	}, []);
	// set initial value of form
	useEffect(() => {
		if (selectedItem.setting) {
			const setting = selectedItem.setting;
			switch (selectedItem.dataType) {
				case ColumnDataType.String:
					setFieldsValue({ max: !!setting.max })
					setFieldsValue({ maxLength: setting.maxLength })
					break;
				case ColumnDataType.Decimal:
					setFieldsValue({ precision: setting.precision })
					setFieldsValue({ scale: setting.scale })
					break;
			}
		}
		setFieldsValue({ name: selectedItem.name });
		setFieldsValue({ dataType: selectedItem.dataType });
		setFieldsValue({ label: selectedItem.label });
		setFieldsValue({ bookmark: selectedItem.bookmark });
		form.validateFields(() => { });
		// onColumnPropertyChange({ 'setting': getDefaultDataTypeSetting(selectedItem.dataType)});
	}, [])

	function addValueToSetting(setting, fieldName, value) {
		const newSetting = setting ? { ...setting } : {};
		newSetting[fieldName] = value;
		return newSetting;
	}



	function handleFieldChange(fieldName: keyof ColumnPropertiesForm, value) {
		let setting = selectedItem.setting ? selectedItem.setting : getDefaultDataTypeSetting(getFieldValue('dataType'));
		switch (fieldName) {
			case 'name':
			case 'label':
			case 'bookmark':
				onColumnPropertyChange({ [fieldName]: value });
				break;
			case 'dataType':
				onColumnPropertyChange({ [fieldName]: value, setting: getDefaultDataTypeSetting(value) });
				break;
			case 'maxLength':
				onColumnPropertyChange({ 'setting': addValueToSetting(setting, 'maxLength', value) });
				break;
			case 'max':
				setFieldsValue({ maxLength: 4000 });
				onColumnPropertyChange({ 'setting': addValueToSetting(addValueToSetting(setting, 'max', value), 'maxLength', 4000) });
				break;
			case 'precision':
				let consideredPrecisionValue = value ? value : getDefaultDataTypeSetting(ColumnDataType.Decimal).precision;
				lastSettingValues.current.precision = consideredPrecisionValue
				onColumnPropertyChange({ 'setting': addValueToSetting(setting, 'precision', consideredPrecisionValue) });
				break;
			case 'scale':
				let consideredScaleValue = value ? value : getDefaultDataTypeSetting(ColumnDataType.Decimal).scale;
				lastSettingValues.current.scale = consideredScaleValue
				onColumnPropertyChange({ 'setting': addValueToSetting(setting, 'scale', consideredScaleValue) });
				break;
		}
	}

	const precisionAndScaleFormAlert = useMemo(() => {
		if (!getFieldValue('scale')) {
			setFieldsValue({ scale: lastSettingValues.current.scale })
		}

		if (!getFieldValue('precision')) {
			setFieldsValue({ precision: lastSettingValues.current.precision })
		}

		if (getFieldValue('scale') > getFieldValue('precision')) {
			return translate('DDMModelerPrecisionShouldBeBiggerThanScale');
		} else {
			return null;
		}
	}, [getFieldValue('scale'), getFieldValue('precision')])

	useEffect(() => {
		if (!getFieldValue('maxLength')) {
			setFieldsValue({ maxLength: getDefaultDataTypeSetting(ColumnDataType.String).maxLength });
		}
	}, [getFieldValue('maxLength')]);

	function labelValidator(rule, value, callback) {
		if (table.columns.filter(col => col.key !== selectedItem.key).find(col => col.label === selectedItem.label)) {
			callback({
				message: translate('DDMModelerDuplicateLabel'),
				field: rule.field,
			});
		} else {
			callback();
		}
	}

	const getFormItemSizeSetting = (inline, isSetting) => {
		if (inline) {
			if (isSetting) {
				return {
					wrapperCol: { span: 14 },
					labelCol: { span: 10 }
				}
			} else {
				return {
					wrapperCol: { span: 18 },
					labelCol: { span: 6 }
				}
			}

		} else {
			return {
				labelCol: { span: 0, offset: 0 },
				wrapperCol: { span: 24, offset: 0 }
			}
		}
	}

	const formItemSize = getFormItemSizeSetting(inline, false);
	const settingFormItemSize = getFormItemSizeSetting(inline, true);

	const InnerForm = (
		<Form>
			<FormItem label={translate('ColumnTitle')} {...formItemSize}>
				{getFieldDecorator('name', { rules: [{ required: true, pattern: validNameRegex, message: translate('DDMModelerColumnNameincorrect') }] })(
					<Input onChange={(e) => { handleFieldChange('name', (e.target as any).value) }} disabled={disableImportantFields} />
				)}
			</FormItem>
			<FormItem label={translate('DDMModelerDataType')} {...formItemSize}>
				{getFieldDecorator('dataType', { rules: [{ required: true }] })(
					<SelectDataType dataTypes={availableDataTypes} onChange={(value) => { handleFieldChange('dataType', value) }} disabled={disableImportantFields} 
					/>
				)}
			</FormItem>
			<FormItem label={translate('Label')} {...formItemSize}>
				{getFieldDecorator('label', { rules: [{ required: true }, { validator: labelValidator }] })(
					<Input onChange={(e) => { handleFieldChange('label', (e.target as any).value) }} disabled={disableAllFields} />
				)}
			</FormItem>
			<FormItem label={translate('Bookmark')} {...formItemSize}>
				{getFieldDecorator('bookmark', { rules: [{ required: false }] })(
					<Input onChange={(e) => { handleFieldChange('bookmark', (e.target as any).value) }} disabled={disableAllFields} />
				)}
			</FormItem>

			{(() => {
				switch (Number(getFieldValue('dataType'))) {
					case ColumnDataType.String:
						return (
							<>
								<FormItem label={translate('DDMModelerMaxLength')} {...settingFormItemSize}>
									{getFieldDecorator('maxLength', { initialValue: 128, rules: [{ required: true }] })(
										<InputNumber onChange={(value) => { handleFieldChange('maxLength', value) }} disabled={disableImportantFields || getFieldValue('max')} max={4000} min={0} />
									)}
								</FormItem>
								<FormItem label={translate('DDMModelerMax')} {...settingFormItemSize}>
									{getFieldDecorator('max', {})(
										<Checkbox onChange={(e) => { handleFieldChange('max', (e.target as any).checked) }} disabled={disableImportantFields} />
									)}
								</FormItem>
							</>
						)

					case ColumnDataType.Decimal:
						return (
							<>
								<FormItem label={translate('DDMModelerPrecision')} {...settingFormItemSize} validateStatus={precisionAndScaleFormAlert ? 'error' : 'success'}>
									{getFieldDecorator('precision', { rules: [{ required: true }], })(
										<InputNumber onChange={(value) => { handleFieldChange('precision', value) }} disabled={disableImportantFields} min={0} max={28} />
									)}
								</FormItem>
								<FormItem label={translate('DDMModelerScale')} {...settingFormItemSize} validateStatus={precisionAndScaleFormAlert ? 'error' : 'success'} >
									{getFieldDecorator('scale', {  rules: [{ required: true }] })(
										<InputNumber onChange={(value) => { handleFieldChange('scale', value) }} disabled={disableImportantFields} min={0} max={28} />
									)}
								</FormItem>
								{precisionAndScaleFormAlert && <Alert type="error" message={precisionAndScaleFormAlert} />}
							</>
						)
					default:
						return '';
				}
			})()}
		</Form>
	)
	return useFormLayoutWrapper ? (
		<FormLayout style={{ backgroundColor: 'transparent' }}>
			<FormLayout.LayoutContent style={{ backgroundColor: 'transparent' }}>
				{InnerForm}
			</FormLayout.LayoutContent>
		</FormLayout>) : InnerForm
		;
}

// SimpleDesignerColumnProperties.defaultProps = {
// 	availableDataTypes: Object.keys(ColumnDataType).filter(key => !isNaN(Number(key)))
// }

export default Form.create()(SimpleDesignerColumnProperties);

