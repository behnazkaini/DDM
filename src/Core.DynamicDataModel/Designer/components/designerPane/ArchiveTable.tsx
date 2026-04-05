import * as React from "react";
import { ReferenceArchiveViewer } from "../../../Widget/Display/referenceArchiveViewer";
import {
  ArchiveOrderColumnChange,
  GlobalPropsContext,
  TogglePropertiesItemDockAction,
} from "../../../Designer/store/reducers/designLayoutSlice";
import useFloorStack from "../../../Designer/hooks/useFloorStack";
import {
  BaseLayoutItemSetting,
  InlineArchiveLayoutDesignerViewModel,
  IWidgetFactory,
  LayoutItemColumnSetting,
  ReferenceArchiveWidgetProps,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { useAppDispatch } from "../../../Designer/store/hook";
import { PropertiesDockTabs } from "../../../../typings/Core.DynamicDataModel/Enums";
import { ModernTableColumnProps } from '@didgah-components/ant-table/utils';

import {
  Icon,
  Spin,
  TextViewerComponentField,
  Tooltip,
} from "didgah/ant-core-component";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { translate } from "didgah/common";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";

interface ArchiveTableProps {
  widgetFactory: IWidgetFactory;
  signalOnChange: (props: { reRender: () => void }) => void;
}

const ArchiveTable = (props: ArchiveTableProps) => {
  const timeOutId = React.useRef(undefined);
  const globalProps = React.useContext(GlobalPropsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const { currentLayout, currentFloor } =
    useFloorStack<InlineArchiveLayoutDesignerViewModel>({
      layoutGuid: globalProps.layoutGuid,
    });

  const { PropertiesDockItemState } = currentFloor;

  const handleClickOnColumnSetting = (columnGuid: string) => {
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        IsOpen: !PropertiesDockItemState.IsOpen,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutItemFocus: PropertiesDockItemState.IsOpen ? null : columnGuid,
      })
    );
  };

  function reRenderArchive() {
    setIsLoading(true);
    timeOutId.current = window.setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  React.useEffect(() => {
    props.signalOnChange({
      reRender: reRenderArchive,
    });

    setIsLoading(false);
    return () => {
      window.clearTimeout(timeOutId.current);
    };
  }, []);

  const Header = (
    layoutItemGuid: string,
    label: string,
    columnIndex: number,
    columnsLength: number
  ) => {
    const isRequired =
      !!currentLayout.Validations &&
      currentLayout.Validations.find(
        (rule) =>
          rule.LayoutItemGuid.toLowerCase() === layoutItemGuid.toLowerCase() &&
          rule.Type === ValidationType.Required
      );

    const TitleComponent = () => {
      return !!isRequired ? (
        <>
          <span style={{ color: "red" }}>*</span> {label}
        </>
      ) : (
        `${label}`
      );
    };

    const OrderBtns = (props: { index: number; length: number }) => {
      const { index, length } = props;

      const toLeftColumn = (layoutItemGuid: string) => () => {
        dispatch(
          ArchiveOrderColumnChange({
            LayoutGuid: currentLayout.Guid,
            layoutItemGuid,
            mode: "Left"
          })
        );
        reRenderArchive();
      };

      const toRightColumn = (layoutItemGuid: string) => () => {
        dispatch(
          ArchiveOrderColumnChange({
            LayoutGuid: currentLayout.Guid,
            layoutItemGuid,
            mode: "Right"
          })
        );
        reRenderArchive();
      };

      return (
        <>
          {index > 0 && (
            <Tooltip title={translate("ToRight")}>
              <Icon
                key={Math.random()}
                type="right"
                style={{ fontSize: "16px", cursor: "pointer" }}
                onClick={toRightColumn(layoutItemGuid)}
              />
            </Tooltip>
          )}
          {index < length - 1 && (
            <Tooltip title={translate("ToLeft")}>
              <Icon
                key={Math.random()}
                type="left"
                style={{ fontSize: "16px", cursor: "pointer" }}
                onClick={toLeftColumn(layoutItemGuid)}
              />
            </Tooltip>
          )}
        </>
      );
    };

    return !globalProps.permission.readOnly ? (
      <ul
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          flexDirection: "row-reverse",
          alignItems: "center",
          padding: 0,
          margin: 0,
        }}
      >
        <li>
          <div>
            <Icon
              key={Math.random()}
              type="setting"
              style={{ fontSize: "16px", cursor: "pointer" }}
              onClick={() => handleClickOnColumnSetting(layoutItemGuid)}
            />
          </div>
        </li>
        <li>{TitleComponent()}</li>
        <li>
          <OrderBtns index={columnIndex} length={columnsLength} />
        </li>
      </ul>
    ) : (
      TitleComponent()
    );
  };

  const SampleViewComponent = (): any => {
    return {
      component: () => TextViewerComponentField,
      setting: [],
      rule: [],
      layoutItemType: LayoutItemType.SubLayout,
    };
  };

  const layoutItems = currentLayout.Items.filter(
    (item) => item.Type !== LayoutItemType.SubLayout
  );

  const ArchiveProps: ReferenceArchiveWidgetProps = {
    value: [],
    onChange: function (value: any): void {
      throw new Error("Function not implemented.");
    },
    validationRules: {},
    initValue: [],
    mode: "design",
    layoutDesign: JSON.parse(currentLayout.Design),
    columns: layoutItems.sort((a, b) => {
      return a.OrderIndex - b.OrderIndex;
  }).map((item, index) => {
      const DesignItem: LayoutItemColumnSetting = JSON.parse(item.Design);
      return {
        Header: Header(item.Guid, DesignItem.Label, index, layoutItems.length),
        accessor: DesignItem.Label,
        dataIndex:
          item.Type === LayoutItemType.Column
            ? (item as LayoutItemColumnViewModel).ColumnGuid
            : (item as LayoutItemReferenceViewModel).RelationGuid,
        editComponent: SampleViewComponent(),
        viewComponent: SampleViewComponent(),
        staticProps: { columnSetting: item.Design, dataType: (props.widgetFactory.getDetailOfDataModel(item) as ColumnViewModel).DataType }
      } as ModernTableColumnProps<any>;
    }),
  };

  return (
    <Spin spinning={isLoading}>
      {!isLoading && (
        <ReferenceArchiveViewer {...ArchiveProps} />
      )}
    </Spin>
  );
};

export default ArchiveTable;
