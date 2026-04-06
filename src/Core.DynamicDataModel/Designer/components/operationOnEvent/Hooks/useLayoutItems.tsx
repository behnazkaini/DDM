import React, { useMemo } from 'react';
import {
	GlobalPropsContext,
} from "../../../store/reducers/designLayoutSlice";
import useFloorStack from '../../../hooks/useFloorStack';
import { LayoutItemType } from '../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';

function useLayoutItems() {
	const globalProps = React.useContext(GlobalPropsContext);
	const { currentDataModel } = useFloorStack({
		layoutGuid: globalProps.layoutGuid,
	});

	const layoutItems = useMemo(() => {
		const columns = currentDataModel.Columns.map(col => ({
			key: col.Label,
			value: col.Guid,
			Type: LayoutItemType.Column
		}));
		const relations = currentDataModel.Relations.map(rel => ({
			key: rel.Label,
			value: rel.Guid,
			Type: LayoutItemType.Reference
		}));
		return [...columns, ...relations];
	}, []);

	return layoutItems;
}

export default useLayoutItems;
