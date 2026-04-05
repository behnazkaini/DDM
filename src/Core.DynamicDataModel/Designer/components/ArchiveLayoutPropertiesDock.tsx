import { ArchiveWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { guid, translate } from "didgah/common";
import {
	Button,
	Checkbox,
	Form,
	Input,
	Message,
	NumericalInput,
	SideBar,
	StackPanel,
	useAppContext,
	WrappedFormUtils,
} from "didgah/ant-core-component";
import * as React from "react";
import useFloorStack from "../hooks/useFloorStack";
import { GlobalPropsContext, SetPluginValues } from "../store/reducers/designLayoutSlice";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import SearchSettingInput from "./archiveSetting/SearchSetting";
import { getDDMPlugin, loadDDMPlugin, PluggableId } from "../../PluginHelper/plugable";
import { useAppDispatch } from "../store/hook";
import { SaveLayoutPluginViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";
import { DDMPlugin } from "@didgah/ddm-plugins";

const Dock = SideBar;
const FormRow = Form.Row;

interface ArchiveLayoutPropertiesDockProps {
	form?: WrappedFormUtils<any>;
	archiveLayoutWidgetSetting: ArchiveWidget;
	onSaveFormSetting: (setting: any) => void;
	layoutItems: Array<LayoutItemViewModel>;
	plugins: DDMPlugin[];
}

const ArchiveLayoutPropertiesDock = (
	props: ArchiveLayoutPropertiesDockProps
) => {
	const appContext = useAppContext();
	const { form, archiveLayoutWidgetSetting, onSaveFormSetting, layoutItems, plugins } =
		props;
	const { layoutGuid } = React.useContext(GlobalPropsContext);
	const [loading, setLoading] = React.useState(true);
	const { currentFloor, currentDataModel, currentLayout } = useFloorStack({
		layoutGuid: layoutGuid,
	});
	const dispatch = useAppDispatch();
	const getInitialData = (pluginGuid: string) => {

		const plugins = currentLayout.Plugins ? [...currentLayout.Plugins] : [];
		const plugin = plugins.find(p => p.PluginGuid.toLowerCase() === pluginGuid.toLowerCase());
		const parseData = plugin?.Value && typeof plugin.Value === 'string' ? JSON.parse(plugin.Value) : plugin?.Value ?? null
		return parseData
	}

	const onPluginValueChange = (pluginGuid, pluginValue) => {
		const plugins = currentLayout.Plugins ? [...currentLayout.Plugins] : [];
		const currentIndex = plugins.findIndex(p => p.PluginGuid.toLowerCase() === pluginGuid.toLowerCase());
		if (currentIndex > -1) {
			plugins[currentIndex] = { ...plugins[currentIndex], Value: pluginValue }
		} else {
			plugins.push({
				LayoutGuid: layoutGuid,
				Guid: guid.newGuid(),
				PluginGuid: pluginGuid,
				Value: pluginValue
			});
		}

		dispatch(SetPluginValues({
			LayoutGuid: layoutGuid,
			plugins
		}))
	}

	const onSave = () => {
		form.validateFields((errors, values) => {
			if ((+values.MaxRow > 1000 && +values.MaxRow < 1) || (+values.MinRow > 1000 && +values.MinRow < 1)) {
				Message.warning(translate('MaxRowAndMinRowShouldBetweenOneAndThousand'));
				return;
			}
			if (+values.MaxRow && +values.MinRow > +values.MaxRow) {
				Message.warning(translate('MinRowShouldLesserOrEqualMaxRow'));
				return
			}
			if (!errors) {
				onSaveFormSetting(values);
			}
		})
	};

	const Header = () => {
		return "header content";
	};

	React.useEffect(() => {
		const myPlugins = plugins.filter(p => p.pluggableId === PluggableId.archiveLayoutPropertiesDock);
		Promise.all(myPlugins.map(p => loadDDMPlugin(p.name, appContext.DebugMode))).then(() => {
			setLoading(false);
		});
	}, []);

	return (
		!loading && !!currentFloor.PropertiesDockLayoutState.LayoutFocus && (
			<div style={{ zIndex: 20, position: "sticky" }}>
				<Dock
					Docked={currentFloor.PropertiesDockLayoutState.IsOpen}
					header={Header}
					size={300}
					PullLeft={true}
				>
					<StackPanel widthRatio={1} verticalMode={true}>
						<FormRow>
							<Form.Item
								label={translate("DDMSearchSetting")}
								labelCol={{ span: 0, offset: 0 }}
								wrapperCol={{ span: 24, offset: 0 }}
							>
								{form.getFieldDecorator("SearchSetting", {
									initialValue: archiveLayoutWidgetSetting.SearchSetting,
								})(
									<SearchSettingInput
										layoutItems={layoutItems}
									></SearchSettingInput>
								)}
							</Form.Item>
						</FormRow>
						<FormRow>
							<div style={{ marginTop: 10 }}>
								<Form.Item
									label={translate("DDMArchivePagination")}
									labelCol={{ span: 8, offset: 0 }}
									wrapperCol={{ span: 16, offset: 0 }}
								>
									{form.getFieldDecorator("HasPagination", {
										initialValue: archiveLayoutWidgetSetting.HasPagination,
										valuePropName: "checked"
									})(<Checkbox></Checkbox>)}
								</Form.Item>
							</div>
						</FormRow>
						<FormRow>
							<div style={{ marginTop: 10 }}>
								<Form.Item
									label={translate("DDMColumnSort")}
									labelCol={{ span: 8, offset: 0 }}
									wrapperCol={{ span: 16, offset: 0 }}
								>
									{form.getFieldDecorator("HasSort", {
										initialValue: archiveLayoutWidgetSetting.HasSort,
										valuePropName: "checked"
									})(<Checkbox></Checkbox>)}
								</Form.Item>
							</div>
						</FormRow>
						{plugins.filter(p => p.pluggableId === PluggableId.archiveLayoutPropertiesDock).map(p => {
							const PluginComponent = getDDMPlugin(p.name);
							const pluginProps = {
								dataModel: currentDataModel
							};
							return <FormRow>
								<div style={{ marginTop: 10 }}>
									<Form.Item
										label={p.name}
										labelCol={{ span: 8, offset: 0 }}
										wrapperCol={{ span: 16, offset: 0 }}
									>
										<PluginComponent {...pluginProps}
											value={getInitialData(p.guid)}
											onChange={(val) => {
												onPluginValueChange(p.guid, val)
											}} />
									</Form.Item>
								</div>
							</FormRow>
						})}

						<FormRow>
							<Form.Item
								labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("MaxRow")}
							>
								{form.getFieldDecorator("MaxRow", {
									initialValue: archiveLayoutWidgetSetting.MaxRow, rules: [
										{ max: 1000, min: 1, type: 'number', message: translate('ValueRangeViolation').replace('{1}', '1000').replace('{0}', '1') },
									]
								})(<NumericalInput />)}
							</Form.Item>
						</FormRow>
						<FormRow>
							<Form.Item
								labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("MinRow")}
							>
								{form.getFieldDecorator("MinRow", {
									initialValue: archiveLayoutWidgetSetting.MinRow, rules: [
										{ max: 1000, min: 1, type: 'number', message: translate('ValueRangeViolation').replace('{1}', '1000').replace('{0}', '1') },
										{ validator: (_, value) => (value && form.getFieldValue('MaxRow')) ? value <= form.getFieldValue('MaxRow') : true, message: translate('MinRowShouldLesserOrEqualMaxRow') }
									]
								})(<NumericalInput />)}
							</Form.Item>
						</FormRow>
						<FormRow>
							<Form.Item labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("CanAddRow")}>
								{form.getFieldDecorator("ImpossibilityAdd", {
									initialValue: archiveLayoutWidgetSetting.ImpossibilityAdd,
									valuePropName: "checked"
								})(<Checkbox />)}
							</Form.Item>
							<Form.Item
								labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("CanRemoveRow")}
							>
								{form.getFieldDecorator("ImpossibilityRemove", {
									initialValue: archiveLayoutWidgetSetting.ImpossibilityRemove,
									valuePropName: "checked"
								})(<Checkbox />)}
							</Form.Item>
						</FormRow>
						<FormRow>
							<Form.Item
								labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("CanImportDataTable")}
							>
								{form.getFieldDecorator("CanImportDataTable", {
									initialValue: archiveLayoutWidgetSetting.CanImportDataTable,
									valuePropName: "checked"
								})(<Checkbox />)}
							</Form.Item>
							<Form.Item
								labelCol={{ span: 12, offset: 0 }}
								wrapperCol={{ span: 12, offset: 0 }}
								label={translate("CanExportDataTable")}
							>
								{form.getFieldDecorator("CanExportDataTable", {
									initialValue: archiveLayoutWidgetSetting.CanExportDataTable,
									valuePropName: "checked"
								})(<Checkbox />)}
							</Form.Item>
						</FormRow>
						<FormRow>
							<Button type={"primary"} onClick={onSave}>{translate("Save")}</Button>
						</FormRow>
					</StackPanel>
				</Dock>
			</div>
		)
	);
};

export default Form.create()(ArchiveLayoutPropertiesDock);
