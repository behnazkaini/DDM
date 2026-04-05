
import { TreeNodeType } from '../../Models/Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.TreeNodeType';

export interface SearchTreeNodeMetadataModel {
	NodeType: typeof TreeNodeType[keyof typeof TreeNodeType]
}
