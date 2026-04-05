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
import { ArchiveLayoutDesignerViewModel, DefineArchiveLayoutDesignerViewModel, DefineLayoutDesignerViewModel, InlineArchiveLayoutDesignerViewModel, LayoutViewModelWithState } from "../../../../typings/Core.DynamicDataModel/Types";
import LayoutItemMapper from "./LayoutItemMapper";
import ValidationMapper from "./ValidationMapper";

export default class LayoutMapper {

  mappers: Mapper<LayoutViewModel, LayoutViewModelWithState, AddLayoutViewModel, ModifyLayoutViewModel>[] = [
    new DefineMapper(),
    new ArchiveMapper(),
    new DefineArchiveMapper(),
    new InlineArchiveMapper(),
  ]

  public toDesignerViewModels(
    layouts: LayoutViewModel[]
  ): LayoutViewModelWithState[] {
    return layouts.map(layout => {
      const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
      return mapper.toDesignerViewModel(layout);
    });
  }

  public toSaveViewModel(
    layouts: LayoutViewModelWithState[]
  ): SaveLayoutChangesViewModel {
    return {
      Added: layouts
        .filter((x) => x.State === "Added")
        .map((x) => this.toAddViewModel(x)),
      Modified: layouts
        .filter((x) => x.State === "Modified")
        .map((x) => this.toModifyViewModel(x)),
    };
  }

  private toAddViewModel(layout: LayoutViewModelWithState): AddLayoutViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toAddViewModel(layout);
  }

  private toModifyViewModel(
    layout: LayoutViewModelWithState
  ): ModifyLayoutViewModel {
    const mapper = this.mappers.find(mapper => mapper.type === layout.Type);
    return mapper.toModifyViewModel(layout);
  }
}

abstract class Mapper<TViewModel extends LayoutViewModel, TDesignerViewModel extends LayoutViewModelWithState, TAddViewModel extends AddLayoutViewModel, TModifyViewModel extends ModifyLayoutViewModel>
{
  protected layoutItemMapper = new LayoutItemMapper();
  protected validationMapper = new ValidationMapper();

  abstract type: LayoutType;

  public abstract toDesignerViewModel(viewModel: TViewModel): TDesignerViewModel;

  public abstract toAddViewModel(viewModel: TDesignerViewModel): TAddViewModel;

  public abstract toModifyViewModel(viewModel: TDesignerViewModel): TModifyViewModel;
}

class DefineMapper extends Mapper<DefineLayoutViewModel, DefineLayoutDesignerViewModel, AddDefineLayoutViewModel, ModifyDefineLayoutViewModel>
{
  type = LayoutType.Define;

  public toDesignerViewModel(viewModel: DefineLayoutViewModel): DefineLayoutDesignerViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      State: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items),
      Validations: this.validationMapper.toDesignerViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toDesignerViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: DefineLayoutDesignerViewModel): AddDefineLayoutViewModel {
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

  public toModifyViewModel(viewModel: DefineLayoutDesignerViewModel): ModifyDefineLayoutViewModel {
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

class ArchiveMapper extends Mapper<ArchiveLayoutViewModel, ArchiveLayoutDesignerViewModel, AddArchiveLayoutViewModel, ModifyArchiveLayoutViewModel>
{
  type = LayoutType.Archive;

  public toDesignerViewModel(viewModel: ArchiveLayoutViewModel): ArchiveLayoutDesignerViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      State: "Unchanged",
      Type: viewModel.Type,
      IsDefault: viewModel.IsDefault,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items),
      Plugins: viewModel.Plugins,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: ArchiveLayoutDesignerViewModel): AddArchiveLayoutViewModel {
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

  public toModifyViewModel(viewModel: ArchiveLayoutDesignerViewModel): ModifyArchiveLayoutViewModel {
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

class DefineArchiveMapper extends Mapper<DefineArchiveLayoutViewModel, DefineArchiveLayoutDesignerViewModel, AddDefineArchiveLayoutViewModel, ModifyDefineArchiveLayoutViewModel>
{
  type = LayoutType.DefineArchive;

  public toDesignerViewModel(viewModel: DefineArchiveLayoutViewModel): DefineArchiveLayoutDesignerViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      State: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items),
      DefineLayoutGuid: viewModel.DefineLayoutGuid,
      Plugins: viewModel.Plugins,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: DefineArchiveLayoutDesignerViewModel): AddDefineArchiveLayoutViewModel {
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

  public toModifyViewModel(viewModel: DefineArchiveLayoutDesignerViewModel): ModifyDefineArchiveLayoutViewModel {
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

class InlineArchiveMapper extends Mapper<InlineArchiveLayoutViewModel, InlineArchiveLayoutDesignerViewModel, AddInlineArchiveLayoutViewModel, ModifyInlineArchiveLayoutViewModel>
{
  type = LayoutType.InlineArchive;

  public toDesignerViewModel(viewModel: InlineArchiveLayoutViewModel): InlineArchiveLayoutDesignerViewModel {
    return {
      Guid: viewModel.Guid,
      DataModelGuid: viewModel.DataModelGuid,
      Design: viewModel.Design,
      IsDefault: viewModel.IsDefault,
      Label: viewModel.Label,
      PlatformType: viewModel.PlatformType,
      State: "Unchanged",
      Type: viewModel.Type,
      Items: this.layoutItemMapper.toDesignerViewModels(viewModel.Items),
      Validations: this.validationMapper.toDesignerViewModelSample(viewModel.Validations),
      ComplexValidations: this.validationMapper.toDesignerViewModelComplex(viewModel, viewModel.ComplexValidations),
      Plugins: viewModel.Plugins,
      ShowFormItemLabelInSepratedRow: viewModel.ShowFormItemLabelInSepratedRow
    };
  }

  public toAddViewModel(viewModel: InlineArchiveLayoutDesignerViewModel): AddInlineArchiveLayoutViewModel {
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

  public toModifyViewModel(viewModel: InlineArchiveLayoutDesignerViewModel): ModifyInlineArchiveLayoutViewModel {
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
    Value:typeof plugin.Value === 'string' ? plugin.Value : JSON.stringify(plugin.Value)
  }
}