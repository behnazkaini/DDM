import { Checkbox, CustomIcon, Form, FormLayout, Icon, Input, SelectEx, SelectItem } from "didgah/ant-core-component";
import React, { useState } from "react"
import { translate } from "../../../Utility/language";
import { useAppDispatch } from "../store/hook";
import { SetFormNameSetting, SetBookmarkSetting, SetDataModelNameSetting, SimpleDesignerGlobalPropsContext, SetIsDefaultForm } from "../store/reducers/designLayoutSlice";
import modelerTransportLayer from '../../Modeler/transportLayer';
import useFloorStack from "../hooks/useFloorStack";
import { validNameRegex } from "../../../Core.DynamicDataModel/Modeler/Utility";
import { LayoutViewModelWithState, RichLayoutItem } from "../../../typings/Core.DynamicDataModel/Types";

const FormRow = Form.Row;
const FormItem = Form.Item;
const LayoutContent = FormLayout.LayoutContent;

const FormPropertiesDock = (props) => {
    const { layoutGuid, toggleDockCallBack, form } = props;
    const { getFieldDecorator } = form;
    const dispatch = useAppDispatch();
    const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
    const { currentLayout } = useFloorStack({
        layoutGuid: globalProps.layoutGuid,
    });
    const { Label, DataModelInfo } = currentLayout as any;

    const handleFormNameChange = (e) => {
        dispatch(
            SetFormNameSetting({
                LayoutGuid: layoutGuid,
                formName: e.target.value,
            })
        );
    }

    const handleDataModelNameChange = (e) => {
        dispatch(
            SetDataModelNameSetting({
                LayoutGuid: layoutGuid,
                dataModelName: e.target.value,
            })
        );
    }

    const handleBookmarkChange = (e) => {
        dispatch(
            SetBookmarkSetting({
                LayoutGuid: layoutGuid,
                Bookmark: e.target.value,
            })
        );
    }

    const handleIsDefaultFormChange = (e) => {
        dispatch(
            SetIsDefaultForm({
                LayoutGuid: layoutGuid,
                IsDefault: e.target.checked,
            })
        );
    }

    const formItemSetting = {
        labelCol: { span: 0, offset: 0 },
        wrapperCol: { span: 24, offset: 0 }
    };

    return (
        <FormLayout style={{ backgroundColor: 'transparent' }}>
            <LayoutContent style={{ backgroundColor: 'transparent' }}>
                <div
                    style={{
                        backgroundColor: '#3578ac',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0px -5px',
                        marginTop: '-5px',
                        padding: '5px',
                        minHeight: '40px',
                        height: '40px',
                    }}
                    className="propertiesdock_header"
                >
                    <div
                        style={{
                            fontSize: 'var(--font-size-md)'
                        }}
                        className="propertiesdock_button-wrapper"
                    >
                        تنظیمات
                    </div>
                    <div className="propertiesdock_button-wrapper" style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
                        <CustomIcon
                            style={{
                                fontSize: '20px'
                            }}
                            type="angle-left"
                            onClick={toggleDockCallBack}
                        />
                    </div>
                </div>
                <FormRow>
                    <FormItem
                        label={`${translate("Name")} ${translate("Form")}`}
                        {...formItemSetting}
                    >
                        {getFieldDecorator('FormName', { initialValue: Label, rules: [{ required: true }] })(
                            <Input
                                type="text"
                                onChange={handleFormNameChange}
                            ></Input>)}
                    </FormItem>
                </FormRow>
                <FormRow>
                    <FormItem
                        label={`${translate("DataModelName")}`}
                        {...formItemSetting}
                    >
                        {getFieldDecorator('DataModelName', { initialValue: DataModelInfo?.Name, rules: [{ required: true, pattern: validNameRegex, message: translate('DDMModelerTableNameincorrect') }] })(
                            <Input
                                type="text"
                                onChange={handleDataModelNameChange}
                                disabled={(currentLayout as LayoutViewModelWithState).State !== 'Added'}
                                ></Input>)}
                    </FormItem>
                </FormRow>
                <FormRow>
                    <FormItem
                        label={`${translate("Bookmark")}`}
                        {...formItemSetting}
                    >
                        {getFieldDecorator('Bookmark', { initialValue: DataModelInfo?.Bookmark, rules: [] })(
                            <Input
                                type="text"
                                onChange={handleBookmarkChange}
                            ></Input>)}
                    </FormItem>
                </FormRow>
                <FormRow>
                    <FormItem
                        label={`${translate("IsDefault")}`}
                        {...formItemSetting}
                    >
                        {getFieldDecorator('IsDefault', { initialValue: currentLayout.IsDefault, rules: [], valuePropName: 'checked' })(
                            <Checkbox
                                onChange={handleIsDefaultFormChange}
                            />)}
                    </FormItem>
                </FormRow>
            </LayoutContent>
        </FormLayout>
    )
};

export default Form.create()(FormPropertiesDock);
