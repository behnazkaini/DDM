import GetEditWidgets from "../Widget/Edit/index";
import GetDisplayWidgets from "../Widget/Display/index";
import GetGroupWidgets from "./NoneBindable/index";
import GetSearchWidgets from "../Widget/Search/index";
import { ColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { DataModelViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutItemColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { LayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutItemType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import {
  DirectionType,
  DisplayWidget,
  EditWidget,
  HelpBlockType,
  WidgetType,
} from "../../typings/Core.DynamicDataModel/Enums";
import {
  ComponentModel,
  IWidget,
  IWidgetFactory,
  LayoutItemColumnSetting,
  LayoutItemReferenceSetting,
  LayoutItemSetting,
  DefaultSetting,
  IGetReferenceDefaultSettingResult,
  ReferenceAutoComplete,
  ReferenceTokenContainer,
  BaseLayoutItemSetting,
  DefaultSettingWidgetById,
  WidgetFactoryConstructor,
  DataModelSetting,
  LayoutItemNoneBindableSetting,
  DefaultValidationByWidgetIdHelperProps,
  getDefaultValidationByWidgetIdProps,
  getInitialDefaultValidationArgs,
  RichLayoutItem,
  ReferenceCheckBoxList,
  ReferenceRadioButton
} from "../../typings/Core.DynamicDataModel/Types";
import {
  FieldTypesWidget,
  ReferenceTypeWidgetProxy,
  Setting,
  WidgetSettingMap,
  NoneBindableWidget,
  EditWidgetInitialValidation,
  ReferenceTypeWidget,
  groupFieldTypesByWidget,
  FieldTypesWidgetToList,
  findWidgetIdBySimpleDesignerWidgetType,
  editWidgetToDefaultDisplay,
} from "../TS/Widgets";
import { guid, translate, utility } from "didgah/common";
import { RelationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemReferenceViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { SubLayoutItemViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { ValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { DefineLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import { InlineArchiveLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { validationRules, dataModelRules } from '../Renderer/components/commonRangeRule';
import { WebSoftwareComponentViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { IWebSoftwareViewModel } from "../SoftwareModels/Staff/types";
import { getSoftwareModelItem } from "../Designer/services/widgetManager";
import { DidgahContextProps, IAppContext } from "didgah/ant-core-component";
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { ValidationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { availableWidgets } from "../SimpleDesigner/hooks/useField";

interface WidgetFactoryHelperConstructor {
  dataModels: Array<DataModelViewModel>;
  dataModelGuid: string;
  layouts: LayoutViewModel[];
  isSimpleDesignerMode: boolean;
}

export class WidgetFactory implements IWidgetFactory {
  layouts: LayoutViewModel[];
  dataModels: Array<DataModelViewModel>;
  softwareModels: Array<WebSoftwareComponentViewModel>;
  rows: any;
  layoutGuid: string;
  dataModelGuid: string;
  widgetFactoryHelpers: WidgetFactoryHelper<LayoutItemSetting, LayoutItemViewModel, ColumnViewModel | RelationViewModel>[];
  context: DidgahContextProps;
  isSimpleDesignerMode: boolean;
  constructor({
    layoutModel,
    layoutGuid,
    dataModelGuid,
    softwareModels = [],
    context,
    isSimpleDesignerMode = false
  }: WidgetFactoryConstructor) {
    this.layouts = layoutModel.Layouts;
    this.dataModels = layoutModel.DataModels;
    this.layoutGuid = layoutGuid;
    this.dataModelGuid = dataModelGuid;
    this.softwareModels = softwareModels;
    this.context = context;
    this.isSimpleDesignerMode = isSimpleDesignerMode;
    const widgetFactoryHelperConstructor = {
      dataModelGuid: this.dataModelGuid,
      dataModels: this.dataModels,
      layouts: this.layouts,
      isSimpleDesignerMode: this.isSimpleDesignerMode
    };

    this.widgetFactoryHelpers = [
      new GroupWidgetFactoryHelper(widgetFactoryHelperConstructor),
      new ColumnWidgetFactoryHelper(widgetFactoryHelperConstructor),
      new ReferenceWidgetFactoryHelper(widgetFactoryHelperConstructor),
      new SubLayoutWidgetFactoryHelper(widgetFactoryHelperConstructor),
    ];
  }

  getLayout() {
    return this.layouts.find((layout) => layout.DataModelGuid.toLowerCase() === this.dataModelGuid.toLowerCase()
      && layout.Guid.toLowerCase() === this.layoutGuid.toLowerCase()
    );
  }

  getLayoutItem(layoutItemGuid: string) {
    return this.getLayout().Items.find((item) => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase());
  }

  getComponentName(layoutItem: LayoutItemViewModel) {
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
    return widgetFactoryHelper.getComponentName(layoutItem, this.softwareModels);
  }

  getComponent(layoutItemGuid: string) {
    const layoutItem = this.getLayoutItem(layoutItemGuid);
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);

    return {
      ...widgetFactoryHelper.getComponent(layoutItem, this.getLayout(), this.softwareModels),
      dataModelSetting: layoutItem.Type === LayoutItemType.Column ? this.getDataModelSetting(layoutItem) : null
    };
  }

  getComponentByMode(layoutItemGuid: string, mode: WidgetType) {
    const layoutItem = this.getLayoutItem(layoutItemGuid);
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
    return {
      ...widgetFactoryHelper.getComponentByMode(layoutItem, this.getLayout(), mode, this.softwareModels),
      dataModelSetting: this.getDataModelSetting(layoutItem)
    };
  }

  getInitialDefaultSetting(setting: DefaultSetting) {
    const widgetFactoryHelper = this.widgetFactoryHelpers.find((x) => x.type === setting.type);
    return widgetFactoryHelper.getInitialDefaultSettingHelper(setting.attribute, setting.settingType, setting.widgetTypes, this.softwareModels, setting.simpleDesignerWidgetType);
  }

  getInitialDefaultValidation({ layoutItemGuid, attributes, type, simpleDesignerWidgetType }: getInitialDefaultValidationArgs) {
    const widgetFactoryHelper = this.widgetFactoryHelpers.find((x) => x.type === type);
    return widgetFactoryHelper.getInitialDefaultValidationHelper(layoutItemGuid, attributes, simpleDesignerWidgetType);
  }

  getDefaultSettingByWidgetId(data: DefaultSettingWidgetById) {
    const widgetFactoryHelper = this.widgetFactoryHelpers.find((x) => x.type === data.layoutItemType);
    return widgetFactoryHelper.getDefaultSettingByWidgetIdHelper(data);
  }

  getDetailOfDataModel(layoutItem: LayoutItemViewModel) {
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
    return widgetFactoryHelper.getDetailOfDataModel(layoutItem);
  }

  getDataModelColumns(layoutItem: LayoutItemViewModel) {
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
    return widgetFactoryHelper.getDataModelColumns(layoutItem);
  }

  getDataModelSetting(layoutItem: LayoutItemViewModel) {
    if (this.isSimpleDesignerMode) {
      return {
        dataType: (layoutItem as RichLayoutItem).simpleDesignerData ? convertDesignerVersion2WidgetTypeToDataType((layoutItem as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : null,
        setting: JSON.stringify({})
      }
    } else {
      const dataModel = this.getDetailOfDataModel(layoutItem) as ColumnViewModel;
      const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
      return widgetFactoryHelper.getDataModelSetting(dataModel);
    }
  }

  getLayoutItemSettingByType(layoutItem: LayoutItemViewModel) {
    const widgetFactoryHelper = this.getWidgetFactoryHelperByType(layoutItem.Type);
    return widgetFactoryHelper.getLayoutItemSettingByType(layoutItem);
  }

  private getWidgetFactoryHelperByType(type: LayoutItemType) {
    return this.widgetFactoryHelpers.find((x) => x.type === type);
  }

  RelationInSoftwareModel(referenceGuid: string): WebSoftwareComponentViewModel {
    return this.softwareModels.find(model => model.DataModelGuid.toLowerCase() === referenceGuid.toLowerCase());
  }

  getDefaultValidationByWidgetId({ layoutItem, widgetType, viewModel, widgetId, simpleDesignerWidgetType }: getDefaultValidationByWidgetIdProps): ValidationViewModel[] {
    const widgetFactoryHelper = this.widgetFactoryHelpers.find((x) => x.type === layoutItem.Type);
    return widgetFactoryHelper.getDefaultValidationByWidgetIdHelper({ widgetType, viewModel, widgetId, layoutItemGuid: layoutItem.Guid, simpleDesignerWidgetType });
  }
}

abstract class WidgetFactoryHelper<TSetting, TLayoutItemViewModel extends LayoutItemViewModel, IViewModel> {

  dataModels: Array<DataModelViewModel>;
  dataModelGuid: string;
  layouts: LayoutViewModel[]
  softwareModel: IWebSoftwareViewModel;
  isSimpleDesignerMode: boolean;
  constructor({ dataModels, dataModelGuid, layouts, isSimpleDesignerMode }: WidgetFactoryHelperConstructor) {
    this.dataModels = dataModels;
    this.dataModelGuid = dataModelGuid;
    this.layouts = layouts;
    this.isSimpleDesignerMode = isSimpleDesignerMode;
  }

  abstract type: LayoutItemType;

  abstract getComponentName(layoutItem: TLayoutItemViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]);//
  abstract getComponentNameByMode(layoutItem: TLayoutItemViewModel, mode: WidgetType, WebSoftwareComponentViewModels?: WebSoftwareComponentViewModel[]);//
  abstract getComponentElement(layoutItemSetting: TSetting, layoutItem?: TLayoutItemViewModel, WebSoftwareComponentViewModels?: WebSoftwareComponentViewModel[], componentName?: string): IWidget;
  abstract getComponentElementByMode(mdoe: WidgetType, componentName: string, layoutItem: TLayoutItemViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]): IWidget;
  abstract getDetailOfDataModel(layoutItem: TLayoutItemViewModel): IViewModel;
  abstract getDefaultSettingByWidgetIdHelper(data: DefaultSettingWidgetById);

  abstract getInitialDefaultSettingHelper(attribute: IViewModel, settingType: LayoutType, widgetTypes: WidgetType[], softwareModels: Array<WebSoftwareComponentViewModel>, simpleDesignerWidgetType?: string);

  abstract getInitialDefaultValidationHelper(layoutItemGuid: string, attribute: any, simpleDesignerWidgetType?: string);
  abstract getDataModelColumns(layoutItem: TLayoutItemViewModel);
  abstract getDataModelSetting(dataModel: ColumnViewModel): DataModelSetting;
  abstract getDefaultValidationByWidgetIdHelper(props: DefaultValidationByWidgetIdHelperProps): ValidationViewModel[];

  getComponent(layoutItem: TLayoutItemViewModel, layout: LayoutViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]): ComponentModel {
    const componentModel: ComponentModel = {
      component: null,
      setting: null,
      rule: null,
      layoutItemType: null,
    };
    let validations: ValidationViewModel[]
    switch (layout.Type) {
      case LayoutType.Define:
        validations = (layout as DefineLayoutViewModel).Validations
      case LayoutType.InlineArchive:
        validations = (layout as InlineArchiveLayoutViewModel).Validations
    }

    const layoutItemSetting = this.getLayoutItemSettingByType(layoutItem);
    const componentName = this.getComponentName(layoutItem, WebSoftwareComponentViewModels);

    componentModel.component = this.getComponentElement(layoutItemSetting, layoutItem, WebSoftwareComponentViewModels, componentName);
    (componentModel as any).setting = layoutItemSetting as TSetting;

    componentModel.layoutItemType = layoutItem.Type;
    let dataType;
    if (this.isSimpleDesignerMode) {
      dataType = layoutItem.Type === LayoutItemType.Column ? convertDesignerVersion2WidgetTypeToDataType((layoutItem as unknown as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : null;
      componentModel.dataModelSetting = { dataType, setting: (layoutItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo?.setting };
    } else {
      componentModel.dataModelSetting = this.getDataModelSetting(this.getDetailOfDataModel(layoutItem) as any);
      dataType = componentModel.dataModelSetting?.dataType;
    }
    const validationsRule = validations?.filter(x => x.LayoutItemGuid === layoutItem.Guid)?.map(validation => {
      validationRules.setting = validation.Setting;
      validationRules.colType = componentModel.dataModelSetting?.dataType;
      return ({ ...validationRules[validation.Type] })
    }) ?? [];

    dataModelRules.setting = componentModel.dataModelSetting;
    dataModelRules.rules = componentModel.rule;
    const getDefaultRules = () => {
      if (dataType && dataModelRules[dataType]) {
        return [dataModelRules[dataType]];

      } else {
        return [];
      }
    }
    componentModel.rule = !!validationsRule.length ? validationsRule : getDefaultRules();
    return componentModel;
  }

  getComponentByMode(layoutItem: TLayoutItemViewModel, layout: LayoutViewModel, mode: WidgetType, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]) {
    const componentModel: ComponentModel = {
      component: null,
      setting: null,
      rule: null,
      layoutItemType: null,
    };
    let validations: ValidationViewModel[]
    switch (layout.Type) {
      case LayoutType.Define:
        validations = (layout as DefineLayoutViewModel).Validations
      case LayoutType.InlineArchive:
        validations = (layout as InlineArchiveLayoutViewModel).Validations
    }

    const layoutItemSetting = this.getLayoutItemSettingByType(layoutItem);
    const componentName = this.getComponentNameByMode(layoutItem, mode, WebSoftwareComponentViewModels);

    componentModel.component = this.getComponentElementByMode(mode, componentName, layoutItem, WebSoftwareComponentViewModels);
    (componentModel as any).setting = layoutItemSetting as TSetting;
    componentModel.layoutItemType = layoutItem.Type;
    if (!!validations) {
      validations.filter(x => x.LayoutItemGuid === layoutItem.Guid)?.forEach(validation => {
        validationRules.setting = validation.Setting;
        validationRules.colType = componentModel.dataModelSetting?.dataType;
        componentModel.rule = { ...componentModel.rule, ...validationRules[validation.Type] }
      });
    }
    if (this.isSimpleDesignerMode) {
      componentModel.dataModelSetting = {
        dataType: (layoutItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo.dataType,
        setting: (layoutItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo.setting
      };
    } else {
      componentModel.dataModelSetting = this.getDataModelSetting(this.getDetailOfDataModel(layoutItem) as any);
    }
    dataModelRules.setting = componentModel.dataModelSetting;
    const computedRules = { ...componentModel.rule, ...dataModelRules[componentModel.dataModelSetting?.dataType] };
    componentModel.rule = Object.keys(computedRules).length !== 0 ? [computedRules] : undefined;

    return componentModel;
  }

  getDatamodel() {
    return this.dataModels.find(
      (dataModel: DataModelViewModel) =>
        dataModel.Guid.toLowerCase() === this.dataModelGuid.toLowerCase()
    );
  }

  getLayoutItemSettingByType(layoutItem: TLayoutItemViewModel) {
    return JSON.parse(layoutItem.Design) as TSetting;
    //return layoutItem.Design as any
  }
}

class GroupWidgetFactoryHelper extends WidgetFactoryHelper<LayoutItemNoneBindableSetting, LayoutItemViewModel, any> {
  type = LayoutItemType.NoneBindable;

  getComponentName(layoutItem: LayoutItemViewModel) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    return NoneBindableWidget[(itemSetting as LayoutItemNoneBindableSetting).Widget.Id];
  }

  getComponentNameByMode(layoutItem: LayoutItemViewModel, mode: WidgetType) {
    return this.getComponentName(layoutItem)
  }

  getComponentElement(layoutItemSetting: LayoutItemNoneBindableSetting, layoutItem: LayoutItemViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[], componentName: string) {
    return GetGroupWidgets(componentName);
  }

  getComponentElementByMode(mode: WidgetType, componentName) {
    return GetGroupWidgets(componentName);
  }

  getDetailOfDataModel(layoutItem: LayoutItemColumnViewModel): ColumnViewModel {
    return null;
  }

  getDefaultSettingByWidgetIdHelper(data: DefaultSettingWidgetById) {
    const { widgetId, settingLayoutType } = data;
    const defaultWidgetName = NoneBindableWidget[widgetId];

    return {
      Widget: {
        Id: widgetId,
      },
      ...this.getDefaultSetting({
        defaultWidgetName,
        settingLayoutType,
      }),
    };
  }

  getInitialDefaultSettingHelper(): BaseLayoutItemSetting {
    return null;
  }

  getDataModelColumns(layoutItem: LayoutItemReferenceViewModel) {
    return []
  }

  getDataModelSetting(dataModel: ColumnViewModel) {
    return null
  }

  private getDefaultSetting(data: {
    defaultWidgetName: string;
    settingLayoutType: LayoutType;
  }) {

    let result: LayoutItemNoneBindableSetting | any = {};
    (WidgetSettingMap[data.defaultWidgetName])[data.settingLayoutType.toString()].forEach((settingName) => {
      switch (settingName) {
        case Setting.HelpBlock:
          result[Setting.HelpBlockClosable] = false;
          result[Setting.HelpBlockShowIcon] = false;
          result[Setting.HelpBlockShowMessage] = false;
          result[Setting.HelpBlockType] = HelpBlockType.info;
          result[Setting.HelpBlockDescription] = translate("Text");
          result[Setting.LabelMutable] = true;
          result[Setting.WrapperCol] = 24;
          result[Setting.WrapperLabel] = 0
          break;
      }
    });

    return { ...result };
  }

  getDefaultValidationByWidgetIdHelper(props: { viewModel: ColumnViewModel | RelationViewModel; widgetType: WidgetType; widgetId: string; }): ValidationViewModel[] {
    throw new Error("Method not implemented.");
  }

  getInitialDefaultValidationHelper(layoutItemGuid: string, attribute: any): ValidationViewModel[] {
    return [];
  }
}

export function convertDesignerVersion2WidgetTypeToDataType(WidgetType: string): number {
  return ColumnDataType[groupFieldTypesByWidget().find(item => item.Widget === WidgetType).FieldTypes[0]]
}

export function convertDataTypeToDesignerVersion2WidgetType(dataType: string, widgetId: string) {
  for (let item in FieldTypesWidget) {
    if (ColumnDataType[FieldTypesWidget[item].Name] === Number(dataType)) {
      return FieldTypesWidget[item].EditWidget[widgetId];
    }
  }
}
class ColumnWidgetFactoryHelper extends WidgetFactoryHelper<LayoutItemColumnSetting, LayoutItemColumnViewModel, ColumnViewModel> {
  type = LayoutItemType.Column;

  getComponentName(layoutItem: LayoutItemColumnViewModel) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    const widgetMode = itemSetting.Widget;
    if (this.isSimpleDesignerMode) {
      return FieldTypesWidget[convertDesignerVersion2WidgetTypeToDataType((layoutItem as unknown as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType)][widgetMode][(itemSetting as LayoutItemColumnSetting)[widgetMode].Id];
    } else {
      const dataModelColumn = this.getDetailOfDataModel(layoutItem);
      const widgetId = widgetMode === WidgetType.DisabledWidget ? (itemSetting as LayoutItemColumnSetting)[WidgetType.EditWidget].Id : (itemSetting as LayoutItemColumnSetting)[widgetMode].Id;
      return FieldTypesWidget[dataModelColumn.DataType][widgetMode][widgetId];
    }
  }

  getComponentNameByMode(layoutItem: LayoutItemColumnViewModel, mode: WidgetType) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    if (this.isSimpleDesignerMode) {
      return FieldTypesWidget[convertDesignerVersion2WidgetTypeToDataType((layoutItem as unknown as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType)][WidgetType[mode]][(itemSetting as LayoutItemColumnSetting)[WidgetType[mode]].Id];
    } else {
      const itemSetting = this.getLayoutItemSettingByType(layoutItem);
      const dataModelColumn = this.getDetailOfDataModel(layoutItem);
      if (!itemSetting[WidgetType[mode]]) {
        return DisplayWidget.UndefinedComponent
      }
      return FieldTypesWidget[dataModelColumn.DataType][WidgetType[mode]][(itemSetting as LayoutItemColumnSetting)[WidgetType[mode]].Id];
    }
  }

  getComponentElement(layoutItemSetting: LayoutItemColumnSetting, layoutItem: LayoutItemColumnViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[], componentName: string): IWidget {
    let element;
    switch (layoutItemSetting.Widget) {
      case WidgetType.EditWidget:
      case WidgetType.DisabledWidget:
        element = GetEditWidgets(componentName);
        break;
      case WidgetType.DisplayWidget:
        element = GetDisplayWidgets(componentName);
        break;
      case WidgetType.SearchWidget:
        element = GetSearchWidgets(componentName);
        break;
      default:
        break;
    }
    return { ...element };
  }

  getComponentElementByMode(mode: WidgetType, componentName: string) {
    let element;
    switch (mode) {
      case WidgetType.EditWidget:
      case WidgetType.DisabledWidget:
        element = GetEditWidgets(componentName);
        break;
      case WidgetType.DisplayWidget:
        element = GetDisplayWidgets(componentName);
        break;
      case WidgetType.SearchWidget:
        element = GetSearchWidgets(componentName);
        break;
      default:
        break;
    }
    return { ...element };
  }

  getDetailOfDataModel(layoutItem: LayoutItemColumnViewModel): ColumnViewModel {
    const dataModelcolumn = this.getDatamodel()?.Columns.find((column) => column.Guid.toLowerCase() === layoutItem.ColumnGuid.toLowerCase());
    return dataModelcolumn;
  }

  getDefaultSettingByWidgetIdHelper(data: DefaultSettingWidgetById) {
    const { widgetId, widgetType, attribute, settingLayoutType, simpleDesignerWidgetType } = data;
    let dataType;
    if (simpleDesignerWidgetType) {
      dataType = convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType);
    } else {
      dataType = (attribute as ColumnViewModel).DataType;
    }
    const defaultWidgetName = FieldTypesWidget[dataType][widgetType][widgetId.toString()];

    return {
      ...this.getDefaultSetting({
        defaultWidgetName,
        attribute: attribute as ColumnViewModel,
        settingLayoutType,
        simpleDesignerWidgetType
      }),
    };
  }

  getInitialDefaultSettingHelper(attribute: ColumnViewModel, settingLayoutType: LayoutType, widgetTypes: WidgetType[] = [WidgetType.DisplayWidget, WidgetType.EditWidget], softwareModels = [], simpleDesignerWidgetType): BaseLayoutItemSetting {
    let result: LayoutItemColumnSetting | any = {};
    let dataType;
    if (simpleDesignerWidgetType) {
      dataType = convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType)
    } else {
      dataType = attribute.DataType
    }
    result.Widget = (settingLayoutType !== LayoutType.Define && settingLayoutType !== LayoutType.InlineArchive) ? WidgetType.DisplayWidget : WidgetType.EditWidget;

    widgetTypes.forEach(widgetType => {
      switch (widgetType) {
        case WidgetType.EditWidget:
          if (simpleDesignerWidgetType) {
            result.EditWidget = { Id: findWidgetIdBySimpleDesignerWidgetType(simpleDesignerWidgetType, 'EditWidget') };
          } else {
            result.EditWidget = { Id: 0 };
          }
          break;
        case WidgetType.DisplayWidget:
          if (simpleDesignerWidgetType) {
            result.DisplayWidget = { Id: findWidgetIdBySimpleDesignerWidgetType(editWidgetToDefaultDisplay[simpleDesignerWidgetType], 'DisplayWidget') };
          } else {
            result.DisplayWidget = { Id: 0 };
          }
          break;
        case WidgetType.SearchWidget:
          result.SearchWidget = { Id: 0 };
          break;
        default: {
          throw new Error(`not supported widgetType ${widgetType}`)
        }
      }
    });

    const defaultWidgetName =
      FieldTypesWidget[dataType][result.Widget][0];

    return {
      ...result,
      ...this.getDefaultSetting({ defaultWidgetName, attribute, settingLayoutType, simpleDesignerWidgetType }),
    };
  }

  getDataModelColumns(layoutItem: LayoutItemColumnViewModel) {
    const viewModels: DataModelViewModel = this.dataModels.find(
      (model) =>
        model.Guid.toLowerCase() === this.dataModelGuid.toLowerCase()
    );

    return viewModels;
  }

  getDataModelSetting(dataModel: ColumnViewModel): DataModelSetting {
    return {
      dataType: dataModel.DataType,
      setting: !!dataModel?.Setting ? JSON.parse(dataModel.Setting) : {}
    }
  }

  private getDefaultSetting(data: {
    defaultWidgetName: string;
    attribute: ColumnViewModel;
    settingLayoutType: LayoutType;
    simpleDesignerWidgetType: string;
  }) {
    let result: LayoutItemColumnSetting | any = {};
    const { settingLayoutType } = data;
    let Label, Name;
    if (this.isSimpleDesignerMode) {
      Label = translate(`DDM_SimpleDesigner_${availableWidgets.find(w => w.WidgetType === data.simpleDesignerWidgetType).id}`);
    } else {
      Name = data.attribute.Name;
      Label = data.attribute.Label;
    }
    (WidgetSettingMap[data.defaultWidgetName])[this.getGeneralLayoutType(settingLayoutType)].forEach((settingName) => {
      switch (settingName) {
        case Setting.Label:
          result[settingName] = Label || Name;
          break;
        case Setting.Direction:
          result[settingName] = DirectionType.Auto;
          break;
        case Setting.LabelMutable:
          result[settingName] = false;
          break;
        case Setting.DefaultValueTime:
        case Setting.DefaultValueDate:
        case Setting.DefaultValueDateTime:
          result[Setting.DefaultValue] = null;
          break;
        default:
          result[settingName] = null;
          break;
      }
    });

    return { ...result };
  }

  private getGeneralLayoutType(settingLayoutType: LayoutType): LayoutType {
    return settingLayoutType !== LayoutType.Define ? LayoutType.Archive : LayoutType.Define;
  }

  getDefaultValidationByWidgetIdHelper({ viewModel, widgetType, widgetId, layoutItemGuid, simpleDesignerWidgetType }: DefaultValidationByWidgetIdHelperProps): ValidationViewModel[] {
    const dataType = this.isSimpleDesignerMode ? convertDesignerVersion2WidgetTypeToDataType(simpleDesignerWidgetType) : viewModel.DataType;
    const defaultWidgetName = FieldTypesWidget[dataType][widgetType][widgetId.toString()];
    switch (widgetType) {
      case WidgetType.EditWidget:
        return !!EditWidgetInitialValidation[defaultWidgetName] ? EditWidgetInitialValidation[defaultWidgetName].map((rule) => ({ Guid: utility.newGuid(), LayoutItemGuid: layoutItemGuid.toLowerCase(), ...rule }) as ValidationViewModel) : []

      default:
        return []
    }
  }

  getInitialDefaultValidationHelper(layoutItemGuid: string, attribute: any, simpleDesignerWidgetType): ValidationViewModel[] {
    if (simpleDesignerWidgetType) {
      return [];
    }
    const { DataType, Setting } = attribute as ColumnViewModel;
    const result: ValidationViewModel[] = [];

    switch (DataType) {
      case ColumnDataType.String:
        const setting = JSON.parse(Setting);
        if (setting.MaxLength) {
          result.push({
            Guid: guid.newGuid(),
            LayoutItemGuid: layoutItemGuid,
            Setting: `{"Max": ${setting.MaxLength}}`,
            Type: ValidationType.Range
          })
        }
        break;
      default:
        break;
    }
    return result;
  }
}

class ReferenceWidgetFactoryHelper extends WidgetFactoryHelper<LayoutItemReferenceSetting, LayoutItemReferenceViewModel, RelationViewModel> {
  type = LayoutItemType.Reference;

  getComponentName(layoutItem: LayoutItemReferenceViewModel & RichLayoutItem, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    const widgetMode = (itemSetting as LayoutItemReferenceSetting).Widget;
    let RelationNature, RelationType, ReferenceDataModelGuid;

    if (this.isSimpleDesignerMode) {
      RelationNature = layoutItem.simpleDesignerData.DataModelInfo.Nature;
      RelationType = layoutItem.simpleDesignerData.DataModelInfo.Type;
      ReferenceDataModelGuid = layoutItem.simpleDesignerData.DataModelInfo.ReferenceDataModelGuid;
    } else {
      const dataModelColumn = this.getDetailOfDataModel(layoutItem);
      RelationNature = dataModelColumn.Nature;
      RelationType = dataModelColumn.Type;
      ReferenceDataModelGuid = dataModelColumn.ReferenceDataModelGuid
    }

    if (!ReferenceDataModelGuid) {
      return ReferenceTypeWidgetProxy(RelationNature, RelationType, ReferenceTypeWidget)[widgetMode][
        (itemSetting as LayoutItemReferenceSetting)[widgetMode].Id
      ];
    }
    const viewModelSoftwareModel = getSoftwareModelItem(ReferenceDataModelGuid, WebSoftwareComponentViewModels);
    const widgetId = widgetMode === WidgetType.DisabledWidget ? (itemSetting as LayoutItemReferenceSetting)[WidgetType.EditWidget].Id : (itemSetting as LayoutItemReferenceSetting)[widgetMode].Id;
    if (!!viewModelSoftwareModel) {
      const model: IWebSoftwareViewModel = window["Model" + viewModelSoftwareModel.DataModelGuid.replace(/\-/gm, "").toLowerCase()];
      const data = model.widgetMap[ReferenceDataModelGuid.toLowerCase()];

      return ReferenceTypeWidgetProxy(RelationNature, RelationType, data)[widgetMode === WidgetType.DisabledWidget ? WidgetType.EditWidget : widgetMode][widgetId]
    } else {
      return ReferenceTypeWidgetProxy(RelationNature, RelationType, ReferenceTypeWidget)[widgetMode === WidgetType.DisabledWidget ? WidgetType.EditWidget : widgetMode][widgetId];
    }
  }

  getComponentNameByMode(layoutItem: LayoutItemReferenceViewModel, mode: WidgetType, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    const widgetMode = WidgetType[mode];
    const dataModelColumn = this.getDetailOfDataModel(layoutItem);
    const viewModelSoftwareModel = getSoftwareModelItem(dataModelColumn.ReferenceDataModelGuid, WebSoftwareComponentViewModels);

    if (!itemSetting[widgetMode]) {
      // Because my assumption was we can not support references field in search
      return null
    }

    if (!!viewModelSoftwareModel) {
      const model: IWebSoftwareViewModel = window["Model" + viewModelSoftwareModel.DataModelGuid.replace(/\-/gm, "").toLowerCase()];
      const referenceWidgetsModel = ReferenceTypeWidgetProxy(dataModelColumn.Nature, dataModelColumn.Type, model.widgetMap[dataModelColumn.ReferenceDataModelGuid.toLowerCase()]);
      return referenceWidgetsModel[mode][(itemSetting as LayoutItemReferenceSetting)[widgetMode].Id];
    } else {
      return ReferenceTypeWidgetProxy(dataModelColumn.Nature, dataModelColumn.Type, ReferenceTypeWidget)[widgetMode][
        (itemSetting as LayoutItemReferenceSetting)[widgetMode].Id
      ];
    }
  }

  getComponentElement(layoutItemSetting: LayoutItemReferenceSetting, layoutItem: LayoutItemReferenceViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[], componentName: string): IWidget {
    let element;
    const setElementFromDefaults = () => {
      switch (layoutItemSetting.Widget) {
        case WidgetType.EditWidget:
        case WidgetType.DisabledWidget:
          element = GetEditWidgets(componentName);
          break;
        case WidgetType.DisplayWidget:
          element = GetDisplayWidgets(componentName);
          break;
        case WidgetType.SearchWidget:
          element = GetSearchWidgets(componentName);
          break;
        default:
          break;
      }
    }
    let ReferenceDataModelGuid;
    setElementFromDefaults();

    if (this.isSimpleDesignerMode) {
      ReferenceDataModelGuid = (layoutItem as unknown as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid;
    } else {
      const dataModelColumn = this.getDetailOfDataModel(layoutItem);
      ReferenceDataModelGuid = dataModelColumn.ReferenceDataModelGuid;
    }
    if (ReferenceDataModelGuid) {
      const viewModelSoftwareModel = getSoftwareModelItem(ReferenceDataModelGuid, WebSoftwareComponentViewModels);
      if (!!viewModelSoftwareModel) {
        const model: IWebSoftwareViewModel = window["Model" + viewModelSoftwareModel.DataModelGuid.replace(/\-/gm, "").toLowerCase()];
        element = model.component(componentName);
      } else {
        setElementFromDefaults();
      }
    } else {
      setElementFromDefaults();
    }
    return { ...element };
  }

  getComponentElementByMode(mode: WidgetType, componentName: string, layoutItem: LayoutItemReferenceViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[]): IWidget {
    let element;
    const dataModelColumn = this.getDetailOfDataModel(layoutItem);
    const viewModelSoftwareModel = getSoftwareModelItem(dataModelColumn.ReferenceDataModelGuid, WebSoftwareComponentViewModels);

    if (!!viewModelSoftwareModel) {
      const model: IWebSoftwareViewModel = window["Model" + viewModelSoftwareModel.DataModelGuid.replace(/\-/gm, "").toLowerCase()];
      element = model.component(componentName);
    } else {
      switch (mode) {
        case WidgetType.EditWidget:
          element = GetEditWidgets(componentName);
          break;
        case WidgetType.DisplayWidget:
          element = GetDisplayWidgets(componentName);
          break;
        case WidgetType.SearchWidget:
          element = GetSearchWidgets(componentName);
          break;
        default:
          break;
      }
    }

    return { ...element };
  }

  getDetailOfDataModel(layoutItem: LayoutItemReferenceViewModel): RelationViewModel {
    const dataModelRelation = this.getDatamodel()?.Relations.find(
      (relation) =>
        relation.Guid.toLowerCase() === layoutItem.RelationGuid.toLowerCase()
    );
    return dataModelRelation;
  }

  getDefaultSettingByWidgetIdHelper(data: DefaultSettingWidgetById) {
    const { widgetId, widgetType, attribute, settingLayoutType } = data;
    const defaultWidgetName = ReferenceTypeWidgetProxy((attribute as RelationViewModel).Nature, (attribute as RelationViewModel).Type, ReferenceTypeWidget)[widgetType][widgetId];
    return this.getDefaultSetting({
      defaultWidgetName,
      attribute: attribute as RelationViewModel,
      settingLayoutType,
    });
  }

  getInitialDefaultSettingHelper(attribute: RelationViewModel, settingLayoutType: LayoutType, widgetTypes: WidgetType[] = [WidgetType.DisplayWidget, WidgetType.EditWidget], softwareModels: Array<WebSoftwareComponentViewModel>): IGetReferenceDefaultSettingResult {
    const { Label, Type, ReferenceDataModelGuid } = attribute;
    const result: IGetReferenceDefaultSettingResult = {
      Design: {},
    };

    const defaultWidgetType = (settingLayoutType !== LayoutType.Define && settingLayoutType !== LayoutType.InlineArchive) ? WidgetType.DisplayWidget : WidgetType.EditWidget;
    (result.Design as LayoutItemReferenceSetting).Widget =
      defaultWidgetType;
    (result.Design as LayoutItemReferenceSetting).EditWidget = { Id: 0 };
    (result.Design as LayoutItemReferenceSetting).DisplayWidget = { Id: 0 };

    let defaultSettings: IGetReferenceDefaultSettingResult = {
      Design: {},
      ColumnGuids: [],
    };

    const softwareDataModel = getSoftwareModelItem(ReferenceDataModelGuid, softwareModels);

    if (!!softwareDataModel) {
      defaultSettings.Design[Setting.Label] = attribute.Label;
      defaultSettings.Design[Setting.LabelMutable] = false;
      defaultSettings.Design[Setting.Direction] = DirectionType.Auto;
      defaultSettings.Design[Setting.HelpTooltip] = null;
    } else {
      let defaultWidgetName;
      defaultWidgetName = ReferenceTypeWidgetProxy(attribute.Nature, attribute.Type, ReferenceTypeWidget)[defaultWidgetType][0];
      defaultSettings = this.getDefaultSetting({ defaultWidgetName, attribute, settingLayoutType });
    }

    return {
      Design: { ...result.Design, ...defaultSettings.Design },
      ColumnGuids: [...defaultSettings.ColumnGuids],
    };
  }

  getDataModelColumns(layoutItem: LayoutItemReferenceViewModel) {
    const viewModels: DataModelViewModel = this.dataModels.find(
      (model) =>
        model.Guid.toLowerCase() === this.dataModelGuid.toLowerCase()
    );

    const referenceViewModel: Array<RelationViewModel> = viewModels ? viewModels.Relations.filter(
      (column) => column.Guid === layoutItem.RelationGuid
    ) : [];

    if (referenceViewModel.length > 0) {
      const referenceColumns: DataModelViewModel = this.dataModels.filter(
        (model) =>
          model.Guid.toLowerCase() === referenceViewModel[0].ReferenceDataModelGuid.toLowerCase()
      )[0];
      return referenceColumns
    }

    return [];
  }

  getDataModelSetting(dataModel: ColumnViewModel) {
    return null
  }

  private getDefaultSetting(data: { defaultWidgetName: string; attribute: RelationViewModel; settingLayoutType: LayoutType; }) {
    const { defaultWidgetName, attribute, settingLayoutType } = data;
    const result: IGetReferenceDefaultSettingResult = {
      Design: {},
      ColumnGuids: [],
    };
    if (this.isSimpleDesignerMode) {
      result.ColumnGuids = [];
    } else {
      result.ColumnGuids = this.getReferenceDataModelColumnGuids(
        attribute.ReferenceDataModelGuid
      );
    }

    ((WidgetSettingMap[defaultWidgetName])[this.getGeneralLayoutType(settingLayoutType)]).forEach((settingName) => {
      switch (settingName) {
        case Setting.Label:
          result.Design[settingName] = attribute.Label;
          break;

        case Setting.Direction:
          result.Design[settingName] = DirectionType.Auto;
          break;

        case Setting.LabelMutable:
        case Setting.HelpBlockClosable:
        case Setting.HelpBlockShowIcon:
        case Setting.HelpBlockShowMessage:
          result.Design[settingName] = false;
          break;

        case Setting.ReferenceAutoCompleteColumnsConfige:
          const AutoCompleteColumnsObject = {};

          result.ColumnGuids.forEach(
            (column, index) =>
              (AutoCompleteColumnsObject[column] = { order: index })
          );

          const AutoCompleteColumnsConfige: ReferenceAutoComplete = {
            ReferenceAutoCompleteColumnsConfige: {
              SeperableCharachter: ",",
              Columns: AutoCompleteColumnsObject,
            },
          };

          result.Design[settingName] = {
            ...AutoCompleteColumnsConfige[settingName],
          };
          break;

        case Setting.ReferenceRadioButtonColumnsConfig:
          const RadioButtonColumnsObject = {};

          result.ColumnGuids.forEach(
            (column, index) =>
              (RadioButtonColumnsObject[column] = { order: index })
          );

          const RadioButtonColumnsConfige: ReferenceRadioButton = {
            ReferenceRadioButtonColumnsConfig: {
              SeperableCharachter: ",",
              Columns: RadioButtonColumnsObject,
            },
          };

          result.Design[settingName] = {
            ...RadioButtonColumnsConfige[settingName],
          };
          break;

        case Setting.ReferenceTokenContainerColumnsConfige:
          const TokenContainercolumnsObject = {};

          result.ColumnGuids.forEach(
            (column, index) =>
              (TokenContainercolumnsObject[column] = { order: index })
          );

          const ToeknColumnsConfige: ReferenceTokenContainer = {
            ReferenceTokenContainerColumnsConfige: {
              SeperableCharachter: ',',
              Columns: TokenContainercolumnsObject,
            },
          };

          result.Design[settingName] = { ...ToeknColumnsConfige[settingName] };
          break;

        case Setting.ReferenceCheckBoxListColumnsConfig:
          const CheckBoxListcolumnsObject = {};

          result.ColumnGuids.forEach(
            (column, index) =>
              (CheckBoxListcolumnsObject[column] = { order: index })
          );

          const CheckBoxListItemColumnsConfig: ReferenceCheckBoxList = {
            ReferenceCheckBoxListColumnsConfig: {
              SeperableCharachter: ',',
              Columns: CheckBoxListcolumnsObject,
              CheckBoxCoulmnCountInARow: 4
            },
          };

          result.Design[settingName] = { ...CheckBoxListItemColumnsConfig[settingName] };
          break;

          

        case Setting.HelpBlockType:
          result.Design[settingName] = HelpBlockType.info;
          break;

        case Setting.DefaultValueDate:
        case Setting.DefaultValueTime:
        case Setting.DefaultValueDateTime:
          result.Design[Setting.DefaultValue] = null;

        case Setting.HelpBlockDescription:
          result.Design[settingName] = translate("Text");
          break;
        case Setting.CascadeDropDownLevel:
          result[settingName] = 1;
          break;
        default:
          result.Design[settingName] = null;
      }
    });

    return { ...result };
  }

  private getGeneralLayoutType(settingLayoutType: LayoutType): LayoutType {
    return settingLayoutType !== LayoutType.Define ? LayoutType.Archive : LayoutType.Define;
  }

  private getReferenceDataModelColumnGuids(referenceDataModelGuid: string
  ): Array<string> {
    const viewModels: Array<DataModelViewModel> = this.dataModels.filter(
      (model) =>
        model.Guid.toLowerCase() === referenceDataModelGuid.toLowerCase()
    );
    const guids: Array<string> = viewModels[0].Columns.map(
      (column) => column.Guid
    );

    return guids;
  }

  getDefaultValidationByWidgetIdHelper(props: { viewModel: ColumnViewModel | RelationViewModel; widgetType: WidgetType; widgetId: string; }): ValidationViewModel[] {
    return [];
  }

  getInitialDefaultValidationHelper(layoutItemGuid: string, attribute: any): ValidationViewModel[] {
    return [];
  }
}

class SubLayoutWidgetFactoryHelper extends WidgetFactoryHelper<any, SubLayoutItemViewModel, any> {
  type = LayoutItemType.SubLayout;

  getComponentName(layoutItem: SubLayoutItemViewModel) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    const widgetMode = (itemSetting as LayoutItemReferenceSetting).Widget;
    const dataModelColumn: RelationViewModel = this.getDetailOfDataModel(layoutItem);

    return ReferenceTypeWidgetProxy(dataModelColumn.Nature, dataModelColumn.Type, ReferenceTypeWidget)[widgetMode][
      (itemSetting as LayoutItemReferenceSetting)[widgetMode].Id
    ];
  }

  getComponentNameByMode(layoutItem: SubLayoutItemViewModel, mode: WidgetType) {
    const itemSetting = this.getLayoutItemSettingByType(layoutItem);
    const widgetMode = WidgetType[mode];
    const dataModelColumn: RelationViewModel = this.getDetailOfDataModel(layoutItem);

    return ReferenceTypeWidgetProxy(dataModelColumn.Nature, dataModelColumn.Type, ReferenceTypeWidget)[widgetMode][
      (itemSetting as LayoutItemReferenceSetting)[widgetMode].Id
    ];
  }

  getComponentElement(layoutItemSetting: LayoutItemReferenceSetting, layoutItem: SubLayoutItemViewModel, WebSoftwareComponentViewModels: WebSoftwareComponentViewModel[], componentName: string): IWidget {
    let element: IWidget;
    switch (layoutItemSetting.Widget) {
      case WidgetType.EditWidget:
      case WidgetType.DisabledWidget:
        element = GetEditWidgets(componentName);
        break;
      case WidgetType.DisplayWidget:
        element = GetDisplayWidgets(componentName);
        break;
      default:
        break;
    }
    return { ...element };
  }

  getComponentElementByMode(mode, componentName) {
    let element;
    switch (mode) {
      case 'edit':
        element = GetEditWidgets(componentName);
        break;
      case 'display':
        element = GetDisplayWidgets(componentName);
        break;
      default:
        break;
    }
    return { ...element };
  }

  getDetailOfDataModel(layoutItem: any): any {
    const dataModelRelation = this.getDatamodel().Relations.find(
      (relation) =>
        relation.Guid.toLowerCase() === layoutItem.RelationGuid.toLowerCase()
    );
    return dataModelRelation;
  }

  getDefaultSettingByWidgetIdHelper(data: DefaultSettingWidgetById) {
    const { widgetId, widgetType, attribute } = data;
    const { Type, Label } = attribute as RelationViewModel;
    const defaultWidgetName = FieldTypesWidget[Type][widgetType][widgetId];

    return this.getDefaultSetting({
      defaultWidgetName,
      attribute: attribute as RelationViewModel,
    });
  }

  getInitialDefaultSettingHelper(attribute: any, settingType: LayoutType): BaseLayoutItemSetting {
    return null;
  }

  getDataModelColumns(layoutItem: SubLayoutItemViewModel) {


    return [];
  }

  getDataModelSetting(dataModel: ColumnViewModel) {
    return null
  }

  private getDefaultSetting(data: { defaultWidgetName: string; attribute: RelationViewModel }) {
    return {}
  }

  getDefaultValidationByWidgetIdHelper(props: { viewModel: ColumnViewModel | RelationViewModel; widgetType: WidgetType; widgetId: string; }): ValidationViewModel[] {
    throw new Error("Method not implemented.");
  }

  getInitialDefaultValidationHelper(layoutItemGuid: string, attribute: any): ValidationViewModel[] {
    return [];
  }

}
