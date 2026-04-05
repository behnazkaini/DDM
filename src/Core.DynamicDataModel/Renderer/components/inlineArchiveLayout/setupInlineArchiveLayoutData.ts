import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import {
	ISetupData, SetupDataProps, DataSetup, IWidgetFactory, ColumnItemsFieldValue,
	RelationItemsOneToManyAggregationFieldValue,
	ArchivalRowItemModel,
	RelationItemsOneToOneAggregationFieldValue,
	LayoutItemsActionsOnEvent
} from '../../../../typings/Core.DynamicDataModel/Types';
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";


type AutoCompleteExFormData = {
	primaryKey: string;
	key: string;
	value: {
		label: string;
		key: string;
		rowData: KeyValueViewModel<string, Object>[]
		metadata: {
			ColumnGuids: string[];
			DataModelGuid: string;
		}
	}

}

type TokenContainerFormData = {
	primaryKey: string;
	key: string;
	value: {
		tokens: {
			id: string;
			title: string;
			rowData: KeyValueViewModel<string, Object>[]
		}[];
		metadata: {
			ColumnGuids: string[];
			DataModelGuid: string;
		}
		key: string,
	}

}

interface OneToOneAggregationRowAndFormData {
	formData: AutoCompleteExFormData[],
	row?: any
}

interface OneToManyAggregationRowAndFormData {
	formData: TokenContainerFormData[],
	row?: any
}

type RelationRowAndFormData =
	OneToOneAggregationRowAndFormData |
	OneToManyAggregationRowAndFormData;


interface ColumnDataViewModel {
	formData: ArchivalRowItemModel[]
}

export default class SetupData implements ISetupData {
	currentLayout: LayoutViewModel;
	widgetFactory: IWidgetFactory;
	initialData: LayoutValueResponseViewModel;
	setupDataHelperList;
	data: DataSetup[];
	events: LayoutItemsActionsOnEvent[];
	constructor({ widgetFactory, initialData, currentLayout, events }: SetupDataProps<LayoutValueResponseViewModel>) {
		this.currentLayout = currentLayout;
		this.widgetFactory = widgetFactory;
		this.initialData = initialData as LayoutValueResponseViewModel;
		this.events = events;
		this.setupDataHelperList = [
			new ColumnItemHelper(this.widgetFactory),
			new RelationItemHelper(this.widgetFactory),
		];
		this.data = this.getSetupData();
	}

	getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string) {
		const helper = this.getHelper(layoutItemSetup.layoutItemType);
		return helper.getFieldValue(layoutItemSetup, formData, recordKey)
	}

	getSetupData(): DataSetup[] {
		const data = []
		this.getAllLayoutItemsExceptGroups().forEach(layoutItem => {
			const rowKey = this.getRowKeyByLayoutItemType(layoutItem, layoutItem.Type);
			const dataModel = this.getDataModel(layoutItem);
			data.push({
				layoutItemGuid: layoutItem.Guid,
				layoutItemType: layoutItem.Type,
				rowKey,
				dataModelType: dataModel?.Type,
				dataModelGuid: dataModel?.ReferenceDataModelGuid,
				dataModelNature: dataModel?.Nature,
				subLayoutGuid: layoutItem.Type === LayoutItemType.SubLayout ? (layoutItem as SubLayoutItemViewModel).SubLayoutGuid : undefined,
				event: this.events?.find(event => event.layoutItemGuid === layoutItem.Guid),
				...this.setRowAndFormData(rowKey, layoutItem, dataModel)
			})
		});
		return data;
	}

	private getAllLayoutItemsExceptGroups(): LayoutItemViewModel[] {
		return this.currentLayout.Items.filter(x => x.Type !== LayoutItemType.NoneBindable);
	}

	private getRowKeyByLayoutItemType(layoutItem: LayoutItemViewModel, type: LayoutItemType) {
		const helper = this.getHelper(type);
		return helper.getRowKey(layoutItem);
	}

	private getDataModel(layoutItem: LayoutItemViewModel) {
		const helper = this.getHelper(layoutItem.Type);
		return helper.getDataModel(layoutItem);
	}

	private setRowAndFormData(rowKey: string, layoutItem: LayoutItemViewModel, dataModel) {
		const helper = this.getHelper(layoutItem.Type);

		const rowsData = () => {
			let rows: ArchivalRowItemModel[] = [];
			this.initialData.Rows?.forEach(item => {
				const keyValue = item.KeyValues.find(keyValue => keyValue.Key === rowKey);
				rows.push({ primaryKey: item.PrimaryKey, key: rowKey, value: keyValue?.Value }); 
			});  
			return rows
		}
		const rows = rowsData();
		return { ...helper.setRowAndFormData(rows, layoutItem, dataModel) }
	}

	private getHelper(type: LayoutItemType) {
		return this.setupDataHelperList.find(x => x.type === type);
	}
}

abstract class SetupDataHelper<ILayoutItemViewModel, IFieldValue, ISetterRowAndFormData> {
	widgetFactory: IWidgetFactory;

	constructor(widgetFactory: IWidgetFactory) {
		this.widgetFactory = widgetFactory;
	}
	abstract type: LayoutItemType;
	abstract getRowKey(layoutItem: ILayoutItemViewModel): string;
	abstract getDataModel(layoutItem: ILayoutItemViewModel);
	abstract setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ISetterRowAndFormData;
	abstract getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string): IFieldValue

}

class ColumnItemHelper extends SetupDataHelper<LayoutItemColumnViewModel, ColumnItemsFieldValue, ColumnDataViewModel>{
	type = LayoutItemType.Column;

	getRowKey(layoutItem: LayoutItemColumnViewModel): string {
		return layoutItem.ColumnGuid;
	}

	getDataModel(layoutItem: LayoutItemColumnViewModel) {
		return (this.widgetFactory.getDetailOfDataModel(layoutItem) as ColumnViewModel);
	}

	setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ColumnDataViewModel {
		return {
			formData: rows
		}

	}

	getFieldValue(layoutItemSetup: DataSetup, formData: Object, recordKey): ColumnItemsFieldValue {
		const key = layoutItemSetup.rowKey;
		return {
			Key: key,
			Value: formData[key] ?? null
		}
	}

}

class RelationItemHelper extends SetupDataHelper<LayoutItemReferenceViewModel, any, RelationRowAndFormData>{
	relationDataModelHlper;
	constructor(widgetFactory) {
		super(widgetFactory);
		this.relationDataModelHlper = [
			new OneToOneAggregationHelper(this.widgetFactory),
			new OneToManyAggregationHelper(this.widgetFactory),
		];
	}
	type = LayoutItemType.Reference;

	getRowKey(layoutItem: LayoutItemReferenceViewModel): string {
		return layoutItem.RelationGuid;
	}

	getDataModel(layoutItem: LayoutItemReferenceViewModel) {
		return (this.widgetFactory.getDetailOfDataModel(layoutItem) as RelationViewModel);
	}

	setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel: RelationViewModel) {
		const helper = this.relationDataModelHlper.find(x => x.type === dataModel.Type && x.nature === dataModel.Nature);
		return helper.setField(rows, layoutItem, dataModel);
	}

	getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string) {
		const helper = this.relationDataModelHlper.find(x => x.type === layoutItemSetup.dataModelType && x.nature === layoutItemSetup.dataModelNature);
		return helper.getField(layoutItemSetup, formData, recordKey);
	}

}

abstract class RelationItemsHelper<IRowViewModel, ISetterField, IGetterField> {
	widgetFactory: IWidgetFactory;
	initialData: LayoutValueResponseViewModel;
	currentLayout
	constructor(widgetFactory, initialData?, currentLayout?) {
		this.widgetFactory = widgetFactory;
		this.initialData = initialData;
		this.currentLayout = currentLayout
	}
	abstract setField(rows: IRowViewModel[], layouItem: LayoutItemViewModel, dataMdoel: RelationViewModel): ISetterField;
	abstract getField(layoutItemSetup: DataSetup, formData, recordKey: string): IGetterField

}

class OneToOneAggregationHelper extends RelationItemsHelper<ArchivalRowItemModel, OneToOneAggregationRowAndFormData, RelationItemsOneToOneAggregationFieldValue> {
	type = RelationType.OneToOne;
	nature = RelationNature.Aggregation;

	setField(rows: ArchivalRowItemModel[], layouItem: LayoutItemReferenceViewModel, dataMdoel: RelationViewModel): OneToOneAggregationRowAndFormData {
		const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
			const itemDesign = JSON.parse(layouItem.Design);
			const values: object[] = keyValues.map((column) => column.Value);
			const { ReferenceAutoCompleteColumnsConfige } = itemDesign;
			const seperableCharachter = ReferenceAutoCompleteColumnsConfige?.SeperableCharachter ?? ',' ;

			return (values).join(seperableCharachter);
		}

		const getData = () => {
			const data: AutoCompleteExFormData[] = [];

			if (!!rows.length) {
				rows.forEach(row => {
					const isValueExist = !!row?.value && !!(row.value as KeyValueViewModel<string, Object>[]).length;
					data.push({
						primaryKey: row.primaryKey,
						key: row.key,
						value: {
							key: isValueExist && Array.isArray(row.value[0].KeyValues) && !!row.value[0].KeyValues.length ? (row.value[0] as any).PrimaryKey : undefined,
							label: isValueExist ? getTitle((row.value[0] as any).KeyValues) : '',
							metadata: {
								ColumnGuids: layouItem.ColumnGuids,
								DataModelGuid: dataMdoel.ReferenceDataModelGuid,
							},
							rowData: isValueExist ? row.value[0].KeyValues as KeyValueViewModel<string, Object>[] : [],
						}

					})
				});
			}

			else {
				data.push({
					primaryKey: undefined,
					key: undefined,
					value: {
						key: undefined,
						label: '',
						metadata: {
							ColumnGuids: layouItem.ColumnGuids,
							DataModelGuid: dataMdoel.ReferenceDataModelGuid,
						},
						rowData: [],
					}

				})
			}

			return data;
		}

		const getRows = () => {
			return rows.map(row => {
				return {
					Key: row?.primaryKey,
					Value: row?.value
				}
			})
		}

		return {
			formData: getData(),
			row: getRows()
		}
	}

	getField(layoutItemSetup: DataSetup, formData: any, recordKey): RelationItemsOneToOneAggregationFieldValue {
		const key = layoutItemSetup.rowKey;
		const value: SaveRowViewModel[] = [];
		const fieldInFirstLoad = layoutItemSetup.formData?.find(x => x.primaryKey === recordKey)?.value?.key;
		const currenetField = formData[key]?.key;
		const dataIsChanged = !!fieldInFirstLoad && !!currenetField && fieldInFirstLoad !== currenetField;
		const recordIsAddedAndDataIsNull = !fieldInFirstLoad && !currenetField && formData.__status === 'added';
		if ((!fieldInFirstLoad && !!currenetField) || dataIsChanged) {
			value.push({
				KeyValues: formData[key].rowData,
				PrimaryKey: formData[key].key,
				State: RowState.Added
			})
		}

		if ((!!fieldInFirstLoad && !currenetField) || dataIsChanged) {
			value.push({
				KeyValues: [],
				PrimaryKey: layoutItemSetup.row.find(x=>x.Key === recordKey).Value[0].PrimaryKey,
				State: RowState.PhysicalDeleted
			})
		}

		if((!!fieldInFirstLoad && !!currenetField && !dataIsChanged)){
			const initialRow = layoutItemSetup.row.find(x=>x.Key === recordKey).Value[0];
			value.push({
				KeyValues: initialRow.KeyValues,
				PrimaryKey: initialRow.PrimaryKey,
				State: RowState.Unchanged
			})
		}

		if (!!value.length || recordIsAddedAndDataIsNull || (!fieldInFirstLoad && !currenetField && !dataIsChanged)) {
			return {
				Key: key,
				Value: !!value.length ? value : []
			} as RelationItemsOneToOneAggregationFieldValue
		}


	}
}

class OneToManyAggregationHelper extends RelationItemsHelper<ArchivalRowItemModel, OneToManyAggregationRowAndFormData, RelationItemsOneToManyAggregationFieldValue> {
	type = RelationType.OneToMany;
	nature = RelationNature.Aggregation;

	setField(rows: ArchivalRowItemModel[], layouItem: LayoutItemReferenceViewModel, dataMdoel): OneToManyAggregationRowAndFormData {
		const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
			const itemDesign = JSON.parse(layouItem.Design);
			const values: object[] = keyValues.map((column) => column.Value);
			const { ReferenceTokenContainerColumnsConfige } = itemDesign;
			const seperableCharachter = ReferenceTokenContainerColumnsConfige?.SeperableCharachter ?? ',' ;

			return (values).join(seperableCharachter);
		}

		const getData = () => {
			const data: TokenContainerFormData[] = [];
			const changedData = (value) => {
				return value.map(item => {
					return {
						id: item.PrimaryKey,
						title: getTitle(item.KeyValues),
						rowData: item.KeyValues,
					}
				})
			}
			if (!!rows.length) {
				rows.forEach(row => {
					data.push({
						value: {
							metadata: {
								ColumnGuids: layouItem.ColumnGuids,
								DataModelGuid: dataMdoel.ReferenceDataModelGuid,
							},
							tokens: !!(row.value as KeyValueViewModel<string, Object>[]).length ? changedData(row.value) : [],
							key: row.key,
						},
						primaryKey: row.primaryKey,
						key: row.key,
					})
				});
				return data
			}

			else {
				data.push({
					value: {
						metadata: {
							ColumnGuids: layouItem.ColumnGuids,
							DataModelGuid: dataMdoel.ReferenceDataModelGuid,
						},
						tokens: [],
						key: undefined,
					},
					primaryKey: undefined,
					key: undefined,
				});
				return data
			}
		}

		const getRows = () => {
			return rows.map(row => {
				return {
					Key: row?.primaryKey,
					Value: row?.value
				}
			})
		}
		return {
			formData: getData(),
			row: getRows()
		}
	}

	getField(layoutItemSetup: DataSetup, formData, recordKey): RelationItemsOneToManyAggregationFieldValue {
		const key = layoutItemSetup.rowKey;
		const value = this.getValues(layoutItemSetup, formData, recordKey);
		const fieldIsInFirstLoad = layoutItemSetup.formData?.find(x => x.primaryKey === recordKey)?.value?.key;
		const currenetField = formData[key]?.key;
		const recordIsAddedAndDataIsNull = !fieldIsInFirstLoad && !currenetField && formData.__status === 'added';
		if (!!value.length || recordIsAddedAndDataIsNull) {
			return {
				Key: key,
				Value: !!value.length ? value : []
			} as RelationItemsOneToOneAggregationFieldValue
		}
	}

	private getValues(layoutItemSetup: DataSetup, formData, recordKey): SaveRowViewModel[] {
		let data: SaveRowViewModel[] = [];

		const tokensOfFormData = formData[layoutItemSetup.rowKey];
		let addedTokens = !!tokensOfFormData ? [...tokensOfFormData.tokens] : [];

		const checkTokenExistInFormData = (primaryKey) => {
			return tokensOfFormData?.tokens?.find(item => item.id === primaryKey);
		}

		const existRecord = layoutItemSetup.row.find(x => x.Key === recordKey);
		if (!!existRecord) {
			existRecord.Value.forEach(item => {
				const tokenExist = checkTokenExistInFormData(item.PrimaryKey);
				if (!!tokenExist) {
					const oldToken = addedTokens.findIndex(x => x.id === item.PrimaryKey)
					addedTokens.splice(oldToken, 1);
					data.push({
						KeyValues: item.KeyValues,
						PrimaryKey: item.PrimaryKey,
						State: RowState.Unchanged
					})
				}
				else {
					data.push({
						KeyValues: [],
						PrimaryKey: item.PrimaryKey,
						State: RowState.PhysicalDeleted
					})
				}
			})
		}

		addedTokens.forEach(item => {
			data.push({
				KeyValues: item.rowData,
				PrimaryKey: item.id,
				State: RowState.Added
			})
		});

		return data
	}

}

