import React from 'react';
import { SelectEx, SelectValue } from 'didgah/ant-core-component';
import { ColumnDataType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType';
import { translate } from '../../../Utility/language';

interface Props {
	value?: SelectValue;
	onChange?: (value: SelectValue) => void;
	disabled?: boolean;
	dataTypes: number[];
}

function SelectDataType({ value, onChange, disabled, dataTypes}: Props) {
return <SelectEx dataSource={dataTypes.map(key => ({ key: translate(ColumnDataType[key])  , value: key }))} value={value} onChange={onChange}  disabled={disabled}/>;
}

export default SelectDataType