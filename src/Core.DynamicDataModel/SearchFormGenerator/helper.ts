import { ITreeNode } from "@models/didgah-components/lib/Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeNode";
import { DataModelViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { utility, translate } from 'didgah/common';
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { FieldTypesWidget, ReferenceTypeWidget, ReferenceTypeWidgetProxy } from "../TS/Widgets";
import GetDisplayWidgets from "../Widget/Display/index";
import GetEditWidgets from "../Widget/Edit/index";
import { ConditionType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";
import { RelationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { ColumnViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";

export function generateTreeFromTables(tables: DataModelViewModel[], dataModelGuid: string) {
	const rootTable = tables.find(table => table.Guid.toLowerCase() === dataModelGuid.toLowerCase());
	const treeData: ITreeNode<any>[] = [{
		Id: rootTable.Guid,
		ParentId: null,
		Text: rootTable.Label,
		DisableSelect: true,
		Hierarchy: [],
		Children: [...recursiveColumnTree(rootTable.Columns, dataModelGuid, []), ...rootTable.Relations.map((relation) => recursiveRelationTree(relation, []))],
	}];

	function recursiveColumnTree(columns: ColumnViewModel[], dataModelGuid: string, parentHierarchy: string[]): ITreeNode<any>[] {
		return columns.map(column =>
		({
			Id: column.Guid,
			Text: column.Label,
			Hierarchy: [...parentHierarchy, dataModelGuid, column.Guid],
			ParentId: dataModelGuid,
			Children: null,
			IsLeaf: true,
			Metadata: {
				DataModelGuid: dataModelGuid,
				RelationGuid: null,
				Type: 'Column',
				DataType: column.DataType
			}
		})
		)
	}

	function recursiveRelationTree(relationTable: RelationViewModel, parentHierarchy: string[]): ITreeNode<any> {
		const rootTable = tables.find(table => table.Guid.toLowerCase() === relationTable.ReferenceDataModelGuid.toLowerCase());
		const relationRootGuid = utility.newGuid();

		return {
			Id: relationRootGuid,
			Text: relationTable.Label,
			ParentId: rootTable.Guid,
			Hierarchy: [...parentHierarchy, relationRootGuid],
			DisableSelect: true,
			Children: [...recursiveColumnTree(rootTable.Columns, rootTable.Guid, [...parentHierarchy, relationRootGuid]), ...rootTable.Relations.map((relation) => recursiveRelationTree(relation, [...parentHierarchy, relationRootGuid]))],
			IsLeaf: rootTable.Relations.length > 0 || rootTable.Columns.length > 0 ? false : true
		};
	}

	return treeData;
}

export function getComponent(type: 'Column' | 'Relation', mode: 'Edit' | 'Display', data: { DataType?: number, RelationType?: number, RelationNature?: number }) {
	const { DataType, RelationNature, RelationType } = data;

	switch (type) {
		case 'Column':
			switch (mode) {
				case 'Display':
					return GetDisplayWidgets(FieldTypesWidget[DataType]['DisplayWidget']['0']);
				case 'Edit':
					return GetEditWidgets(FieldTypesWidget[DataType]['EditWidget']['0']);
				default:
					return;
			}
		case 'Relation':
			switch (mode) {
				case 'Display':
					return GetDisplayWidgets(ReferenceTypeWidgetProxy(RelationNature, RelationType, ReferenceTypeWidget)['DisplayWidget']['0']);
				case 'Edit':
					return GetEditWidgets(ReferenceTypeWidgetProxy(RelationNature, RelationType, ReferenceTypeWidget)['EditWidget']['0']);
				default:
					return;
			}
	}
}

export const dataTypeOperators = {
	[ColumnDataType.BigInteger]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
		{ key: translate('GreaterEquals'), value: ConditionType.GreaterEquals },
		{ key: translate('LowerEquals'), value: ConditionType.LowerEquals },
		{ key: translate('Greater'), value: ConditionType.Greater },
		{ key: translate('Lower'), value: ConditionType.Lower },
		{ key: translate('Contains'), value: ConditionType.Contains },
		{ key: translate('NotContains'), value: ConditionType.NotContains },
		{ key: translate('StartsWith'), value: ConditionType.StartsWith },
		{ key: translate('EndsWith'), value: ConditionType.EndsWith }
	],
	[ColumnDataType.Boolean]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
	],
	[ColumnDataType.DateTime]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
		{ key: translate('GreaterEquals'), value: ConditionType.GreaterEquals },
		{ key: translate('LowerEquals'), value: ConditionType.LowerEquals },
		{ key: translate('Greater'), value: ConditionType.Greater },
		{ key: translate('Lower'), value: ConditionType.Lower },
		{ key: translate('Contains'), value: ConditionType.Contains },
		{ key: translate('NotContains'), value: ConditionType.NotContains },
		{ key: translate('StartsWith'), value: ConditionType.StartsWith },
		{ key: translate('EndsWith'), value: ConditionType.EndsWith }
	],
	[ColumnDataType.Decimal]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
		{ key: translate('GreaterEquals'), value: ConditionType.GreaterEquals },
		{ key: translate('LowerEquals'), value: ConditionType.LowerEquals },
		{ key: translate('Greater'), value: ConditionType.Greater },
		{ key: translate('Lower'), value: ConditionType.Lower },
		{ key: translate('Contains'), value: ConditionType.Contains },
		{ key: translate('NotContains'), value: ConditionType.NotContains },
		{ key: translate('StartsWith'), value: ConditionType.StartsWith },
		{ key: translate('EndsWith'), value: ConditionType.EndsWith }
	],
	[ColumnDataType.Integer]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
		{ key: translate('GreaterEquals'), value: ConditionType.GreaterEquals },
		{ key: translate('LowerEquals'), value: ConditionType.LowerEquals },
		{ key: translate('Greater'), value: ConditionType.Greater },
		{ key: translate('Lower'), value: ConditionType.Lower },
		{ key: translate('Contains'), value: ConditionType.Contains },
		{ key: translate('NotContains'), value: ConditionType.NotContains },
		{ key: translate('StartsWith'), value: ConditionType.StartsWith },
		{ key: translate('EndsWith'), value: ConditionType.EndsWith }
	],
	[ColumnDataType.String]: [
		{ key: translate('Equals'), value: ConditionType.Equals },
		{ key: translate('NotEquals'), value: ConditionType.NotEquals },
		{ key: translate('GreaterEquals'), value: ConditionType.GreaterEquals },
		{ key: translate('LowerEquals'), value: ConditionType.LowerEquals },
		{ key: translate('Greater'), value: ConditionType.Greater },
		{ key: translate('Lower'), value: ConditionType.Lower },
		{ key: translate('Contains'), value: ConditionType.Contains },
		{ key: translate('NotContains'), value: ConditionType.NotContains },
		{ key: translate('StartsWith'), value: ConditionType.StartsWith },
		{ key: translate('EndsWith'), value: ConditionType.EndsWith }
	]
}

export function logProxy(title,proxy) {
	const keys = Object.keys(proxy);
	const entries = keys.map(key => [key, proxy[key]]);
	console.log("proxy:",title);
	console.table(entries); 
}