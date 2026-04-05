import QueryBuilder from "@didgah-components/ant-querybuilder";
import { QueryBuilderStore } from "@didgah-components/ant-querybuilder/utils";
import {
  Alert,
  Button,
  Fieldset,
  Form,
  FormLayout,
  Input,
  StackPanel,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import React from "react";
import ConditionEditor from "./ConditionEditor";
import {
  DesignerComplexValidationViewModel,
  IWidgetFactory,
  LayoutViewModelWithState,
  QueryBuilderConditionGroupViewModel,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { translate, utility } from "didgah/common";
import { ConditionGroupType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";
import { $enum } from "ts-enum-util";
import {
  GlobalPropsContext,
  LocalComplexConditionContext,
} from "../../../Designer/store/reducers/designLayoutSlice";
import useFloorStack from "../../../Designer/hooks/useFloorStack";
import { ConditionType as ConditionTypeView } from "@models/didgah-components";
import viewRenderer from "./viewRenderer";

interface QueryBuilderPanelProps {
  layoutValidation: DesignerComplexValidationViewModel;
  layoutItems: LayoutItemViewModel[];
  widgetFactory: IWidgetFactory;
  mode: "add" | "edit";
  onSave: (data: any) => void;
  form?: WrappedFormUtils<any>;
}

const ActionBar = FormLayout.ActionBar;
const LayoutContent = FormLayout.LayoutContent;

const QueryBuilderPanel = (props: QueryBuilderPanelProps) => {
  const store = React.useRef<QueryBuilderStore>();

  const { layoutValidation, layoutItems, widgetFactory, mode, onSave, form } =
    props;

  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentFloor } =
    useFloorStack<LayoutViewModelWithState>({
      layoutGuid: globalProps.layoutGuid,
    });
  const [queryBuilderVisible, setQueryBuilderVisible] = React.useState(false);
  const Message: string = mode === "edit" ? layoutValidation.Message : "";
  const initModel: QueryBuilderConditionGroupViewModel =
    mode === "edit"
      ? layoutValidation.ConditionGroup
      : {
          Id: Math.random().toString(),
          OperatorId: ConditionGroupType.OR,
          Type: ConditionTypeView.Complex,
          Condition: [],
      };

  const operationDataSource: Array<{ key: string; value: number }> = $enum(
    ConditionGroupType
  )
    .getKeys()
    .map((groupType) => {
      const valueStr = groupType.toString().toLowerCase();

      return {
        key: translate(valueStr.charAt(0).toUpperCase() + valueStr.slice(1)),
        value: $enum(ConditionGroupType).getValueOrDefault(groupType),
      };
    });
  const [queryBuilderErrorVisible, setQueryBuilderErrorVisible] =
    React.useState<boolean>(false);

  const onSaveHandle = () => {
    form.validateFields((error: any[], values) => {
      if (store.current.getData() == null) {
        setQueryBuilderErrorVisible(true);
      }

      if (error == null && store.current.getData() != null) {
        onSave({
          Message: form.getFieldValue("Message"),
          ConditionGroup: store.current.getData(),
          Guid: mode === "add" ? utility.newGuid() : layoutValidation.Guid,
        } as DesignerComplexValidationViewModel);
      }
    });
  };

  const messageOnChnage = (e) => {
    form.setFieldsValue({
      Message: e.target.value,
    });
  };

  React.useEffect(() => {
    store.current = new QueryBuilderStore(
      { Condition: initModel },
      operationDataSource[0].value.toString()
    );

    setQueryBuilderVisible(true);
  }, []);

  return (
    <div style={{ height: "50%" }}>
      <Fieldset
        legend={translate("ConditionBuilder")}
        style={{ height: "100%" }}
      >
        <FormLayout>
          <ActionBar>
            <StackPanel>
              <Button type="primary" onClick={onSaveHandle}>
                {translate("Save")}
              </Button>
            </StackPanel>
          </ActionBar>
          <LayoutContent style={{ backgroundColor: "#fff" }}>
            <LocalComplexConditionContext.Provider
              value={{ widgetFactory, currentLayout }}
            >
              <Form.Row>
                <Form.Item
                  label={translate("Message")}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                >
                  {form.getFieldDecorator("Message", {
                    rules: [
                      {
                        type: "string",
                        message: translate("Required"),
                        required: true,
                      },
                    ],
                    initialValue: Message,
                  })(<Input onChange={messageOnChnage}></Input>)}
                </Form.Item>
              </Form.Row>
              <Form.Row className="DDM-qbuilder">
                <Form.Item
                  label={translate("DDMQueryBuilderLabel")}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                >
                  <div className="DDM-QueryBuilder">
                    {queryBuilderVisible && (
                      <QueryBuilder
                        inline={true}
                        conditionDataSource={operationDataSource}
                        store={store.current}
                        conditionEditor={ConditionEditor}
                        conditionEditorProps={{
                          widgetFactory,
                          layoutItems,
                          currentFloor,
                          currentLayout,
                        }}
                        viewRenderer={viewRenderer}
                      />
                    )}
                  </div>
                  {queryBuilderErrorVisible && (
                    <Alert
                      type={"error"}
                      style={{
                        border: "solid 1px #ff5500",
                        background: "rgb(255 217 217)",
                        borderRadius: "5px",
                        padding: "10px",
                        marginTop: "5px",
                        color: "red",
                      }}
                      message={translate("DDM_QuerryBuilderValidation")}
                    ></Alert>
                  )}
                </Form.Item>
              </Form.Row>
            </LocalComplexConditionContext.Provider>
          </LayoutContent>
        </FormLayout>
      </Fieldset>
    </div>
  );
};

export default Form.create()(QueryBuilderPanel);
