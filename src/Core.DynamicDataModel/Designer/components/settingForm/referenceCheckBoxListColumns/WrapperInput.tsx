import React, { ChangeEvent, FC, useCallback, useMemo, useRef, useState, } from "react";
import { Alert, Button, CheckboxItem, CheckboxList, Form, Input, Label, Modal, NumericalInput, StackPanel, WrappedFormUtils } from "didgah/ant-core-component";
import { CheckboxListStore } from "didgah/ant-core-component/providers";
import { translate } from "../../../../../Utility/language";
import { IDictionary, ReferenceCheckBoxList } from "../../../../../typings/Core.DynamicDataModel/Types";
import { ColumnViewModel } from "../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { sortDictionaryByOrder } from "../utils/Utilities";
import ColumnTagOrderEditor from "../common/ColumnTagOrderEditor";


interface WrapperInputProps {
  columns: ColumnViewModel[];
  value?: ReferenceCheckBoxList["ReferenceCheckBoxListColumnsConfig"];
  onChange?: (value: ReferenceCheckBoxList["ReferenceCheckBoxListColumnsConfig"]) => void;
  form: WrappedFormUtils;
  settingName: string;
  onSave: () => void;
  dataModelLabel: string;
}

const WrapperInput: FC<WrapperInputProps> = ({ columns, value, onChange, form, settingName, onSave, dataModelLabel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [separatorCharachter, setSeparatorCharachter] = useState(value.SeperableCharachter);
  const [checkBoxCoulmnCountInARow, setCheckBoxCoulmnCountInARow] = useState(value.CheckBoxCoulmnCountInARow);
  const checkBoxListStore = useRef(new CheckboxListStore()).current;

  const initialSelectedTags = useMemo<CheckboxItem[]>(() => {
    return sortDictionaryByOrder(value.Columns).map(({ key }) => {
      const column = columns.find(column => column.Guid.toLowerCase() === key.toLowerCase());
      return {
        value: key,
        text: column?.Label ?? "",
        selected: true,
      };
    });
  }, [columns, value.Columns]);

  const [selectedTags, setSelectedTags] = useState<CheckboxItem[]>(initialSelectedTags);

  const checkboxItems = useMemo<CheckboxItem[]>(() => {
    return columns.map((column) => ({
      value: column.Guid,
      text: column.Label,
      selected: Boolean(value.Columns[column.Guid]),
    }))
  }, [columns, value.Columns]
  );

  const orderPreviewText = useMemo(() => {
    return selectedTags
      .map((tag) => `${separatorCharachter} [${tag.text}]`)
      .join(" ")
      .trim()
  }, [selectedTags, separatorCharachter]
  );

  const handleCheckboxChange = useCallback((item: CheckboxItem) => {
    if (item.selected) {
      const column = columns.find(columns => columns.Guid.toLowerCase() === item.value.toLowerCase());
      setSelectedTags((prev) => [
        { value: column.Guid, text: column.Label, selected: true },
        ...prev,
      ]);
    } else {
      setSelectedTags((prev) =>
        prev.filter(tag => tag.value.toLowerCase() !== item.value.toLowerCase())
      );
    }

    setShowErrorAlert(!checkBoxListStore.getSelectedData().length)
  }, [columns, checkBoxListStore]
  );

  const handleSave = () => {
    if (selectedTags?.length) {
      const settingSaveData = settingSaveDataFactory()
      onChange(settingSaveData);
      form.setFieldsValue({ [settingName]: settingSaveData });
      onSave();
      setIsModalOpen(false);
    }
  };

  const settingSaveDataFactory = (): ReferenceCheckBoxList["ReferenceCheckBoxListColumnsConfig"] => {
    const Columns: IDictionary<{ order: number }> = {};

    selectedTags.forEach((tag, index) => {
      Columns[tag.value] = { order: index };
    });

    return {
      Columns,
      SeperableCharachter: separatorCharachter,
      CheckBoxCoulmnCountInARow: checkBoxCoulmnCountInARow,
    }
  }

  return (
    <>
      <StackPanel>
        <Label>{orderPreviewText}</Label>
        <Button icon="ellipsis" type="ghost" onClick={() => setIsModalOpen(true)} />
      </StackPanel>

      <Modal
        title={`${translate("Settings")} ${dataModelLabel}`}
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >

        <Form>
          <Form.Row>
            <Form.Item label={translate("SeperableCharacter")} labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
              <Input
                maxLength={1}
                value={separatorCharachter}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSeparatorCharachter(e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label={translate("CheckBoxCoulmnCountInARow")} labelCol={{ span: 14 }} wrapperCol={{ span: 10 }}>
              <NumericalInput
                allowFloatNumbers={false}
                allowNegativeNumbers={false}
                value={checkBoxCoulmnCountInARow}
                onChange={setCheckBoxCoulmnCountInARow}
              />
            </Form.Item>
          </Form.Row>

          <Form.Row>
            <Form.Item label={translate("Columns")} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <CheckboxList
                fieldsetTitle={translate('CheckboxList')}
                hasFieldset={false}
                store={checkBoxListStore}
                checkboxItems={checkboxItems}
                onChangeCheckboxItem={handleCheckboxChange}
                height="100px"
                showSelectAll={false}
                columnCount={3}
              />
            </Form.Item>
          </Form.Row>

          <Form.Row>
            <Form.Item label={translate("Order")} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
              <ColumnTagOrderEditor tags={selectedTags} onChange={setSelectedTags} />
            </Form.Item>
          </Form.Row>
          <Form.Row>
            <Form.Item label={translate("Preview")} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Label>{orderPreviewText}</Label>
            </Form.Item>
          </Form.Row>
        </Form>
        {showErrorAlert && (
          <Alert
            type="error"
            message={translate("ColumnRequired")}
            showIcon
          />
        )}
      </Modal>
    </>
  );
};

export default WrapperInput