import { AutoCompleteEx, Form, injectContext, SelectEx, SelectItem, useAjax, widgetFactory } from 'didgah/ant-core-component';
import React, { useEffect, useMemo, useState } from 'react';
import { getApiUrl } from '../../../../Utility/helpers';
import { AggregationOneToOneValue, ComponentProps, IWidget } from "../../../../typings/Core.DynamicDataModel/Types";
import { DataModelViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';
import CascadeDropdown from './cascadeDropdown';
import CascadeDropdownInGrid from './cascadeDropdownInGrid';

interface DataModels extends DataModelViewModel {
    title: string;
    dataSource: any[];
    level: number;
}

interface DropDownData {
    dropDownData: SelectItem[]
}

interface AllPermanentsType {
    level: number;
    dropDownData: SelectItem[];
    selectedPrevDropDown?: {
        Key: string,
        Value: any
    };
}

interface ValueType {
    key: string,
    dropDownData: SelectItem[]

}

function CascadeDropdownWidget(props: ComponentProps<AggregationOneToOneValue> & { referenceDataModelGuid: string; CascadeDropDownLevel: number }) {
    if (props.isGrid) return <CascadeDropdownInGrid {...props} />
    return <CascadeDropdown {...props} />
}

export default {
    component: injectContext(CascadeDropdownWidget),
} as IWidget;
