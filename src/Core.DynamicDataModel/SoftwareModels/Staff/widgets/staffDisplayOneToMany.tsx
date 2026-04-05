import { injectContext } from "didgah/ant-core-component";
import SelectIndividual, { SelectIndividualComponentTypes, SelectIndividualStore } from '@didgah-components/ant-selectindividual';
import { Individual } from '@models/didgah-components';
import React from "react";
import { ComponentProps, AggregationOneToManyValue } from "../../../../typings/Core.DynamicDataModel/Types";

const SelectStaff = SelectIndividualComponentTypes.SelectStaff;

const StaffDisplayOneToMany = ({ mode, value }: ComponentProps<AggregationOneToManyValue> & { dataModelGuid: string }) => {
  const selectIdividualStore = React.useRef<SelectIndividualStore>(new SelectIndividualStore(null));
  const [tokenItems, setTokenItems] = React.useState<Individual[]>([]);
  React.useEffect(() => {
    if (mode === 'render') {
      setTokenItems(setupTokenItems());
    }
  }, [value]);

  function setupTokenItems(): Array<Individual> {
    const tokens = (!!value && !!value?.tokens.length) ? [...value.tokens] : [];
    const currentTokens: Individual[] = [];
    if (!!tokens.length) {
      tokens.forEach((val) => {
        currentTokens.push({
          Id: val.id,
          Type: 0,
          CommandType: '',
          Metadata: value.metadata,
          Title: val.title
        })
      })
    }
    return currentTokens
  }


  return (
    <SelectIndividual
      store={selectIdividualStore.current}
      components={[new SelectStaff({
        multiSelect: true,
      })]}
      itemsViewType={'token'}
      mode={'normal'}
      value={tokenItems}
      readonly={true}
    />
  )
};

export default injectContext(StaffDisplayOneToMany);
