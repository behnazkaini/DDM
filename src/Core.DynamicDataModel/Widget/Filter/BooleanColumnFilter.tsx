import { Checkbox, Modal } from "didgah/ant-core-component";
import React, { useEffect, useState } from "react";
import { translate } from "./../../../Utility/language";

type filterRefType={
  [key: string]: { setValueFn: (value: any) => void };
};
export default function BooleanColumnFilter(
  { column: { filterValue, setFilter } },
  dataIndex,
  getData,
  filterRefs,
  getInitialRecord
) {
  const [value, setValue] = useState(!!filterValue);
  useEffect(() => {
    filterRefs.current[dataIndex] = { setValueFn: setValue };
  }, [setFilter, dataIndex, setValue]);
  const count = getData().length;


  const onChangeHandler = (e) => {
    const rows = getData();
    const isAdded = rows.some((row) => row.__status === "added" || row.__status === "edited");
    if (isAdded) {
      Modal.warning({
        title: translate("FilterWarningMessage"),
        okText: translate("Confirm"),
      });
      return
    };
    Object.entries((filterRefs.current) as filterRefType).forEach(([key, { setValueFn }]) => {
      if (key !== dataIndex) {
        setValueFn("");
      }
    });
    setValue(e.target.checked);
    setFilter(e.target.checked || undefined);
  };

  // return <Checkbox checked={value} onChange={onChangeHandler}/>;
  return null;
}
