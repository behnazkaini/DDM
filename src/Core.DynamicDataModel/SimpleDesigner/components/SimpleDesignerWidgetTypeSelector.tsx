import { translate } from "didgah/common";
import { Form, Select } from "didgah/ant-core-component";
import React from "react"
import { EditWidget } from "../../../typings/Core.DynamicDataModel/Enums";
import { availableWidgets } from "../hooks/useField";
const Option = Select.Option;

const SimpleDesignerWidgetTypeSelector = ({
    handleWidgetTypeChange
}) => {
    return (
        <div style={{padding: '10px 0px'}}>
        <Form.Item label="ویجت" required>
            <Select
                defaultValue={null}
                style={{ width: "85%" }}
                onChange={handleWidgetTypeChange}
                labelInValue={false}
                
            >
                
                {availableWidgets.map(((item, index) =>
                (<Option value={item.WidgetType}>
                    {translate(item.WidgetType)}
                </Option>)
                ))}
            </Select>
        </Form.Item>
        </div>
    )
};

export default SimpleDesignerWidgetTypeSelector;
