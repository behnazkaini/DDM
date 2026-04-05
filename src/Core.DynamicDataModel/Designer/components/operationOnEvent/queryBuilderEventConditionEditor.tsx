import React, { useEffect, useMemo } from 'react';
import { SelectEx, SelectItem, Button, Col, Row, EditorProps, FieldValue, FormComponentProps, Form } from 'didgah/ant-core-component';
import { Events } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel';
import useFloorStack from '../../hooks/useFloorStack';
import {
	GlobalPropsContext,
} from "../../store/reducers/designLayoutSlice";
import { isWorkspaceLayoutItem } from './JSBlock/helper';
const FormItem = Form.Item;

const eventsDataSource: SelectItem[] = Object.keys(Events).filter(item => isNaN(item as any)).map(item => ({ key: item, value: Events[item] }))

interface Props extends EditorProps {
	onCancel?: () => void;
	onSubmit: (field: Omit<FieldValue, 'value'>, text: string) => void;
	field?: string,
	operator?: string;
	value?: string;
	extraData?: any;
	[name: string]: any;
	layoutItems: LayoutItemViewModel[]
}

function QueryBuilderEventConditionEditor({ form, onSubmit, onCancel, field, operator }: Props & FormComponentProps) {
	const globalProps = React.useContext(GlobalPropsContext);
	const { currentLayout } = useFloorStack({
		layoutGuid: globalProps.layoutGuid,
	});
	const layoutItems = useMemo(() => currentLayout.Items.filter(item => { return isWorkspaceLayoutItem(item); }).map(item => ({ key: JSON.parse(item.Design).Label, value: item.Guid })), []);
	const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;

	useEffect(() => {
		setFieldsValue({'LayoutItem' : field});
		setFieldsValue({'Event' : operator});
	}, []);
	
	function handleSubmit() {
		validateFields((errors, values) => {
			if (!errors) {
				onSubmit({
					field: values.LayoutItem,
					operator: values.Event,
				}, `'${layoutItems.find(layout => layout.value === values.LayoutItem).key} ${Events[values.Event]}'`);
			}
		})
	}

	return (
		<Form>
			<Row>
				<Col md={5}>
					<FormItem >
						{getFieldDecorator('LayoutItem', { rules: [{ required: true }] })(
							<SelectEx disabled={!!field} dataSource={layoutItems} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />)}
					</FormItem>
				</Col>
				<Col md={4}>
					<FormItem >
						{getFieldDecorator('Event', { rules: [{ required: true }] })(
							<SelectEx dataSource={eventsDataSource} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />)}
					</FormItem>
				</Col>
				<Col md={4} offset={6}>
					<FormItem>
						<Button icon='check' onClick={handleSubmit}></Button>
						<Button icon='close' onClick={onCancel}></Button>
					</FormItem>
				</Col>
			</Row>
		</Form>
	);
}

export default Form.create()(QueryBuilderEventConditionEditor);