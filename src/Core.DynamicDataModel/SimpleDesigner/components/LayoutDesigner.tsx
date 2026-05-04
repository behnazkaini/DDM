import { dragDrop, translate } from "didgah/common";
import {
  Button,
  Col,
  Fieldset,
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
  OptionType,
} from "../../../typings/Core.DynamicDataModel/Enums";
import {
  DefineLayoutDesignerViewModel,
  DragableMetadata,
} from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetFactory } from "../../Widget/WidgetFactory";
import { useAppDispatch } from "../store/hook";
import {
  ChangeActiveTab,
  SimpleDesignerGlobalPropsContext,
  closePropertiesDockAction,
  closePropertiesItemDockAction,
  openPropertiesDockAction,
} from "../store/reducers/designLayoutSlice";
import FieldList from "./designTab/fieldList";
import RelationList from "./designTab/RelationList";
import LayoutDesignerPane from "./LayoutDesignerPane";
import useFloorStack from "../hooks/useFloorStack";
import ConditionView from "../../Designer/components/conditionPane/ConditionView";
import { DefineLayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import { copyDesignerForm } from "../helper";
import CopyFormModal from "./copyFormModal";
import PropertiesDock from "./PropertiesDock";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import ActionBarFrame from "./designerPane/ActionBarFrame";
import ActionBarFrameContainer from "./designerPane/ActionBarFrameContainer";

const ActionBar = FormLayout.ActionBar;
const ToolBar = FormLayout.ToolBar;
const LayoutSide = FormLayout.LayoutSide;
const LayoutContent = FormLayout.LayoutContent;
const TabPane = Tabs.TabPane;
export const DragElementGroup = dragDrop.makeDragElementComponent("group", "div");
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
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { closeWindow, onSaveForm, openFormSettingModal, permission, context } =
    globalProps;
  const { currentLayout, currentFloor, } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { PropertiesDockLayoutState, PropertiesDockItemState, SoftwareModels } = currentFloor;
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
      context,
      isSimpleDesignerMode: true
    }),
    [currentFloor.StateVersion]
  );

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

  const toggleDockHandler = () => {
    if(PropertiesDockItemState.FocusedLayoutItemGuid) {
      dispatch(
        closePropertiesItemDockAction({
          LayoutGuid: globalProps.layoutGuid,
        })
      );
    } else {
    dispatch(
      closePropertiesDockAction({
        LayoutGuid: globalProps.layoutGuid,
      })
    );
    }
  };

  const openFormSetting = () => {
    dispatch(
      openPropertiesDockAction({
        LayoutGuid: globalProps.layoutGuid,
      })
    );
  };

  const dockActiveTab = PropertiesDockItemState.ActiveSettingTab;

  const actionFramOptions = true
    ? [
      {
        Type: OptionType.Setting,
        onHandler: openFormSetting,
      },
    ]
    : [];

  return (
    <>
      <FormLayout key={`FormLayout_${currentLayout.Guid}`}>
        <LayoutSide
          dockType="simple"
          open={sideBarIsOpen && !globalProps.permission.readOnly}
          size={260}
          allowResize={false}
        >
          {PropertiesDockLayoutState.IsFormFocused || !!PropertiesDockItemState.FocusedLayoutItemGuid ? (
            <PropertiesDock
              widgetFactory={widgetFactory()}
              toggleDockCallBack={toggleDockHandler}
              activeTab={dockActiveTab}
              layoutItemFocus={PropertiesDockItemState.FocusedLayoutItemGuid}
              type={LayoutType.Define}
              validationRules={(currentLayout as DefineLayoutDesignerViewModel).Validations}
              softwareModels={SoftwareModels}
              isFormFocused={PropertiesDockLayoutState.IsFormFocused}
              layoutGuid={globalProps.layoutGuid}
            ></PropertiesDock>
          ) : (
            <>
              <Fieldset
                legend={translate("DDMSorting")}
                style={{
                  height: 'auto',
                  minHeight: 'auto'
                }}
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
              </Fieldset>
              <Fieldset
                legend={translate("DDMFields")}
                className={"DDM-core-FieldTabPane"}
                style={{
                  height: 'auto',
                  minHeight: 'auto'
                }}              >
                <FieldList />
              </Fieldset>
              <Fieldset
                legend={translate("DDMRelations")}
                className={"DDM-core-FieldTabPane"}
                style={{
                  height: 'auto',
                  minHeight: 'auto'
                }}
              >
                <RelationList />
              </Fieldset>
            </>)}
        </LayoutSide>
        <LayoutContent style={{ backgroundColor: '#fff' }}>
          <ActionBarFrameContainer
            isFocus={true}
            Options={actionFramOptions}
            designError={[]}
            signs={[]}
            sortable={false}
            design={currentLayout.Design}
            id={512}
            type={ArrangementType.NoneBindableGroup}
            onFindElement={null}
            onElementMove={null}
          >
            {designPaneMode === DesignerPaneType.Designer && (
              <LayoutDesignerPane
                key={`LayoutDesignPane_${currentLayout.Guid}`}
                widgetFactory={widgetFactory()}
              />
            )}
          </ActionBarFrameContainer>
        </LayoutContent>
        <ActionBar>
          <StackPanel justify={"center"} align={"center"}>
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
            {currentLayout.SimpleDesignerLayoutState === "Unchanged" && currentLayout.SimpleDesignerDataModelState === "Unchanged" && <CopyFormModal layoutItemGuid={globalProps.layoutGuid} />}

          </StackPanel>
        </ActionBar>
      </FormLayout>
    </>
  );
};

export default LayoutDesigner;
