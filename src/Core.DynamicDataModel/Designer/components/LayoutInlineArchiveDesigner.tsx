import * as React from "react";
import { translate } from "didgah/common";
import { Spin, Tabs } from "didgah/ant-core-component";
import { LayoutTabs } from "../../../typings/Core.DynamicDataModel/Enums";
import LayoutPreviewer from "./LayoutPreviewer";
import { GlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "../hooks/useFloorStack";
import LayoutArchive from "./LayoutArchive";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";

const TabPane = Tabs.TabPane;

const LayoutInlineArchiveDesigner = () => {
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentFloor, currentLayout } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { IsLoading } = currentFloor;
  const [currentTab, setCurrentTab] = React.useState<string>(
    LayoutTabs.Designer
  );

  const clickTabHandler = (tabName) => {
    setCurrentTab(tabName);
  };

  return (
    <Spin spinning={IsLoading} stretch>
      <Tabs
        activeKey={currentTab}
        defaultActiveKey={LayoutTabs.Designer}
        className={"coreDDM_tabBar"}
        onChange={clickTabHandler}
        animated={true}
        onTabClick={() => null}
      >
        <TabPane key={LayoutTabs.Designer.toString()} tab={translate("Design")}>
          {!IsLoading && <LayoutArchive layoutType={LayoutType.InlineArchive} />}
        </TabPane>
        <TabPane key={LayoutTabs.Preview.toString()} tab={translate("Preview")}>
          <div style={{ width: "100%" }}>{<LayoutPreviewer mode={"add"} designVersion={currentFloor.StateVersion} inLoadableMode={true} layoutGuid={currentLayout.Guid} dataModelGuid={currentLayout.DataModelGuid} previewInitialDataForDesigner={{DataModels: currentFloor.LayoutModels.DataModels, Layouts: currentFloor.LayoutModels.Layouts, Rows: []}} layoutType={currentLayout.Type} webSoftwareComponents={currentFloor.SoftwareModels} />}</div>
        </TabPane>
      </Tabs>
    </Spin>
  );
};

export default LayoutInlineArchiveDesigner;
