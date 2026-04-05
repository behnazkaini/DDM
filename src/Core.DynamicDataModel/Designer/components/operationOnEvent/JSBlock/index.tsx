import * as Blockly from 'blockly';
import { createWorkSpace } from './workspace';
import { Button, FormLayout, Modal, useAjax, useCommandHandler } from 'didgah/ant-core-component';
import React, { useEffect, useMemo, useRef } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { GlobalPropsContext } from '../../../store/reducers/designLayoutSlice';
import useFloorStack from '../../../hooks/useFloorStack';
import { LayoutItemType } from '../.../../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { convertBadCharactersToXmlValidCharacter, isWorkspaceLayoutItem, jsBlockInitialXml } from './helper';
import { WidgetFactory } from '../../../../Widget/WidgetFactory';
import { ColumnActions, ReferenceActions } from '../../../../../typings/Core.DynamicDataModel/Enums';

const BLOCKLY_DIV_ID = 'blocklyDiv';

export interface JSBlockLanguageProps {
	initialXmlText?: string;
	onSave: ({ xmlText, code }: { xmlText: string, code: string }) => void;
	onCancel: () => void;
	layoutItemType: LayoutItemType;
	action: number;
}

interface JSBlockLanguageState {
	showCode: boolean;
	loadingCode: boolean;
	saving: boolean;
	code: string;
}

type ActionType = 'SHOW_CODE';
function reducer(state: JSBlockLanguageState, action: { type: ActionType, payload?: any }): JSBlockLanguageState {
	switch (action.type) {
		case 'SHOW_CODE': {
			return { ...state, showCode: true, code: action.payload, loadingCode: false }
		}
		default: {
			return { ...state };
		}
	}
}

export default function JSBlockLanguage({ initialXmlText, onSave, onCancel, layoutItemType, action }: JSBlockLanguageProps) {
	const workspace = React.useRef<Blockly.WorkspaceSvg>(null);
	const [state, dispatch] = React.useReducer(reducer, {
		showCode: false,
		loadingCode: false,
		saving: false,
		code: null
	});
	const globalProps = React.useContext(GlobalPropsContext);
	const { currentLayout, currentDataModel, currentFloor } = useFloorStack({
		layoutGuid: globalProps.layoutGuid,
	});
	const widgetFactory = useRef(new WidgetFactory({ dataModelGuid: currentDataModel.Guid, layoutGuid: globalProps.layoutGuid, layoutModel: currentFloor.LayoutModels, softwareModels: currentFloor.SoftwareModels, context: globalProps.context }));
	const columnsBlockOptions = useRef(currentLayout.Items.filter(item => isWorkspaceLayoutItem(item)).map(item => {
		return ({
			name: widgetFactory.current.getDetailOfDataModel(item).Name,
			title: JSON.parse(item.Design).Label,
			guid: item.Guid
		})
	}));

	function handleSave() {
		const workspaceText = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace.current));
		onSave({ xmlText: workspaceText, code: state.code });
	}

	function updateCode() {
		var code = (Blockly as any).JavaScript.workspaceToCode(workspace.current);
		dispatch({
			type: 'SHOW_CODE',
			payload: code
		});
	}

	function getMainFunctionCheck() {
		if(layoutItemType === LayoutItemType.Column) {
			if(action === ColumnActions.Disabled || action === ColumnActions.Required) {
				return 'Boolean';
			} else {
				return 'String';
			}
		} else if(layoutItemType === LayoutItemType.Reference){
			if(action === ReferenceActions.Disabled || action === ReferenceActions.Required) {
				return 'Boolean';
			} else {
				return 'String';
			}
		} else {
			return 'String';
		}

	}

	useEffect(() => {
		setTimeout(() => { 
			workspace.current = createWorkSpace(BLOCKLY_DIV_ID, [{ category: 'Functions', name: 'Columns', type: 'Dropdown', options: columnsBlockOptions.current }], getMainFunctionCheck());
			workspace.current.addChangeListener((event) => {
				updateCode();
			});

			if (initialXmlText) { 
				Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(convertBadCharactersToXmlValidCharacter(initialXmlText)), workspace.current);
			}
		}, 1000);
		
		return () => {
			const docElements = document.getElementsByClassName('geras-renderer');
			for (let index = 0; index < docElements.length; index++) {
				(docElements[index] as HTMLElement).style.display = "none";
			}
		}
	}, []);

	return (
		<Modal
			visible={true}
			onOk={handleSave}
			onCancel={onCancel}
			width={'90%'}
		>
			<div className="ddm-operation-on-event_jsblock">
				<div className="ddm-operation-on-event_jsblock_code" style={{ direction: 'ltr', margin: 20 }}>
					{state.code ? <SyntaxHighlighter language='javascript' style={vs} wrapLines showLineNumbers>
						{state.code}
					</SyntaxHighlighter> : null}
				</div>
				<div id={BLOCKLY_DIV_ID} style={{ width: '100%' }}>
				</div>
			</div>
		</Modal>
	);
}
