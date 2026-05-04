import { injectContext, TokenContainer } from "didgah/ant-core-component";
import React, { useEffect } from "react";
import { IWidget, ComponentProps, AggregationOneToManyValue } from "../../../typings/Core.DynamicDataModel/Types";

const ReferenceTokenContainerViewer = (props: ComponentProps<AggregationOneToManyValue>) => {
	const { value, mode } = props;
	const [tokenItems, setTokenItems] = React.useState([]);

	useEffect(() => {
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
			editable={false}
			closeable={false}
			addableSearch={false}
		/>
	);
};

export default {
	component: injectContext(ReferenceTokenContainerViewer),
} as IWidget;
