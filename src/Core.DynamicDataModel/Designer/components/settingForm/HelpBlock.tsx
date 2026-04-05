import * as React from "react";
import { translate } from "../../../../Utility/language";
import {
  Form,
  SelectEx,
  Switch,
  Input,
  WrappedFormUtils,
} from "didgah/ant-core-component";
const FormItem = Form.Item;

import { HelpBlockProps, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { HelpBlockType as HelpBlockTypeId } from "../../../../typings/Core.DynamicDataModel/Enums";
import { Setting } from "../../../TS/Widgets";

const HelpBlockSettingWrapper = (props: SettingFormItemProps<HelpBlockProps>) => {
  const { form, initialSettingValues, onSave, key } = props;
  const { getFieldDecorator, setFieldsValue } = form;

  const {
    HelpBlockType,
    HelpBlockShowMessage,
    HelpBlockMessage,
    HelpBlockDescription,
    HelpBlockClosable,
    HelpBlockShowIcon,
  } = initialSettingValues;

  const [showMessageInput, setShowMessageInput] =
    React.useState<boolean>(HelpBlockShowMessage);
  const alertTypesArray = [
    { key: `✓ ${translate("Success")}`, value: HelpBlockTypeId.success },
    { key: `🛈 ${translate("Info")}`, value: HelpBlockTypeId.info },
    { key: `⚠ ${translate("Warning")}`, value: HelpBlockTypeId.warning },
    { key: `⨯ ${translate("Error")}`, value: HelpBlockTypeId.error },
  ];

  const OnChangeShowMessageValue = (state: boolean) => {
    if (!state) {
      setFieldsValue({ [Setting.HelpBlockMessage]: "" });
    }

    setShowMessageInput(state);
    onSave();
  };
  return (
    <div key={key}>
      <FormItem
        label={translate("Type")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {getFieldDecorator(Setting.HelpBlockType, {
          initialValue: HelpBlockType,
        })(<SelectEx dataSource={alertTypesArray} onChange={onSave} />)}
      </FormItem>
      <FormItem
        label={translate("Title")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {getFieldDecorator(Setting.HelpBlockShowMessage, {
          valuePropName: "checked",
          initialValue: showMessageInput,
        })(
          <Switch
            checkedChildren={translate("Show")}
            unCheckedChildren={translate("Hide")}
            onChange={OnChangeShowMessageValue}
          />
        )}
      </FormItem>
      {showMessageInput && (
        <FormItem
          label={" "}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          colon={false}
        >
          {getFieldDecorator(Setting.HelpBlockMessage, {
            initialValue: HelpBlockMessage,
          })(<Input placeholder={translate("Title")} onChange={onSave} />)}
        </FormItem>
      )}
      <FormItem
        label={translate("Help")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {getFieldDecorator(Setting.HelpBlockDescription, {
          initialValue: HelpBlockDescription,
        })(
          <Input
            type="textarea"
            placeholder={translate("Description")}
            onChange={onSave}
          />
        )}
      </FormItem>
      <FormItem
        label={translate("CloseButton")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {getFieldDecorator(Setting.HelpBlockClosable, {
          valuePropName: "checked",
          initialValue: HelpBlockClosable,
        })(
          <Switch
            checkedChildren={translate("Show")}
            unCheckedChildren={translate("Hide")}
            onChange={onSave}
          />
        )}
      </FormItem>
      <FormItem
        label={translate("Icon")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {getFieldDecorator(Setting.HelpBlockShowIcon, {
          valuePropName: "checked",
          initialValue: HelpBlockShowIcon,
        })(
          <Switch
            checkedChildren={translate("Show")}
            unCheckedChildren={translate("Hide")}
            onChange={onSave}
          />
        )}
      </FormItem>
    </div>
  );
};

export default HelpBlockSettingWrapper;
