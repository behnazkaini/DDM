import { LayoutItemColumnDesignerViewModel, LayoutItemColumnSetting, LayoutItemColumnSimpleDesignerViewModel, LayoutItemDesignerViewModel, LayoutItemNonBindableDesignerViewModel, LayoutItemReferenceDesignerViewModel, SubLayoutItemDesignerViewModel } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { SaveLayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemColumnViewModel";
import { SaveLayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemReferenceViewModel";
import { SaveLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutItemViewModel";
import { SaveSubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveSubLayoutItemViewModel";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";

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
    const filterItems = items.filter(x => x.ParentGuid === parentGuid).sort((a, b) => a.OrderIndex - b.OrderIndex);
    filterItems.forEach(item => {
      const mappedItem = this.mappers.find(x => x.type == item.Type).toSaveViewModel(item, ++orderIndex);
      saveItems = [
        ...saveItems,
        mappedItem,
        ...this.toSaveItemViewModels(items, item.Guid)
      ];
    });
    return saveItems;
  }

  public toDesignerViewModels(items: LayoutItemViewModel[]): LayoutItemDesignerViewModel[] {
    const filterItems = items.filter(i => i.Type !== LayoutItemType.Others)
    return filterItems.map(item => {
      const mapper = this.mappers.find(mapper => mapper.type === item.Type);
      return mapper.toDesingerViewModel(item);
    });
  }
}

abstract class ItemMapper<TViewModel extends LayoutItemViewModel, TDesignerViewModel extends LayoutItemDesignerViewModel, TSaveViewModel extends SaveLayoutItemViewModel> {
  public abstract type: LayoutItemType;

  public abstract toSaveViewModel(item: TDesignerViewModel, orderIndex: number): TSaveViewModel;

  public abstract toDesingerViewModel(item: TViewModel): TDesignerViewModel;

}


class ItemGroupMapper extends ItemMapper<LayoutItemViewModel, LayoutItemNonBindableDesignerViewModel, SaveLayoutItemViewModel> {
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

  public toDesingerViewModel(item: LayoutItemViewModel): LayoutItemNonBindableDesignerViewModel {
    return {
      Guid: item.Guid,
      ParentGuid: item.ParentGuid,
      Design: item.Design,
      OrderIndex: item.OrderIndex,
      Type: item.Type
    };
  }
}

class ItemColumnMapper extends ItemMapper<LayoutItemColumnViewModel, LayoutItemColumnDesignerViewModel, SaveLayoutItemColumnViewModel> {
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

  public toDesingerViewModel(item: LayoutItemColumnViewModel): LayoutItemColumnDesignerViewModel {
    return {
      Guid: item.Guid,
      ParentGuid: item.ParentGuid,
      ColumnGuid: item.ColumnGuid,
      Design: item.Design,
      OrderIndex: item.OrderIndex,
      Type: item.Type
    };
  }


}

class ItemReferenceMapper extends ItemMapper<LayoutItemReferenceViewModel, LayoutItemReferenceDesignerViewModel, SaveLayoutItemReferenceViewModel> {
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

  public toDesingerViewModel(item: LayoutItemReferenceViewModel): LayoutItemReferenceDesignerViewModel {
    return {
      Guid: item.Guid,
      ParentGuid: item.ParentGuid,
      RelationGuid: item.RelationGuid,
      ColumnGuids: item.ColumnGuids,
      Design: item.Design,
      OrderIndex: item.OrderIndex,
      Type: item.Type
    };
  }
}

class SubLayoutItemMapper extends ItemMapper<SubLayoutItemViewModel, SubLayoutItemDesignerViewModel, SaveSubLayoutItemViewModel> {
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

  public toDesingerViewModel(item: SubLayoutItemViewModel): SubLayoutItemDesignerViewModel {
    return {
      Guid: item.Guid,
      ParentGuid: item.ParentGuid,
      RelationGuid: item.RelationGuid,
      SubLayoutGuid: item.SubLayoutGuid,
      Design: item.Design,
      OrderIndex: item.OrderIndex,
      Type: item.Type
    };
  }
}