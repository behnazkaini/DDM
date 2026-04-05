import React, { useState, useRef } from "react";
import { DDMSearch } from '@didgah/common-shared';
import { Button, Modal, Message } from 'didgah/ant-core-component';

const InvalidQuery = "کوئری نامعتبر است."

export default function FilterGridPlugin({ value, onChange, dataModel }) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const searchInfo = useRef(undefined);
  const pluginRef = useRef(undefined);
  return <div>
    <Button
      onClick={() => {
        setModalVisibility(true);
      }}
    >تنظیمات جستجو</Button>
    <Modal
      visible={modalVisibility}
      title="Title"
      onOk={() => {
        const valid = pluginRef.current?.validate();
        const isEmpty = pluginRef.current?.isEmpty();

        if (valid || (isEmpty && !valid)) {
          onChange(searchInfo.current === undefined ? value : searchInfo.current);
          setModalVisibility(false);
        } else {
          Message.error(InvalidQuery)
        }
      }}
      onCancel={() => { setModalVisibility(false) }}
    >
      <DDMSearch
        initialData={value}
        dataModelGuid={dataModel.Guid}
        onChange={(val) => {
          searchInfo.current = val;
        }}
        onPluginCreate={ref => {
          pluginRef.current = ref
        }}
      />
    </Modal>
  </div >
}
