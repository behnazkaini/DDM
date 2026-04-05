import { TreeStore } from '@didgah-components/ant-tree-ex/utils';
import { useAjax } from 'didgah/ant-core-component';
import React, { useEffect, useRef, useState } from 'react';
import { generateTreeFromTables } from '../../../SearchFormGenerator/helper';
import transportLayer from './transportLayer';
import { DataModelViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';
import { generateLayoutTree } from './helper';
import { GlobalPropsContext } from '../../store/reducers/designLayoutSlice';
import useFloorStack from '../../hooks/useFloorStack';

export default function useDataModelTreeStructure({dataModelGuid}) {
	const ajax = useAjax();
	const { getTables } = transportLayer(ajax);
	const [loading, setLoading] = useState(true);
	const treeStore = useRef<TreeStore>(null); 

	const globalProps = React.useContext(GlobalPropsContext);
	const { currentLayout, currentFloor, currentDataModel } = useFloorStack({
		layoutGuid: globalProps.layoutGuid,
	});

    const generateDataModelTreeStructure = async () => {
		const nodes = generateLayoutTree(currentFloor.LayoutGuid, currentFloor.LayoutModels.Layouts, currentDataModel, currentFloor.LayoutModels.DataModels);
    console.log("dd66557",nodes);
		treeStore.current = new TreeStore({ nodes: nodes as any, expandedKeys: [] });
		setLoading(false);
	}

    useEffect(() => {
		generateDataModelTreeStructure();
    }, []);

	return {
        loading,
        treeStore
    }
}