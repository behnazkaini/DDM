import { Icon } from 'didgah/ant-core-component';
import React from 'react'
import { IWidget } from '../../../typings/Core.DynamicDataModel/Types';
import { translate } from '../../../Utility/language'

function UndefinedComponent() {
    return (
        <div style={{
            color: "red",
            borderStyle: "inset",
            padding: "0 10px",
            fontWeight: "bold",
            backgroundColor: "yellow"
        }}>{translate("UndefinedComponent")} <Icon type={"exception"}></Icon></div>
    )
}

export default {
    component: UndefinedComponent,
} as IWidget;
