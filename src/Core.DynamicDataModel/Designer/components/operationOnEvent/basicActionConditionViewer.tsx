import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { FieldValue } from '@didgah-components/ant-querybuilder';
import { GlobalPropsContext } from '../../store/reducers/designLayoutSlice';
import useFloorStack from '../../hooks/useFloorStack';
import { ColumnActions, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { Button, DidgahContextProps, injectContext, Modal } from 'didgah/ant-core-component';
import JSCodeViewer from './JSCodeViewer';
import { createWorkSpace } from './JSBlock/workspace';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { convertBadCharactersToXmlValidCharacter } from './JSBlock/helper';
import { WidgetFactory } from '../../../Widget/WidgetFactory';
import { translate } from 'didgah/common';

const BLOCKLY_DIV_ID = 'blocklyDiv-hidden';

function QueryBuilderActionConditionViewer(props: FieldValue) {
  const { field, operator, value, extraData } = props;
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentDataModel, currentFloor } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const widgetFactory = useRef(new WidgetFactory({ dataModelGuid: currentDataModel.Guid, layoutGuid: globalProps.layoutGuid, layoutModel: currentFloor.LayoutModels, softwareModels: currentFloor.SoftwareModels, context: globalProps.context }));
  const columnsBlockOptions = useRef([
    ...currentDataModel.Columns.map(col => ({
      name: col.Name,
      title: col.Label,
      guid: col.Guid
    })),
    ...currentDataModel.Relations.map(rel => ({
      name: rel.Name,
      title: rel.Label,
      guid: rel.Guid
    }))
  ]);
  const layoutType = currentDataModel.Columns.some(col => col.Guid === field)
        ? LayoutItemType.Column
        : LayoutItemType.Reference;
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [code, setCode] = useState('');
  const workspace = useRef(null);

  useEffect(() => {
    workspace.current = createWorkSpace(BLOCKLY_DIV_ID, [{ category: 'Functions', name: 'Columns', type: 'Dropdown', options: columnsBlockOptions.current }], 'String');
    const str = convertBadCharactersToXmlValidCharacter(value);

    str && Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(str), workspace.current);
  }, []);

  return <div>
    {columnsBlockOptions.current.find(layout => layout.guid === field).title} {layoutType === LayoutItemType.Column ? translate(`DDM_${ColumnActions[operator]}`) : translate(`DDM_${ReferenceActions[operator]}`)}
    <Button
      onClick={() => {
        setCode((Blockly as any).JavaScript.workspaceToCode(workspace.current));
        setShowCodeViewer(true);
      }}>{translate('DDM_ViewCode')}
    </Button>
    <div id={BLOCKLY_DIV_ID} style={{ width: '100%' }} hidden>
    </div>
    {showCodeViewer && <Modal
      visible={true}
      onOk={() => { setShowCodeViewer(false); }}
      onCancel={() => { setShowCodeViewer(false) }}
      width={'90%'}
    >
      <JSCodeViewer code={code} />
    </Modal>}
  </div>;
}
export default QueryBuilderActionConditionViewer;