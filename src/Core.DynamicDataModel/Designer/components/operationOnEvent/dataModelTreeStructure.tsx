import { TreeStore } from '@didgah-components/ant-tree-ex/utils';
import React, { useEffect, useRef, useState } from 'react';
import { generateLayoutTree } from './helper';
import { GlobalPropsContext } from '../../store/reducers/designLayoutSlice';
import useFloorStack from '../../hooks/useFloorStack';

export default function useDataModelTreeStructure({ dataModelGuid: _dataModelGuid }: { dataModelGuid: string }) {
  const [loading, setLoading] = useState(true);
  const treeStore = useRef<TreeStore>(null);

  const globalProps = React.useContext(GlobalPropsContext);
  const { currentFloor, currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });

  const generateDataModelTreeStructure = async () => {
    try {
      const nodes = generateLayoutTree(currentFloor.LayoutGuid, currentFloor.LayoutModels.Layouts, currentDataModel, currentFloor.LayoutModels.DataModels);
      treeStore.current = new TreeStore({ nodes: nodes as any, expandedKeys: [] });
    } catch (e) {
      console.error('[dataModelTreeStructure] Failed to build layout tree:', e);
      treeStore.current = new TreeStore({ nodes: [], expandedKeys: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generateDataModelTreeStructure();
  }, []);

  return {
    loading,
    treeStore
  }
}