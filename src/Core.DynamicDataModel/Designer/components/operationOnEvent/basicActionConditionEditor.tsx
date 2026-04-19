import React, { useMemo, useState, useEffect } from 'react';
import { FormComponentProps, SelectEx, SelectItem, Button, Col, Row, EditorProps, Form } from 'didgah/ant-core-component';
import { ColumnActions, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel';
import useFloorStack from '../../hooks/useFloorStack';
import {
  GlobalPropsContext,
} from "../../store/reducers/designLayoutSlice";
import JSBlock from './JSBlock';
import { translate } from '../../../../Utility/language';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { jsBlockInitialXml } from './JSBlock/helper';
import useLayoutItems from './Hooks/useLayoutItems';
const FormItem = Form.Item;

interface Props extends EditorProps {
  onCancel?: () => void;
}

function QueryBuilderActionConditionEditor({ form, onSubmit, onCancel, field, operator, value: initialValue }: Props & FormComponentProps) {
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const layoutItems = useLayoutItems();
  const [value, setValue] = useState(initialValue ? initialValue : jsBlockInitialXml);
  const [showBlockly, setShowBlockly] = useState(false);
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = form;
  const layoutItem = getFieldValue('LayoutItem');

  function getLayoutType() {
    if (!layoutItem) return null;
    return currentDataModel.Columns.some(col => col.Guid === layoutItem)
      ? LayoutItemType.Column
      : LayoutItemType.Reference;
  }
  const actionsDataSource: SelectItem[] = useMemo(() => {
    if (layoutItem) {
      const layoutType = getLayoutType();
      if (layoutType === LayoutItemType.Column) {
        return Object.keys(ColumnActions).filter(item => isNaN(item as any)).map(item => ({ key: translate(`DDM_${item}`), value: ColumnActions[item] }));
      } else {
        return Object.keys(ReferenceActions).filter(item => isNaN(item as any)).map(item => ({ key: translate(`DDM_${item}`), value: ReferenceActions[item] }));
      }
    } else {
      return [];
    }
  }, [layoutItem]);

  useEffect(() => {
    setFieldsValue({ 'LayoutItem': field });
    setFieldsValue({ 'Action': operator });
  }, []);

  function handleSubmit() {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit({
          field: values.LayoutItem,
          operator: values.Action,
          value
        }, ``);
      }
    })
  }

  function openBlockly() {
    setShowBlockly(true);
  }

  return (
    <Form>
      <Row>
        <Col md={5}>
          <FormItem >
            {getFieldDecorator('LayoutItem', { rules: [{ required: true }] })(
              <SelectEx disabled={!!field} dataSource={layoutItems} style={{ width: '100%', marginLeft: '10px' }} dropdownMatchSelectWidth />
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
            <Button onClick={openBlockly} disabled={!form.getFieldValue('Action')}>{translate('ShowBlockly')}</Button>
            {showBlockly && <JSBlock
              initialXmlText={value}
              onSave={(value) => { setValue(value.xmlText); setShowBlockly(false); }}
              onCancel={() => { setShowBlockly(false); }}
              action={form.getFieldValue('Action')}
              layoutItemType={getLayoutType()}
            />}
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
export default Form.create()(QueryBuilderActionConditionEditor);