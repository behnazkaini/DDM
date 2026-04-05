import { dragDrop, translate } from "didgah/common";
import {
  Button,
  Col,
  FormLayout,
  Modal,
  Radio,
  Row,
  StackPanel,
  Tabs,
  Tooltip,
  useAjax,
} from "didgah/ant-core-component";
import * as React from "react";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import {
  ArrangementType,
  DesignerItemType,
  DefineDesignerTabs,
  ErrorDesignType,
  PropertiesDockTabs,
} from "../../../typings/Core.DynamicDataModel/Enums";
import {
  DefineLayoutDesignerViewModel,
  DragableMetadata,
} from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetFactory } from "../../Widget/WidgetFactory";
import { useAppDispatch } from "../store/hook";
import {
  ChangeActiveTab,
  GlobalPropsContext,
  TogglePropertiesItemDockAction,
} from "../store/reducers/designLayoutSlice";
import FieldList from "./designTab/fieldList";
import RelationList from "./designTab/RelationList";
import LayoutDesignerPane from "./LayoutDesignerPane";
import useFloorStack from "../hooks/useFloorStack";
import ConditionView from "./conditionPane/ConditionView";
import { DefineLayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import OperationOnEvent from "./operationOnEvent";
import { copyDesignerForm } from "../helper";
import CopyFormModal from "./copyFormModal";

const ActionBar = FormLayout.ActionBar;
const ToolBar = FormLayout.ToolBar;
const LayoutSide = FormLayout.LayoutSide;
const LayoutContent = FormLayout.LayoutContent;
const TabPane = Tabs.TabPane;
const DragElementGroup = dragDrop.makeDragElementComponent("group", "div");
const DragElementRow = dragDrop.makeDragElementComponent("row", "div");
const DropElementHelpBlock = dragDrop.makeDragElementComponent("col", "div");

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

enum DesignerPaneType {
  Designer = "Designer",
  Validation = "Validation",
  OperationOnEvents = "OperationOnEvents",
}
const LayoutDesigner = () => {
  const dispatch = useAppDispatch();
  const ajax = useAjax();
  const globalProps = React.useContext(GlobalPropsContext);
  const { closeWindow, onSaveForm, openFormSettingModal, permission, context } =
    globalProps;
  const { currentLayout, currentFloor,  } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { IsLoading } = currentFloor;
  const [sideBarIsOpen, setSideBarIsOpen] = React.useState(true);
  const [designPaneMode, setDesignPaneMode] = React.useState(
    DesignerPaneType.Designer
  );
  const widgetFactory = React.useCallback(
    () => new WidgetFactory({
      layoutModel: currentFloor.LayoutModels,
      layoutGuid: currentFloor.LayoutGuid,
      dataModelGuid: currentFloor.DataModelGuid,
      softwareModels: currentFloor.SoftwareModels,
      context
    }),
    [currentFloor.StateVersion]
  );

  const onChangeHandler = (tabName: DefineDesignerTabs) => {
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: currentLayout.Guid,
        IsOpen: false,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutItemFocus: null,
      })
    );
    dispatch(
      ChangeActiveTab({ LayoutGuid: currentLayout.Guid, ActiveTab: tabName })
    );
  };

  const renderRow = (cols: Array<number>) => {
    const style = { border: "1px solid gray", margin: "2px", height: "15px" };
    return (
      <DragElementRow
        draggable
        metadata={
          {
            DesignType: ArrangementType.Row,
            ItemType: undefined,
            PayLoadItem: DesignerItemType.Tabs,
            attributes: { cols },
          } as DragableMetadata
        }
        id={Math.random()}
      >
        {" "}
        <Row>
          {cols.map((col, index) => (
            <Col xs={col * 2} key={index} md={col * 2}>
              <div style={style} />
            </Col>
          ))}
        </Row>
      </DragElementRow>
    );
  };

  const onSaveDesignForm = () => {
    onSaveForm();
  };

  const FormSettingValidationError = () => {
    const tempLi = [];

    currentFloor.FormValidation.forEach((error) => {
      switch (error.ErrorType) {
        case ErrorDesignType.LayoutHasNotName:
          tempLi.push(translate("FormNameIsRequired"));
          break;

        default:
          break;
      }
    });

    return (
      <ul>
        {tempLi.map((li, i) => (
          <li key={i} className="DDM-ActionBar-Error-Message">
            {li}
          </li>
        ))}
      </ul>
    );
  };

  const onChangedesignPaneMode = (e) => {
    setDesignPaneMode(e.target.value);
    if (e.target.value !== DesignerPaneType.Designer) {
      setSideBarIsOpen(false);
    } else {
      setSideBarIsOpen(true);
    }
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        IsOpen: false,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutItemFocus: null,
      })
    );
  };

  const hasFormError =
    currentFloor.FormValidation.findIndex(
      (error) => error.ErrorType === ErrorDesignType.LayoutHasNotName
    ) > -1
      ? true
      : false;


  return (
    <>
      <FormLayout key={`FormLayout_${currentLayout.Guid}`}>
        <ToolBar>
          <div style={{ display: "flex" }}>
            <RadioGroup
              onChange={onChangedesignPaneMode}
              value={designPaneMode}
            >
              <RadioButton value={DesignerPaneType.Designer}>
                {translate("Design")}
              </RadioButton>
              <RadioButton value={DesignerPaneType.Validation}>
                {translate("Validation")}
              </RadioButton>
              <RadioButton value={DesignerPaneType.OperationOnEvents}>
                {translate("OperationOnEvents")}
              </RadioButton>
            </RadioGroup>
          </div>
        </ToolBar>
        <LayoutSide
          dockType="simple"
          open={sideBarIsOpen && !globalProps.permission.readOnly}
          size={250}
          allowResize={false}
        >
          <Tabs
            tabPosition="left"
            defaultActiveKey={DefineDesignerTabs.Container}
            column={true}
            wrap={true}
            onChange={onChangeHandler}
            className={"DDM-core-designerTabs"}
            onTabClick={() => null}
          >
            <TabPane
              tab={translate("DDMLayouts")}
              key={DefineDesignerTabs.Container}
            >
              <Row>
                {/* <Col style={{ padding: 5, marginBottom: 5 }}>
                  <DragElementGroup
                    draggable
                    metadata={
                      {
                        DesignType: ArrangementType.Group,
                        ItemType: LayoutItemType.NoneBindable,
                        PayLoadItem: DesignerItemType.Tabs,
                      } as DragableMetadata
                    }
                    id={"Tabs"}
                  >
                    {translate("Tabs")}
                    <div
                      className="common question-16x16"
                      style={{ float: "right", marginLeft: "10px" }}
                    ></div>
                  </DragElementGroup>
                </Col> */}
                <Col style={{ padding: 5, marginBottom: 5 }}>
                  <DragElementGroup
                    draggable
                    metadata={
                      {
                        DesignType: ArrangementType.NoneBindableGroup,
                        ItemType: LayoutItemType.NoneBindable,
                        PayLoadItem: DesignerItemType.Fieldset,
                      } as DragableMetadata
                    }
                    id={"Fieldset"}
                  >
                    {translate("NewFieldSet")}
                    <div
                      className="common fieldset-16x16"
                      style={{ float: "right", marginLeft: "10px" }}
                    ></div>
                  </DragElementGroup>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={translate("DDMSorting")}
              key={DefineDesignerTabs.Sorting}
            >
              <ul style={{ width: "100%" }}>
                <li>{renderRow([12])}</li>
                <li>{renderRow([9, 3])}</li>
                <li>{renderRow([8, 4])}</li>
                <li>{renderRow([6, 6])}</li>
                <li>{renderRow([4, 8])}</li>
                <li>{renderRow([3, 9])}</li>
                <li>{renderRow([6, 3, 3])}</li>
                <li>{renderRow([3, 3, 6])}</li>
                <li>{renderRow([3, 6, 3])}</li>
                <li>{renderRow([4, 4, 4])}</li>
                <li>{renderRow([3, 3, 3, 3])}</li>
              </ul>
            </TabPane>
            <TabPane
              tab={translate("DDMFields")}
              key={DefineDesignerTabs.Fields}
              className={"DDM-core-FieldTabPane"}
            >
              <FieldList />
            </TabPane>
            <TabPane
              tab={translate("DDMRelations")}
              key={DefineDesignerTabs.Relations}
              className={"DDM-core-FieldTabPane"}
            >
              <>
                <RelationList Type={"Aggregation"} />
                <RelationList Type={"Composition"} />
              </>
            </TabPane>
            <TabPane
              tab={translate("DDMDrawing")}
              key={DefineDesignerTabs.Shapes}
              className={"DDM-core-FieldTabPane"}
            >
              <DropElementHelpBlock
                draggable
                metadata={
                  {
                    DesignType: ArrangementType.Shape,
                    ItemType: LayoutItemType.NoneBindable,
                    PayLoadItem: DesignerItemType.HelpBlock,
                  } as DragableMetadata
                }
                id={"HelpBlock"}
              >
                <div
                  style={{
                    margin: "2px 0px",
                    padding: "5px",
                    border: "1px dotted gray",
                    borderRadius: "5px",
                    borderLeft: "solid 5px gray",
                  }}
                >
                  {translate("Helpblock")}
                </div>
              </DropElementHelpBlock>
            </TabPane>
          </Tabs>
        </LayoutSide>
        <LayoutContent>
          {designPaneMode === DesignerPaneType.Designer && (
            <LayoutDesignerPane key={`LayoutDesignPane_${currentLayout.Guid}`} widgetFactory={widgetFactory()}   />
          )}
          {designPaneMode === DesignerPaneType.Validation && (
            <ConditionView
              ComplexValidations={
                (currentLayout as DefineLayoutDesignerViewModel)
                  .ComplexValidations
              }
              widgetFactory={widgetFactory()}
              layoutItems={(currentLayout as DefineLayoutViewModel).Items}
            />
          )}
          {designPaneMode === DesignerPaneType.OperationOnEvents && (
            <OperationOnEvent />
          )}
        </LayoutContent>
        <ActionBar>
          <StackPanel justify={"center"} align={"center"}>
            {hasFormError && <FormSettingValidationError />}
            {!globalProps.permission.readOnly && (
              <Tooltip
                placement="top"
                title={`${translate("Settings")} ${translate("Form")}`}
              >
                <Button
                  type="ghost"
                  shape="circle"
                  icon="setting"
                  onClick={() => openFormSettingModal(true)}
                  style={
                    hasFormError
                      ? {
                        backgroundColor: "#ffecec",
                        color: "red",
                        borderColor: "red",
                      }
                      : undefined
                  }
                />
              </Tooltip>
            )}
            <Button
              onClick={() => closeWindow({ rapidClose: permission.readOnly })}
            >
              {translate("Cancel")}
            </Button>
            {!permission.readOnly && (
              <Button
                loading={IsLoading}
                type="primary"
                onClick={onSaveDesignForm}
              >
                {translate("Save")}
              </Button>
            )}
            {currentLayout.State === "Unchanged" && <CopyFormModal layoutItemGuid={globalProps.layoutGuid} />}

          </StackPanel>
        </ActionBar>
      </FormLayout>
    </>
  );
};

export default LayoutDesigner;
