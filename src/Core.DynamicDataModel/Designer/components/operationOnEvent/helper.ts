import { ISimpleCondition, ITreeNode } from "@models/didgah-components";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { FormEvents, LayoutViewModelWithState } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";

export function mapOperationOnEventToFormEvents(data: any[]): FormEvents[] {
	return data.map(item => ({
		Title: item.title,
		LayoutItems: item.events.Condition.Condition.map((condition: ISimpleCondition) => ({
			Guid: condition.Field,
			EventId: Number(condition.Operator),
			ExtraData: condition.ExtraData
		})),
		Actions: item.actions.Condition.Condition.map((condition: ISimpleCondition) => ({
			Guid: condition.Field,
			ActionId: Number(condition.Operator),
			CodeXml: condition.Value,
			ExtraData: condition.ExtraData
		}))
	}))

}

function mapLayoutToTreeNode(layout: LayoutViewModelWithState, parentId: string): ITreeNode<any> {
	return {
		Id: layout.Guid,
		ParentId: parentId,
		Text: JSON.parse(layout.Design).Label,
		Hierarchy: [layout.Guid, parentId],
		Children: [],
		DisableSelect: false,
		Metadata: {
			Type: layout.Type
		}
	}
}

function addReferencesToNode(node: ITreeNode<any>, referenceLayout: LayoutItemViewModel, layouts: LayoutViewModelWithState[]) {
	const subLayout = (layouts.find(l => (referenceLayout as unknown as any).SubLayoutGuid === l.Guid) as any);
	let relationNode: ITreeNode<any> = {
		Id: referenceLayout.Guid,
		Children: [],
		Hierarchy: [],
		ParentId: node.Id,
		Text: subLayout.Label,
		DisableSelect: false,
		IsLeaf: false,
		Metadata: {
			isGrid: true
		}
	}


	const archiveReferenceLayouts = subLayout.Items;
	archiveReferenceLayouts?.filter(item => item.Type === LayoutItemType.Column).forEach((item) => {
		relationNode.Children.push({ ...mapLayoutToTreeNode(item as any, node.Id), IsLeaf: true });
	});

	const referenceDefineLayouts = layouts.find(l => l.Guid === subLayout.DefineLayoutGuid)?.Items;
	referenceDefineLayouts?.filter(item => item.Type === LayoutItemType.SubLayout).forEach((item) => {
		const newItem = addReferencesToNode(relationNode, item, layouts);
		relationNode = newItem;
	});

	node.Children.push(relationNode)
	return { ...node };
}

function mapColumnToTreeNode(column: any, parentId: string): ITreeNode<any> {
	return {
		Id: column.Guid,
		ParentId: parentId,
		Text: column.Label,
		Hierarchy: [column.Guid, parentId],
		Children: [],
		DisableSelect: false,
		Metadata: {
			Type: LayoutItemType.Column
		}
	}
}

export function generateLayoutTree(rootLayoutGuid: string, layouts: LayoutViewModelWithState[], dataModel?: DataModelViewModel, dataModels?: DataModelViewModel[]) {
	let root = layouts.find(layout => layout.Guid === rootLayoutGuid);
	let rootNode: ITreeNode<any>;
	const rootChildren = dataModel
		? dataModel.Columns.map(col => ({ ...mapColumnToTreeNode(col, root.Guid), IsLeaf: true }))
		: root.Items.filter(item => item.Type === LayoutItemType.Column).map(item => ({ ...mapLayoutToTreeNode(item as any, root.Guid), IsLeaf: true }));
	rootNode = {
		...root,
		Id: root.Guid,
		Text: root.Label,
		ParentId: null,
		Hierarchy: [root.Guid],
		Children: rootChildren,
		DisableSelect: false,
		Metadata: {
			isGrid: true
		}
	};

	if (dataModel && dataModels) {
		dataModel.Relations.forEach(relation => {
			const refDataModel = dataModels.find(dm => dm.Guid.toLowerCase() === relation.ReferenceDataModelGuid.toLowerCase());
			if (refDataModel) {
				const relationNode: ITreeNode<any> = {
					Id: relation.Guid,
					Children: refDataModel.Columns.map(col => ({ ...mapColumnToTreeNode(col, relation.Guid), IsLeaf: true })),
					Hierarchy: [relation.Guid, root.Guid],
					ParentId: rootNode.Id,
					Text: relation.Label,
					DisableSelect: false,
					IsLeaf: false,
					Metadata: { isGrid: true }
				};
				rootNode.Children.push(relationNode);
			}
		});
	} else {
		const rootReferences = root.Items.filter(item => item.Type === LayoutItemType.SubLayout);
		rootReferences.forEach(r => {
			rootNode = addReferencesToNode(rootNode, r, layouts)
		});
	}

	return [rootNode];
}