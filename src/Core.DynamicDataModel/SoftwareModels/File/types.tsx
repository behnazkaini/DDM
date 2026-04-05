import { WrappedFormUtils } from 'didgah/ant-core-component';
import React from "react";

export enum WidgetNames {
	FileSelectorOneToOne = "FileSelectorOneToOne",
	FileSelectorOneToMany = "FileSelectorOneToMany",
	FileDisplayOneToOne = "FileDisplayOneToOne",
	FileDisplayOneToMany = "FileDisplayOneToMany",
}

export enum SettingName {
	AllowedExtensions = "AllowedExtensions",
	AllowedFileCount = "AllowedFileCount",
}

export interface EntityComponentSettingFormProps {
	initialSettingValues: any;
	onSettingChanged: () => void;
	form?: WrappedFormUtils<any>;
	Widget: string;
	EditWidget: { Id: number };
	DisplayWidget: { Id: number };
	commonSettingWidget: React.ReactNodeArray;
	settingMap: Record<string, SettingType>;
	layoutType: LayoutType;
	relationViewModel: any;
	componentName: string;
}

export interface AggregationOneToManyValue {
	metadata: AggregaionComponentValueMetadata;
	tokens: Array<AggregationOneToManyValueTokens>;
}

export interface AggregationOneToManyValueTokens {
	id: string;
	rowData: Array<{ Key: string; Value: string }>;
	title: string;
}

interface AggregaionComponentValueMetadata {
	ColumnGuids: Array<string>;
	DataModelGuid: string;
}

export interface AggregationOneToOneValue {
	key: string;
	label: string;
	metadata: AggregaionComponentValueMetadata
	rowData: Array<{ Key: string; Value: string }>;
}

export enum DirectionType {
	Auto = "unset",
	Right = "rtl",
	Left = "ltr",
}

export enum LayoutType {
	Define = 1,
	Archive = 2,
	DefineArchive = 3,
	InlineArchive = 4,
}

export interface SettingType {
	[LayoutType.Define]: Array<string>;
	[LayoutType.Archive]?: Array<string>;
}

export interface SettingFormItemProps<T> {
	initialSettingValues: T;
	settingName: string;
	form: WrappedFormUtils<any>;
	onSave: () => void;
	key: string;
}

export enum RelationNature {
	Aggregation = 1,
	Composition = 2,
}

export enum RelationType {
	OneToOne = 1,
	OneToMany = 2,
}