import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FormComponentProps, SelectEx, SelectItem, Button, Col, Row, EditorProps, Form, useAjax, View } from 'didgah/ant-core-component';
import { ColumnActions, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel';
import useFloorStack from '../../hooks/useFloorStack';
import {
  GlobalPropsContext,
} from "../../store/reducers/designLayoutSlice";
import { translate } from '../../../../Utility/language';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import TreeSelect from '@didgah-components/ant-tree-select';
import useDataModelTreeStructure from './dataModelTreeStructure';
import { ITreeNode } from '@models/didgah-components';
const FormItem = Form.Item;

const functionDataSource = [
  {
    key: 'SUM',
    value: 'SUM'
  }
];

interface Props extends EditorProps {
  onCancel?: () => void;
  layoutItemDataSource: ITreeNode<LayoutItemViewModel>[];
}

function QueryBuilderActionConditionEditor({ form, onSubmit, onCancel, field, operator, extraData, layoutItemDataSource }: Props & FormComponentProps) {
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
  const layoutItem = getFieldValue('LayoutItem');
  const { loading, treeStore: targetLayoutTreeStore } = useDataModelTreeStructure({ dataModelGuid: currentLayout.DataModelGuid });
  const { treeStore: layoutTreeStore } = useDataModelTreeStructure({ dataModelGuid: currentLayout.DataModelGuid });

  const actionsDataSource: SelectItem[] = useMemo(() => {
    return Object.keys(ColumnActions).filter(item => isNaN(item as any)).map(item => ({ key: translate(`DDM_${item}`), value: ColumnActions[item] }))
  }, [layoutItem]);

  useEffect(() => {
    if (field) {
      setFieldsValue({ 'TargetLayoutItem': extraData.targetLayoutItem });
      targetLayoutTreeStore.current.setSelectedKeyDirectly(extraData.targetLayoutItem.Id);
      setFieldsValue({ 'Action': operator });
      setFieldsValue({ 'FunctionName': extraData.functionName });
      setFieldsValue({ 'LayoutItem': extraData.layoutItem.Id });
      layoutTreeStore.current.setSelectedKeyDirectly(extraData.layoutItem.Id);
    }
  }, []);

  function handleSubmit() {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit({
          field: values.TargetLayoutItem.Id,
          operator: values.Action,
          value: null,
          extraData: {
            isGridAction: true,
            functionName: values.FunctionName,
            layoutItem: layoutItemDataSource.find(item => item.Id === values.LayoutItem),
            targetLayoutItem: values.TargetLayoutItem
          }
        }, ``);
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
                {getFieldDecorator('TargetLayoutItem', { rules: [{ required: true }] })(
                  <TreeSelect
                    store={targetLayoutTreeStore.current}
                    onSelect={(key, node, record) => {
                      form.setFieldsValue({ 'TargetLayoutItem': record });
                    }}
                  />
                )}</FormItem>
            </Col>
            <Col md={4}>
              <FormItem>
                {getFieldDecorator('Action', { rules: [{ required: true }] })(
                  <SelectEx dataSource={actionsDataSource} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />
                )}</FormItem>
            </Col>
            <Col md={4}>
              <FormItem>
                {getFieldDecorator('FunctionName', { rules: [{ required: true }] })(
                  <SelectEx dataSource={functionDataSource} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />
                )}</FormItem>
            </Col>
            <Col md={4}>
              <FormItem>
                {getFieldDecorator('LayoutItem', { rules: [{ required: true }] })(
                  <SelectEx
                    dataSource={layoutItemDataSource.filter(item => (item as any).Metadata.Type === LayoutItemType.Column).map((l: any) => ({ key: (l as any).Text, value: l.Id }))}
                    style={{ width: '100%', marginLeft: '10px' }}
                    dropdownMatchSelectWidth
                  />
                )}</FormItem>
            </Col>
            <Col md={4} offset={6}>
              <FormItem>
                <Button icon='check' onClick={handleSubmit}></Button>
                <Button icon='close' onClick={onCancel}></Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      }</>

  );
}
export default Form.create()(QueryBuilderActionConditionEditor);