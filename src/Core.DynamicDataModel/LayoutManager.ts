import { LayoutType } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { DataModelViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { LayoutViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import GetDisplayWidgets from "./Widget/Display/index";
import GetEditWidgets from "./Widget/Edit/index";

import {
	ArchiveLayoutDesignerViewModel,
	ArchiveLayoutSetting,
	BaseLayoutItemSetting,
	ComponentModel,
	DefineArchiveLayoutDesignerViewModel,
	DefineLayoutDesignerViewModel,
	Design,
	InlineArchiveLayoutDesignerViewModel,
	IWidgetFactory,
	LayoutViewModelWithState,
	LayoutItemDesignerViewModel,
	LayoutsModel,
	SubLayoutItemDesignerViewModel,
	ReferenceArchiveWidgetProps,
	RichLayoutItem,
	SimpleDesignerLayoutViewModelWithState
} from "../typings/Core.DynamicDataModel/Types";
import { DefineLayoutViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import { ArchiveLayoutViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ArchiveLayoutViewModel";
import { DefineArchiveLayoutViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import LayoutDefineSimpleDesigner from "./SimpleDesigner/components/LayoutDefineDesigner";
import LayoutArchiveSimpleDesigner from "./SimpleDesigner/components/LayoutArchiveDesigner";
import LayoutDefineDesigner from "./Designer/components/LayoutDefineDesigner";
import LayoutArchiveDesigner from "./Designer/components/LayoutArchiveDesigner";
import { RelationViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutPlatformType } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutPlatformType";
import { convertDesignerVersion2WidgetTypeToDataType, WidgetFactory } from "./Widget/WidgetFactory";
import { LayoutItemType } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { RelationType } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import { ReferenceTypeWidget, ReferenceTypeWidgetProxy } from "./TS/Widgets";
import { ModernTableColumnProps } from '@didgah-components/ant-table/utils';

import { LayoutItemColumnViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { RelationNature } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import LayoutDefineArchiveSimpleDesigner from "./SimpleDesigner/components/LayoutDefineArchiveDesigner";
import LayoutInlineArchiveSimpleDesigner from "./SimpleDesigner/components/LayoutInlineArchiveDesigner";
import LayoutDefineArchiveDesigner from "./Designer/components/LayoutDefineArchiveDesigner";
import LayoutInlineArchiveDesigner from "./Designer/components/LayoutInlineArchiveDesigner";
import { LayoutItemViewModel } from "./../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { WidgetType } from "../typings/Core.DynamicDataModel/Enums";
import { InlineArchiveLayoutViewModel } from "../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { ValidationViewModel } from "../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { dataModelRules } from "./Renderer/components/commonRangeRule";
import { DidgahContextProps, widgetFactory } from "didgah/ant-core-component";
import { importModule } from "../Utility/helpers";
import { WebSoftwareComponentViewModel } from "../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { ColumnViewModel } from "../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { translate } from "didgah/common";

interface DesignerViewModel {
	dataModels: DataModelViewModel[];
	layouts: SimpleDesignerLayoutViewModelWithState[];
	currentLayoutGuid: string
}

interface DesignerHelperViewModel<T> {
	dataModels: DataModelViewModel[];
	layouts: SimpleDesignerLayoutViewModelWithState[];
	currentLayout: T
}

export default class LayoutManager {
	layouts: Array<LayoutViewModelWithState>;
	dataModels: Array<DataModelViewModel>;
	layoutsHelper: LayoutHelper<LayoutViewModel, LayoutViewModelWithState>[];
	widgetFactory: IWidgetFactory;
	widgetsMode: WidgetType;
	context: DidgahContextProps;
	isSimpleDesignerMode: boolean;
	constructor(props?: { LayoutsModel?: LayoutsModel, context: DidgahContextProps; isSimpleDesignerMode: boolean; }) {
		if (!!props && !!props.LayoutsModel) {
			this.dataModels = props.LayoutsModel.DataModels;
			this.layouts = props.LayoutsModel.Layouts;
			this.widgetFactory = props.LayoutsModel.WidgetFactory;
			this.widgetsMode = props.LayoutsModel.WidgetsMode;
			this.context = props.context;
		}
		this.isSimpleDesignerMode = props ? props.isSimpleDesignerMode : false;
		this.layoutsHelper = [
			new DefineLayoutHelper({ isSimpleDesignerMode: this.isSimpleDesignerMode }),
			new ArchiveLayoutHelper({ isSimpleDesignerMode: this.isSimpleDesignerMode }),
			new DefineArchiveLayoutHelper({ isSimpleDesignerMode: this.isSimpleDesignerMode }),
			new InlineArchiveLayoutHelper({ isSimpleDesignerMode: this.isSimpleDesignerMode }),
		];
	}

	getDesignSettingOfLayout(layout: LayoutViewModel) {
		const layoutHelper = this.getLayoutHelperByType(layout.Type);
		return layoutHelper.getDesignSettingOfLayout(layout)
	}

	getDesigner(data: DesignerViewModel): any {
		const { layouts, currentLayoutGuid, dataModels } = data;
		const currentLayoutDesigner = this.getCurrentLayout({ layouts, currentLayoutGuid });
		const layoutHelper = this.getLayoutHelperByType(currentLayoutDesigner.Type);

		return layoutHelper.getDesigner({
			currentLayout: currentLayoutDesigner,
			dataModels,
			layouts
		});
	}

	getCurrentLayout({ layouts, currentLayoutGuid }: { layouts, currentLayoutGuid: string }): LayoutViewModelWithState {
		return layouts.find((x) => x.Guid.toLowerCase() === currentLayoutGuid.toLocaleLowerCase())
	}

	getNewLayout(params: { relationViewModel?: RelationViewModel, layoutType: LayoutType, newLayoutGuid: string, dataModelGuid: string, dataModelsResult?: any }): LayoutViewModelWithState {
		const { relationViewModel, layoutType, newLayoutGuid, dataModelGuid, dataModelsResult } = params;
		const layoutHelper = this.getLayoutHelperByType(layoutType);
		return layoutHelper.getNewLayout({ relationViewModel, newLayoutGuid, dataModelGuid, dataModelsResult });
	}

	getSubLayout(layoutItemGuid: string, layoutGuid: string) {

	}

	getSubLayoutComponent(layoutItemGuid: string, layoutGuid: string, mode?: WidgetType): ComponentModel {
		const currentLayout = this.getCurrentLayout({ layouts: this.layouts, currentLayoutGuid: layoutGuid });
		const currentDataModel = this.dataModels.find((dataModel) => dataModel.Guid.toLowerCase() === currentLayout.DataModelGuid.toLowerCase());
		const subLayoutItem = currentLayout.Items.find((item) => item.Guid.toLowerCase() === layoutItemGuid.toLowerCase());
		if (subLayoutItem.Type === LayoutItemType.SubLayout) {
			let referenceType, natureType;
			if (this.isSimpleDesignerMode) {
				referenceType = RelationType.OneToMany;
				natureType = RelationNature.Composition;
			} else {
				const relationViewModel: RelationViewModel = currentDataModel.Relations.find((relation) => relation.Guid.toLowerCase() === (subLayoutItem as SubLayoutItemDesignerViewModel).RelationGuid.toLowerCase());
				referenceType = relationViewModel.Type;
				natureType = relationViewModel.Nature;
			}
			const layoutRelatedSubLayout = this.getCurrentLayout({ layouts: this.layouts, currentLayoutGuid: (subLayoutItem as SubLayoutItemDesignerViewModel).SubLayoutGuid });
			const widgetFactory: IWidgetFactory = new WidgetFactory({ dataModelGuid: layoutRelatedSubLayout.DataModelGuid, layoutGuid: layoutRelatedSubLayout.Guid, layoutModel: { DataModels: this.dataModels, Layouts: this.layouts }, softwareModels: [], context: this.context, isSimpleDesignerMode: this.isSimpleDesignerMode })
			const layoutHelper = this.getLayoutHelperByType(layoutRelatedSubLayout.Type);
			return layoutHelper.getSubLayoutComponent({
				currentSubLayout: layoutRelatedSubLayout,
				referenceType,
				natureType,
				widgetFactory,
				subLayoutItem,
				mode: mode ?? WidgetType.DisplayWidget
			});
		}
	}

	getLayoutColumnDesign(): Array<ModernTableColumnProps<any>> {

		return []
	}

	getLayoutComponent(layout: LayoutViewModelWithState): ComponentModel {
		const layoutHelper = this.getLayoutHelperByType(layout.Type);
		return layoutHelper.getLayoutComponent({
			currentLayout: layout,
			widgetFactory: this.widgetFactory,
			widgetsMode: this.widgetsMode
		});
	}

	getLayoutHelperByType(layoutType: LayoutType) {
		return this.layoutsHelper.find((x) => x.type == layoutType);
	}
}

abstract class LayoutHelper<TLayoutViewModel extends LayoutViewModelWithState, TLayoutDesignerViewModel extends LayoutViewModelWithState> {

	abstract type: LayoutType;
	isSimpleDesignerMode: boolean;
	abstract getDesigner(data: DesignerHelperViewModel<TLayoutDesignerViewModel>);
	abstract getDesignSettingOfLayout(layout: TLayoutViewModel);
	abstract getNewLayout(props: { relationViewModel?: RelationViewModel, newLayoutGuid: string, dataModelGuid: string, dataModelsResult: any }): LayoutViewModelWithState;
	abstract getSubLayoutComponent(props: { currentSubLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory, subLayoutItem: LayoutItemDesignerViewModel, mode?: WidgetType }): ComponentModel;
	abstract getLayoutColumnDesign(props: { columns: Array<LayoutItemDesignerViewModel>, widgetFactory: IWidgetFactory, validations?: ValidationViewModel[] }): Array<ModernTableColumnProps<any>>;
	abstract getLayoutComponent(props: { currentLayout: LayoutViewModelWithState, referenceType?: RelationType, natureType?: RelationNature, widgetFactory: IWidgetFactory, widgetsMode?: WidgetType }): ComponentModel;

}

class DefineLayoutHelper extends LayoutHelper<LayoutViewModel, DefineLayoutDesignerViewModel> {
	type = LayoutType.Define;
	constructor({ isSimpleDesignerMode }) {
		super();
		this.isSimpleDesignerMode = isSimpleDesignerMode;
	}

	getLayoutColumnDesign(props: { columns: LayoutItemDesignerViewModel[] }): ModernTableColumnProps<any>[] {
		throw new Error("Method not implemented.");
	}

	getSubLayoutComponent(props: { currentSubLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory, mode?: WidgetType }): ComponentModel {
		const setting = {
			layout: props.currentSubLayout,
			dataModelGuid: props.currentSubLayout.DataModelGuid
		}
		return {
			component: GetEditWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToOne, ReferenceTypeWidget).EditWidget[0]),
			setting: setting,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		}
	}

	getNewLayout(props: { relationViewModel?: RelationViewModel, newLayoutGuid: string, dataModelGuid: string, dataModelsResult: any }): DefineLayoutDesignerViewModel {
		const { relationViewModel, newLayoutGuid, dataModelGuid, dataModelsResult } = props;

		return {
			DataModelGuid: dataModelGuid,
			Guid: newLayoutGuid,
			Label: `${translate(`Form`)} ${translate(`LayoutType_Define`)}`,
			Type: LayoutType.Define,
			PlatformType: LayoutPlatformType.Web,
			Design: JSON.stringify({
				IsResponsive: false,
				Arrangement: [],
				Events: [],
			} as Design),
			IsDefault: false,
			Items: [],
			State: "Added",
			ComplexValidations: [],
			Validations: [],
			Plugins: [],
			DataModelInfo: dataModelsResult ? dataModelsResult : {
				status: 'added'
			},
		}
	}

	getDesigner(data: DesignerHelperViewModel<DefineLayoutDesignerViewModel>) {
		return this.isSimpleDesignerMode ? LayoutDefineSimpleDesigner : LayoutDefineDesigner
	}

	getDesignSettingOfLayout(layout: DefineLayoutViewModel) {
		return JSON.parse(layout.Design) as Design;
	}

	getLayoutComponent(props: { currentLayout: LayoutViewModelWithState }) {
		return null;
	}
}

class ArchiveLayoutHelper extends LayoutHelper<LayoutViewModelWithState, ArchiveLayoutDesignerViewModel> {

	type = LayoutType.Archive;
	constructor({ isSimpleDesignerMode }) {
		super();
		this.isSimpleDesignerMode = isSimpleDesignerMode;
	}

	getLayoutColumnDesign(props: { columns: LayoutItemDesignerViewModel[], widgetFactory: IWidgetFactory }): ModernTableColumnProps<any>[] {
		return props.columns.sort((a, b) => {
			return a.OrderIndex - b.OrderIndex;
		}).map((item) => {
			const DesignItem: BaseLayoutItemSetting = JSON.parse(item.Design);
			const dataType = this.isSimpleDesignerMode ? convertDesignerVersion2WidgetTypeToDataType((item as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (props.widgetFactory.getDetailOfDataModel(item) as ColumnViewModel).DataType;
			return {
				Header: DesignItem.Label,
				accessor: DesignItem.Label,
				dataIndex: this.getRowKey(item),
				editComponent: props.widgetFactory.getComponent(item.Guid).component,
				viewComponent: props.widgetFactory.getComponent(item.Guid).component,
				staticProps: { columnSetting: item.Design, dataType: dataType }
			} as ModernTableColumnProps<any>;
		})
	}

	getSubLayoutComponent(props: { currentSubLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory, subLayoutItem: LayoutItemDesignerViewModel }): ComponentModel {
		const { currentSubLayout, referenceType, widgetFactory, natureType, subLayoutItem } = props;

		const subLayoutDesign: ArchiveLayoutSetting = JSON.parse(currentSubLayout.Design) as ArchiveLayoutSetting;
		const subLayoutColumnDesign = this.getLayoutColumnDesign({
			columns: [...currentSubLayout.Items].sort((a, b) => {
				return a.OrderIndex - b.OrderIndex;
			}), widgetFactory
		});
		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: subLayoutColumnDesign,
			initValue: [],
			//initValue: !!this.rows ? this.getTableInitValue(subLayoutItem, subLayoutColumnDesign):[],
			layoutDesign: JSON.parse(currentSubLayout.Design),
			validationRules: {},
			label: currentSubLayout.Label
		}
		return {
			component: GetDisplayWidgets(ReferenceTypeWidgetProxy(natureType, referenceType, ReferenceTypeWidget).DisplayWidget[subLayoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}

	getNewLayout(props: { relationViewModel?: RelationViewModel, newLayoutGuid: string, dataModelGuid: string }): ArchiveLayoutDesignerViewModel {
		const { relationViewModel, newLayoutGuid, dataModelGuid } = props;

		const newLayoutDesigner: LayoutViewModelWithState = {
			Guid: newLayoutGuid,
			DataModelGuid: dataModelGuid,
			Label: null,
			Type: LayoutType.Archive,
			PlatformType: LayoutPlatformType.Web,
			Design: JSON.stringify({
				Widget: {
					Id: 0,
					SearchSetting: {
						Enable: false,
						LayoutItemGuid: null,
						ColumnViewModelGuid: null
					}
				},
				DefineLayoutGuid: null,
			}),
			IsDefault: false,
			Items: [],
			State: "Added",
			Plugins: [],
			DataModelInfo: {},
		};

		return newLayoutDesigner;
	}

	getDesigner(data: DesignerHelperViewModel<ArchiveLayoutDesignerViewModel>) {
		return this.isSimpleDesignerMode ? LayoutArchiveSimpleDesigner : LayoutArchiveDesigner
	}

	getDesignSettingOfLayout(layout: ArchiveLayoutViewModel) {
		return JSON.parse(layout.Design) as Design;
	}

	getLayoutComponent(props: { currentLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory }) {
		const { currentLayout, widgetFactory } = props;

		const layoutDesign: ArchiveLayoutSetting = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
		const layoutColumnDesign = this.getLayoutColumnDesign({
			columns: [...currentLayout.Items].sort((a, b) => {
				return a.OrderIndex - b.OrderIndex;
			}), widgetFactory
		});
		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: layoutColumnDesign,
			initValue: [],
			layoutDesign: JSON.parse(currentLayout.Design),
			validationRules: {},
		}
		return {
			component: GetDisplayWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToMany, ReferenceTypeWidget).DisplayWidget[layoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}


	// private getTableInitValue(subLayoutItem, columns: ModernTableColumnProps<any>[]) {
	// 	const getValue = (dataIndex) => {
	// 		const rowKey = this.getRowKey(subLayoutItem);
	// 		const currentRow = this.rows.KeyValues.find(x => x.Key === rowKey);
	// 		return (currentRow.Value as RowViewModel[])[0].KeyValues.find(row => row.Key === dataIndex).Value;
	// 	}
	// 	return columns.map(column => {
	// 		return {
	// 			[column.dataIndex]: getValue(column.dataIndex)
	// 		}
	// 	});
	// }

	private getRowKey(layoutItem: LayoutItemViewModel) {
		switch (layoutItem.Type) {
			case LayoutItemType.Column:
				return (layoutItem as LayoutItemColumnViewModel).ColumnGuid
			default:
				return (layoutItem as LayoutItemReferenceViewModel).RelationGuid
		}
	}
}

class DefineArchiveLayoutHelper extends LayoutHelper<LayoutViewModel, DefineArchiveLayoutDesignerViewModel> {
	type = LayoutType.DefineArchive;
	constructor({ isSimpleDesignerMode }) {
		super();
		this.isSimpleDesignerMode = isSimpleDesignerMode;
	}
	getLayoutColumnDesign(props: { columns: LayoutItemDesignerViewModel[], widgetFactory: IWidgetFactory }): ModernTableColumnProps<any>[] {
		return props.columns.sort((a, b) => {
			return a.OrderIndex - b.OrderIndex;
		}).map((item) => {
			const DesignItem: BaseLayoutItemSetting = JSON.parse(item.Design);
			// const componentName : string = widgetFactory.getComponentName(item);
			// const componentElemnt = widgetFactory.getComponent(item.Guid);
			const dataType = this.isSimpleDesignerMode ? convertDesignerVersion2WidgetTypeToDataType((item as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (props.widgetFactory.getDetailOfDataModel(item) as ColumnViewModel).DataType;
			return {
				//Header: Header(item.Guid, DesignItem.Label),
				Header: DesignItem.Label,
				accessor: DesignItem.Label,
				dataIndex: item.Type === LayoutItemType.Column
					? (item as LayoutItemColumnViewModel).ColumnGuid
					: (item as LayoutItemReferenceViewModel).RelationGuid,
				editComponent: props.widgetFactory.getComponent(item.Guid).component,
				viewComponent: props.widgetFactory.getComponent(item.Guid).component,
				staticProps: { columnSetting: item.Design, dataType: dataType }
			} as ModernTableColumnProps<any>;
		})
	}

	getSubLayoutComponent(props: { currentSubLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory }): ComponentModel {
		const { currentSubLayout, referenceType, widgetFactory, natureType } = props;

		const subLayoutDesign: ArchiveLayoutSetting = JSON.parse(currentSubLayout.Design) as ArchiveLayoutSetting;
		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: this.getLayoutColumnDesign({
				columns: [...currentSubLayout.Items].sort((a, b) => {
					return a.OrderIndex - b.OrderIndex;
				}), widgetFactory
			}),
			initValue: [],
			layoutDesign: JSON.parse(currentSubLayout.Design),
			validationRules: {},
			label: currentSubLayout.Label
		}
		return {
			component: GetDisplayWidgets(ReferenceTypeWidgetProxy(natureType, referenceType, ReferenceTypeWidget).DisplayWidget[subLayoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}

	getNewLayout(props: { relationViewModel?: RelationViewModel, newLayoutGuid: string, dataModelGuid: string, dataModelsResult: any }): DefineArchiveLayoutDesignerViewModel {
		const { newLayoutGuid, dataModelGuid, dataModelsResult } = props;

		const newLayoutDesigner: DefineArchiveLayoutDesignerViewModel = {
			Guid: newLayoutGuid,
			DataModelGuid: dataModelGuid,
			Label: null,
			Type: LayoutType.DefineArchive,
			PlatformType: LayoutPlatformType.Web,
			Design: JSON.stringify({
				Widget: {
					Id: 0,
					SearchSetting: {
						Enable: false,
						LayoutItemGuid: null,
						ColumnViewModelGuid: null
					}
				},
			}),
			IsDefault: false,
			Items: [],
			State: "Added",
			DefineLayoutGuid: null,
			Plugins: [],
			DataModelInfo: dataModelsResult,
		};
		return newLayoutDesigner;
	}

	getDesigner(data: DesignerHelperViewModel<DefineArchiveLayoutDesignerViewModel>) {
		return LayoutDefineArchiveDesigner
	}

	getDesignSettingOfLayout(layout: DefineArchiveLayoutViewModel) {

	}

	getLayoutComponent(props: { currentLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory }) {
		const { currentLayout, widgetFactory } = props;

		const layoutDesign: ArchiveLayoutSetting = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
		const layoutColumnDesign = this.getLayoutColumnDesign({
			columns: [...currentLayout.Items].sort((a, b) => {
				return a.OrderIndex - b.OrderIndex;
			}), widgetFactory
		});
		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: layoutColumnDesign,
			initValue: [],
			layoutDesign: JSON.parse(currentLayout.Design),
			validationRules: {},
		}
		return {
			component: GetDisplayWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToMany, ReferenceTypeWidget).DisplayWidget[layoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}

}

class InlineArchiveLayoutHelper extends LayoutHelper<LayoutViewModel, InlineArchiveLayoutDesignerViewModel> {
	type = LayoutType.InlineArchive;
	constructor({ isSimpleDesignerMode }) {
		super();
		this.isSimpleDesignerMode = isSimpleDesignerMode;
	}
	getLayoutColumnDesign(props: { columns: LayoutItemDesignerViewModel[], widgetFactory: IWidgetFactory, validations: ValidationViewModel[], mode: WidgetType }): ModernTableColumnProps<any>[] {
		return props.columns.map((item) => {
			const DesignItem: BaseLayoutItemSetting = JSON.parse(item.Design);
			const rules = props.validations.filter(x => x.LayoutItemGuid === item.Guid);
			let ruleObject = {};
			rules.forEach(rule => {
				if (!!rule.Setting) {
					const obj = JSON.parse(rule.Setting.toLocaleLowerCase())
					Object.keys(obj).forEach(key => {
						if (key === "regex") {
							ruleObject["pattern"] = new RegExp(obj[key]);
						} else {
							ruleObject[key] = obj[key]
						}
					})
				}
			});
			let dataModelSetting;
			if (this.isSimpleDesignerMode) {
				dataModelSetting = (item as RichLayoutItem).simpleDesignerData.DataModelInfo.setting;
			} else {
				dataModelSetting = props.widgetFactory.getDataModelSetting(item) as any;
			}
			dataModelRules.setting = dataModelSetting;
			dataModelRules.rules = ruleObject;

			let computedRules = { ...dataModelRules[dataModelSetting?.dataType], ...ruleObject };
			const dataType = this.isSimpleDesignerMode ? convertDesignerVersion2WidgetTypeToDataType((item as RichLayoutItem).simpleDesignerData.simpleDesignerWidgetType) : (props.widgetFactory.getDetailOfDataModel(item) as ColumnViewModel).DataType;
			return {
				rules: Object.keys(computedRules).length !== 0 ? computedRules : undefined,
				Header: DesignItem.Label,
				accessor: DesignItem.Label,
				dataIndex: item.Type === LayoutItemType.Column
					? (item as LayoutItemColumnViewModel).ColumnGuid
					: (item as LayoutItemReferenceViewModel).RelationGuid,
				editComponent: props.widgetFactory.getComponentByMode(item.Guid, WidgetType.EditWidget).component,
				viewComponent: props.widgetFactory.getComponentByMode(item.Guid, WidgetType.DisplayWidget).component,
				staticProps: { validationRules: { setting: dataModelSetting?.setting }, columnSetting: item.Design, dataType: dataType }
			} as ModernTableColumnProps<any>;
		})
	}

	getSubLayoutComponent(props: { currentSubLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory, mode?: WidgetType }): ComponentModel {
		const { currentSubLayout, referenceType, widgetFactory, natureType, mode } = props;

		const subLayoutDesign: ArchiveLayoutSetting = JSON.parse(currentSubLayout.Design) as ArchiveLayoutSetting;
		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: this.getLayoutColumnDesign({
				columns: [...currentSubLayout.Items].sort((a, b) => {
					return a.OrderIndex - b.OrderIndex;
				}), widgetFactory, validations: (currentSubLayout as InlineArchiveLayoutViewModel).Validations, mode
			}),
			initValue: [],
			layoutDesign: JSON.parse(currentSubLayout.Design),
			validationRules: {},
			label: currentSubLayout.Label
		}
		return {
			component: mode === WidgetType.DisplayWidget ?
				GetDisplayWidgets(ReferenceTypeWidgetProxy(natureType, referenceType, ReferenceTypeWidget).DisplayWidget[subLayoutDesign.Widget.Id])
				: GetEditWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToMany, ReferenceTypeWidget).EditWidget[subLayoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}

	getNewLayout(props: { relationViewModel?: RelationViewModel, newLayoutGuid: string, dataModelGuid: string }): InlineArchiveLayoutDesignerViewModel {
		const { relationViewModel, newLayoutGuid, dataModelGuid } = props;

		const newLayoutDesigner: InlineArchiveLayoutDesignerViewModel = {
			Guid: newLayoutGuid,
			DataModelGuid: dataModelGuid,
			Label: `${translate(`Form`)} ${translate(`LayoutType_Define`)}`,
			Type: LayoutType.InlineArchive,
			PlatformType: LayoutPlatformType.Web,
			Design: JSON.stringify({
				Widget: {
					Id: 0,
					SearchSetting: {
						Enable: false,
						LayoutItemGuid: null,
						ColumnViewModelGuid: null
					}
				},
				DefineLayoutGuid: null,
				Events: [],
			}),
			IsDefault: false,
			Items: [],
			State: "Added",
			Validations: [],
			ComplexValidations: [],
			Plugins: [],
			DataModelInfo: {},
		};

		return newLayoutDesigner;
	}

	getDesigner(data: DesignerHelperViewModel<ArchiveLayoutDesignerViewModel>) {
		return this.isSimpleDesignerMode ? LayoutInlineArchiveSimpleDesigner : LayoutInlineArchiveDesigner;
	}

	getDesignSettingOfLayout(layout: InlineArchiveLayoutViewModel) {
		return JSON.parse(layout.Design) as Design;
	}

	getLayoutComponent(props: { currentLayout: LayoutViewModelWithState, referenceType: RelationType, natureType: RelationNature, widgetFactory: IWidgetFactory, widgetsMode: WidgetType }) {
		const { currentLayout, widgetFactory } = props;

		const layoutDesign: ArchiveLayoutSetting = JSON.parse(currentLayout.Design) as ArchiveLayoutSetting;
		const layoutColumnDesign = this.getLayoutColumnDesign({
			columns: [...currentLayout.Items].sort((a, b) => {
				return a.OrderIndex - b.OrderIndex;
			}), widgetFactory, validations: (currentLayout as InlineArchiveLayoutViewModel).Validations, mode: props.widgetsMode
		});

		const SettingArchiveReference: ReferenceArchiveWidgetProps = {
			columns: layoutColumnDesign,
			initValue: [],
			layoutDesign: JSON.parse(currentLayout.Design),
			validationRules: {},
		}
		return {
			component: (!!props.widgetsMode && props.widgetsMode === WidgetType.DisplayWidget) ? GetDisplayWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToMany, ReferenceTypeWidget).DisplayWidget[layoutDesign.Widget.Id]) : GetEditWidgets(ReferenceTypeWidgetProxy(RelationNature.Composition, RelationType.OneToMany, ReferenceTypeWidget).EditWidget[layoutDesign.Widget.Id]),
			setting: SettingArchiveReference,
			rule: [],
			layoutItemType: LayoutItemType.SubLayout,
		};
	}
}

export const importSoftwareModelComponents = ({
	softwareModels,
	context,
}: { softwareModels: WebSoftwareComponentViewModel[]; context: DidgahContextProps }): Promise<any>[] => {
	const softwareModelModules: Promise<any>[] = softwareModels.map(
		(model) => {
			const softwares = context.commandHandler.getDidgahSoftwares();
			const softwareContext = softwares.find(
				(item) => item.Guid.toLowerCase() === model.SoftwareGuid.toLowerCase()
			);
			return importModule(`/${softwareContext.Url}${model.IndexFilePath}`);
		}
	);

	return softwareModelModules;
};


