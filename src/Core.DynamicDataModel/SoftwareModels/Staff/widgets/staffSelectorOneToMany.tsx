import React, { useEffect } from "react";
import { injectContext } from "didgah/ant-core-component";
import SelectIndividual, {
  SelectIndividualComponentTypes,
  SelectIndividualStore,
} from '@didgah-components/ant-selectindividual';
import { Individual } from "@models/didgah-components";
import {
  ComponentProps,
  AggregationOneToManyValue,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";

const SelectStaff = SelectIndividualComponentTypes.SelectStaff;
const emptyObj: AggregationOneToManyValue = {
  metadata: {
    ColumnGuids: [],
    DataModelGuid: "00000000-0000-0000-0000-000000000000",
  },
  tokens: [],
};

const StaffSelectorOneToMany = ({
  value = emptyObj,
  mode,
  onChange,
  initValue,
  resetForm,
  DefaultStaff,
  Widget,
  Disabled
}: ComponentProps<any> & { dataModelGuid: string }) => {
  const selectIdividualStore = React.useRef<SelectIndividualStore>(
    new SelectIndividualStore(null)
  );
  const [tokenItems, setTokenItems] = React.useState<Individual[]>([]);

  React.useEffect(() => {
    if (mode === "render") {
      setTokenItems(setupTokenItems());
    }
  }, [value]);
  useEffect(()=>{
    if (mode === "render") {
    if(DefaultStaff && (!value || !value?.tokens.length)){
      const curStaff=getCurrentUserStaff()
      setTokenItems(curStaff)
      onChange({
        tokens:[{
          id: General.DefaultStaffGuid,
          title:curStaff[0].Title,
          rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: General.UserFullName }]},
        ],
        metadata:initValue.metadata,
        Type: 0,
      })
    }
  }
  },[])

  function setupTokenItems(): Array<Individual> {
    const tokens = !!value && !!value?.tokens.length ? [...value.tokens] : [];
    let currentTokens: Individual[] = [];
    if (!!tokens.length) {
      tokens.forEach((val) => {
        currentTokens.push({
          Id: val.id,
          Type: 0,
          CommandType: "",
          Metadata: value.metadata,
          Title: val.title,
        });
      });
    }
    return currentTokens;
  }

  function handleChangeTokenItems(selectedItem: Individual[]): void {

    if (!!selectedItem) {
      setTokenItems(selectedItem);
      onChange({
        tokens: selectedItem.map((select) => ({
          id: select.Id.length===43?select.Id:select?.Metadata.Guid,
          title: select.Title,
          rowData: [{ Key: initValue.metadata.ColumnGuids[0], Value: select.Title }]
        })),
        metadata: initValue.metadata,
      });
      typeof resetForm === 'function' && resetForm()
    } else {
      setTokenItems([]);
      onChange(undefined);
    }
  }
  const getCurrentUserStaff = (): Array<Individual> => {
		return [{
			CommandType: '',
			Title: `${General.UserFullName} (${General.UserStaff})`,
			Id: General.StaffId,
			Metadata: { Guid: General.DefaultStaffGuid, StaffPersonRelationType: 0 },
			Type: 1,
		}];
	}



  return (
    <SelectIndividual
      onChange={handleChangeTokenItems}
      store={selectIdividualStore.current}
      components={[
        new SelectStaff({
          multiSelect: true,
        }),
      ]}
      itemsViewType={"token"}
      mode={"normal"}
      value={!!tokenItems.length?tokenItems:undefined}
      readonly={Widget === WidgetType.DisabledWidget || Disabled}
    />
  );
};

export default injectContext(StaffSelectorOneToMany);
