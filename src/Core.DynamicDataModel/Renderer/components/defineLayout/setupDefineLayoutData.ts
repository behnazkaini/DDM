import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutValueByPrimaryKeyResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueByPrimaryKeyResponseViewModel";
import { RelationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { RowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModel";
import { KeyValueViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import { RelationNature } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import {
  IWidgetFactory,
  DataSetup,
  ISetupData,
  SetupDataProps,
  ColumnItemsFieldValue,
  RelationItemsOneToManyAggregationFieldValue,
  RelationItemsOneToOneAggregationFieldValue,
  RelationItemsOneToManyCompositionFieldValue,
  LayoutItemsActionsOnEvent,
  LayoutItemNoneBindableSetting,
  RichLayoutItem,
} from '../../../../typings/Core.DynamicDataModel/Types';
import LayoutManager from "../../../LayoutManager";
import { NoneBindableTypeId } from "../../../../typings/Core.DynamicDataModel/Enums";
import { guid } from 'didgah/common';

type RelationRowAndFormData =
  OneToOneAggregationRowAndFormData |
  OneToManyAggregationRowAndFormData;

interface ColumnRowAndFormData {
  row: KeyValueViewModel<string, Object>,
  formData: Object
}

type AutoCompleteExFormData = {
  key: string;
  label: string;
  rowData: KeyValueViewModel<string, Object>[]
  metadata: {
    ColumnGuids: string[];
    DataModelGuid: string;
  }
}

type TokenContainerFormData = {
  tokens: {
    id: string;
    title: string;
    rowData: KeyValueViewModel<string, Object>[]
  }[];
  metadata: {
    ColumnGuids: string[];
    DataModelGuid: string;
  }
}

interface OneToOneAggregationRowAndFormData {
  row: {
    Key: string,
    Value: RowViewModel<any>[]
  };
  formData: AutoCompleteExFormData;
  formItemInitialValue: {
    key: string;
    label: string
  } | undefined
}

interface OneToManyAggregationRowAndFormData {
  row: {
    Key: string,
    Value: RowViewModel<any>[]
  };
  formData: TokenContainerFormData,
  formItemInitialValue: {
    tokens: {
      id: string;
      title: string;
      rowData: KeyValueViewModel<string, Object>[]
    }[]
  } | undefined
}

interface OneToManyCompositionRowAndFormData {
  row: {
    Key: string,
    Value: RowViewModel<any>[]
  };
  formData: Object[]
}

interface OneToOneAggregationRowDataModel {
  Key: string;
  Value: RowViewModel<any>[]
}

interface OneToManyAggregationRowDataModel {
  Key: string;
  Value: RowViewModel<any>[]
}

interface OneToManyCompositionRowDataModel extends OneToManyAggregationRowDataModel { }


export default class SetupData implements ISetupData {
  currentLayout: LayoutViewModel;
  widgetFactory: IWidgetFactory;
  initialData: LayoutValueByPrimaryKeyResponseViewModel;
  setupDataHelperList;
  data: DataSetup[];
  events: LayoutItemsActionsOnEvent[];
  layoutManager: LayoutManager
  constructor({ widgetFactory, initialData, currentLayout, events }: SetupDataProps<LayoutValueByPrimaryKeyResponseViewModel>) {
    this.currentLayout = currentLayout;
    this.widgetFactory = widgetFactory;
    this.initialData = initialData as LayoutValueByPrimaryKeyResponseViewModel;
    this.events = events;
    this.setupDataHelperList = [
      new NonBindableItemHelper(this.widgetFactory),
      new ColumnItemHelper(this.widgetFactory),
      new RelationItemHelper(this.widgetFactory),
      new SublayoutItemHelper(this.widgetFactory, this.initialData, this.currentLayout),
    ];
    this.data = this.getSetupData();
  }

  getFieldValue(layoutItemSetup: DataSetup, formData, rowKey: string, dataModel: RelationViewModel) {
    const helper = this.getHelper(layoutItemSetup.layoutItemType);
    return helper.getFieldValue(layoutItemSetup, formData, rowKey, dataModel)
  }

  setEvents(layoutItem: LayoutItemViewModel) {
    const eventsForLayoutItem = this.events?.filter(event => event.layoutItemGuid === layoutItem.Guid);
    const setActions = () => {
      let computedActions = [];
      eventsForLayoutItem.forEach(event => {
        computedActions = [...computedActions, ...event.actions]
      });
      return computedActions;
    }

    if (eventsForLayoutItem?.length > 1) {
      return {
        layoutItemGuid: layoutItem.Guid,
        eventId: eventsForLayoutItem[0].eventId,
        actions: setActions()
      } as LayoutItemsActionsOnEvent
    }
    else {
      return eventsForLayoutItem?.length ? eventsForLayoutItem[0] : eventsForLayoutItem
    }
  }

  getSetupData(): DataSetup[] {
    const data: DataSetup[] = [];
    this.getAllLayoutItemsExceptGroups().forEach(layoutItem => {
      const rowKey = this.getRowKeyByLayoutItemType(layoutItem, layoutItem.Type);
      let dataModel, dataModelType, dataModelNature, referenceDataModelGuid;
      if (this.widgetFactory.isSimpleDesignerMode) {
        if ((layoutItem as RichLayoutItem).Type === LayoutItemType.Column || (layoutItem as RichLayoutItem).Type === LayoutItemType.Reference) {
          const { Type, Nature, ReferenceDataModelGuid } = (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo;
          dataModelType = Type;
          dataModelNature = Nature;
          referenceDataModelGuid = ReferenceDataModelGuid;
        }
      } else {
        dataModel = this.getDataModel(layoutItem);
        dataModelType = dataModel?.Type;
        dataModelNature = dataModel?.Nature;
        referenceDataModelGuid = dataModel?.ReferenceDataModelGuid;
      }
      data.push({
        layoutItemGuid: layoutItem.Guid,
        layoutItemType: layoutItem.Type,
        subLayoutGuid: layoutItem.Type === LayoutItemType.SubLayout ? (layoutItem as SubLayoutItemViewModel).SubLayoutGuid : undefined,
        rowKey,
        dataModelType: dataModelType,
        dataModelGuid: referenceDataModelGuid,
        dataModelNature: dataModelNature,
        event: this.setEvents(layoutItem),
        ...this.setRowAndFormData(rowKey, layoutItem, dataModel)
      })
    });
    return data;
  }

  private getAllLayoutItemsExceptGroups() {
    return this.currentLayout.Items.filter(item => {
      if (item.Type === LayoutItemType.NoneBindable) {
        return (this.widgetFactory.getLayoutItemSettingByType(item) as LayoutItemNoneBindableSetting).Widget.Id === NoneBindableTypeId.HelpBlock;
      } else if (item.Type === LayoutItemType.Hidden) {
        return false
      }
      else {
        return true
      }
    })
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
    const row = this.initialData.Row?.KeyValues.find(row => row.Key === rowKey);
    return { ...helper.setRowAndFormData(row, layoutItem, dataModel) }
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
  abstract setRowAndFormData(row: KeyValueViewModel<string, Object>, layoutItem: LayoutItemViewModel, dataModel): ISetterRowAndFormData;
  abstract getFieldValue(layoutItemSetup: DataSetup, formData: any, rowKey: string, dataModel: RelationViewModel): IFieldValue
}

class NonBindableItemHelper extends SetupDataHelper<LayoutItemColumnViewModel, ColumnItemsFieldValue, ColumnRowAndFormData> {
  type = LayoutItemType.NoneBindable;

  getRowKey(layoutItem: LayoutItemColumnViewModel): string {
    return layoutItem.Guid;
  }

  getDataModel() {
    return;
  }

  setRowAndFormData(row: KeyValueViewModel<string, Object>, layoutItem: LayoutItemViewModel, dataModel): ColumnRowAndFormData {
    return {
      row: undefined,
      formData: undefined,
    }
  }

  getFieldValue(layoutItemSetup: DataSetup, formData: Object): ColumnItemsFieldValue {
    return
  }

}

class ColumnItemHelper extends SetupDataHelper<LayoutItemColumnViewModel, ColumnItemsFieldValue, ColumnRowAndFormData> {
  type = LayoutItemType.Column;

  getRowKey(layoutItem: LayoutItemColumnViewModel): string {

    return layoutItem.ColumnGuid;
  }

  getDataModel() {
    return;
  }

  setRowAndFormData(row: KeyValueViewModel<string, Object>, layoutItem: LayoutItemViewModel, dataModel): ColumnRowAndFormData {
    return {
      row: { Key: row?.Key, Value: row?.Value },
      formData: row?.Value,
    }
  }

  getFieldValue(layoutItemSetup: DataSetup, formData: Object): ColumnItemsFieldValue {
    const key = layoutItemSetup.rowKey;
    return {
      Key: key,
      Value: formData[key] ?? null
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
      new OneToOneCompositionHelper(this.widgetFactory),
      new OneToManyCompositionHelper(this.widgetFactory),

    ];
  }
  type = LayoutItemType.Reference;

  getRowKey(layoutItem: LayoutItemReferenceViewModel): string {
    return layoutItem.RelationGuid;
  }

  getDataModel(layoutItem: LayoutItemReferenceViewModel) {
    return (this.widgetFactory.getDetailOfDataModel(layoutItem) as RelationViewModel);
  }

  setRowAndFormData(row: KeyValueViewModel<string, Object>, layoutItem: LayoutItemViewModel, dataModel: RelationViewModel) {

    let helper;
    if (this.widgetFactory.isSimpleDesignerMode) {
      helper = this.relationDataModelHlper.find(x => x.type === (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.Type && x.nature === (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.Nature);
    } else {
      helper = this.relationDataModelHlper.find(x => x.type === dataModel.Type && x.nature === dataModel.Nature);
    }
    return helper.setField(row, layoutItem, dataModel);
  }

  getFieldValue(layoutItemSetup: DataSetup, formData: any, rowKey: string, dataModel: RelationViewModel) {
    const helper = this.relationDataModelHlper.find(x => x.type === layoutItemSetup.dataModelType && x.nature === layoutItemSetup.dataModelNature);
    return helper.getField(layoutItemSetup, formData, rowKey, dataModel);
  }

}

class SublayoutItemHelper extends SetupDataHelper<any, any, any> {
  type = LayoutItemType.SubLayout;
  relationDataModelHlper;
  constructor(widgetFactory, initialData, currentLayout) {
    super(widgetFactory);
    this.relationDataModelHlper = [
      new OneToOneAggregationHelper(this.widgetFactory, initialData, currentLayout),
      new OneToManyAggregationHelper(this.widgetFactory, initialData, currentLayout),
      new OneToOneCompositionHelper(this.widgetFactory, initialData, currentLayout),
      new OneToManyCompositionHelper(this.widgetFactory, initialData, currentLayout),

    ];
  }
  getRowKey(layoutItem: any): string {
    return layoutItem.RelationGuid;;
  }

  getDataModel(layoutItem: any) {
    return (this.widgetFactory.getDetailOfDataModel(layoutItem) as RelationViewModel);
  }

  setRowAndFormData(row: KeyValueViewModel<string, Object>, layoutItem: RichLayoutItem, dataModel: RelationViewModel) {
    let helper;
    if (this.widgetFactory.isSimpleDesignerMode) {
      helper = this.relationDataModelHlper.find(x => x.type === RelationType.OneToMany && x.nature === RelationNature.Composition);
    } else {
      helper = this.relationDataModelHlper.find(x => x.type === dataModel.Type && x.nature === dataModel.Nature);
    }
    return helper.setField(row, layoutItem, dataModel);
  }

  getFieldValue(layoutItemSetup: DataSetup, formData) {
    const helper = this.relationDataModelHlper.find(x => x.type === layoutItemSetup.dataModelType && x.nature === layoutItemSetup.dataModelNature);
    return helper.getField(layoutItemSetup, formData);
  }

}

abstract class RelationItemsHelper<IRowViewModel, ISetterField, IGetterField> {
  widgetFactory: IWidgetFactory;
  initialData: LayoutValueByPrimaryKeyResponseViewModel;
  currentLayout
  constructor(widgetFactory, initialData?, currentLayout?) {
    this.widgetFactory = widgetFactory;
    this.initialData = initialData;
    this.currentLayout = currentLayout
  }
  abstract setField(row: IRowViewModel, layouItem: LayoutItemViewModel, dataMdoel: RelationViewModel): ISetterField;

  abstract getField(layoutItemSetup: DataSetup, formData, rowKey: string, dataModel: RelationViewModel): IGetterField;

}

class OneToOneAggregationHelper extends RelationItemsHelper<OneToOneAggregationRowDataModel, OneToOneAggregationRowAndFormData, RelationItemsOneToOneAggregationFieldValue> {
  type = RelationType.OneToOne;
  nature = RelationNature.Aggregation;

  setField(row: OneToOneAggregationRowDataModel, layouItem: LayoutItemReferenceViewModel, dataMdoel: RelationViewModel): OneToOneAggregationRowAndFormData & { variableGuid: string, dataModel: any } {
    {
      const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
        const itemDesign = JSON.parse(layouItem.Design);
        const values: object[] = keyValues.map((column) => column.Value);
        const { ReferenceAutoCompleteColumnsConfige } = itemDesign;
        const seperableCharachter = ReferenceAutoCompleteColumnsConfige?.SeperableCharachter ?? ',';

        return (values).join(seperableCharachter);
      }

      const isValueExist = !!row?.Value && !!row.Value.length;
      const computedKey = isValueExist && Array.isArray(row.Value[0].KeyValues) && !!row.Value[0].KeyValues.length ? row.Value[0].PrimaryKey : '';
      const computedLabel = isValueExist ? getTitle(row.Value[0].KeyValues) : ''
      return {
        formData: {
          key: computedKey,
          label: computedLabel,
          rowData: isValueExist ? row.Value[0].KeyValues : [],
          metadata: {
            ColumnGuids: layouItem.ColumnGuids,
            DataModelGuid: this.widgetFactory.isSimpleDesignerMode ? (layouItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid : dataMdoel.ReferenceDataModelGuid,
          }
        },
        row: {
          Key: row?.Key,
          Value: row?.Value
        },
        formItemInitialValue: computedKey !== '' ? {
          key: computedKey,
          label: computedLabel,
        } : undefined,
        variableGuid: dataMdoel.VariableGuid,
        dataModel: dataMdoel
      }
    }
  }

  getField(layoutItemSetup: DataSetup, formData: AutoCompleteExFormData, rowKey: string, dataModel: RelationViewModel): RelationItemsOneToOneAggregationFieldValue {
    const softwareDataModel = this.widgetFactory.RelationInSoftwareModel(dataModel.ReferenceDataModelGuid);
    const getCurrenetField = (key: string, formData: AutoCompleteExFormData) => {
      return formData[key]?.key
    }

    const getRowData = (key: string, formData: AutoCompleteExFormData) => {
      return formData[key]?.rowData;
    }

    const key = layoutItemSetup.rowKey;
    const value: SaveRowViewModel[] = [];
    const fieldInFirstLoad = layoutItemSetup.formData?.key;
    const currenetField = getCurrenetField(key, formData);

    const dataIsChanged = fieldInFirstLoad && currenetField && JSON.stringify(layoutItemSetup.formData) !== JSON.stringify(formData[key])

    if ((!fieldInFirstLoad && !!currenetField) || dataIsChanged) {
      value.push({
        KeyValues: getRowData(key, formData),
        PrimaryKey: formData[key].key,
        State: RowState.Added
      })
    }

    if ((!!fieldInFirstLoad && !currenetField) || dataIsChanged) {
      value.push({
        KeyValues: [],
        PrimaryKey: layoutItemSetup.row.Value[0].PrimaryKey,
        State: RowState.PhysicalDeleted
      })
    }

    if (!!fieldInFirstLoad && !!currenetField && !dataIsChanged) {
      value.push({
        KeyValues: layoutItemSetup.formData.rowData,
        PrimaryKey: layoutItemSetup.row.Value[0].PrimaryKey,
        State: RowState.Unchanged
      })
    }
    if (!!value.length) {
      return {
        Key: key,
        Value: value
      } as RelationItemsOneToOneAggregationFieldValue
    }
    return;
  }
}

class OneToManyAggregationHelper extends RelationItemsHelper<OneToManyAggregationRowDataModel, OneToManyAggregationRowAndFormData, RelationItemsOneToManyAggregationFieldValue> {
  type = RelationType.OneToMany;
  nature = RelationNature.Aggregation;

  setField(row: OneToManyAggregationRowDataModel, layouItem: LayoutItemReferenceViewModel, dataMdoel): OneToManyAggregationRowAndFormData & { variableGuid: string, dataModel?: any } {
    const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
      const itemDesign = JSON.parse(layouItem.Design);
      const values: object[] = keyValues.map((column) => column.Value);
      const { ReferenceTokenContainerColumnsConfige } = itemDesign;
      const seperableCharachter = ReferenceTokenContainerColumnsConfige?.SeperableCharachter ?? ',';

      return (values).join(seperableCharachter);
    }

    const changedData = () => {
      const result = [];
      row?.Value?.forEach(value => {
        if (Array.isArray(value.KeyValues) && !!value.KeyValues.length) {
          result.push({
            id: value.PrimaryKey,
            title: getTitle(value.KeyValues),
            rowData: value.KeyValues,
          })
        }
      });
      return result
    }

    return {
      formData: {
        metadata: {
          ColumnGuids: layouItem.ColumnGuids,
          DataModelGuid: this.widgetFactory.isSimpleDesignerMode ? (layouItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid : dataMdoel.ReferenceDataModelGuid,
        },
        tokens: !!row ? changedData() : []
      },
      row: {
        Key: row?.Key,
        Value: row?.Value
      },
      formItemInitialValue: !!row && row.Value.length > 0 ? { tokens: changedData() } : undefined,
      variableGuid: dataMdoel.VariableGuid,
      dataModel: dataMdoel
    }
  }

  getField(layoutItemSetup: DataSetup, formData, rowKey: string, dataModel: RelationViewModel): RelationItemsOneToManyAggregationFieldValue {
    const key = layoutItemSetup.rowKey;
    const value = this.getValues(layoutItemSetup, formData);
    if (!!value.length) {
      return {
        Key: key,
        Value: value
      } as RelationItemsOneToManyAggregationFieldValue
    }
  }

  private getValues(layoutItemSetup: DataSetup, formData): SaveRowViewModel[] {
    let data: SaveRowViewModel[] = [];

    const tokensOfFormData = formData[layoutItemSetup.rowKey] as TokenContainerFormData;
    let addedTokens = [...tokensOfFormData?.tokens ?? []];

    const checkTokenExistInFormData = (primaryKey) => {
      return tokensOfFormData?.tokens?.find(item => item.id === primaryKey);
    }

    layoutItemSetup.row.Value?.forEach(item => {
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

    addedTokens.forEach(item => {
      data.push({
        KeyValues: item.rowData,
        PrimaryKey: item.id,
        State: RowState.Added
      })
    })


    return data
  }
}

class OneToOneCompositionHelper extends RelationItemsHelper<any, any, any> {
  type = RelationType.OneToOne;
  nature = RelationNature.Composition;

  setField(row: OneToManyCompositionRowDataModel, layoutItem: LayoutItemReferenceViewModel, dataModel: RelationViewModel) {
    const recordData = (keyValues) => {
      const data = {}
      keyValues.forEach(keyValue => {
        data[keyValue.Key] = keyValue.Value
      });
      return data
    }
    const formData = row?.Value.map(value => {
      return {
        Guid: value.PrimaryKey,
        ...recordData(value.KeyValues)
      }
    });

    return {
      formData: !!row ? formData : undefined,
      row: {
        Key: row?.Key,
        Value: row?.Value
      }
    }
  }

  getField(layoutItemSetup: DataSetup, formData): RelationItemsOneToManyCompositionFieldValue {
    const key = layoutItemSetup.rowKey;
    const value = this.getValues(layoutItemSetup, formData);
    if (!!value.length) {
      return {
        Key: key,
        Value: value
      } as RelationItemsOneToManyCompositionFieldValue
    }
  }

  private getValues(layoutItemSetup: DataSetup, formData): SaveRowViewModel[] {
    let data: SaveRowViewModel[] = [];

    const subLayoutGuid = (this.widgetFactory.getLayoutItem(layoutItemSetup.layoutItemGuid) as SubLayoutItemViewModel).SubLayoutGuid;
    const layout = this.initialData.Layouts.find(x => x.Guid === subLayoutGuid);
    const dataTableOfFormData = formData[layoutItemSetup.rowKey] as TokenContainerFormData;

    if (layout.Type === LayoutType.Archive) {
      data = [];
    }

    return data
  }
}

class OneToManyCompositionHelper extends RelationItemsHelper<OneToManyCompositionRowDataModel, OneToManyCompositionRowAndFormData, RelationItemsOneToManyCompositionFieldValue> {
  type = RelationType.OneToMany;
  nature = RelationNature.Composition;


  setField(row: OneToManyCompositionRowDataModel, layouItem: LayoutItemReferenceViewModel, dataModel: RelationViewModel) {
    const recordData = (keyValues) => {
      const data = {}
      keyValues.forEach(keyValue => {
        data[keyValue.Key] = keyValue.Value
      });
      return data
    }
    const formData = row?.Value.map(value => {
      return {
        Guid: value.PrimaryKey,
        ...recordData(value.KeyValues)
      }
    });
    return {
      formData: !!row ? formData : undefined,
      row: {
        Key: row?.Key,
        Value: row?.Value
      }
    }
  }

  getField(layoutItemSetup: DataSetup, formData): RelationItemsOneToManyCompositionFieldValue {
    const key = layoutItemSetup.rowKey;
    const value = this.getValues(layoutItemSetup, formData);
    if (!!value.length) {
      return {
        Key: key,
        Value: value
      } as RelationItemsOneToManyCompositionFieldValue
    }
  }

  private getValues(layoutItemSetup: DataSetup, formData): SaveRowViewModel[] {
    let data: SaveRowViewModel[] = [];

    const subLayoutGuid = (this.widgetFactory.getLayoutItem(layoutItemSetup.layoutItemGuid) as SubLayoutItemViewModel).SubLayoutGuid;
    const layout = this.initialData.Layouts.find(x => x.Guid === subLayoutGuid);
    const dataTableOfFormData = formData[layoutItemSetup.rowKey] as TokenContainerFormData;

    if (layout.Type === LayoutType.Archive) {
      data = [];
    }

    // data.push({
    // 	KeyValues: item.KeyValues,
    // 	PrimaryKey: item.PrimaryKey,
    // 	State: RowState.PhysicalDeleted
    // })

    return data
  }


}
