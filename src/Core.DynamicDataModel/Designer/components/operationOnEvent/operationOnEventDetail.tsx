import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Fieldset, Icon, Input, Modal, Popconfirm, Row, SelectEx, SelectItem, Label } from 'didgah/ant-core-component';
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
  extraData?: any;
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
  extraData?: any;
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
  marginTop: 8,
};

function OperationOnEventDetail({ selectedRecord, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(selectedRecord?.title ?? '');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const layoutItems = useLayoutItems();
  const { loading: treeLoading, treeStore } = useDataModelTreeStructure({ dataModelGuid: null });
  const { loading: targetTreeLoading, treeStore: targetLayoutTreeStore } = useDataModelTreeStructure({ dataModelGuid: null });

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
      extraData: c.ExtraData,
    }));
  });

  const [draftAction, setDraftAction] = useState<DraftAction | null>(null);

  // Pre-select the target tree node when editing an existing grid action
  useEffect(() => {
    if (!targetTreeLoading && draftAction?.extraData?.targetLayoutItem && targetLayoutTreeStore.current) {
      targetLayoutTreeStore.current.setSelectedKeyDirectly(draftAction.extraData.targetLayoutItem.Id);
    }
  }, [targetTreeLoading, draftAction?.id]);

  const getGridEventFromRows = (rows: EventRow[]) => rows.find(r => r.extraData?.isGridEvent);

  const [isGridEventSelected, setIsGridEventSelected] = useState<boolean>(() =>
    !!getGridEventFromRows(
      selectedRecord?.events?.Condition?.Condition?.map((c: any) => ({
        id: '', field: c.Field, fieldText: c.Text ?? c.Field,
        operator: Number(c.Operator), extraData: c.ExtraData,
      })) ?? []
    )
  );

  const getGridNodeFromRow = (row?: EventRow) =>
    row?.extraData?.parentGrid ?? row?.extraData?.layoutItem;

  const [layoutItemDataSource, setLayoutItemDataSource] = useState<any[]>(() => {
    const rows = selectedRecord?.events?.Condition?.Condition?.map((c: any) => ({
      id: '', field: c.Field, fieldText: c.Text ?? c.Field,
      operator: Number(c.Operator), extraData: c.ExtraData,
    })) ?? [];
    return getGridNodeFromRow(getGridEventFromRows(rows))?.Children ?? [];
  });

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

  function syncGridState(rows: EventRow[]) {
    const gridEvent = getGridEventFromRows(rows);
    setIsGridEventSelected(!!gridEvent);
    setLayoutItemDataSource(getGridNodeFromRow(gridEvent)?.Children ?? []);
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
    const next = draftEvent.id
      ? eventRows.map(r => r.id === draftEvent.id ? row : r)
      : [...eventRows, row];
    setEventRows(next);
    syncGridState(next);
    setDraftEvent(null);
  }

  function handleDeleteEvent(id: string) {
    const next = eventRows.filter(r => r.id !== id);
    setEventRows(next);
    syncGridState(next);
  }

  function handleAddAction() {
    setDraftAction({ id: null, field: null, operator: null, value: jsBlockInitialXml, showJSBlock: false });
  }

  function handleEditAction(row: ActionRow) {
    setDraftAction({ id: row.id, field: row.field, operator: row.operator, value: row.value, showJSBlock: false, extraData: row.extraData });
  }

  function handleConfirmAction() {
    if (!draftAction || !draftAction.field || draftAction.operator === null) return;
    if (isGridEventSelected && (!draftAction.extraData?.functionName || !draftAction.extraData?.layoutItem)) return;
    const row: ActionRow = {
      id: draftAction.id ?? guid.newGuid(),
      field: draftAction.field,
      operator: draftAction.operator,
      value: isGridEventSelected ? null : draftAction.value,
      extraData: isGridEventSelected ? {
        isGridAction: true,
        functionName: draftAction.extraData.functionName,
        layoutItem: draftAction.extraData.layoutItem,
        targetLayoutItem: draftAction.extraData.targetLayoutItem ?? { Id: draftAction.field, Text: draftAction.field },
      } : undefined,
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
    if (!title) {
      setTitleError(true);
      setEditingTitle(true);
      return;
    }
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
            ExtraData: r.extraData,
          })),
        },
      },
    });
  }

  const gridColumnDataSource = layoutItemDataSource
    .filter((item: any) => item.Metadata?.Type === LayoutItemType.Column)
    .map((item: any) => ({ key: item.Text, value: item.Id }));

  function getFieldDataSource(field: string, fallbackText?: string) {
    if (!field || layoutItems.some(i => i.value === field)) return layoutItems;
    return [...layoutItems, { key: fallbackText ?? field, value: field }];
  }

  const gridActionsDs: SelectItem[] = Object.keys(ColumnActions)
    .filter(k => isNaN(k as any))
    .map(k => ({ key: translate(`DDM_${k}`), value: (ColumnActions as any)[k] }));

  const functionDs: SelectItem[] = [{ key: 'SUM', value: 'SUM' }];

  function renderActionEditRow(draft: DraftAction) {
    if (isGridEventSelected) {
      return (
        <Card>
          <Row gutter={8} align="middle">
            <Col md={5}>
              {draft.id && draft.field ? (
                <SelectEx
                  dataSource={[{ key: draft.extraData?.targetLayoutItem?.Text ?? draft.field, value: draft.field }]}
                  value={draft.field}
                  disabled
                  onChange={() => {}}
                  style={{ width: '99%' }}
                />
              ) : targetTreeLoading || !targetLayoutTreeStore.current
                ? <span>{translate('Loading')}</span>
                : <TreeSelect
                  store={targetLayoutTreeStore.current}
                  autoExpandParent
                  onSelect={(_key: any, _node: any, record: any) => {
                    setDraftAction(prev => prev ? {
                      ...prev,
                      field: record.Id,
                      operator: ColumnActions.setFieldsValue,
                      extraData: { ...prev.extraData, targetLayoutItem: record },
                    } : prev);
                  }}
                />
              }
            </Col>
            <Col span={4}>
              <SelectEx
                dataSource={gridActionsDs}
                value={draft.operator}
                onChange={(v: number) => setDraftAction(prev => prev ? { ...prev, operator: v } : prev)}
                disabled={!draft.field}
              />
            </Col>
            <Col span={4}>
              <SelectEx
                dataSource={functionDs}
                value={draft.extraData?.functionName}
                onChange={(v: string) => setDraftAction(prev => prev ? { ...prev, extraData: { ...prev.extraData, functionName: v } } : prev)}
                disabled={!draft.field}
              />
            </Col>
            <Col span={6}>
              <SelectEx
                dataSource={gridColumnDataSource}
                value={draft.extraData?.layoutItem?.Id}
                onChange={(v: string) => {
                  const node = layoutItemDataSource.find((i: any) => i.Id === v);
                  setDraftAction(prev => prev ? { ...prev, extraData: { ...prev.extraData, layoutItem: node } } : prev);
                }}
                disabled={!draft.field}
              />
            </Col>
            <Col>
              <Button size="small" icon="check" onClick={handleConfirmAction} style={{ marginLeft: 4, border: 'none', color: '#52c41a' }} />
              <Button size="small" icon="close" onClick={() => setDraftAction(null)} style={{ marginLeft: 4, border: 'none', color: '#ff4d4f' }} />
            </Col>
          </Row>
        </Card>
      );
    }

    return (
      <Card>
        <Row>
          <Col span={8}>
            <SelectEx
              dataSource={layoutItems}
              value={draft.field}
              onChange={(v: string) => setDraftAction(prev => prev ? { ...prev, field: v, operator: null } : prev)}
              style={{ width: '99%' }}
            />
          </Col>
          <Col span={8}>
            <SelectEx
              dataSource={draft.field ? getActionsDs(draft.field) : []}
              value={draft.operator}
              onChange={(v: number) => setDraftAction(prev => prev ? { ...prev, operator: v } : prev)}
              disabled={!draft.field}
              style={{ width: '99%' }}
            />
          </Col>
          {draft.operator === ColumnActions.setFieldsValue && (
            <Col span={4}>
              <Button onClick={() => setDraftAction(prev => prev ? { ...prev, showJSBlock: true } : prev)}>
                {translate('ShowBlockly')}
              </Button>
            </Col>
          )}
          <Col span={draft.operator === ColumnActions.setFieldsValue ? 4 : 8}>
            <Button size="small" icon="check" onClick={handleConfirmAction} style={{ marginLeft: 4, border: 'nonde', color: '#52c41a' }} />
            <Button size="small" icon="close" onClick={() => setDraftAction(null)} style={{ marginLeft: 4, border: 'none', color: '#ff4d4f' }} />
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
    <Row>
      <Col md={1} style={{ marginTop: '6px' }}>
        <Label >{`${translate("Title")} :`}</Label>
      </Col>
      <Col md={4}>
        <Input
          value={title}
          onChange={e => { setTitle(e.target.value); if (titleError) setTitleError(false); }}
          style={titleError ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' } : undefined} />
      </Col>
      {/* <Col md={4}>
        {editingTitle
          ? <Input
            value={title}
            onChange={e => { setTitle(e.target.value); if (titleError) setTitleError(false); }}
            style={titleError ? { borderColor: '#ff4d4f', boxShadow: '0 0 0 2px rgba(255,77,79,.2)' } : undefined}
          />
          : <Input value={title} readOnly />
        }
      </Col>
      <Col md={8} style={{ marginTop: '6px', marginRight: '3px' }}>
        {editingTitle
          ? <Icon type="check" onClick={() => setEditingTitle(false)} style={{ cursor: 'pointer', color: '#52c41a', fontSize: '16px' }} />
          : <Icon type="edit" onClick={() => setEditingTitle(true)} style={{ cursor: 'pointer', color: '#fa8c16', fontSize: '16px' }} />
        }
      </Col> */}
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
      width="99%"
    >
      <Fieldset legend={translate('Events')} simpleMode collapsible={false}>
        {/* <Label>{translate('TheOccurrenceOfAnyOfTheFollowingConditionsWillTriggerTheOperation')}</Label> */}
        <Label>رخ دادن یک مورد از شروط زیر منجر به انجام عملیات میشود.</Label>

        {eventRows.map(row => {
          const isEditing = draftEvent?.id === row.id;
          return (
            <Card
              style={{ borderColor: isEditing ? '#52c41a' : undefined }}
            >
              {isEditing ? (
                <Row >
                  <Col md={8}>
                    <SelectEx
                      dataSource={getFieldDataSource(draftEvent.field ?? '', draftEvent.fieldText ?? undefined)}
                      value={draftEvent.field}
                      onChange={(v: string) => {
                        const item = layoutItems.find(i => i.value === v);
                        setDraftEvent(prev => prev ? { ...prev, field: v, fieldText: item?.key ?? v, extraData: null } : prev);
                      }}
                      style={{ width: '99%' }}
                    />
                  </Col>
                  <Col md={8}>
                    <SelectEx
                      dataSource={eventsDataSource}
                      value={draftEvent.operator}
                      onChange={(v: number) => setDraftEvent(prev => prev ? { ...prev, operator: v } : prev)}
                      style={{ width: '99%' }}
                    />
                  </Col>
                  <Col md={8}>
                    <Button size="small" icon="check" onClick={handleConfirmEvent} style={{ marginLeft: 4, border: 'none', color: '#52c41a' }} />
                    <Button size="small" icon="close" onClick={() => setDraftEvent(null)} style={{ marginLeft: 4, border: 'none', color: '#ff4d4f' }} />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col md={8}>
                    <SelectEx dataSource={getFieldDataSource(row.field, row.fieldText)} value={row.field} disabled onChange={() => { }} style={{ width: '99%' }} />
                  </Col>
                  <Col md={8}>
                    <SelectEx dataSource={eventsDataSource} value={row.operator} disabled onChange={() => { }} style={{ width: '99%' }} />
                  </Col>
                  <Col md={8}>
                    <div className='ooe-list__card-actions'>
                      <Icon
                        type='edit'
                        className='ooe-list__icon ooe-list__icon--edit'
                        onClick={() => handleEditEvent(row)}
                      />
                      <Popconfirm
                        title={translate('AreYouSure')}
                        onConfirm={() => handleDeleteEvent(row.id)}
                        okText={translate('Yes')}
                        cancelText={translate('No')}
                      >
                        <Icon type='delete' className='ooe-list__icon ooe-list__icon--delete' />
                      </Popconfirm>
                    </div>
                  </Col>
                </Row>
              )}
            </Card>
          );
        })}

        {draftEvent && !draftEvent.id && (
          <Card>
            {treeLoading || !treeStore.current
              ? <span>{translate('Loading')}</span>
              : (
                <Row>
                  <Col md={8}>
                    <TreeSelect
                      store={treeStore.current}
                      autoExpandParent
                      onSelect={(_key: any, _node: any, record: any) => {
                        const parent = record.ParentId && treeStore.current
                          ? treeStore.current.findNode(record.ParentId)
                          : null;
                        const isInsideRelation = !!(parent?.Metadata?.isGrid && parent.ParentId);
                        const isGridEvent = !!record.Metadata?.isGrid || isInsideRelation;
                        setDraftEvent(prev => prev ? {
                          ...prev,
                          field: record.Id,
                          fieldText: record.Text,
                          extraData: {
                            isGridEvent,
                            layoutItem: record,
                            parentGrid: isInsideRelation ? parent : undefined,
                          },
                        } : prev);
                      }}
                      //autoExpandParent

                      // searchable
                      // textRenderer={(node)=>{
                      // console.log(node);
                      // return node
                      // }
                      // }
                      style={{ width: '99%' }}
                    />
                  </Col>
                  <Col md={8}>
                    <SelectEx
                      dataSource={eventsDataSource}
                      value={draftEvent.operator}
                      onChange={(v: number) => setDraftEvent(prev => prev ? { ...prev, operator: v } : prev)}
                      style={{ width: '99%' }}
                    />
                  </Col>
                  <Col md={8}>
                    <Button size="small" icon="check" onClick={handleConfirmEvent} style={{ marginLeft: 4, border: 'none', color: '#52c41a' }} />
                    <Button size="small" icon="close" onClick={() => setDraftEvent(null)} style={{ marginLeft: 4, border: 'none', color: '#ff4d4f' }} />
                  </Col>
                </Row>
              )
            }
          </Card>
        )}

        <Row justify="end">
          <Col>
            <Button type='primary' icon="plus" onClick={handleAddEvent} disabled={!!draftEvent} style={addBtnStyle}>
              {/* {translate('AddEvent')} */}
              افزودن رخداد
            </Button>
          </Col>
        </Row>
      </Fieldset>

      <Fieldset legend={translate('Actions')} simpleMode collapsible={false}>
        {/* <Label>{translate('AllDefinedOperationsAreExecuted')}</Label> */}
        <Label>تمامی عملیاتهای تعیین شده انجام میشوند.</Label>

        {actionRows.map(row => {
          if (draftAction?.id === row.id) {
            return renderActionEditRow(draftAction);
          }
          const actions = (
            <div className='ooe-list__card-actions'>
              <Icon type='edit' className='ooe-list__icon ooe-list__icon--edit' onClick={() => handleEditAction(row)} />
              <Popconfirm title={translate('AreYouSure')} onConfirm={() => handleDeleteAction(row.id)} okText={translate('Yes')} cancelText={translate('No')}>
                <Icon type='delete' className='ooe-list__icon ooe-list__icon--delete' />
              </Popconfirm>
            </div>
          );
          if (row.extraData?.isGridAction) {
            const targetText = row.extraData.targetLayoutItem?.Text ?? row.field;
            const gridColId = row.extraData.layoutItem?.Id;
            const gridColText = row.extraData.layoutItem?.Text ?? gridColId;
            return (
              <Card>
                <Row gutter={8} align="middle">
                  <Col md={5}>
                    <SelectEx
                      dataSource={[{ key: targetText, value: row.field }]}
                      value={row.field}
                      disabled
                      onChange={() => { }}
                      style={{ width: '99%' }}
                    />
                  </Col>
                  <Col span={4}>
                    <SelectEx dataSource={gridActionsDs} value={row.operator} disabled onChange={() => { }} />
                  </Col>
                  <Col span={4}>
                    <SelectEx dataSource={functionDs} value={row.extraData.functionName} disabled onChange={() => { }} />
                  </Col>
                  <Col span={6}>
                    <SelectEx
                      dataSource={[{ key: gridColText, value: gridColId }]}
                      value={gridColId}
                      disabled
                      onChange={() => { }}
                    />
                  </Col>
                  <Col>{actions}</Col>
                </Row>
              </Card>
            );
          }
          return (
            <Card style={{ borderColor: '#52c41a' }}>
              <Row>
                <Col md={8}>
                  <SelectEx dataSource={getFieldDataSource(row.field)} value={row.field} disabled onChange={() => { }} style={{ width: '99%' }} />
                </Col>
                <Col md={8}>
                  <SelectEx dataSource={getActionsDs(row.field)} value={row.operator} disabled onChange={() => { }} style={{ width: '99%' }} />
                </Col>
                <Col md={8}>{actions}</Col>
              </Row>
            </Card>
          );
        })}

        {draftAction && !draftAction.id && renderActionEditRow(draftAction)}

        <Row justify="end">
          <Col>
            <Button type='primary' icon="plus" onClick={handleAddAction} disabled={!!draftAction} style={addBtnStyle}>
              {/* {translate('AddAction')} */}
              افزودن عملیات
            </Button>
          </Col>
        </Row>
      </Fieldset>
    </Modal>
  );
}

export default OperationOnEventDetail;
