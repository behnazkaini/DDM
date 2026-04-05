import { translate } from 'didgah/common';
import { Button, Form, FormComponentProps, Input, Message, Modal, Notification, useAjax } from 'didgah/ant-core-component';
import * as React from 'react';
import { copyDesignerForm } from '../helper';
import {
  GlobalPropsContext,
} from "../store/reducers/designLayoutSlice";
function CopyFormModal({ form, layoutItemGuid }: { layoutItemGuid: string } & FormComponentProps) {
  const [copyFormModalVisible, setCopyFormModalVisible] = React.useState(false);
  const ajax = useAjax();
  const globalProps = React.useContext(GlobalPropsContext);
  const { copyFormAppFn } = globalProps;
  const onOk = () => {
    form.validateFields(async (errors, values) => {
      if (!errors) {
        const layout = await copyDesignerForm(ajax, layoutItemGuid, values.Title);
        if (copyFormAppFn) {
          await copyFormAppFn(values, layout)
        }
        Message.success(translate('YourOperationDoneSuccessfully'));
        setCopyFormModalVisible(false);
      }
    })
  }
  return (
    <>
      <Button
        type="primary"
        onClick={() => setCopyFormModalVisible(true)}
      >
        {translate("Copy")}
      </Button>
      <Modal
        visible={copyFormModalVisible}
        onOk={onOk}
        onCancel={() => setCopyFormModalVisible(false)}
      >
        <Form.Item label={translate('Title')}>{form.getFieldDecorator('Title', { rules: [{ required: true }] })(<Input />)}</Form.Item>
      </Modal>
    </>
  );
}

export default Form.create()(CopyFormModal);