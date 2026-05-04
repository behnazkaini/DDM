import { LayoutPluginViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutPluginViewModel";
import { SaveLayoutPluginViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";
import { AddArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddArchiveLayoutViewModel";
import { AddDefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddDefineArchiveLayoutViewModel";
import { AddDefineLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddDefineLayoutViewModel";
import { AddInlineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddInlineArchiveLayoutViewModel";
import { AddLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddLayoutViewModel";
import { ArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ArchiveLayoutViewModel";
import { DefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { DefineLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import { InlineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { ModifyArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyArchiveLayoutViewModel";
import { ModifyDefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyDefineArchiveLayoutViewModel";
import { ModifyDefineLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyDefineLayoutViewModel";
import { ModifyInlineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyInlineArchiveLayoutViewModel";
import { ModifyLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyLayoutViewModel";
import { SaveLayoutChangesViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutChangesViewModel";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ArchiveLayoutDesignerViewModel, DefineArchiveLayoutDesignerViewModel, DefineLayoutDesignerViewModel, InlineArchiveLayoutDesignerViewModel, LayoutItemDesignerViewModel, SimpleDesignerLayoutViewModelWithState, RichLayoutItem, DefineArchiveLayoutSimpleDesignerViewModel, InlineArchiveLayoutSimpleDesignerViewModel, ArchiveLayoutSimpleDesignerViewModel, DefineLayoutSimpleDesignerViewModel } from "../../../../typings/Core.DynamicDataModel/Types";
import LayoutItemMapper from "./LayoutItemMapper";
import ValidationMapper from "./ValidationMapper";
import { AddDataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddDataModelViewModel";
import { ModifyDataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ModifyDataModelViewModel";
import { SaveDataModelChangesViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveDataModelChangesViewModel";
import { DataModelType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { AddRelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddRelationViewModel";
import { getDefaultDataTypeSetting } from "../../../../Core.DynamicDataModel/TS/Validations";

function toColumnViewModel(item: RichLayoutItem): ColumnViewModel {
  const { dataType, bookmark, name, label, setting, guid,bookmarkType } = item.simpleDesignerData.DataModelInfo;
  return {
    Guid: guid,
    Label: label,
    Name: name,
    Bookmark: bookmark,
    DataType: dataType,
    Setting: JSON.stringify(setting ? setting : getDefaultDataTypeSetting(dataType)),
    BookmarkType:bookmarkType
  }
} 

function toRelationViewModel(item: RichLayoutItem): RelationViewModel {
  const { Type, Nature, bookmark, Name, label, RelationGuid, ReferenceDataModelGuid,bookmarkType } = item.simpleDesignerData.DataModelInfo;

  return {
    Guid: RelationGuid,
    Bookmark: 'bookmark',
    Label: 'label',
    Name: 'Name',
    Nature,
    ReferenceDataModelGuid,
    Type,
    BookmarkType:bookmarkType,
    Settings:[]
  }
}
export default class LayoutMapper {

  dataModels: DataModelViewModel[];
  dataModelGuid: string;
  softwareGuid: string;
  scopeGuid: string;
  mappers: Mapper<LayoutViewModel, SimpleDesignerLayoutViewModelWithState, AddLayoutViewModel, ModifyLayoutViewModel>[];
  constructor({ dataModelGuid = null, dataModels = [], softwareGuid, scopeGuid}) {
    this.dataModelGuid = dataModelGuid;
    this.dataModels = dataModels;
    this.softwareGuid = softwareGuid;
    this.scopeGuid = scopeGuid;
    this.mappers = [
      new DefineMapper(),
      new ArchiveMapper(),
      new DefineArchiveMapper(),
      new InlineArchiveMapper(),
    ]
  }

  public toDesignerViewModels(
    layouts: LayoutViewModel[]
  ): SimpleDesignerLayoutViewModelWithState[] {
    return layouts.map(layout => {
      const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
      return mapper.toDesignerViewModel(layout, layout.DataModelGuid, this.dataModels);
    });
  }

  public toSaveViewModel(
    layouts: SimpleDesignerLayoutViewModelWithState[], predefinedDataModelGuids: string[]
  ): SaveLayoutChangesViewModel {
    const Added = [];
    const Modified = [];
    for (let layout of layouts) {
        if (layout.SimpleDesignerLayoutState === "Added") {
          Added.push(layout);
        }
 
        if (layout.SimpleDesignerLayoutState === "Modified" ) {
          Modified.push(layout);
        }
      }
    return {
      Added: Added
        .map((x) => this.toAddViewModel(x)),
      Modified: Modified
        .map((x) => this.toModifyViewModel(x)),
    };
  }

  public toDataModelSaveViewModel(
    layouts: SimpleDesignerLayoutViewModelWithState[],
    predefinedDataModelGuid: string
  ): SaveDataModelChangesViewModel {
    return {
      Added: layouts
        .filter((x) => x.SimpleDesignerDataModelState === "Added")
        .map((x) => this.toDataModelAddViewModel(x)),
      Modified: layouts
        .filter((x) => x.SimpleDesignerDataModelState === "Modified")
        .map((x) => this.toDataModelModifyViewModel(x)),
    };
  }

  private toDataModelAddViewModel(layout: SimpleDesignerLayoutViewModelWithState): AddDataModelViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toDataModelAddViewModel(layout, this.softwareGuid, this.scopeGuid);
  }

  private toDataModelModifyViewModel(
    layout: SimpleDesignerLayoutViewModelWithState
  ): ModifyDataModelViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toDataModelModifyViewModel(layout);
  }

  private toAddViewModel(layout: SimpleDesignerLayoutViewModelWithState): AddLayoutViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toAddViewModel(layout);
  }

  private toModifyViewModel(
    layout: SimpleDesignerLayoutViewModelWithState
  ): ModifyLayoutViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toModifyViewModel(layout);
  }
}

abstract class Mapper<TViewModel extends LayoutViewModel, TDesignerViewModel extends SimpleDesignerLayoutViewModelWithState, TAddViewModel extends AddLayoutViewModel, TModifyViewModel extends ModifyLayoutViewModel>
{
  protected layoutItemMapper = new LayoutItemMapper();
  protected validationMapper = new ValidationMapper();

  abstract type: LayoutType;

  public abstract toDesignerViewModel(viewModel: TViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): TDesignerViewModel;
  public abstract toAddViewModel(viewModel: TDesignerViewModel): TAddViewModel;

  public abstract toModifyViewModel(viewModel: TDesignerViewModel): TModifyViewModel;

  public abstract toDataModelAddViewModel(viewModel: TDesignerViewModel, softwareGuid, scopeGuid): AddDataModelViewModel;
  public abstract toDataModelModifyViewModel(viewModel: TDesignerViewModel): ModifyDataModelViewModel;

}

class DefineMapper extends Mapper<DefineLayoutViewModel, DefineLayoutSimpleDesignerViewModel, AddDefineLayoutViewModel, ModifyDefineLayoutViewModel>
{
  type = LayoutType.Define;
  public toDataModelAddViewModel(viewModel: DefineLayoutSimpleDesignerViewModel, softwareGuid, scopeGuid): AddDataModelViewModel {
    const { Name, Bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      SoftwareGuid: softwareGuid,
      ScopeGuid: scopeGuid,
      Type: DataModelType.Dynamic,
      Label: Name,
      Name: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column).map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout)).map(toRelationViewModel)
    };
  }

  public toDataModelModifyViewModel(viewModel: DefineLayoutSimpleDesignerViewModel): ModifyDataModelViewModel {
    const { scopeGuid, Name, bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      Label: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toRelationViewModel),
      ModifiedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toColumnViewModel),
      ModifiedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toRelationViewModel)
    };
  }

  public toDesignerViewModel(viewModel: DefineLayoutViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): DefineLayoutSimpleDesignerViewModel {
    const dataModel = dataModels.find(d => d.Guid === dataModelGuid);
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      SimpleDesignerDataModelState: "Unchanged",
      SimpleDesignerLayoutState: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items, dataModelGuid, dataModels),
      Validations: this.validationMapper.toDesignerViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toDesignerViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins,
      DataModelInfo: dataModel,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: DefineLayoutSimpleDesignerViewModel): AddDefineLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Validations: this.validationMapper.toSaveViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toSaveViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toModifyViewModel(viewModel: DefineLayoutSimpleDesignerViewModel): ModifyDefineLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Validations: this.validationMapper.toSaveViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toSaveViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }
}

class ArchiveMapper extends Mapper<ArchiveLayoutViewModel, ArchiveLayoutSimpleDesignerViewModel, AddArchiveLayoutViewModel, ModifyArchiveLayoutViewModel>
{
  public toDataModelModifyViewModel(viewModel: ArchiveLayoutSimpleDesignerViewModel): ModifyDataModelViewModel {
    const { scopeGuid, Name, Bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      Label: Name,
      AddedColumns: viewModel.Items.filter(item => LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toColumnViewModel),
      ModifiedColumns: viewModel.Items.filter(item => LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toColumnViewModel),
      ModifiedRelations: [],
      AddedRelations: []
    };  }
  public toDataModelAddViewModel(viewModel: ArchiveLayoutSimpleDesignerViewModel, softwareGuid, scopeGuid): AddDataModelViewModel {
    const { Name, Bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      SoftwareGuid: softwareGuid,
      ScopeGuid: scopeGuid,
      Type: DataModelType.Dynamic,
      Label: Name,
      Name: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column).map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => item.Type === LayoutItemType.Reference).map(toRelationViewModel)
    };
  }
  type = LayoutType.Archive;

  public toDesignerViewModel(viewModel: ArchiveLayoutViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): ArchiveLayoutSimpleDesignerViewModel {
    const dataModel = dataModels.find(d => d.Guid === dataModelGuid);

    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      SimpleDesignerDataModelState: "Unchanged",
      SimpleDesignerLayoutState: "Unchanged",
      Type: viewModel.Type,
      IsDefault: viewModel.IsDefault,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items, viewModel.DataModelGuid, dataModels),
      Plugins: viewModel.Plugins,
      DataModelInfo: dataModel,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: ArchiveLayoutSimpleDesignerViewModel): AddArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      Type: viewModel.Type,
      IsDefault: viewModel.IsDefault,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toModifyViewModel(viewModel: ArchiveLayoutSimpleDesignerViewModel): ModifyArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }
}

class DefineArchiveMapper extends Mapper<DefineArchiveLayoutViewModel, DefineArchiveLayoutSimpleDesignerViewModel, AddDefineArchiveLayoutViewModel, ModifyDefineArchiveLayoutViewModel>
{
  type = LayoutType.DefineArchive;
  public toDataModelAddViewModel(viewModel: DefineArchiveLayoutSimpleDesignerViewModel, softwareGuid, scopeGuid): AddDataModelViewModel {
    const { Name, Bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      SoftwareGuid: softwareGuid,
      ScopeGuid: scopeGuid,
      Type: DataModelType.Dynamic,
      Label: Name,
      Name: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column).map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout)).map(toRelationViewModel)
    };
  }

  public toDataModelModifyViewModel(viewModel: DefineArchiveLayoutSimpleDesignerViewModel): ModifyDataModelViewModel {
    const { scopeGuid, Name, bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      Label: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toRelationViewModel),
      ModifiedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toColumnViewModel),
      ModifiedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toRelationViewModel)
    };
  }

  public toDesignerViewModel(viewModel: DefineArchiveLayoutViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): DefineArchiveLayoutSimpleDesignerViewModel {
    const dataModel = dataModels.find(d => d.Guid === dataModelGuid);
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      SimpleDesignerDataModelState: "Unchanged",
      SimpleDesignerLayoutState: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items, dataModelGuid, dataModels),
      DefineLayoutGuid: viewModel.DefineLayoutGuid,
      Plugins: viewModel.Plugins,
      DataModelInfo: dataModel,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: DefineArchiveLayoutSimpleDesignerViewModel): AddDefineArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      DefineLayoutGuid: viewModel.DefineLayoutGuid,
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toModifyViewModel(viewModel: DefineArchiveLayoutSimpleDesignerViewModel): ModifyDefineArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      DefineLayoutGuid: viewModel.DefineLayoutGuid,
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }


}

class InlineArchiveMapper extends Mapper<InlineArchiveLayoutViewModel, InlineArchiveLayoutSimpleDesignerViewModel, AddInlineArchiveLayoutViewModel, ModifyInlineArchiveLayoutViewModel>
{
  type = LayoutType.InlineArchive;
  public toDataModelAddViewModel(viewModel: InlineArchiveLayoutSimpleDesignerViewModel, softwareGuid, scopeGuid
    ): AddDataModelViewModel {
    const {  Name, Bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      SoftwareGuid: softwareGuid ,
      ScopeGuid: scopeGuid,
      Type: DataModelType.Dynamic,
      Label: Name,
      Name: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column).map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout)).map(toRelationViewModel)
    };
  }

  public toDataModelModifyViewModel(viewModel: InlineArchiveLayoutSimpleDesignerViewModel): ModifyDataModelViewModel {
    const { scopeGuid, Name, bookmark } = (viewModel as any).DataModelInfo;
    return {
      Guid: viewModel.DataModelGuid,
      Label: Name,
      AddedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toColumnViewModel),
      AddedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'added').map(toRelationViewModel),
      ModifiedColumns: viewModel.Items.filter(item => item.Type === LayoutItemType.Column && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toColumnViewModel),
      ModifiedRelations: viewModel.Items.filter(item => (item.Type === LayoutItemType.Reference || item.Type === LayoutItemType.SubLayout) && (item as RichLayoutItem).simpleDesignerData.status === 'modified').map(toRelationViewModel)
    };
  }

  public toDesignerViewModel(viewModel: InlineArchiveLayoutViewModel, dataModelGuid: string, dataModels: DataModelViewModel[]): InlineArchiveLayoutSimpleDesignerViewModel {
    const dataModel = dataModels.find(d => d.Guid === dataModelGuid);
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      SimpleDesignerDataModelState: "Unchanged",
      SimpleDesignerLayoutState: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items, dataModelGuid, dataModels),
      Validations: this.validationMapper.toDesignerViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toDesignerViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins,
      DataModelInfo: dataModel,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: InlineArchiveLayoutSimpleDesignerViewModel): AddInlineArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Validations: this.validationMapper.toSaveViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toSaveViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toModifyViewModel(viewModel: InlineArchiveLayoutSimpleDesignerViewModel): ModifyInlineArchiveLayoutViewModel {
    return {
      Guid: viewModel.Guid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toSaveViewModels(viewModel.Items),
      Validations: this.validationMapper.toSaveViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toSaveViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins.map(toSaveLayoutPlugin),
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }
}

function toSaveLayoutPlugin(plugin: LayoutPluginViewModel): SaveLayoutPluginViewModel {
  return {
    Guid: plugin.Guid,
    PluginGuid: plugin.PluginGuid,
    Value: JSON.stringify(plugin.Value)
  }
}