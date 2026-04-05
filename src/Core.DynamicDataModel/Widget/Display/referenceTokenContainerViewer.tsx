import { injectContext, TokenContainer, TokenItem } from "didgah/ant-core-component";
import * as React from "react";
import { IWidget, ComponentProps, AggregationOneToManyValue } from "../../../typings/Core.DynamicDataModel/Types";

const ReferenceTokenContainerViewer = (props: ComponentProps<AggregationOneToManyValue>) => {
	const { initValue, value, mode } = props;
	const [tokenItems, setTokenItems] = React.useState([]);

	React.useEffect(() => {
		if (mode === 'render') {
			setTokenItems(setupTokenItems());
		}
	}, [!!value && JSON.stringify(value.tokens.map((token => token.id)))])

	function setupTokenItems() {
		const tokens = value?.tokens ?? [];
		
		const currentTokens = []
		if (!!tokens && !!tokens.length) {
			tokens.forEach((value) => {
				currentTokens.push(value)
			})
		}
		return currentTokens
	}

	return (
		<TokenContainer
			tokenItems={tokenItems}
			readOnly={true}
		/>
	);
};

export default {
	component: injectContext(ReferenceTokenContainerViewer),
} as IWidget;
