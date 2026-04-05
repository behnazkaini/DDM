import React from 'react'
import { SearchTreeNodeMetadataModel } from './types';
import { RelationalOperatorType } from '../../Models/Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType';
import {ITreeNode} from '@models/didgah-components'
import { ReactElementType } from 'react-window';

export type SearchFormGeneratorContextType = {
	fieldsOperators: { [key: string]: RelationalOperatorType[]; } | null;
	searchTreeNodes: ITreeNode<any>[] | null;
	getViewComponent: (type: 'Column' | 'Relation', metadata:  { DataType?: number, RelationType?: number, RelationNature?: number }) => ReactElementType | null;
	getEditComponent: (type: 'Column' | 'Relation', metadata:  { DataType?: number, RelationType?: number, RelationNature?: number }) => ReactElementType | null;
}

const SearchFormGeneratorContext = React.createContext<SearchFormGeneratorContextType>({
	fieldsOperators: null,
	searchTreeNodes: null,
	getViewComponent: null,
	getEditComponent: null,
})

export default SearchFormGeneratorContext;