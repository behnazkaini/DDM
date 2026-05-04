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
import { IWidgetFactory, DataSetup, ISetupData, SetupDataProps, ArchivalRowItemModel } from "../../../../typings/Core.DynamicDataModel/Types";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";

type RelationRowAndFormData = OneToOneAggregationRowAndFormData | OneToManyAggregationRowAndFormData;

type AutoCompleteExFormData = {
  primaryKey: string;
  key: string;
  value: {
    label: string;
    key: string;
    rowData: KeyValueViewModel<string, Object>[];
    metadata: {
      ColumnGuids: string[];
      DataModelGuid: string;
    };
  };
};

type TokenContainerFormData = {
  tokens: {
    id: string;
    title: string;
    rowData: KeyValueViewModel<string, Object>[];
  }[];
  metadata: {
    ColumnGuids: string[];
    DataModelGuid: string;
  };
};

interface OneToOneAggregationRowAndFormData {
  formData: AutoCompleteExFormData[];
  row?: any;
}

interface OneToManyAggregationRowAndFormData {
  formData: TokenContainerFormData[];
  row?: any;
}

interface ColumnDataViewModel {
  formData: ArchivalRowItemModel[];
}

export default class SetupData implements ISetupData {
  currentLayout: LayoutViewModel;
  widgetFactory: IWidgetFactory;
  initialData: LayoutValueResponseViewModel;
  setupDataHelperList;
  data: DataSetup[];
  constructor({ widgetFactory, initialData, currentLayout }: SetupDataProps<LayoutValueResponseViewModel>) {
    this.currentLayout = currentLayout;
    this.widgetFactory = widgetFactory;
    this.initialData = initialData as LayoutValueResponseViewModel;

    this.setupDataHelperList = [new ColumnItemHelper(this.widgetFactory), new RelationItemHelper(this.widgetFactory)];
    this.data = this.getSetupData();
  }

  private getSetupData(): DataSetup[] {
    const data = [];
    this.getAllLayoutItemsExceptGroups().forEach((layoutItem) => {
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
        ...this.setRowAndFormData(rowKey, layoutItem, dataModel),
      });
    });
    return data;
  }

  private getAllLayoutItemsExceptGroups() {
    return this.currentLayout.Items.filter((x) => x.Type !== LayoutItemType.NoneBindable);
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
      let rows = [];
      this.initialData.Rows?.forEach((item) => {
        const keyValue = item.KeyValues.find((keyValue) => keyValue.Key === rowKey);
        keyValue && rows.push({ primaryKey: item.PrimaryKey, key: keyValue.Key, value: keyValue.Value });
      });
      return rows;
    };
    const rows = rowsData();
    if (!!rows) {
      return { ...helper.setRowAndFormData(rows, layoutItem, dataModel) };
    }
    return {
      row: undefined,
      formData: undefined,
    };
  }

  private getHelper(type: LayoutItemType) {
    return this.setupDataHelperList.find((x) => x.type === type);
  }
}

abstract class SetupDataHelper<ILayoutItemViewModel, ISetterRowAndFormData> {
  widgetFactory: IWidgetFactory;

  constructor(widgetFactory: IWidgetFactory) {
    this.widgetFactory = widgetFactory;
  }
  abstract type: LayoutItemType;
  abstract getRowKey(layoutItem: ILayoutItemViewModel): string;
  abstract getDataModel(layoutItem: ILayoutItemViewModel);
  abstract setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ISetterRowAndFormData;
}

class ColumnItemHelper extends SetupDataHelper<LayoutItemColumnViewModel, ColumnDataViewModel> {
  type = LayoutItemType.Column;

  getRowKey(layoutItem: LayoutItemColumnViewModel): string {
    return layoutItem.ColumnGuid;
  }

  getDataModel(layoutItem: LayoutItemColumnViewModel) {
    return this.widgetFactory.getDetailOfDataModel(layoutItem) as ColumnViewModel;
  }

  setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel): ColumnDataViewModel {
    return {
      formData: rows,
    };
  }
}

class RelationItemHelper extends SetupDataHelper<LayoutItemReferenceViewModel, RelationRowAndFormData> {
  relationDataModelHlper;
  constructor(widgetFactory) {
    super(widgetFactory);
    this.relationDataModelHlper = [new OneToOneAggregationHelper(this.widgetFactory), new OneToManyAggregationHelper(this.widgetFactory)];
  }
  type = LayoutItemType.Reference;

  getRowKey(layoutItem: LayoutItemReferenceViewModel): string {
    return layoutItem.RelationGuid;
  }

  getDataModel(layoutItem: LayoutItemReferenceViewModel) {
    return this.widgetFactory.getDetailOfDataModel(layoutItem) as RelationViewModel;
  }

  setRowAndFormData(rows: ArchivalRowItemModel[], layoutItem: LayoutItemViewModel, dataModel: RelationViewModel) {
    const helper = this.relationDataModelHlper.find((x) => x.type === dataModel.Type && x.nature === dataModel.Nature);
    return helper.setField(rows, layoutItem, dataModel);
  }
}

abstract class RelationItemsHelper<IRowViewModel, ISetterField> {
  widgetFactory: IWidgetFactory;
  initialData: LayoutValueResponseViewModel;
  currentLayout;
  constructor(widgetFactory, initialData?, currentLayout?) {
    this.widgetFactory = widgetFactory;
    this.initialData = initialData;
    this.currentLayout = currentLayout;
  }
  abstract setField(rows: IRowViewModel[], layouItem: LayoutItemViewModel, dataMdoel: RelationViewModel): ISetterField;
}

class OneToOneAggregationHelper extends RelationItemsHelper<ArchivalRowItemModel, OneToOneAggregationRowAndFormData> {
  type = RelationType.OneToOne;
  nature = RelationNature.Aggregation;

  setField(rows: ArchivalRowItemModel[], layouItem: LayoutItemReferenceViewModel, dataMdoel: RelationViewModel): OneToOneAggregationRowAndFormData {
    const data: AutoCompleteExFormData[] = [];
    const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
      const itemDesign = JSON.parse(layouItem.Design);
      const values: object[] = keyValues.map((column) => column.Value);
      const { ReferenceAutoCompleteColumnsConfige } = itemDesign;
      const seperableCharachter = ReferenceAutoCompleteColumnsConfige?.SeperableCharachter ?? ",";

      return values.join(seperableCharachter);
    };
    const getData = () => {
      const data: AutoCompleteExFormData[] = [];

      rows?.forEach((row) => {
        const isValueExist = !!row?.value && !!(row.value as KeyValueViewModel<string, Object>[]).length;
        data.push({
          primaryKey: row.primaryKey,
          key: row.key,
          value: {
            key: isValueExist && Array.isArray(row.value[0].KeyValues) && !!row.value[0].KeyValues.length ? (row.value[0] as any).PrimaryKey : undefined,
            label: isValueExist ? getTitle((row.value[0] as any).KeyValues) : "",
            metadata: {
              ColumnGuids: layouItem.ColumnGuids,
              DataModelGuid: dataMdoel.ReferenceDataModelGuid,
            },
            rowData: isValueExist ? (row.value[0].KeyValues as KeyValueViewModel<string, Object>[]) : [],
          },
        });
      });

      return data;
    };

    return {
      formData: getData(),
    };
  }
}

class OneToManyAggregationHelper extends RelationItemsHelper<ArchivalRowItemModel, OneToManyAggregationRowAndFormData> {
  type = RelationType.OneToMany;
  nature = RelationNature.Aggregation;

  setField(rows: ArchivalRowItemModel[], layouItem: LayoutItemReferenceViewModel, dataMdoel): OneToManyAggregationRowAndFormData {
    const getTitle = (keyValues: KeyValueViewModel<string, Object>[]) => {
      const itemDesign = JSON.parse(layouItem.Design);
      const values: object[] = keyValues.map((column) => column.Value);
      const { ReferenceTokenContainerColumnsConfige } = itemDesign;
      const seperableCharachter = ReferenceTokenContainerColumnsConfige?.SeperableCharachter ?? ",";

      return values.join(seperableCharachter);
    };

    const getData = () => {
      const data = [];
      const changedData = (value) => {
        return value.map((item) => {
          return {
            id: item.PrimaryKey,
            title: getTitle(item.KeyValues),
            rowData: item.KeyValues,
          };
        });
      };
      rows?.forEach((row) => {
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
        });
      });
      return data;
    };

    return {
      formData: getData(),
    };
  }
}
