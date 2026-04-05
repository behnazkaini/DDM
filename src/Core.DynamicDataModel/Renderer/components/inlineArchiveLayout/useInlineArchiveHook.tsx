import React from 'react';
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import { WidgetFactory } from "../../../Widget/WidgetFactory";
import LayoutManager from "../../../LayoutManager";
import { ComponentModel, ISetupData, ActionReferenceArchiveProps, UseInlineArchiveHook, ValidationResult, TableError, useLayoutsRendererHookProps, IWidgetFactory, SaveDataViewModel, GetterSavedDataProps, LayoutItemsActions, ResultAction } from '../../../../typings/Core.DynamicDataModel/Types';
import ComplexValidator from '../validation/complexValidator';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { ColumnActions, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { ColumnViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel';
import { RelationViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel';
import { RelationType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType';
import { RelationNature } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature';
import { ColumnDataType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType';
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { useAjax } from 'didgah/ant-core-component';
import { InlineArchiveLayoutViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel';
import transportLayer from "../../transportLayer";
import SetupData from "./setupInlineArchiveLayoutData";
import { translate } from 'didgah/common';

interface State {
	initialData: LayoutValueResponseViewModel;
	loading: boolean;
	currentLayout: InlineArchiveLayoutViewModel;
	visibleDefineForm: boolean
	dataSetup: ISetupData;
	selectedRecord: any;
	mode: 'add' | 'edit';
	showValidationError: ValidationResult
}

interface Action {
	type: string;
	payload: unknown;
}

const initialState: State = {
	initialData: {
		DataModels: undefined,
		Layouts: undefined,
		Rows: undefined
	},
	loading: true,
	currentLayout: null,
	visibleDefineForm: false,
	dataSetup: null,
	selectedRecord: null,
	mode: 'add',
	showValidationError: null
};

interface ActionListProps {
	layoutItemGuid: string;
	value: any;
	actionsList: LayoutItemsActions[]
}

export default function useInlineArchiveHook({
	hasParent,
	layoutGuid,
	parentInitialData,
	dataModelGuid,
	previewInitialDataForDesigner,
	webSoftwareComponents,
	context,
	remoteDataSource,
	widgetsMode,
	isSimpleDesignerMode
}: useLayoutsRendererHookProps<LayoutValueResponseViewModel>): UseInlineArchiveHook {

	function reducer(state: State, action: Action): State {
		switch (action.type) {
			case "SET_LOADING":
				return {
					...state,
					loading: false,
				};

			case "INIT_AND_SET_LOADING_AND_SETUPDATA":
				const data = action.payload as LayoutValueResponseViewModel;
				return {
					...state,
					loading: false,
					currentLayout: (data as any).currentLayout,
					initialData: {
						DataModels: data.DataModels,
						Layouts: data.Layouts,
						Rows: data.Rows
					},
					dataSetup: (data as any).dataSetup
				};
			case 'SHOW_VALIDATION_ERROR':
				return {
					...state,
					showValidationError: action.payload as ValidationResult,
				};

			case 'HIDE_VALIDATION_ERROR':
				return {
					...state,
					showValidationError: null,
				};

			default:
				return { ...state };
		}
	}

	const ajax = useAjax();
	const widgetFactory = React.useRef<IWidgetFactory>(null);
	const layoutManager = React.useRef<LayoutManager>(null);
	const getterSubLayoutsSavedData = React.useRef<Function>(undefined);

	const tableActionHandler = React.useRef<ActionReferenceArchiveProps>(undefined);
	const actions = React.useRef<ActionListProps[]>([]);
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const validator = React.useRef<ComplexValidator>(null);

	const { loading, currentLayout, initialData, visibleDefineForm, dataSetup, selectedRecord, mode, showValidationError } = state;


	React.useEffect(() => {
		const getSetupData = () => {
			if (!hasParent) {
				if (remoteDataSource) {
					context.ajax.post(remoteDataSource.url, remoteDataSource?.metadata).then(result => {
						if (!!result) {
							setupManagers(result);
						}
					});
				} else {
					transportLayer(ajax).GetValue({ LayoutGuid: layoutGuid }).then((result: LayoutValueResponseViewModel) => {
						setupManagers(result);
					})
				}
			}
			else {
				setupManagers(parentInitialData as LayoutValueResponseViewModel);
			}
		}

		if (!previewInitialDataForDesigner) {
			getSetupData()
		}
		else {
			setupManagers(previewInitialDataForDesigner)
		}
	}, []);


	function setupManagers(result: LayoutValueResponseViewModel) {
		const layout = result.Layouts.find((x) => x.Guid.toLowerCase() == layoutGuid.toLocaleLowerCase());
		widgetFactory.current = new WidgetFactory({
			dataModelGuid,
			layoutGuid,
			layoutModel: result,
			softwareModels: webSoftwareComponents,
			context,
			isSimpleDesignerMode: isSimpleDesignerMode
		});
		layoutManager.current = new LayoutManager({
			LayoutsModel: {
				DataModels: result.DataModels,
				Layouts: result.Layouts,
				WidgetFactory: widgetFactory.current,
				WidgetsMode: widgetsMode,
			},
			context,
			isSimpleDesignerMode: isSimpleDesignerMode
		});

		validator.current = new ComplexValidator({ layouts: result.Layouts, dataModels: result.DataModels });


		const data = new SetupData({
			widgetFactory: widgetFactory.current,
			initialData: result,
			currentLayout: layout,
		});

		dispatch({
			type: "INIT_AND_SET_LOADING_AND_SETUPDATA",
			payload: {
				DataModels: result.DataModels,
				Layouts: result.Layouts,
				Rows: result?.Rows,
				currentLayout: layout,
				dataSetup: data,
			} as LayoutValueResponseViewModel,
		});
	}

	const getComponentData = (): ComponentModel => {
		return layoutManager.current.getLayoutComponent(currentLayout);
	}

	const hideValidationError = () => {
		dispatch({ type: 'HIDE_VALIDATION_ERROR', payload: null });
	}

	const getKeyValueList = (record, recordKey) => {
		const keyValueList = [];
		for (const key in record) {
			const layoutItemDataSetup = dataSetup.data.find(x => x.rowKey === key);

			if (!!layoutItemDataSetup) {
				const layoutItem = widgetFactory.current.getLayoutItem(layoutItemDataSetup.layoutItemGuid);
				const viewModel = widgetFactory.current.getDetailOfDataModel(layoutItem);
				const value = dataSetup.getFieldValue(layoutItemDataSetup, record, recordKey, viewModel);
				if (!!value) {
					keyValueList.push(value)
				}
			}
		}
		return keyValueList
	}

	const getFormData = (data, state) => {
		const rows: SaveRowViewModel[] = [];
		data.forEach(item => {
			const recordKey = !!item.Guid ? item.Guid : item.__guid;
			rows.push({
				PrimaryKey: recordKey,
				KeyValues: getKeyValueList(item, recordKey),
				State: state
			})
		});
		return rows
	}

	const getFailedRecords = (dataTable: any[], validationResult: ValidationResult) => {
		let result: TableError[] = [];
		if (!validationResult.succeedded) {
			const failedRows = validationResult.result.filter(x => !x.Succeedded);
			failedRows.forEach(row => {
				dataTable.forEach(x => {
					if (x.hasOwnProperty('Guid') && !!x.Guid) {
						if (x['Guid'] === row.PrimaryKey) {
							result.push({
								keyProperty: 'Guid',
								keyValue: row.PrimaryKey,
								errors: ['dd']
							})
						}

					}
					else {
						if (x['__guid'] === row.PrimaryKey) {
							result.push({
								keyProperty: '__guid',
								keyValue: row.PrimaryKey,
								errors: ['dd']
							})
						}
					}
				});
			});
		}
		return result
	}

	const validateTable = () => {
		return new Promise<boolean>((resolve, reject) => {
			if (tableActionHandler.current.validateForms()) {
				resolve(true);
			}
			else {
				reject()
			}
		})
	}

	const getSavedDataWithoutValidation = (): SaveRowViewModel[] => {
		const dataTable = { data: tableActionHandler.current.getData(), ...tableActionHandler.current.getChanges() }
		const savedData = [...getFormData(dataTable.added, RowState.Added),
		...getFormData(dataTable.deleted, RowState.Deleted),
		...getFormData(dataTable.edited, RowState.Modified),
		...getFormData(dataTable.data.filter(x => !x.hasOwnProperty('__status') && x.hasOwnProperty('Guid')), RowState.Unchanged)];
		return savedData
	}

	const getSavedAndValidationData = (loadable?: boolean) => {
		return new Promise<SaveDataViewModel>((resolve, reject) => {
			const dataTable = { data: tableActionHandler.current.getData(), ...tableActionHandler.current.getChanges() }
			const savedData = [...getFormData(dataTable.added, RowState.Added),
			...getFormData(dataTable.deleted.filter(data => data), RowState.Deleted),
			...getFormData(dataTable.edited, RowState.Modified),
			...getFormData(dataTable.data.filter(x => !x.hasOwnProperty('__status') && x.hasOwnProperty('Guid')), RowState.Unchanged)];
			const tableDesignSetting = JSON.parse(currentLayout.Design).Widget;
			if (tableDesignSetting.MaxRow && savedData?.length > +tableDesignSetting.MaxRow) {
				const validateRes = { succeedded: false, message: translate('TableCanNotAddMoreRow').replace('{0}', currentLayout.Label).replace('{1}', tableDesignSetting.MaxRow) };
				dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validateRes });
				reject();
			};
			if (tableDesignSetting.MinRow && savedData?.length < +tableDesignSetting.MinRow) {
				const validateRes = { succeedded: false, message: translate('TableCanNotRemoveMoreRow').replace('{0}', currentLayout.Label).replace('{1}', tableDesignSetting.MinRow) };
				dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validateRes });
				reject();
			};

			validateTable().then(() => {
				const validationResult = validator.current.validateLayout(currentLayout, savedData);
				if (!!validationResult && !validationResult?.succeedded) {
					dispatch({ type: 'SHOW_VALIDATION_ERROR', payload: validationResult });
					tableActionHandler.current.setInvalidRecords(getFailedRecords(dataTable.data, validationResult));
					reject();
				}
				resolve({ rows: savedData, validationResult });
			}).catch(() => {
				reject();
			});
		})
	}

	const getSavedDataForParent = (disableValidation?: boolean) => {
		return new Promise<GetterSavedDataProps>(resolve => {
			if (!!disableValidation) {
				const savedData = getSavedDataWithoutValidation();
				resolve({
					layoutGuid: currentLayout.Guid,
					value: savedData,
					validationResult: { succeedded: true }
				})
			}
			else {
				getSavedAndValidationData(true).then((savedData) => {
					if (!!savedData.rows) {
						resolve({
							layoutGuid: currentLayout.Guid,
							value: savedData.rows,
							validationResult: savedData.validationResult
						})
					}
				}).catch((error) => {
					resolve({
						layoutGuid: currentLayout.Guid,
						value: undefined,
						validationResult: { succeedded: false }
					})
				})
			}
		})

	}

	const getterSavedData = () => {
		return getSavedDataForParent
	}

	const handlerActionOnTable = (handler: ActionReferenceArchiveProps) => {
		tableActionHandler.current = handler
	}

	const getDefaultValue = (value, dataModel: ColumnViewModel) => {
		if (!value) {
			switch (dataModel.DataType) {
				case ColumnDataType.String:
					return '';
				case ColumnDataType.BigInteger:
				case ColumnDataType.Decimal:
				case ColumnDataType.Integer:
					return 0;
				case ColumnDataType.Boolean:
					return false;
				case ColumnDataType.DateTime:
					return ''
			}
		}
		return value
	}

	const layoutItemFieldValues = (layoutItemGuid: string) => {
		const layoutItemsValue = actions.current.filter(y => y.layoutItemGuid === layoutItemGuid)?.map(action => { return { value: action.value, layoutItemGuid: action.layoutItemGuid } });

		let result = {}
		layoutItemsValue.forEach(item => {
			for (const key in item.value) {
				const data = dataSetup.data.find(x => x.rowKey === key);
				if (!!data) {
					const layoutItem = widgetFactory.current.getLayoutItem(data.layoutItemGuid);
					const dataModel = widgetFactory.current.getDetailOfDataModel(layoutItem);

					let value = getDefaultValue(item.value[key], dataModel as ColumnViewModel);

					if (layoutItem.Type === LayoutItemType.Reference && (dataModel as RelationViewModel).Nature === RelationNature.Aggregation) {
						switch ((dataModel as RelationViewModel).Type) {
							case RelationType.OneToOne: {
								value = item.value[key].key;
								break;
							}
							case RelationType.OneToMany: {
								value = item.value[key].tokens.map((token) => { return token.id });
								break
							}
						}
					}
					result[dataModel.Name] = value
				}

			}

		});
		return JSON.stringify(result)

	}

	const runAction = (targetLayoutItemGuid: string) => {
		const result: ResultAction[] = [];
		actions.current.forEach(layoutItem => {
			layoutItem.actionsList.forEach(action => {
				if (action.targetLayoutItemGuid === targetLayoutItemGuid) {
					const item = widgetFactory.current.getLayoutItem(targetLayoutItemGuid);
					const value = layoutItemFieldValues(layoutItem.layoutItemGuid);
					const actionFunc = action.func.replace("return main(parameters)", `return main(${value})`);

					const script = document.createElement("script");
					script.innerHTML = actionFunc;
					document.body.appendChild(script);

					result.push({
						actionName: item.Type === LayoutItemType.Column ? ColumnActions[action.actionId] : ReferenceActions[action.actionId],
						actionValue: window['Main0'].apply(window),
						targetLayoutItemGuid: action.targetLayoutItemGuid,
						eventOnLayoutItemGuid: layoutItem.layoutItemGuid
					});
				}
			})
		});
		return result;
	}

	const getActions = (targetLayoutItemGuid: string) => {
		return runAction(targetLayoutItemGuid)
	}

	const setActions = (layoutItemGuid: string, value: any, actionsList: LayoutItemsActions[]) => {
		return new Promise<ActionListProps[]>((resolve, reject) => {

			const itemIndex = actions.current.findIndex(x => x.layoutItemGuid === layoutItemGuid)
			if (itemIndex !== -1) {
				actions.current.splice(0, 1)
			}
			actions.current.push({ layoutItemGuid, value, actionsList });
			resolve(actions.current);
		})
	}

	const getTableHandler = () => {
		return tableActionHandler.current
	}
	return {
		getComponentData,
		setupDataValue: dataSetup,
		getSavedAndValidationData,
		showValidationError,
		getterSavedData,
		hideValidationError,
		getActions,
		setActions,
		handlerActionOnTable,
		getTableHandler,
		loading,
		initialData
	} as any

}