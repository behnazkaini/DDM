import React, { useEffect, useContext } from 'react';
import { SelectEx, SelectItem, Button, Col, Row, EditorProps, FieldValue, FormComponentProps, Form } from 'didgah/ant-core-component';
import { Events } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel';
import useFloorStack from '../../hooks/useFloorStack';
import {
	GlobalPropsContext,
} from "../../store/reducers/designLayoutSlice";
import { isWorkspaceLayoutItem } from './JSBlock/helper';
import useDataModelTreeStructure from './dataModelTreeStructure';
import TreeSelect from '@didgah-components/ant-tree-select';
import { generateLayoutTree } from './helper';

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

function QueryBuilderEventConditionEditor({ form, onSubmit, onCancel, field, operator, extraData }: Props & FormComponentProps) {
  const globalProps = useContext(GlobalPropsContext);
	const { currentLayout, currentFloor } = useFloorStack({
		layoutGuid: globalProps.layoutGuid,
	});
	const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
	const { loading, treeStore } = useDataModelTreeStructure({ dataModelGuid: currentLayout.DataModelGuid })

	useEffect(() => {
		if(field) {

			setFieldsValue({ 'LayoutItem': extraData.layoutItem });
			treeStore.current.setSelectedKeyDirectly(extraData.layoutItem.Id);
			setFieldsValue({ 'Event': operator });
		}
	}, []);

	function handleSubmit() {
		validateFields((errors, values) => {

			if (!errors) {
				onSubmit({
					field: values.LayoutItem.Id,
					operator: values.Event,
					extraData: {
						isGridEvent: values.LayoutItem.Metadata?.isGrid,
						layoutItem: values.LayoutItem
					}
				}, `'${values.LayoutItem.Text} ${Events[values.Event]}'`);
			}
		})
	}

	return (
		<>
			{loading ? <>'loading'</> :
				<Form>
					<Row>
						<Col md={5}>
							<FormItem >
								{getFieldDecorator('LayoutItem', { rules: [{ required: true }] })(
									<TreeSelect
										store={treeStore.current}
										onSelect={(key, node, record) => {
											form.setFieldsValue({ 'LayoutItem': record });
										}}
									/>)}
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
				</Form>}
		</>
	);
}

export default Form.create()(QueryBuilderEventConditionEditor);