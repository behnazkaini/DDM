import React, { useContext } from 'react';
import { FieldValue } from 'didgah/ant-core-component';
import SearchFormGeneratorContext from './SearchFormGeneratorContext';
import { translate } from '../../Utility/language';
import { RelationalOperatorType } from '../../Models/Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType';
import { ITreeNode } from '@models/didgah-components';
import { dataTypeOperators } from './helper';

interface Props extends FieldValue {
	field: any;
}

function ViewRenderer(props: Props) {

	const { field, operator, value } = props;
	const { getViewComponent } = useContext(SearchFormGeneratorContext)
	const DisplayComponent = getViewComponent(field.Metadata.Type, field.Metadata);

	const getOperatorText = (): string => {
		if (field.Metadata.Type === "Column") {
			return (dataTypeOperators[field.Metadata.DataType] as Array<{ key: string; value: number }>).find((op) => String(op.value) === String(operator)).key
		} else if (field.Metadata.Type === "Relation") {
			return translate(Object.keys(RelationalOperatorType).find(op => RelationalOperatorType[op] === operator));
		}
	}

	return (
		<div className="search-form-generator_view-renderer" style={{ display: 'flex' }}>
			<div className="search-form-generator_view-renderer_field">
				{(field as unknown as ITreeNode<any>).Text}
			</div>
			<div className="search-form-generator_view-renderer_operator" style={{ margin: '0px 10px' }}>
				{getOperatorText()}
			</div>
			<div className="search-form-generator_view-renderer_value">
				<DisplayComponent value={value} />
			</div>
		</div>);
}

export default ViewRenderer