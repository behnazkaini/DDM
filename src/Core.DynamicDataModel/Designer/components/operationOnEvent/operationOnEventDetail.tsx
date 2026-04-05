import React, { useState } from 'react';
import { Button, Card, Col, Fieldset, Icon, Input, Modal, Row, SelectEx, SelectItem } from 'didgah/ant-core-component';
import { guid, translate } from 'didgah/common';
import { ColumnActions, Events, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import useDataModelTreeStructure from './dataModelTreeStructure';
import TreeSelect from '@didgah-components/ant-tree-select';
import useLayoutItems from './Hooks/useLayoutItems';
import JSBlock from './JSBlock';
import { jsBlockInitialXml } from './JSBlock/helper';

export interface OperationOnEventsRecord {
  title: string;
  events: any;
  actions: any;
}

type EventRow = {
  id: string;
  field: string;
  fieldText: string;
  operator: number;
  extraData?: any;
};

type ActionRow = {
  id: string;
  field: string;
  operator: number;
  value: string;
};

type DraftEvent = {
  id: string | null;
  field: string | null;
  fieldText: string | null;
  operator: number;
  extraData?: any;
};

type DraftAction = {
  id: string | null;
  field: string | null;
  operator: number | null;
  value: string;
  showJSBlock: boolean;
};

interface Props {
  selectedRecord: { title: string; events: any; actions: any } | null;
  onSave: (model: OperationOnEventsRecord) => void;
  onCancel: () => void;
}

const eventsDataSource: SelectItem[] = Object.keys(Events)
  .filter(k => isNaN(k as any))
  .map(k => ({ key: k, value: Events[k] }));

const addBtnStyle: React.CSSProperties = {
  backgroundColor: '#8dc63f',
  borderColor: '#8dc63f',
  color: '#fff',
  // borderRadius: 20,
  marginTop: 8,
};

function OperationOnEventDetail({ selectedRecord, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(selectedRecord?.title ?? '');
  const [editingTitle, setEditingTitle] = useState(false);

  const layoutItems = useLayoutItems();
  const { loading: treeLoading, treeStore } = useDataModelTreeStructure({ dataModelGuid: null });

  const [eventRows, setEventRows] = useState<EventRow[]>(() => {
    if (!selectedRecord?.events?.Condition?.Condition) return [];
    return selectedRecord.events.Condition.Condition.map((c: any) => ({
      id: guid.newGuid(),
      field: c.Field,
      fieldText: c.Text ?? c.Field,
      operator: Number(c.Operator),
      extraData: c.ExtraData,
    }));
  });

  const [draftEvent, setDraftEvent] = useState<DraftEvent | null>(null);

  const [actionRows, setActionRows] = useState<ActionRow[]>(() => {
    if (!selectedRecord?.actions?.Condition?.Condition) return [];
    return selectedRecord.actions.Condition.Condition.map((c: any) => ({
      id: guid.newGuid(),
      field: c.Field,
      operator: Number(c.Operator),
      value: c.Value ?? jsBlockInitialXml,
    }));
  });

  const [draftAction, setDraftAction] = useState<DraftAction | null>(null);

  function getFieldType(fieldGuid: string): LayoutItemType | null {
    return (layoutItems.find(i => i.value === fieldGuid) as any)?.Type ?? null;
  }

  function getActionsDs(fieldGuid: string): SelectItem[] {
    const type = getFieldType(fieldGuid);
    if (type === LayoutItemType.Column) {
      return Object.keys(ColumnActions)
        .filter(k => isNaN(k as any))
        .map(k => ({ key: translate(`DDM_${k}`), value: ColumnActions[k] }));
    }
    if (type === LayoutItemType.Reference) {
      return Object.keys(ReferenceActions)
        .filter(k => isNaN(k as any))
        .map(k => ({ key: translate(`DDM_${k}`), value: ReferenceActions[k] }));
    }
    return [];
  }

  function handleAddEvent() {
    setDraftEvent({ id: null, field: null, fieldText: null, operator: Events.onChange });
  }

  function handleEditEvent(row: EventRow) {
    setDraftEvent({ id: row.id, field: row.field, fieldText: row.fieldText, operator: row.operator, extraData: row.extraData });
  }

  function handleConfirmEvent() {
    if (!draftEvent?.field) return;
    const row: EventRow = {
      id: draftEvent.id ?? guid.newGuid(),
      field: draftEvent.field,
      fieldText: draftEvent.fieldText ?? draftEvent.field,
      operator: draftEvent.operator,
      extraData: draftEvent.extraData,
    };
    if (draftEvent.id) {
      setEventRows(prev => prev.map(r => r.id === draftEvent.id ? row : r));
    } else {
      setEventRows(prev => [...prev, row]);
    }
    setDraftEvent(null);
  }

  function handleDeleteEvent(id: string) {
    setEventRows(prev => prev.filter(r => r.id !== id));
  }

  function handleAddAction() {
    setDraftAction({ id: null, field: null, operator: null, value: jsBlockInitialXml, showJSBlock: false });
  }

  function handleEditAction(row: ActionRow) {
    setDraftAction({ id: row.id, field: row.field, operator: row.operator, value: row.value, showJSBlock: false });
  }

  function handleConfirmAction() {
    if (!draftAction || !draftAction.field || draftAction.operator === null) return;
    const row: ActionRow = {
      id: draftAction.id ?? guid.newGuid(),
      field: draftAction.field,
      operator: draftAction.operator,
      value: draftAction.value,
    };
    if (draftAction.id) {
      setActionRows(prev => prev.map(r => r.id === draftAction.id ? row : r));
    } else {
      setActionRows(prev => [...prev, row]);
    }
    setDraftAction(null);
  }

  function handleDeleteAction(id: string) {
    setActionRows(prev => prev.filter(r => r.id !== id));
  }

  function handleSave() {
    if (!title) return;
    onSave({
      title,
      events: {
        Condition: {
          Condition: eventRows.map(r => ({
            Field: r.field,
            Operator: r.operator,
            ExtraData: r.extraData,
            Text: r.fieldText,
          })),
        },
      },
      actions: {
        Condition: {
          Condition: actionRows.map(r => ({
            Field: r.field,
            Operator: r.operator,
            Value: r.value,
            Text: '',
          })),
        },
      },
    });
  }

  function renderActionEditRow(draft: DraftAction, key?: string) {
    return (
      <Card key={key} bordered style={{ marginBottom: 6, borderColor: '#52c41a' }} bodyStyle={{ padding: '8px 12px' }}>
        <Row gutter={8} align="middle">
          <Col flex="auto">
            <SelectEx
              dataSource={layoutItems}
              value={draft.field}
              onChange={(v: string) => setDraftAction(prev => prev ? { ...prev, field: v, operator: null } : prev)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <SelectEx
              dataSource={draft.field ? getActionsDs(draft.field) : []}
              value={draft.operator}
              onChange={(v: number) => setDraftAction(prev => prev ? { ...prev, operator: v } : prev)}
              disabled={!draft.field}
              style={{ width: '100%' }}
            />
          </Col>
          {draft.operator === ColumnActions.setFieldsValue && (
            <Col>
              <Button onClick={() => setDraftAction(prev => prev ? { ...prev, showJSBlock: true } : prev)}>
                {translate('ShowBlockly')}
              </Button>
            </Col>
          )}
          <Col>
            <Button size="small" icon="check" onClick={handleConfirmAction} style={{ marginLeft: 4 }} />
            <Button size="small" icon="close" onClick={() => setDraftAction(null)} style={{ marginLeft: 4 }} />
          </Col>
        </Row>
        {draft.showJSBlock && (
          <JSBlock
            initialXmlText={draft.value}
            onSave={v => setDraftAction(prev => prev ? { ...prev, value: v.xmlText, showJSBlock: false } : prev)}
            onCancel={() => setDraftAction(prev => prev ? { ...prev, showJSBlock: false } : prev)}
            action={draft.operator!}
            layoutItemType={getFieldType(draft.field ?? '')}
          />
        )}
      </Card>
    );
  }

  const titleRow = (
    <Row gutter={8} align="middle">
      <Col flex="auto">
        {editingTitle
          ? <Input value={title} onChange={e => setTitle(e.target.value)} />
          : <span style={{ fontWeight: 'bold' }}>{title || translate('Title')}</span>
        }
      </Col>
      <Col>
        {editingTitle
          ? <Icon type="check" onClick={() => setEditingTitle(false)} style={{ cursor: 'pointer', color: '#52c41a' }} />
          : <Icon type="edit" onClick={() => setEditingTitle(true)} style={{ cursor: 'pointer', color: '#fa8c16' }} />
        }
      </Col>
    </Row>
  );

  return (
    <Modal
      visible={true}
      title={titleRow}
      onOk={handleSave}
      onCancel={onCancel}
      okText={translate('Confirm')}
      cancelText={translate('Cancel')}
      width="100%"
    >
      {/* Events */}
      <Fieldset legend={translate('Events')}>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{translate('EventsHint')}</p>

        {eventRows.map(row => {
          const isEditing = draftEvent?.id === row.id;
          return (
            <Card
              key={row.id}
              bordered
              style={{ marginBottom: 6, borderColor: isEditing ? '#52c41a' : undefined }}
              bodyStyle={{ padding: '8px 12px' }}
            >
              {isEditing ? (
                <Row gutter={8} align="middle">
                  <Col flex="auto">
                    <SelectEx
                      dataSource={layoutItems}
                      value={draftEvent.field}
                      onChange={(v: string) => {
                        const item = layoutItems.find(i => i.value === v);
                        setDraftEvent(prev => prev ? { ...prev, field: v, fieldText: item?.key ?? v, extraData: null } : prev);
                      }}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={8}>
                    <SelectEx
                      dataSource={eventsDataSource}
                      value={draftEvent.operator}
                      onChange={(v: number) => setDraftEvent(prev => prev ? { ...prev, operator: v } : prev)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col>
                    <Button size="small" icon="check" onClick={handleConfirmEvent} style={{ marginLeft: 4 }} />
                    <Button size="small" icon="close" onClick={() => setDraftEvent(null)} style={{ marginLeft: 4 }} />
                  </Col>
                </Row>
              ) : (
                <Row gutter={8} align="middle">
                  <Col flex="auto">
                    <SelectEx dataSource={layoutItems} value={row.field} disabled style={{ width: '100%' }} />
                  </Col>
                  <Col span={8}>
                    <SelectEx dataSource={eventsDataSource} value={row.operator} disabled style={{ width: '100%' }} />
                  </Col>
                  <Col>
                    <Button size="small" icon="delete" onClick={() => handleDeleteEvent(row.id)} style={{ color: '#f5222d', borderColor: '#f5222d', marginLeft: 4 }} />
                    <Button size="small" icon="edit" onClick={() => handleEditEvent(row)} style={{ color: '#fa8c16', borderColor: '#fa8c16', marginLeft: 4 }} />
                  </Col>
                </Row>
              )}
            </Card>
          );
        })}

        {draftEvent && !draftEvent.id && (
          <Card bordered style={{ marginBottom: 6, borderColor: '#52c41a' }} bodyStyle={{ padding: '8px 12px' }}>
            {treeLoading || !treeStore.current
              ? <span>{translate('Loading')}</span>
              : (
                <Row gutter={8} align="middle">
                  <Col flex="auto">
                    <TreeSelect
                      store={treeStore.current}
                      onSelect={(_key: any, _node: any, record: any) => {
                        setDraftEvent(prev => prev ? {
                          ...prev,
                          field: record.Id,
                          fieldText: record.Text,
                          extraData: { isGridEvent: record.Metadata?.isGrid, layoutItem: record },
                        } : prev);
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <SelectEx
                      dataSource={eventsDataSource}
                      value={draftEvent.operator}
                      onChange={(v: number) => setDraftEvent(prev => prev ? { ...prev, operator: v } : prev)}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col>
                    <Button size="small" icon="check" onClick={handleConfirmEvent} style={{ marginLeft: 4 }} />
                    <Button size="small" icon="close" onClick={() => setDraftEvent(null)} style={{ marginLeft: 4 }} />
                  </Col>
                </Row>
              )
            }
          </Card>
        )}

        <Row justify="end">
          <Col>
            <Button icon="plus" onClick={handleAddEvent} disabled={!!draftEvent} style={addBtnStyle}>
              {translate('AddEvent')}
            </Button>
          </Col>
        </Row>
      </Fieldset>

      {/* Actions */}
      <Fieldset legend={translate('Actions')}>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{translate('ActionsHint')}</p>

        {actionRows.map(row => {
          if (draftAction?.id === row.id) {
            return renderActionEditRow(draftAction, row.id);
          }
          return (
            <Card key={row.id} bordered style={{ marginBottom: 6 }} bodyStyle={{ padding: '8px 12px' }}>
              <Row gutter={8} align="middle">
                <Col flex="auto">
                  <SelectEx dataSource={layoutItems} value={row.field} disabled style={{ width: '100%' }} />
                </Col>
                <Col span={8}>
                  <SelectEx dataSource={getActionsDs(row.field)} value={row.operator} disabled style={{ width: '100%' }} />
                </Col>
                <Col>
                  <Button size="small" icon="delete" onClick={() => handleDeleteAction(row.id)} style={{ color: '#f5222d', borderColor: '#f5222d', marginLeft: 4 }} />
                  <Button size="small" icon="edit" onClick={() => handleEditAction(row)} style={{ color: '#fa8c16', borderColor: '#fa8c16', marginLeft: 4 }} />
                </Col>
              </Row>
            </Card>
          );
        })}

        {draftAction && !draftAction.id && renderActionEditRow(draftAction)}

        <Row justify="end">
          <Col>
            <Button icon="plus" onClick={handleAddAction} disabled={!!draftAction} style={addBtnStyle}>
              {translate('AddAction')}
            </Button>
          </Col>
        </Row>
      </Fieldset>
    </Modal>
  );
}

export default OperationOnEventDetail;
