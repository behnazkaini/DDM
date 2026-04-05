import { LayoutItemType } from "../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";

export const jsBlockInitialXml =`
<xml><block type="main_func" x="-271" y="74" deletable="false"></block></xml>`;
export function convertBadCharactersToXmlValidCharacter(str: string) {
	if(str){
		return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	}
	
} 

export const isWorkspaceLayoutItem =  (item) => item.Type === LayoutItemType.Column || item.Type === LayoutItemType.Reference;