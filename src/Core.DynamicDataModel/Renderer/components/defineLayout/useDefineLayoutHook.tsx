import { FormComponentProps } from 'didgah/ant-core-component';
import React from 'react';
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { guid } from "didgah/common";
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { UseDefineHook, GetterSavedDataProps, ValidationResult, ISetupData, SaveDataViewModel } from '../../../../typings/Core.DynamicDataModel/Types';
import { WidgetFactory } from '../../../Widget/WidgetFactory';
import ComplexValidator from '../validation/complexValidator';
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { translate } from '../../../../Utility/language';
import LayoutManager from "../../../LayoutManager";

interface UseDefineHookProps {
	primaryKey: string;
	mode: 'add' | 'edit',
	initialDataSetup: ISetupData,
	initialData: LayoutValueByPrimaryKeyResponseViewModel,
	validator: ComplexValidator,
	currentLayout: LayoutViewModel,
	widgetFactory: WidgetFactory,
	layoutManager?: LayoutManager
}

export default function useDefineLayoutHook({
	mode,
	primaryKey,
	form,
	initialDataSetup,
	initialData,
	validator,
	currentLayout,
	widgetFactory,
}: UseDefineHookProps & FormComponentProps): UseDefineHook {

	const getterSubLayoutsSavedData = React.useRef<Function[]>([]);
	const subLayoutsData = React.useRef<GetterSavedDataProps[]>([]);
	const changedLayoutGuid = React.useRef<string[]>([]);

	const [showValidationError, setShowValidationError] = React.useState<ValidationResult>(null);

	const setChangedLayoutItemGuid = (layoutItemGuid: string) => {
		if (!changedLayoutGuid.current.find(x => x === layoutItemGuid)) {
			changedLayoutGuid.current.push(layoutItemGuid);
		}
	};

	const getChangedLayoutItemGuid = () => {
		return changedLayoutGuid.current;
	};

	const hideValidationError = () => {
		setShowValidationError(null);
	};

	const getKeyValuesList = () => {
		let KeyValueList: KeyValueViewModel<string, Object>[] = [];
		const formData = form.getFieldsValue();
		initialDataSetup.data.forEach((item) => {
			const layoutItem = widgetFactory.getLayoutItem(item.layoutItemGuid);
			const viewModel = widgetFactory.getDetailOfDataModel(layoutItem);
			if (item.layoutItemType !== LayoutItemType.SubLayout) {
				const value = initialDataSetup.getFieldValue(item, formData, item.rowKey, viewModel);
				if (!!value) {
					KeyValueList.push(value);
				}
			} else {
				const subLayoutDataDetail = subLayoutsData.current.find(x => x.layoutGuid === item.subLayoutGuid);
				if (!!subLayoutDataDetail) {
					KeyValueList.push({
						Key: item.rowKey,
						Value: subLayoutDataDetail.value
					});
				}
			}
		});
		return KeyValueList;
	};

	const getRows = (_data): SaveRowViewModel[] => {
		return [{
			PrimaryKey: !!primaryKey ? primaryKey : guid.newGuid(),
			State: mode === 'edit' ? RowState.Modified : RowState.Added,
			KeyValues: getKeyValuesList()
		}];
	};

	const setGetterSubLayoutData = (getterSubLayoutsData) => {
		getterSubLayoutsSavedData.current.push(getterSubLayoutsData);
	};

	const getSubLayoutsData = (disableValidation = false) => {
		const gettersSubLayoutData = getterSubLayoutsSavedData.current.map(fn => fn(disableValidation));
		return new Promise<GetterSavedDataProps[]>((resolve, reject) => {
			Promise.all(gettersSubLayoutData).then((values) => {
				subLayoutsData.current = values;
				resolve(values);
			}).catch(() => reject());
		});
	};

	const getSavedDataWithoutValidation = () => {
		return new Promise<SaveDataViewModel>((resolve) => {
			getSubLayoutsData(true).then(_sublayoutsResult => {
				const rows = getRows(initialData);
				resolve({ rows, validationResult: { succeedded: true } });
			});
		});
	};

	const getSavedAndValidationData = (loadable?: boolean) => {
		return new Promise<SaveDataViewModel>((resolve, reject) => {
			getSubLayoutsData().then(sublayoutsResult => {
				const failedSublayout = sublayoutsResult.find(result => !result.validationResult.succeedded);
				if (!!failedSublayout) {
					const layoutLabel = widgetFactory.layouts.find(layout => layout.Guid === failedSublayout.layoutGuid).Label;
					reject({ message: translate('ThereIsAnErrorInTheItem').replace('{n}', `${layoutLabel}`) });
				} else {
					const rows = getRows(initialData);
					const validationResult = validator.validateLayout(currentLayout, rows);
					if (!!validationResult && !validationResult?.succeedded) {
						if (!loadable) {
							setShowValidationError(validationResult);
						}
						reject({ message: validationResult.message });
					}
					resolve({ rows, validationResult });
				}
			}).catch(() => reject());
		});
	};

	const getSavedDataForParent = (disableValidation?: boolean) => {
		return new Promise<GetterSavedDataProps>((resolve, reject) => {
			if (!!disableValidation) {
				getSavedDataWithoutValidation().then((savedData) => {
					if (!!savedData.rows) {
						resolve({
							layoutGuid: currentLayout.Guid,
							value: savedData.rows,
							validationResult: savedData.validationResult
						});
					}
				}).catch((error) => {
					resolve({
						layoutGuid: currentLayout.Guid,
						value: undefined,
						validationResult: { succeedded: false, message: error.message }
					});
				});
			} else {
				form.validateFields((errors, _formData) => {
					if (!!errors) {
						reject(errors);
						return;
					}
					getSavedAndValidationData(true).then((savedData) => {
						if (!!savedData.rows) {
							resolve({
								layoutGuid: currentLayout.Guid,
								value: savedData.rows,
								validationResult: savedData.validationResult
							});
						}
					}).catch((error) => {
						resolve({
							layoutGuid: currentLayout.Guid,
							value: undefined,
							validationResult: { succeedded: false, message: error?.message ?? 'error' }
						});
					});
				});
			}
		});
	};

	const getterSavedData = () => {
		return getSavedDataForParent;
	};

	return {
		getSavedAndValidationData,
		getterSavedData,
		showValidationError,
		setGetterSubLayoutData,
		hideValidationError,
		setChangedLayoutItemGuid,
		getChangedLayoutItemGuid,
	} as any;
}