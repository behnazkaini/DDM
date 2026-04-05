import { DateTimePicker } from "didgah/ant-core-component";
import React, { useState } from "react";
export default function DateColumnFilter({
  column: { filterValue, setFilter, id },
}) {
  const [value, setValue] = useState(filterValue || "");
  const onChangeHandler = (e) => {
    setValue(e);
    setFilter(e || undefined);
  };
  return null;
}
