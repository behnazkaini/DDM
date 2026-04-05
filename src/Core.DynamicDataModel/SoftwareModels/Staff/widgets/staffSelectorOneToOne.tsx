import React, { useEffect } from "react";
import { injectContext } from "didgah/ant-core-component";
import SelectIndividual, { SelectIndividualComponentTypes, SelectIndividualStore } from '@didgah-components/ant-selectindividual';
import { Individual } from '@models/didgah-components';
import { AggregationOneToOneValue, ComponentDefaultProps, ComponentProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";

const SelectStaff = SelectIndividualComponentTypes.SelectStaff;


const StaffSelectorOneToOne = ({ value, mode, primaryKey, onChange, initValue, DefaultValue, dataModelGuid, resetForm, DefaultStaff, Widget, Disabled }: ComponentProps<AggregationOneToOneValue> & { dataModelGuid: string }) => {
	const selectIdividualStore = React.useRef<SelectIndividualStore>(new SelectIndividualStore(null));
	const [tokenItems, setTokenItems] = React.useState<Individual[]>([]);

	React.useEffect(() => {
		if (mode === 'render') {
			setTokenItems(setupTokenItems());
		}
	}, [value])
	useEffect(() => {
		if (mode === 'render') {
			if (DefaultStaff && (!value || !value?.key)) {
				const curStaff = getCurrentUserStaff()
				setTokenItems(curStaff)
				onChange({
					key: General.DefaultStaffGuid,
					label: curStaff[0].Title,
					metadata: initValue.metadata,
					rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: General.UserFullName }],
				})
			}
		}
	}, []);

	function setupTokenItems(): Array<Individual> {
		const tokens = (!!value && value?.key !== '') ? [value] : [];
		let currentTokens: Individual[] = [];
		if (!!tokens.length) {
			tokens.forEach((val) => {
				currentTokens.push({
					Id: val.key,
					Type: 0,
					CommandType: '',
					Metadata: val.metadata,
					Title: val.label
				})
			})
		}
		return currentTokens
	}

	function handleChangeTokenItems(selectedItem: Individual[]): void {
		if (!!selectedItem) {
			onChange({
				key: selectedItem[0]?.Metadata?.Guid,
				label: selectedItem[0].Title,
				metadata: initValue.metadata,
				rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: selectedItem[0].Title }]
			});
			setTokenItems(selectedItem);
			typeof resetForm === 'function' && resetForm();
		} else {
			onChange(undefined);
			setTokenItems([]);
		}
	}

	const parseBooli = (variable: Boolean | string) => {
		if (typeof variable === 'boolean')
			return variable;

		if (variable === 'true' || variable === '1') {
			return true;
		} else if (variable === 'false' || variable === '0') {
			return false;
		}

		return false;
	}

	const getCurrentUserStaff = (): Array<Individual> => {
		return [{
			CommandType: null,
			Title: `${General.UserFullName} (${General.UserStaff})`,
			Id: General.StaffId,
			Metadata: { Guid: General.DefaultStaffGuid, StaffPersonRelationType: 0 },
			Type: 0,
		}];
	}


	return (
		<SelectIndividual
			onChange={handleChangeTokenItems}
			store={selectIdividualStore.current}
			components={[new SelectStaff({
				multiSelect: false,
			})]}
			itemsViewType={'token'}
			mode={'normal'}
			value={tokenItems}
			maxSelectedItems={1}
			readonly={Widget === WidgetType.DisabledWidget || Disabled}
		/>
	)

}

export default injectContext(StaffSelectorOneToOne)
