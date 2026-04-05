import { injectContext } from "didgah/ant-core-component";
import SelectIndividual, { SelectIndividualComponentTypes, SelectIndividualStore } from '@didgah-components/ant-selectindividual';
import { Individual } from '@models/didgah-components';
import React from "react";
import { AggregationOneToOneValue, ComponentProps } from "../../../../typings/Core.DynamicDataModel/Types";

const SelectStaff = SelectIndividualComponentTypes.SelectStaff;

const StaffDisplayOneToOne = ({ mode, value }: ComponentProps<AggregationOneToOneValue> & { dataModelGuid: string }) => {
  const selectIdividualStore = React.useRef<SelectIndividualStore>(new SelectIndividualStore(null));
	const [tokenItems, setTokenItems] = React.useState<Individual[]>([]);

	React.useEffect(() => {
		if (mode === 'render') {
			setTokenItems(setupTokenItems());
		}
	}, [value]);

	function setupTokenItems(): Array<Individual> {
		const tokens = (!!value?.key && value?.key !== '' ) ? [value] : [];
		const currentTokens: Individual[] = [];
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


	return (
		<SelectIndividual
			store={selectIdividualStore.current}
			components={[new SelectStaff({
				multiSelect: false,
			})]}
			itemsViewType={'token'}
			mode={'normal'}
			value={tokenItems}
      		readonly={true}
		/>
	)
};

export default injectContext(StaffDisplayOneToOne);
