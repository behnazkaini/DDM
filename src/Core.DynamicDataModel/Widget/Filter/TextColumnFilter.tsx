import { translate } from "./../../../Utility/language";
import { Input, Modal } from "didgah/ant-core-component";
import React, { useEffect, useRef, useState } from "react";
type filterRefType={
  [key: string]: { setValueFn: (value: any) => void };
};
export default function TextColumnFilter(
  { column: { filterValue, setFilter } },
  dataIndex,
  getData,
  filterRefs,
  getInitialRecord
) {


  const [value, setValue] = useState(filterValue || "");
  const [isAddedState, setIsAddedState] = useState(false);

  useEffect(() => {
    filterRefs.current[dataIndex] = { setValueFn: setValue };
  }, [setFilter, dataIndex, setValue]);

  const count = getData().length;

  const onChangeHandler = (e) => {
    if (isAddedState) return;
    Object.entries((filterRefs.current) as filterRefType).forEach(([key, { setValueFn }]) => {
      if (key !== dataIndex) {
        setValueFn("");
      }
    });
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  const focusHandler = () => {
    const initialRows = getInitialRecord();
    const rows = getData();

    const isEdited = initialRows.some((initialRow) => {
        const matchingRow = rows.find((row) => row.Guid === initialRow.Guid);

        if (!matchingRow) return false; 

        return Object.keys(initialRow).some((key) => {
            if (key === "Guid" || key === "__status" || key === "__guid") return false;

            return JSON.stringify(initialRow[key]) !== JSON.stringify(matchingRow[key]);
        });
    });

    const isAdded = rows.some((row) => row.__status === "added");

    setIsAddedState(isAdded || isEdited);

    if (isAdded || isEdited) {
      Modal.warning({
        title: translate("FilterWarningMessage"),
        okText: translate("Confirm"),
      });
    }
};


  return (
    <Input
      value={value}
      // @ts-ignore
      onFocus={focusHandler}
      onChange={onChangeHandler}
      placeholder={`${translate("Search")} ${translate(
        "For"
      )} ${count} ${translate("Record")}...`}
    />
  );
}
