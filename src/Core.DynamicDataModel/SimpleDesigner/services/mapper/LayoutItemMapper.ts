import { LayoutItemColumnDesignerViewModel, LayoutItemColumnSetting, LayoutItemColumnSimpleDesignerViewModel, LayoutItemDesignerViewModel, LayoutItemNonBindableDesignerViewModel, LayoutItemNonBindableSimpleDesignerViewModel, LayoutItemReferenceDesignerViewModel, LayoutItemReferenceSimpleDesignerViewModel, SubLayoutItemDesignerViewModel, SubLayoutItemSimpleDesignerViewModel } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { SaveLayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemColumnViewModel";
import { SaveLayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemReferenceViewModel";
import { SaveLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";
import { SaveSubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveSubLayoutItemViewModel";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { convertDataTypeToDesignerVersion2WidgetType } from "../../../../Core.DynamicDataModel/Widget/WidgetFactory";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { getRelationCandidatesType } from "../../../../Core.DynamicDataModel/TS/Widgets";

export default class LayoutItemMapper {
    mappers: ItemMapper<LayoutItemViewModel, LayoutItemDesignerViewModel, SaveLayoutItemViewModel>[] = [
        new ItemGroupMapper(),
        new ItemColumnMapper(),
        new ItemReferenceMapper(),
        new SubLayoutItemMapper()
    ]

    public toSaveViewModels(items: LayoutItemDesignerViewModel[]): SaveLayoutItemViewModel[] {
        return this.toSaveItemViewModels(items, null);
    }

    private toSaveItemViewModels(items: LayoutItemDesignerViewModel[], parentGuid: string): SaveLayoutItemViewModel[] {
        let saveItems: SaveLayoutItemViewModel[] = [];
        let orderIndex = 0;
        items.filter(x => x.ParentGuid === parentGuid).forEach(item => {
            const mappedItem = this.mappers.find(x => x.type == item.Type).toSaveViewModel(item, ++orderIndex);
            saveItems = [
                ...saveItems,
                mappedItem,
                ...this.toSaveItemViewModels(items, item.Guid)
            ];
        });
        return saveItems;
    }

    public toDesignerViewModels(items: LayoutItemViewModel[], dataModelGuid: string, dataModels: DataModelViewModel[]): LayoutItemDesignerViewModel[] {
        return items.map(item => {
            const mapper = this.mappers.find(mapper => mapper.type === item.Type);
            return mapper.toDesingerViewModel(item, dataModelGuid, dataModels);
        });
    }
}

abstract class ItemMapper<TViewModel extends LayoutItemViewModel, TDesignerViewModel extends LayoutItemDesignerViewModel, TSaveViewModel extends SaveLayoutItemViewModel>
{
    public abstract type: LayoutItemType;

    public abstract toSaveViewModel(item: TDesignerViewModel, orderIndex: number): TSaveViewModel;

    public abstract toDesingerViewModel(item: TViewModel, dataModelGuid: string, dataModel: DataModelViewModel[]): TDesignerViewModel;
}


class ItemGroupMapper extends ItemMapper<LayoutItemViewModel, LayoutItemNonBindableDesignerViewModel, SaveLayoutItemViewModel>
{
    public type: LayoutItemType = LayoutItemType.NoneBindable;

    public toSaveViewModel(item: LayoutItemNonBindableDesignerViewModel, orderIndex: number): SaveLayoutItemViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            Design: item.Design,
            OrderIndex: orderIndex,
            Type: item.Type
        };
    }

    public toDesingerViewModel(item: LayoutItemViewModel): LayoutItemNonBindableSimpleDesignerViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            Design: item.Design,
            OrderIndex: item.OrderIndex,
            Type: item.Type,
            simpleDesignerData: {
                status: 'notchanged'
            }
        };
    }
}

class ItemColumnMapper extends ItemMapper<LayoutItemColumnViewModel, LayoutItemColumnDesignerViewModel, SaveLayoutItemColumnViewModel>
{
    public type: LayoutItemType = LayoutItemType.Column;

    public toSaveViewModel(item: LayoutItemColumnDesignerViewModel, orderIndex: number): SaveLayoutItemColumnViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            ColumnGuid: item.ColumnGuid,
            Design: item.Design,
            OrderIndex: orderIndex,
            Type: item.Type
        };
    }

    mapDataModelInfoToColumnProperties(dataModelInfo: ColumnViewModel) {
        const { DataType, Bookmark, Guid, Label, Name, Setting } = dataModelInfo;
        return {
            guid: Guid,
            label: Label,
            setting: Setting,
            name: Name,
            dataType: DataType
        }
    }

    public toDesingerViewModel(item: LayoutItemColumnViewModel, dataModelGuid, dataModels: DataModelViewModel[]): LayoutItemColumnSimpleDesignerViewModel {
        const dataModel = dataModels.find(d => d.Guid === dataModelGuid);
        const columnDataModelInfo = dataModel.Columns.find(c => c.Guid === item.ColumnGuid);
        return columnDataModelInfo ? {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            ColumnGuid: item.ColumnGuid,
            Design: item.Design,
            OrderIndex: item.OrderIndex,
            Type: item.Type,
            simpleDesignerData: {
                simpleDesignerWidgetType: convertDataTypeToDesignerVersion2WidgetType(columnDataModelInfo.DataType.toString(), (JSON.parse(item.Design) as LayoutItemColumnSetting).EditWidget.Id.toString()),
                DataModelInfo: this.mapDataModelInfoToColumnProperties(columnDataModelInfo),
                status: 'notchanged'
            }
        } : null;
    }
}


class ItemReferenceMapper extends ItemMapper<LayoutItemReferenceViewModel, LayoutItemReferenceDesignerViewModel, SaveLayoutItemReferenceViewModel>
{
    public type: LayoutItemType = LayoutItemType.Reference

    public toSaveViewModel(item: LayoutItemReferenceDesignerViewModel, orderIndex: number): SaveLayoutItemReferenceViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            Design: item.Design,
            RelationGuid: item.RelationGuid,
            ColumnGuids: item.ColumnGuids,
            OrderIndex: orderIndex,
            Type: item.Type
        };
    }

    public toDesingerViewModel(item: LayoutItemReferenceViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): LayoutItemReferenceSimpleDesignerViewModel {
        const dataModel = dataModels.find(d => d.Guid === dataModelGuid);
        const relationDataModelInfo = dataModel.Relations.find(r => r.Guid === item.RelationGuid);
        const referenceDataModel = dataModels.find(d => d.Guid === relationDataModelInfo.ReferenceDataModelGuid);

        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            RelationGuid: item.RelationGuid,
            ColumnGuids: item.ColumnGuids,
            Design: item.Design,
            OrderIndex: item.OrderIndex,
            Type: item.Type,
            simpleDesignerData: {
                status: 'notchanged',
                relationCandidatesType: getRelationCandidatesType(referenceDataModel),
                DataModelInfo: relationDataModelInfo

            }
        };
    }
}

class SubLayoutItemMapper extends ItemMapper<SubLayoutItemViewModel, SubLayoutItemDesignerViewModel, SaveSubLayoutItemViewModel>
{
    public type: LayoutItemType = LayoutItemType.SubLayout

    public toSaveViewModel(item: SubLayoutItemDesignerViewModel, orderIndex: number): SaveSubLayoutItemViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            Design: "{}",
            RelationGuid: item.RelationGuid,
            SubLayoutGuid: item.SubLayoutGuid,
            OrderIndex: orderIndex,
            Type: item.Type
        };
    }

    public toDesingerViewModel(item: SubLayoutItemViewModel): SubLayoutItemSimpleDesignerViewModel {
        return {
            Guid: item.Guid,
            ParentGuid: item.ParentGuid,
            RelationGuid: item.RelationGuid,
            SubLayoutGuid: item.SubLayoutGuid,
            Design: item.Design,
            OrderIndex: item.OrderIndex,
            Type: item.Type,
            simpleDesignerData: {
                status: 'notchanged',
            }
        };
    }
}