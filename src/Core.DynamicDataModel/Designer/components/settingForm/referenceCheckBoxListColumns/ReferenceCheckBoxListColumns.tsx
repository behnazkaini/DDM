import React, { FC, useEffect, useState } from "react";
import { Form, Spin } from "didgah/ant-core-component";
import { ReferenceCheckBoxList, RichLayoutItem, SettingFormItemProps } from "../../../../../typings/Core.DynamicDataModel/Types";
import { DataModelViewModel } from "../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import modelerTransportLayer from "../../../../Modeler/transportLayer";
import { LayoutItemViewModel } from "../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import WrapperInput from "./WrapperInput";
import { handleErrors } from "../../../../../Utility/helpers";

const ReferenceCheckBoxListColumns: FC<
  SettingFormItemProps<ReferenceCheckBoxList> & {
    layoutItem: LayoutItemViewModel;
    isSimpleDesignerMode: boolean;
  }
> = ({ initialSettingValues, form, settingName, onSave, dataModel: initialDataModel, layoutItem, isSimpleDesignerMode }) => {
  const [dataModel, setDataModel] = useState<DataModelViewModel | null>(initialDataModel ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  const getModelsData = async () => {
    try {
      if (isSimpleDesignerMode) {
        setLoading(true)
        const dataModelGuid = (layoutItem as RichLayoutItem).simpleDesignerData.ReferenceDataModelGuid;
        const models = await modelerTransportLayer().get({ Guid: dataModelGuid })
        setDataModel(models.find(model => model.Guid === dataModelGuid))
      }
    } catch (error) {
      handleErrors(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getModelsData()
  }, [isSimpleDesignerMode, layoutItem]);

  return (
    <Spin spinning={loading} stretch>
      <Form.Item wrapperCol={{ span: 24 }}>
        {form.getFieldDecorator(settingName, { initialValue: initialSettingValues.ReferenceCheckBoxListColumnsConfig })(
          <WrapperInput
            columns={dataModel.Columns}
            form={form}
            settingName={settingName}
            onSave={onSave}
            dataModelLabel={dataModel.Label}
          />
        )}
      </Form.Item>
    </Spin>
  );
};

export default ReferenceCheckBoxListColumns;
