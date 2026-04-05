import { BaseLayoutItemSetting, LayoutColumnsViewModelProps, SearchSetting } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { Select } from "didgah/ant-core-component";
import React from "react";
import { translate } from "../../../../Utility/language";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
const Option = Select.Option;

const SearchSettingInput = (props: {
  value?: SearchSetting;
  onChange?: (value: SearchSetting) => void;
  layoutItems: Array<LayoutItemViewModel>;
}) => {
  const { onChange, value, layoutItems } = props;

  const changeSelectHandle = (newValue) => {
    if (newValue === null) {
      onChange({ ...value, Enable: false, LayoutItemGuid: null, ColumnViewModelGuid: null });
    } else {
      const columnViewModel = (layoutItems as LayoutItemColumnViewModel[]).find((column: LayoutItemColumnViewModel) => column.Guid.toLowerCase() === newValue.toLowerCase()).ColumnGuid;
      onChange({ ...value, Enable: true, LayoutItemGuid: newValue, ColumnViewModelGuid: columnViewModel });
    }
  };

  return (
    <Select defaultValue={!!value.Enable ? value.LayoutItemGuid : null} onChange={changeSelectHandle}>
      <Option value={null}>{translate("Disable")}</Option>
      {layoutItems.map((item) => (
        <Option value={item.Guid} key={item.Guid}>
          {(JSON.parse(item.Design) as BaseLayoutItemSetting).Label}
        </Option>
      ))}
    </Select>
  );
};

export default SearchSettingInput;
