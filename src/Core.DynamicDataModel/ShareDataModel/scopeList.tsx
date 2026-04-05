import { translate } from "didgah/common";
import { CheckboxList } from "didgah/ant-core-component";
import { CheckboxItem, CheckboxListStore } from "didgah/ant-core-component/providers";
import React from "react";
import { SoftwareScopeStateViewModel } from "./models";

interface ScopeListProps {
  onStoreCreated: (store: CheckboxListStore) => void;
  softwareScope: SoftwareScopeStateViewModel
}

export default function ScopeList(props: ScopeListProps) {

  const scopesStore = React.useRef<CheckboxListStore>(new CheckboxListStore());

  React.useEffect(() => {
    props.onStoreCreated(scopesStore.current);
  }, []);

  return (
    <CheckboxList
      fieldsetTitle={translate('Scopes')}
      columnCount={1}
      height='270px'
      showSelectAll
      store={scopesStore.current}
      checkboxItems={props.softwareScope.scopes
        .map<CheckboxItem>(x => {
          return {
            value: x.guid,
            text: x.name,
            selected: x.isShared
          }
        })}
    />
  )
}