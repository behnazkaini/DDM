import { Button, Form, Input, Message, Tag } from "didgah/ant-core-component";
import React, { ReactElement } from "react";
import { translate } from "../../../../Utility/language";
import { CommaSeparableComboBoxProps, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { ColumnDataType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { number } from "prop-types";
const ItemList = (props: SettingFormItemProps<CommaSeparableComboBoxProps>) => {
  const { initialSettingValues, form, settingName, onSave, key, viewModel } = props;
  const onChange = (value) => {
    form.setFieldsValue({ [settingName]: value });
    onSave();
  };

  const TagsContainer = (props: {
    onChange?: (e: any) => void;
    value?: Array<string> | null;
  }): ReactElement => {
    const { onChange, value } = props;
    const [Tags, setTags] = React.useState(value != null ? value : []);
    const [inputVisible, setinputVisible] = React.useState(false);
    const [inputValue, setinputValue] = React.useState("");

    const handleClose = (removedTag: string) => {
      const modifiedTags = Tags.filter((tag) => tag !== removedTag);
      setTags(modifiedTags);
      onChange(modifiedTags);
    };
    const checkInputType = (inputValue) => {
      const { DataType } = viewModel;
      let isCorrect = true;
      if (DataType === ColumnDataType.Integer) {
        isCorrect = Number.isInteger(Number(inputValue));
      }
      return isCorrect;
    }
    const handleInputConfirm = () => {
      if (inputValue && Tags.indexOf(inputValue) === -1) {
        if (!checkInputType(inputValue)) {
          Message.error(translate('InputIsNotValid'))
          return;
        };
        setTags([...Tags, inputValue]);
        onChange([...Tags, inputValue]);
      }
      setinputValue("");
      setinputVisible(false);
    };

    const handleInputChange = (e) => {
      setinputValue(e.target.value);
    };

    const showInput = () => {
      setinputVisible(true);
    };

    return (
      <div>
        {!!Tags &&
          Tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                key={tag}
                closable={true}
                afterClose={() => handleClose(tag)}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return tagElem;
          })}
        {inputVisible && (
          <Input
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Button size="small" type="dashed" onClick={showInput}>
            {`${translate("New")}+`}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Form.Item
      key={key}
      label={translate("ItemList")}
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
    >
      {form.getFieldDecorator(settingName, {
        initialValue: initialSettingValues.ItemList,
      })(<TagsContainer onChange={onChange} />)}
    </Form.Item>
  );
};

export default ItemList;
