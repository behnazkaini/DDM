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
import { IWidgetFactory, SetupDataProps, ISetupData, DataSetup, RelationItemsOneToManyAggregationFieldValue, RelationItemsOneToOneAggregationFieldValue, ColumnItemsFieldValue, InitialArchiveFormDataType } from '../../../../typings/Core.DynamicDataModel/Types'
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { DefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";

type RelationRowAndFormData =
  OneToOneAggregationRowAndFormData |
  OneToManyAggregationRowAndFormData;

interface RowItemModel {
  primaryKey: string;
  key: string;
  value: any,
  state?: string
}

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
      rowData: KeyValueViewModel<string, Object>[],
    }[];
    metadata: {
      ColumnGuids: string[];
      DataModelGuid: string;
    },
    key: string;

  },
  row: any
}

interface OneToOneAggregationRowAndFormData {
  formData: AutoCompleteExFormData[],
  row?: any
}

interface OneToManyAggregationRowAndFormData {
  formData: TokenContainerFormData[],
  row?: any
}

interface ColumnDataViewModel {
  formData: RowItemModel[]
}

export default class SetupData<T = LayoutValueResponseViewModel> implements ISetupData {
  currentLayout: LayoutViewModel;
  widgetFactory: IWidgetFactory;
  initialData: InitialArchiveFormDataType<T>;
  setupDataHelperList;
  data: DataSetup[];
  defineLayout: LayoutViewModel;

  constructor({ widgetFactory, initialData, currentLayout }: SetupDataProps<T>) {
    this.currentLayout = currentLayout;
    this.widgetFactory = widgetFactory;
    this.initialData = initialData as InitialArchiveFormDataType<T>;
    this.defineLayout = (initialData as any)?.Layouts.filter(layout => layout.Guid === (currentLayout as DefineArchiveLayoutViewModel).DefineLayoutGuid)?.[0]

    this.setupDataHelperList = [
      new ColumnItemHelper(this.widgetFactory),
      new RelationItemHelper(this.widgetFactory),
    ];
    this.data = this.getSetupData()
  }

  getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string) {
    const helper = this.getHelper(layoutItemSetup.layoutItemType);
    return helper.getFieldValue(layoutItemSetup, formData, recordKey)
  }

  getLayoutItem(layoutItemGuid:string){
    return this.widgetFactory.getLayoutItem(layoutItemGuid)
  }

  convertSaveRowViewModelToDataTable(columnData: DataSetup, keyValue: KeyValueViewModel<string, Object>, Guid: string) {
    const layoutItem = this.widgetFactory.getLayoutItem(columnData.layoutItemGuid);
    const dataModel = this.getDataModel(layoutItem);
    const helper = this.getHelper(layoutItem.Type);

    const rows = [{ primaryKey: Guid, key: keyValue.Key, value: keyValue.Value }]
    return helper.setRowAndFormData(rows, layoutItem, dataModel).formData[0].value
  }

  convertDataTableToSaveRowViewModel(layoutItemSetup: DataSetup, record, recordKey: string, mode) {
    const helper = this.getHelper(layoutItemSetup.layoutItemType);
    const fieldValue = helper.getSaveViewModel(layoutItemSetup, record, recordKey);
    return fieldValue

  }

  private getSetupData(): DataSetup[] {
    const data = []
    const getAll=this.getAllLayoutItemsExceptGroups().filter(item=>item.Type === LayoutItemType.Column || item.Type === LayoutItemType.Reference );
    getAll.forEach(layoutItem => {
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
        ...this.setRowAndFormData(rowKey, layoutItem, dataModel)
      })
    });
    return data;
  }
  

  private getAllLayoutItemsExceptGroups() {
    const allLayoutItems = this.currentLayout.Items.filter(x => x.Type !== LayoutItemType.NoneBindable);
    if (this.defineLayout) {
      const items = this.defineLayout?.Items?.filter(x => x.Type !== LayoutItemType.NoneBindable);
      if (items) {
        const existingColumnGuids = new Set(allLayoutItems.map((item:any) => item.ColumnGuid));
        
        items.forEach((item:any) => {
          if (!existingColumnGuids.has(item.ColumnGuid)) {
            allLayoutItems.push(item);
            existingColumnGuids.add(item.ColumnGuid);
          }
        });
      }
    }
    return allLayoutItems;
  }

  private getRowKeyByLayoutItemType(layoutItem, type: LayoutItemType) {
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
      let rows: RowItemModel[] = [];
      this.initialData.Rows?.forEach(item => {
        if (item.hasOwnProperty('State')) {
          if ((item as SaveRowViewModel).State !== RowState.Deleted) {
            const keyValue = item.KeyValues.find(keyValue => keyValue.Key === rowKey);
            rows.push({ primaryKey: item.PrimaryKey, key: keyValue?.Key ?? undefined, value: keyValue?.Value ?? undefined, state: (item as any).State });
          }
        }
        else {
          const keyValue = item.KeyValues.find(keyValue => keyValue.Key === rowKey);
          rows.push({ primaryKey: item.PrimaryKey, key: keyValue.Key, value: keyValue.Value, state: undefined });
        }
      });
      return rows
    }
    const rows = rowsData();
    if (!!rows) {
      return { ...helper.setRowAndFormData(rows, layoutItem, dataModel) }
    }
    return {
      row: undefined,
      formData: undefined,
    }

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
  abstract setRowAndFormData(rows: RowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ISetterRowAndFormData;
  abstract getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string): IFieldValue
  abstract getSaveViewModel(layoutItemSetup: DataSetup, formData, recordKey: string): IFieldValue

}

class ColumnItemHelper extends SetupDataHelper<LayoutItemColumnViewModel, ColumnItemsFieldValue, ColumnDataViewModel> {
  type = LayoutItemType.Column;

  getRowKey(layoutItem: LayoutItemColumnViewModel): string {
    return layoutItem.ColumnGuid;
  }

  getDataModel(layoutItem: LayoutItemColumnViewModel) {
    return (this.widgetFactory.getDetailOfDataModel(layoutItem) as ColumnViewModel);
  }

  setRowAndFormData(rows: RowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ColumnDataViewModel {
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

  getSaveViewModel(layoutItemSetup: DataSetup, record: Object, recordKey): ColumnItemsFieldValue {
    const key = layoutItemSetup.rowKey;
    return {
      Key: key,
      Value: record[key]
    }
  }


}

class RelationItemHelper extends SetupDataHelper<LayoutItemReferenceViewModel, any, RelationRowAndFormData> {
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

  setRowAndFormData(rows: RowItemModel[], layoutItem: LayoutItemViewModel, dataModel: RelationViewModel) {
    const helper = this.relationDataModelHlper.find(x => x.type === dataModel.Type && x.nature === dataModel.Nature);
    return helper.setField(rows, layoutItem, dataModel);
  }

  getFieldValue(layoutItemSetup: DataSetup, formData, recordKey: string) {
    const helper = this.relationDataModelHlper.find(x => x.type === layoutItemSetup.dataModelType && x.nature === layoutItemSetup.dataModelNature);
    return helper.getField(layoutItemSetup, formData, recordKey);
  }

  getSaveViewModel(layoutItemSetup: DataSetup, record, recordKey: string) {
    const helper = this.relationDataModelHlper.find(x => x.type === layoutItemSetup.dataModelType && x.nature === layoutItemSetup.dataModelNature);
    return helper.getSaveViewModelField(layoutItemSetup, record, recordKey);
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
  abstract getSaveViewModelField(layoutItemSetup: DataSetup, formData, recordKey: string): IGetterField
}

class OneToOneAggregationHelper extends RelationItemsHelper<RowItemModel, OneToOneAggregationRowAndFormData, RelationItemsOneToOneAggregationFieldValue> {
  type = RelationType.OneToOne;
  nature = RelationNature.Aggregation;

  setField(rows: RowItemModel[], layoutItem: LayoutItemReferenceViewModel, dataMdoel: RelationViewModel): OneToOneAggregationRowAndFormData {
    const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
      const itemDesign = JSON.parse(layoutItem.Design);
      const values: object[] = keyValues.map((column) => column.Value);
      const { ReferenceAutoCompleteColumnsConfige } = itemDesign;
      const seperableCharachter = ReferenceAutoCompleteColumnsConfige?.SeperableCharachter ?? ',';

      return (values).join(seperableCharachter);
    }

    const getData = () => {
      const data: AutoCompleteExFormData[] = [];

      rows?.forEach(row => {
        const isValueExist = !!row?.value && !!(row.value as KeyValueViewModel<string, Object>[]).length;
        data.push({
          primaryKey: row.primaryKey,
          key: row.key,
          value: {
            key: isValueExist && Array.isArray(row.value[0].KeyValues) && !!row.value[0].KeyValues.length ? (row.value[0] as any).PrimaryKey : undefined,
            label: isValueExist ? getTitle((row.value[0] as any).KeyValues) : '',
            metadata: {
              ColumnGuids: layoutItem.ColumnGuids,
              DataModelGuid: dataMdoel.ReferenceDataModelGuid,
            },
            rowData: isValueExist ? row.value[0].KeyValues as KeyValueViewModel<string, Object>[] : [],
          }
        })
      });

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
    const fieldInFirstLoad = layoutItemSetup.formData?.find(x => x.primaryKey === recordKey)?.value?.key;
    const currenetField = formData[key]?.key;
    const dataIsChanged = !!fieldInFirstLoad && !!currenetField && fieldInFirstLoad !== currenetField;
    const recordIsAddedAndDataIsNull = !fieldInFirstLoad && !currenetField && formData.__status === 'added';
    const value: SaveRowViewModel[] = [];

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
        PrimaryKey: layoutItemSetup.row.find(x => x.Key === recordKey).Value[0].PrimaryKey,
        State: RowState.PhysicalDeleted
      })
    }

    if (!!fieldInFirstLoad && !!currenetField && !dataIsChanged) {
      const initialRow = layoutItemSetup.row.find(x => x.Key === recordKey).Value[0];
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

  getSaveViewModelField(layoutItemSetup: DataSetup, record: any, recordKey): RelationItemsOneToOneAggregationFieldValue {
    return this.getField(layoutItemSetup, record, recordKey)
  }
}

class OneToManyAggregationHelper extends RelationItemsHelper<RowItemModel, OneToManyAggregationRowAndFormData, RelationItemsOneToManyAggregationFieldValue> {
  type = RelationType.OneToMany;
  nature = RelationNature.Aggregation;

  setField(rows: RowItemModel[], layouItem: LayoutItemReferenceViewModel, dataMdoel): OneToManyAggregationRowAndFormData {
    const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
      const itemDesign = JSON.parse(layouItem.Design);
      const values: object[] = keyValues.map((column) => column.Value);
      const { ReferenceTokenContainerColumnsConfige } = itemDesign;
      const seperableCharachter = ReferenceTokenContainerColumnsConfige?.SeperableCharachter ?? ',';

      return (values).join(seperableCharachter);
    }

    const getData = () => {
      const data: TokenContainerFormData[] = [];
      const changedData = (value) => {
        const result = [];
        value.forEach(item => {
          if (item.State !== RowState.PhysicalDeleted) {
            result.push({
              id: item.PrimaryKey,
              title: getTitle(item.KeyValues),
              rowData: item.KeyValues,
            })
          }
        });
        return result
      }
      rows?.forEach(row => {
        data.push({
          value: {
            metadata: {
              ColumnGuids: layouItem.ColumnGuids,
              DataModelGuid: dataMdoel.ReferenceDataModelGuid,
            },
            tokens: !!row.value.length ? changedData(row.value) : [],
            key: row.key,
          },
          primaryKey: row.primaryKey,
          key: row.key,
          row: {
            Key: row.key,
            Value: row.value
          }
        })
      });
      return data
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
    return {
      Key: key,
      Value: (!!value.length || recordIsAddedAndDataIsNull) ? value : []
    } as RelationItemsOneToOneAggregationFieldValue
  }

  getSaveViewModelField(layoutItemSetup: DataSetup, record, recordKey): RelationItemsOneToManyAggregationFieldValue {
    return this.getField(layoutItemSetup, record, recordKey)
  }

  private getValues(layoutItemSetup: DataSetup, formData, recordKey): SaveRowViewModel[] {
    let data: SaveRowViewModel[] = [];
    const existRecord = layoutItemSetup.row.find(x => x.Key === recordKey);
    const tokensOfFormData = formData[layoutItemSetup.rowKey];
    let addedTokens = !!tokensOfFormData ? [...tokensOfFormData.tokens] : [];

    const checkTokenExistInFormData = (primaryKey) => {
      return tokensOfFormData?.tokens?.find(item => item.id === primaryKey);
    }

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

