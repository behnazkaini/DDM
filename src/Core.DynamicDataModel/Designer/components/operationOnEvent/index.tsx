import React, { useMemo, useRef, useState } from 'react';
import { translate, utility } from 'didgah/common';
import { Card, Col, Fieldset, Icon, List, Popconfirm, Row, Spin } from 'didgah/ant-core-component';
import OperationOnEventDetail, { OperationOnEventsRecord } from './operationOnEventDetail';
import { useAppDispatch } from '../../../Designer/store/hook';
import { GlobalPropsContext, UpdateOperationOnEvents } from '../../../Designer/store/reducers/designLayoutSlice';
import { mapOperationOnEventToFormEvents } from './helper';
import useFloorStack from '../../hooks/useFloorStack';
import { ConditionType } from '@models/didgah-components/lib/Chargoon.Didgah.Core5.Components.Models.QueryBuilder.ConditionType';
import { FormEvents } from '../../../../typings/Core.DynamicDataModel/Types';
import { Events } from '../../../../typings/Core.DynamicDataModel/Enums';
import ReactWindowLoadOnDemand from '../../../../Common/ReactWindow/reactWindowLoadOnDemand';

type RecordWithId = { id: string; title: string; events: any; actions: any };


function OperationOnEvent() {
  const globalProps = React.useContext(GlobalPropsContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordWithId | null>(null);
  const dispatch = useAppDispatch();

  const { currentLayout, currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });

  const layoutItems = useMemo(() => {
    const columns = currentDataModel.Columns.map(col => ({ key: col.Label, value: col.Guid }));
    const relations = currentDataModel.Relations.map(rel => ({ key: rel.Label, value: rel.Guid }));
    return [...columns, ...relations];
  }, []);

  const [records, setRecords] = useState<RecordWithId[]>(() => getInitialValue());

  function getInitialValue(): RecordWithId[] {
    const designEvents = JSON.parse(currentLayout.Design).Events as FormEvents[];
    if (!designEvents) return [];

    return designEvents.map(event => {
      const events = {
        Condition: {
          Id: Math.random(),
          Type: ConditionType.Complex,
          Condition: [],
          OperatorId: 'OR'
        }
      };
      const actions = {
        Condition: {
          Id: Math.random(),
          Type: ConditionType.Complex,
          Condition: [],
          OperatorId: 'AND'
        }
      };

      event.LayoutItems.forEach(item => {
        events.Condition.Condition.push({
          Id: Math.random(),
          Field: item.Guid,
          Operator: item.EventId,
          Text: !!item?.ExtraData
            ? `${item.ExtraData.layoutItem.Text} ${Events[item.EventId]}`
            : `'${layoutItems.find(l => l.value === item.Guid)?.key ?? item.Guid} ${Events[item.EventId]}'`,
          Type: ConditionType.Simple,
          ExtraData: item.ExtraData
        });
      });

      event.Actions.forEach(item => {
        actions.Condition.Condition.push({
          Id: Math.random(),
          Field: item.Guid,
          Operator: item.ActionId,
          Value: item.CodeXml,
          Text: ``,
          Type: ConditionType.Simple,
          ExtraData: item.ExtraData
        });
      });

      return { id: utility.newGuid(), title: event.Title, actions, events };
    });
  }

  function dispatchAll(next: RecordWithId[]) {
    dispatch(UpdateOperationOnEvents({
      LayoutGuid: globalProps.layoutGuid,
      OperationOnEvents: mapOperationOnEventToFormEvents(next),
    }));
  }

  function handleSave(record: OperationOnEventsRecord) {
    let next: RecordWithId[];
    if (selectedRecord) {
      next = records.map(r => r.id === selectedRecord.id ? { ...selectedRecord, ...record } : r);
    } else {
      next = [...records, { id: utility.newGuid(), ...record }];
    }
    setRecords(next);
    dispatchAll(next);
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    const next = records.filter(r => r.id !== id);
    setRecords(next);
    dispatchAll(next);
  }

  function handleEdit(record: RecordWithId) {
    setSelectedRecord(record);
    setModalVisible(true);
  }

  function handleAdd() {
    setSelectedRecord(null);
    setModalVisible(true);
  }

  function handleScrollEnd(event: any): void {
    //todo
  }
  return <Fieldset legend={translate('Results')} flex={true} heightRatio={1} collapsible={false}>
    <div style={{ height: 'calc(100% - 90px)', width: '100%' }}>
      <Spin stretch={true} spinning={false}>
        <div className="ddm-operation-on-event_add" onClick={handleAdd}>
          <i className="components add" onClick={handleAdd} />
        </div>
        <Row className="ddm-operation-on-event_list-header" >
          <Col span={6} className="ddm-operation-on-event_list-column">
            {translate('Title')}
          </Col>
        </Row>
        <List onScrollEnd={handleScrollEnd}>
          {records.map(record => (
            <Card
              key={record.id}
              className='ooe-list__card'
              bordered
              bodyStyle={{ display: 'flex', alignItems: 'center', width: '100%'}}
            >

              <div className='ooe-list__card-title' onClick={() => handleEdit(record)}>
                {record.title}
              </div>
              {!globalProps.permission.readOnly && (
                <div className='ooe-list__card-actions'>
                  <Icon
                    type='edit'
                    className='ooe-list__icon ooe-list__icon--edit'
                    onClick={() => handleEdit(record)}
                  />
                  <Popconfirm
                    title={translate('AreYouSure')}
                    onConfirm={() => handleDelete(record.id)}
                    okText={translate('Yes')}
                    cancelText={translate('No')}
                  >
                    <Icon type='delete' className='ooe-list__icon ooe-list__icon--delete' />
                  </Popconfirm>
                </div>
              )}
            </Card>
          ))}
        </List>
      </Spin>
      {modalVisible && (
        <OperationOnEventDetail
          selectedRecord={selectedRecord}
          onSave={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      )}
    </div>
  </Fieldset>
}

export default OperationOnEvent;

// return <div style={{ width: '100%', overflow: 'hidden', height: '100%' }}>
//     <ReactWindowLoadOnDemand
//       hasNextPage={hasNextPage}
//       isNextPageLoading={isNextPageLoading}
//       itemCount={workflowInstances.length}
//       loadNextPage={handleLoadNextPage}
//       itemComponent={Item}
//       itemSize={180}
//     />
//   </div>
