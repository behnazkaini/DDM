import * as React from "react";
import { LayoutValueResponseViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import {
	Button,
	Form,
	FormComponentProps,
	FormLayout,
	Modal,
	Spin,
	useAjax,
} from "didgah/ant-core-component";
import * as Blockly from "blockly";
import { translate } from '../../../../Utility/language';
import { ActionReferenceArchiveProps, ComponentModel, ISetupData, RendererLayoutProps } from "../../../../typings/Core.DynamicDataModel/Types";
import useInlineArchiveHook from './useInlineArchiveHook';
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";

type RenderInParentComp = {
	hasParent?: true,
	parentInitialData?: LayoutValueResponseViewModel
}

type RenderWithoutParent = {
	hasParent?: false,
	parentInitialData?: never
}

type InlineArchiveLayoutProps = (RenderInParentComp | RenderWithoutParent) & RendererLayoutProps<LayoutValueResponseViewModel> & FormComponentProps;

function inlineArchiveLayout({ hasParent = false, onChange=()=> null, widgetsMode, onGetSavedData = () => undefined, parentInitialData, layoutGuid, dataModelGuid, inLoadableMode, form, onSave, previewInitialDataForDesigner, webSoftwareComponents, context, remoteDataSource,primaryKey, softwareGuid, isSimpleDesignerMode,dataModels }: InlineArchiveLayoutProps) {
	const {
    getComponentData,
    setupDataValue,
    getSavedAndValidationData,
    getterSavedData,
    hideValidationError,
    showValidationError,
    handlerActionOnTable,
		loading,
		getTableHandler
  } = useInlineArchiveHook({
    hasParent,
		layoutGuid,
		parentInitialData,
		dataModelGuid,
		previewInitialDataForDesigner,
		webSoftwareComponents,
		context,
		remoteDataSource,
		widgetsMode,
		isSimpleDesignerMode
  });

	React.useEffect(() => {
		if (!loading) {
			onGetSavedData(getterSavedData());
		}
	}, [loading]);

	const showValidationErrorModal = () => {
    Modal.error({
      title: translate('Error'),
      content: <ul>{showValidationError.message}</ul>,
      onOk: hideValidationError
    })
  }

	function handleSave() {
		getSavedAndValidationData().then((result) => {
			onSave(result)
		});
	}

	function setActionOnTable(handler: ActionReferenceArchiveProps) {
		handlerActionOnTable(handler)
	}

	function handleChange() {
		const tableHandler = getTableHandler();
		if(tableHandler){
			onChange(tableHandler.getData(), tableHandler, setupDataValue);
		}
	}

	function getArchiveComponent() {
		const componentData = getComponentData();
		const ComponentElement = (componentData.component as any).component;
		const componentProps = {
			...componentData.setting,
			initValue: setupDataValue.data,
			mode: 'render',
			//Disabled: setDisabeldFormItem(design.LayoutItemGuid, actions),
			validationRules: { ...componentData.rule, ...(componentData as ComponentModel).dataModelSetting },
			onChange: (value, metadata) => handleChange(),
      dataModelGuid,
      primaryKey,
      layoutGuid:parentInitialData?.Guid,
      softwareGuid,
      currentLayout:setupDataValue.currentLayout,
			label: setupDataValue?.currentLayout.Label,
      dataModels
		};
		if (!!ComponentElement) {
			return (
				<>
					<Form.Item label={setupDataValue?.currentLayout.Label} wrapperCol={{span:24}} className='didgah-ddm-renderer'>
						{form.getFieldDecorator(layoutGuid)( <ComponentElement {...componentProps} onActionOnTable={setActionOnTable}></ComponentElement>)}
					</Form.Item>
				</>
			)
		}
		return;
	}

  React.useEffect(()=>{
    if(!!showValidationError && !showValidationError.succeedded){
      showValidationErrorModal()
    }
  },[showValidationError])
  
	const content = <Spin spinning={loading}>
		{!loading &&
			<>
				{getArchiveComponent()}
			</>
		}
	</Spin>

	return (
		<>
			{!inLoadableMode ? <FormLayout>
				<FormLayout.LayoutContent>
					{content}
				</FormLayout.LayoutContent>
				<FormLayout.ActionBar>
					<Button onClick={handleSave} type='primary'>{translate('Save')}</Button>
				</FormLayout.ActionBar>
			</FormLayout> : content}
		</>
	);
}

export default Form.create({})(inlineArchiveLayout);
