import * as React from "react";
import { ReferenceArchiveViewer } from "../../../Widget/Display/referenceArchiveViewer";
import {
  ArchiveOrderColumnChange,
  RemoveArchiveColumn,
  SimpleDesignerGlobalPropsContext,
  ToggleArchiveColumn,
  openPropertiesItemDockAction,
} from "../../../SimpleDesigner/store/reducers/designLayoutSlice";
import useFloorStack from "../../../SimpleDesigner/hooks/useFloorStack";
import {
  BaseLayoutItemSetting,
  InlineArchiveLayoutDesignerViewModel,
  InlineArchiveLayoutSimpleDesignerViewModel,
  IWidgetFactory,
  LayoutItemColumnSetting,
  ReferenceArchiveWidgetProps,
  RichLayoutItem,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { LayoutItemColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { useAppDispatch } from "../../../SimpleDesigner/store/hook";
import { PropertiesDockTabs } from "../../../../typings/Core.DynamicDataModel/Enums";
import { ModernTableColumnProps } from '@didgah-components/ant-table/utils';

import {
  CustomIcon,
  Icon,
  Spin,
  TextViewerComponentField,
  Tooltip,
} from "didgah/ant-core-component";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { translate } from "didgah/common";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { convertDesignerVersion2WidgetTypeToDataType } from "../../../../Core.DynamicDataModel/Widget/WidgetFactory";

interface ArchiveTableProps {
  widgetFactory: IWidgetFactory;
  signalOnChange: (props: { reRender: () => void }) => void;
  handleRemoveColumn: (columnGuid: string) => void;
}

const ArchiveTable = (props: ArchiveTableProps) => {
  const timeOutId = React.useRef(undefined);
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const { currentLayout, currentFloor } =
    useFloorStack<InlineArchiveLayoutSimpleDesignerViewModel>({
      layoutGuid: globalProps.layoutGuid,
    });

  const handleClickOnColumnSetting = (columnGuid: string) => {
    dispatch(
      openPropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        layoutItemGuid: columnGuid,
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
            mode: "Left",
            newIndex: index + 1,
          })
        );
        reRenderArchive();
      };

      const toRightColumn = (layoutItemGuid: string) => () => {
        dispatch(
          ArchiveOrderColumnChange({
            LayoutGuid: currentLayout.Guid,
            layoutItemGuid,
            mode: "Right",
            newIndex: index - 1,
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
          alignItems: "center",
          padding: 0,
          margin: 0,
          cursor: 'pointer'
        }}
      >
        <li 
        style={{flex: 1, textAlign: 'center'}}
        onClick={() => handleClickOnColumnSetting(layoutItemGuid)}
        >{TitleComponent()}</li>
        <li
          key={Math.random()}
          style={{  margin: "2px", textAlign: 'left' }}
          onClick={() => handleClickOnColumnSetting(layoutItemGuid)}
        >
          <Icon
            key={Math.random()}
            type="setting"
            style={{ fontSize: "16px", padding: "2px", fontWeight: 'normal' }}
          />
        </li>
        <li>
          <Icon
            key={Math.random()}
            type="delete"
            style={{ fontSize: "16px", padding: "2px", fontWeight: 'normal' }}
            onClick={() => props.handleRemoveColumn(layoutItemGuid)}
          />

        </li>
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
    columns: layoutItems.map((item, index) => {
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
        staticProps: { columnSetting: item.Design, dataType: convertDesignerVersion2WidgetTypeToDataType((item as RichLayoutItem).simpleDesignerData?.simpleDesignerWidgetType) }
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
