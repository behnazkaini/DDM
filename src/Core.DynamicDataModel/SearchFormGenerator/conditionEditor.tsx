import * as React from 'react';
import { SelectEx, Input, Button, Col, Row, EditorProps, SelectValue, injectContext, withAppContext, IAppContext, Form, FormComponentProps, Label } from 'didgah/ant-core-component';
import { TreeStore } from '@didgah-components/ant-tree-ex/utils';
import TreeSelect from '@didgah-components/ant-tree-select';
import { useRef, useState, useEffect, useMemo, useContext } from 'react';
import { translate } from '../../Utility/language';
import { RelationalOperatorType } from '../../Models/Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType';
import SearchFormGeneratorContext from './SearchFormGeneratorContext';
import { ITreeNode } from '@models/didgah-components';
import { dataTypeOperators } from './helper';

const FormItem = Form.Item;
interface ConditionEditorProps extends EditorProps {
	appContext?: IAppContext;
}

function ConditionEditor(props: ConditionEditorProps & FormComponentProps) {
	const { onSubmit, onCancel } = props;
	const { searchTreeNodes, getEditComponent } = useContext(SearchFormGeneratorContext);
	const [dependentFormItemsLoading, setDependentFormItemsLoading] = useState(true);
	const treeStore = useRef(new TreeStore({ nodes: searchTreeNodes as any, expandedKeys: [searchTreeNodes[0].Id] }));
	const getField = () => !!treeStore.current.selectedKeys.length ? treeStore.current.getNodeInJs(treeStore.current.selectedKeys[0]) || props.field as any : props.field;

	useEffect(() => {
		if (props.field) {
			props.form.setFieldsValue({ value: props.value, operator: props.operator, field: props.field });
			treeStore.current.setSelectedKeyDirectly((props.field as unknown as ITreeNode<any>).Id)
			setDependentFormItemsLoading(false)
		}
	}, []);

	const handleSubmit = () => {
		const save = (errors, formData) => {
			if (!!errors)
				return;

			const { field = props.field, operator, value } = formData;

			onSubmit({
				field: field,
				operator: operator,
				value: value,
			}, '');
		}
		props.form.validateFields(save)
	}

	const field = getField();
	const EditComponent = useMemo(() => field ? getEditComponent(field.Metadata.Type, field.Metadata) : null, [field])

	function getOperatorDataSource() {
		if (field && field.Metadata.Type === 'Column') {
			return dataTypeOperators[field.Metadata.DataType];
		} else {
			return [];
		}
	}

	return (
		<div className='query-builder-editor' style={{ width: '100%' }}>
			<Form>
				<Row gutter={8}>
					<Col md={6}>
						<FormItem>
							{!props.field && props.form.getFieldDecorator('field', { rules: [{ required: true }] })(
								<TreeSelect
									store={treeStore.current}
									onSelect={(key, node, record) => {
										props.form.setFieldsValue({ 'field': record });
										setDependentFormItemsLoading(true);
										setTimeout(() => { setDependentFormItemsLoading(false) }, 50);
									}}
								/>)}
							{!!props.field && <Label>{props.field["Text"]}</Label>}
						</FormItem>
					</Col>
					<Col md={6}>
						{!dependentFormItemsLoading && !!field ?
							<FormItem>{props.form.getFieldDecorator('operator', { rules: [{ required: true }] })(<SelectEx labelInValue={false} dataSource={getOperatorDataSource()} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />)}</FormItem>
							: <FormItem><SelectEx dataSource={[]} disabled={true} /></FormItem>}
					</Col>
					<Col md={6}>
						{!dependentFormItemsLoading && !!field ?
							<FormItem>{props.form.getFieldDecorator('value', { rules: [{ required: true }] })(<EditComponent mode={'render'} />)}</FormItem>
							: <FormItem><Input disabled={true} /></FormItem>}
					</Col>
					<Col md={6} >
						<FormItem>
							<Button icon='check' disabled={!field} onClick={handleSubmit}></Button>
							<Button icon='close' onClick={onCancel}></Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>)
}

export default injectContext(withAppContext(Form.create()(ConditionEditor)));
