import { ReferenceTypeWidgets, SettingType } from "../../../typings/Core.DynamicDataModel/Types";
import { ReactElementType } from "react-window";
import { WrappedFormUtils } from "didgah/ant-core-component";
import { FunctionComponent } from "react";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

export enum WidgetNames {
    StaffSelectorOneToOne = "StaffSelectorOneToOne",
    StaffDisplayOneToOne = "StaffDisplayOneToOne",
    StaffSelectorOneToMany = "StaffSelectorOneToMany",
    StaffDisplayOneToMany = "StaffDisplayOneToMany",
}

export interface IWidget {
    component: ReactElementType;
}

export enum SettingName {
    AllowedExtensions = "AllowedExtensions",
    AllowedFileCount = "AllowedFileCount",
}

export interface StaffComponentSettingFormProps {
    initialSettingValues: any;
    onSettingChanged: () => void;
    form?: WrappedFormUtils<any>;
    settingMap: Record<string, SettingType>;
    commonSettingWidget: React.ReactNodeArray;
    componentName: string;
    layoutType: LayoutType;
}

export interface IWebSoftwareViewModel {
    component: (id: string) => IWidget,
    widgetMap: { [Key: string]: ReferenceTypeWidgets },
    settingFactory: FunctionComponent<StaffComponentSettingFormProps>,
    widgetSetting: Record<string, SettingType>,
}

export interface SettingFormItemProps<T> {
    initialSettingValues: T;
    settingName: string;
    form: WrappedFormUtils<any>;
    onSave: () => void;
    key: string;
}
