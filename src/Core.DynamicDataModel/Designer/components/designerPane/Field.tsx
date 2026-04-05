import {
  ColumnItem,
  ComponentModel,
  DefineLayoutDesignerViewModel,
  FormValidationError,
  IWidget,
  IWidgetFactory,
} from "../../../../typings/Core.DynamicDataModel/Types";
import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  ArrangementType,
  DefineDesignerTabs,
  OptionType,
  PropertiesDockTabs,
  SignType,
} from "../../../../typings/Core.DynamicDataModel/Enums";
import { useAppDispatch } from "../../../Designer/store/hook";
import ActionBarFrame from "./ActionBarFrame";
import { Form, Modal, WrappedFormUtils } from "didgah/ant-core-component";
import {
  GlobalPropsContext,
  LocalPropsContext,
  RemoveColumnAction,
  TogglePropertiesItemDockAction,
} from "../../../Designer/store/reducers/designLayoutSlice";
import useFloorStack from "../../../Designer/hooks/useFloorStack";
import LayoutManager from "../../../LayoutManager";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { isExistLayoutitemInCondition, isExistLayoutitemInEvent } from "../../../Designer/services/widgetManager";
import { translate } from "didgah/common";
import { ValidationType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";

const FieldItem = Form.Item;
interface FieldProps {
  column: ColumnItem;
  widgetFactory: IWidgetFactory;
  form?: WrappedFormUtils<any>;
  error: FormValidationError[];
  conditionFields: string[];
  eventFields: string[];
}

export const InnerField = (props: FieldProps) => {
  const globalProps = useContext(GlobalPropsContext);
  const localProps = useContext(LocalPropsContext);

  const { currentFloor, currentLayout } =
    useFloorStack<DefineLayoutDesignerViewModel>({
      layoutGuid: globalProps.layoutGuid,
    });

  const { Count, StateVersion, ActiveTab, PropertiesDockItemState } =
    currentFloor;
  const dispatch = useAppDispatch();
  const [Setting, setSetting] = useState(null);
  const [Component, setComponent] = useState<ComponentModel>(null);
  const { form, widgetFactory, column, error, conditionFields, eventFields } = props;

  const onDeleteOptionHandler = () => {
    const fieldExistsInValidation = isExistLayoutitemInCondition(
      column.LayoutItemGuid,
      currentLayout.ComplexValidations
    );
    const fieldExistsInEvent = isExistLayoutitemInEvent(column.LayoutItemGuid, currentLayout.Design);

    if (fieldExistsInValidation || fieldExistsInEvent) {
      Modal.info({
        title: translate("DDMFieldExistInLayout"),
        content: translate("DDMFieldExistInLayoutDesc"),
        okText: translate("Ok"),
        cancelText: translate("Cancel"),
        onOk: () => {
          return;
        },
        onCancel: () => {
          return;
        },
      });
      return;
    }

    dispatch(
      RemoveColumnAction({
        LayoutGuid: globalProps.layoutGuid,
        LayoutItemGuid: column.LayoutItemGuid,
      })
    );
  };

  const onSettingOptionHandler = () => {
    dispatch(
      TogglePropertiesItemDockAction({
        LayoutGuid: globalProps.layoutGuid,
        IsOpen: !PropertiesDockItemState.IsOpen,
        ActiveSettingTab: PropertiesDockTabs.Setting,
        LayoutItemFocus:
          PropertiesDockItemState.IsOpen === false
            ? column.LayoutItemGuid
            : null,
      })
    );
  };

  const onDesignerOptionHandler = () => {
    localProps.onOpenInnerLayoutDesigner(column.LayoutItemGuid);
  };

  const getActiveActionFrame = (
    layoutItemType: LayoutItemType
  ): DefineDesignerTabs[] => {
    switch (layoutItemType) {
      case LayoutItemType.Column:
        return [DefineDesignerTabs.Fields];

      case LayoutItemType.Reference:
      case LayoutItemType.SubLayout:
        return [DefineDesignerTabs.Relations];

      case LayoutItemType.NoneBindable:
        return [DefineDesignerTabs.Shapes];

      default:
        return [];
    }
  };

  const getComponentFieldItemProps = (props: {
    setting: any;
    layoutItemType: LayoutItemType;
    layoutItemGuid: string;
  }): { props: any; rules: any } => {
    const { setting, layoutItemType, layoutItemGuid } = props;
    const result: { props: any; rules: any } = { props: {}, rules: {} };

    switch (layoutItemType) {
      case LayoutItemType.SubLayout:
        result.props.help = setting.HelpTooltip;
        result.props.key = Math.random();
        result.props.label = setting.label;
        result.props.labelCol = {
          span: 4,
        };
        result.props.wrapperCol = {
          span: 20,
        };
        break;
      case LayoutItemType.NoneBindable:
        result.props.help = setting.HelpTooltip;
        result.props.key = Math.random();
        result.props.label = null;
        result.props.labelCol = {
          span: 0,
        };
        result.props.wrapperCol = {
          span: 24,
        };
        break;

      case LayoutItemType.Column:
      case LayoutItemType.Reference:
        const isRequired =
          layoutItemGuid !== null &&
          currentLayout.Validations.find(
            (rule) =>
              rule.LayoutItemGuid.toLowerCase() ===
              layoutItemGuid.toLowerCase() &&
              rule.Type === ValidationType.Required
          );
        const requiredRules = !!isRequired
          ? { required: true, message: translate("Required") }
          : {};

        result.rules = requiredRules;
        result.props.help = setting.HelpTooltip;
        result.props.key = Math.random();
        result.props.label = setting.Label;
        result.props.labelCol = {
          span: !!setting && setting.LabelMutable ? setting.WrapperLabel : 4,
        };
        result.props.wrapperCol = {
          span: !!setting && setting.LabelMutable ? setting.WrapperCol : 20,
        };
        break;

      default:
        break;
    }

    return result;
  };

  const getOptionBar = (layoutItem: LayoutItemType) => {
    const ColumnActionFramOptions =
      ActiveTab === DefineDesignerTabs.Fields ||
        ActiveTab === DefineDesignerTabs.Relations ||
        ActiveTab === DefineDesignerTabs.Shapes
        ? [
          {
            Type: OptionType.Delete,
            onHandler: onDeleteOptionHandler,
          },
          {
            Type: OptionType.Setting,
            onHandler: onSettingOptionHandler,
          },
        ]
        : [];

    const SubFormActionFramOptions =
      ActiveTab === DefineDesignerTabs.Relations
        ? [
          {
            Type: OptionType.Delete,
            onHandler: onDeleteOptionHandler,
          },
          {
            Type: OptionType.Setting,
            onHandler: onDesignerOptionHandler,
          },
        ]
        : [];

    switch (layoutItem) {
      case LayoutItemType.Column:
      case LayoutItemType.Reference:
      case LayoutItemType.NoneBindable:
        return ColumnActionFramOptions;

      case LayoutItemType.SubLayout:
        return SubFormActionFramOptions;
      default:
        break;
    }
  };

  const getFieldSigns = (props: {
    events: string[];
    conditions: string[];
    layoutItemGuid: string;
  }): Array<{ Type: SignType }> => {
    const { events, conditions, layoutItemGuid } = props;
    const signs = [];

    if (
      !!conditions.find(
        (fieldGuid) =>
          fieldGuid.toLowerCase() ===
          (!!layoutItemGuid && layoutItemGuid.toLowerCase())
      )
    ) {
      signs.push({ Type: SignType.Validation });
    }

    if (
      !!events.find(
        (fieldGuid) =>
          fieldGuid.toLowerCase() ===
          (!!layoutItemGuid && layoutItemGuid.toLowerCase())
      )
    ) {
      signs.push({ Type: SignType.Event });
    }

    return signs;
  };

  useEffect(() => {
    if (column.LayoutItemGuid !== null) {
      switch (column.Type) {
        case ArrangementType.SubLayout:
          const layoutManager = new LayoutManager({
            LayoutsModel: currentFloor.LayoutModels,
            context: globalProps.context,
            isSimpleDesignerMode: false
          });

          const newSubLayoutComponent = {
            ...layoutManager.getSubLayoutComponent(
              column.LayoutItemGuid,
              currentFloor.LayoutGuid
            ),
          };

          setSetting(newSubLayoutComponent.setting);
          setComponent(newSubLayoutComponent);
          break;
        case ArrangementType.NoneBindableGroup:
          const newComponentModelGroup = {
            ...widgetFactory.getComponent(column.LayoutItemGuid),
          };

          setSetting(newComponentModelGroup.setting);
          setComponent(newComponentModelGroup);

          break;
        default:
          const newComponentModel = {
            ...widgetFactory.getComponent(column.LayoutItemGuid),
          };

          setSetting(newComponentModel.setting);
          setComponent(newComponentModel);
          break;
      }
    } else {
      setComponent(null);
    }
  }, [Count.Field, StateVersion]);

  const isFocused =
    column.LayoutItemGuid != null &&
    PropertiesDockItemState.IsOpen &&
    column.LayoutItemGuid.toLowerCase() ===
    PropertiesDockItemState.LayoutItemFocus.toString();
  const isNotFocused =
    column.LayoutItemGuid != null &&
    currentFloor.PropertiesDockItemState.IsOpen &&
    column.LayoutItemGuid.toLowerCase() !==
    currentFloor.PropertiesDockItemState.LayoutItemFocus.toString();

  if (!!Component && !!Setting) {
    const ComponentElement = (Component.component as IWidget).component;
    const rest = {
      ...Setting,
      mode: "design",
      layoutItemGuid: column.LayoutItemGuid,
      layouts: widgetFactory.layouts,
      dataModels: widgetFactory.dataModels
    };
    if (Component.layoutItemType === LayoutItemType.Reference) {
      rest.referenceDataModelGuid = column.LayoutItemGuid ? (widgetFactory.getDetailOfDataModel(widgetFactory.getLayoutItem(column.LayoutItemGuid)) as RelationViewModel).ReferenceDataModelGuid : null
    }
    const formItemProps = getComponentFieldItemProps({
      setting: Setting,
      layoutItemType: Component.layoutItemType,
      layoutItemGuid: column.LayoutItemGuid,
    });
    const ColumnActionFramSigns = getFieldSigns({ events: eventFields, conditions: conditionFields, layoutItemGuid: column.LayoutItemGuid });
    return (
      <ActionBarFrame
        isFocus={isFocused}
        isNotFocus={isNotFocused}
        key={Math.random()}
        Options={getOptionBar(Component.layoutItemType)}
        style={{ border: "none", margin: 0 }}
        beActiveTab={getActiveActionFrame(Component.layoutItemType)}
        currentTab={ActiveTab}
        designError={[]}
        signs={ColumnActionFramSigns}
      >
        <div style={{ clear: "both" }}>
          <FieldItem {...formItemProps.props}>
            {form.getFieldDecorator(column.Id.toString(), {
              rules: [formItemProps.rules],
            })(<ComponentElement {...rest} />)}
          </FieldItem>
        </div>
      </ActionBarFrame>
    );
  } else {
    return null;
  }
};

const Field = (props: FieldProps) => {
  const globalProps = useContext(GlobalPropsContext);
  const { currentLayout } = useFloorStack<DefineLayoutDesignerViewModel>({ layoutGuid: globalProps.layoutGuid });

  const Wrapper = useMemo(() => {
    return Form.create({ labelLayout: currentLayout.ShowFormItemLabelInSepratedRow ? 'fullSize' : 'default' })(InnerField)
  }, [currentLayout.ShowFormItemLabelInSepratedRow])

  return <Wrapper {...props} />
}

export default Field
