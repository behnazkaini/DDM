import { ArchiveWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { guid, translate } from "didgah/common";
import {
  Button,
  Checkbox,
  Form,
  FormLayout,
  Icon,
  Input,
  Message,
  NumericalInput,
  SideBar,
  StackPanel,
  useAppContext,
  WrappedFormUtils,
} from "didgah/ant-core-component";
import * as React from "react";
import useFloorStack from "../hooks/useFloorStack";
import { SimpleDesignerGlobalPropsContext, SetPluginValues, SetFormNameSetting, SetDataModelNameSetting, SetBookmarkSetting, SaveLayoutArchiveInfo } from "../store/reducers/designLayoutSlice";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import SearchSettingInput from "../../Designer/components/archiveSetting/SearchSetting";
import { getDDMPlugin, loadDDMPlugin, PluggableId } from "../../PluginHelper/plugable";
import { useAppDispatch } from "../store/hook";
import { SaveLayoutPluginViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveLayoutPluginViewModel";
import { DDMPlugin } from "@didgah/ddm-plugins";
import { validNameRegex } from "../../../Core.DynamicDataModel/Modeler/Utility";

const LayoutContent = FormLayout.LayoutContent;
const Dock = SideBar;
const FormRow = Form.Row;
const FormItem = Form.Item;

interface ArchiveLayoutPropertiesDockProps {
  form?: WrappedFormUtils<any>;
  archiveLayoutWidgetSetting: ArchiveWidget;
  layoutItems: Array<LayoutItemViewModel>;
  plugins: DDMPlugin[];
  toggleFormDockHandler: () => void;
}

const ArchiveLayoutPropertiesDock = (
  props: ArchiveLayoutPropertiesDockProps
) => {
  const appContext = useAppContext();
  const { form, archiveLayoutWidgetSetting, layoutItems, plugins, toggleFormDockHandler } =
    props;
  const { layoutGuid } = React.useContext(SimpleDesignerGlobalPropsContext);
  const [loading, setLoading] = React.useState(true);
  const { currentFloor, currentDataModel, currentLayout } = useFloorStack({
    layoutGuid: layoutGuid,
  });
  const dispatch = useAppDispatch();

  const onPluginValueChange = (pluginGuid, pluginValue) => {
    const plugins = currentLayout.Plugins ? [...currentLayout.Plugins] : [];
    const currentIndex = plugins.findIndex(p => p.PluginGuid === pluginGuid);
    if (currentIndex > -1) {
      plugins[currentIndex] = { ...plugins[currentIndex], Value: pluginValue }
    } else {
      plugins.push({
        LayoutGuid: layoutGuid,
        Guid: guid.newGuid(),
        PluginGuid: pluginGuid,
        Value: pluginValue
      });
    }
    dispatch(SetPluginValues({
      LayoutGuid: layoutGuid,
      plugins
    }))
  }

  const handleFormNameChange = (e) => {
    dispatch(
      SetFormNameSetting({
        LayoutGuid: layoutGuid,
        formName: e.target.value,
      })
    );
  }

  const handleDataModelNameChange = (e) => {
    dispatch(
      SetDataModelNameSetting({
        LayoutGuid: layoutGuid,
        dataModelName: e.target.value,
      })
    );
  }

  const handleBookmarkChange = (e) => {
    dispatch(
      SetBookmarkSetting({
        LayoutGuid: layoutGuid,
        Bookmark: e.target.value,
      })
    );
  }

  const validateMinAndMax = (minRow, maxRow) => {
    let result = true;
    if ((+maxRow > 1000 && +maxRow < 1) || (+minRow > 1000 && +minRow < 1)) {
      Message.warning(translate('MaxRowAndMinRowShouldBetweenOneAndThousand'));
      result = false;
    }
    if (+maxRow && +minRow > +maxRow) {
      Message.warning(translate('MinRowShouldLesserOrEqualMaxRow'));
      result = false;
    }
    return result;
  }
  const handleSearchSettingChange = (e) => {
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          SearchSetting: e.target.value
        } as any
      })
    );
  }

  const handleHasPaginationChange = (e) => {
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          HasPagination: e.target.value
        } as any
      })
    );
  }

  const handleHasSortChange = (e) => {
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          HasSort: e.target.value
        } as any
      })
    );
  }

  const handleMinRowChange = (value) => {
    if(validateMinAndMax(value, archiveLayoutWidgetSetting.MaxRow)) {
      dispatch(
        SaveLayoutArchiveInfo({
          LayoutGuid: layoutGuid,
          Widget: {
            MinRow: value
          } as any
        })
        );
      }
  }

  const handleMaxRowChange = (value) => {
    if(validateMinAndMax(archiveLayoutWidgetSetting.MinRow , value)) {
      dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          MaxRow: value
        } as any
      })
    );
    }
  }

  const handleCanAddRowChange = (e) => {
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          CanAddRow: e.target.checked
        } as any
      })
    );
  }

  const handleCanRemoveRowChange = (e) => {
    dispatch(
      SaveLayoutArchiveInfo({
        LayoutGuid: layoutGuid,
        Widget: {
          CanRemoveRow: e.target.checked
        } as any
      })
    );
  }
  const { getFieldDecorator } = form;

  const { Label, DataModelInfo } = currentLayout as any;

  React.useEffect(() => {
    const myPlugins = plugins.filter(p => p.pluggableId === PluggableId.archiveLayoutPropertiesDock);
    Promise.all(myPlugins.map(p => loadDDMPlugin(p.name, appContext.DebugMode))).then(() => {
      setLoading(false);
      form.validateFields(() => {});
    });
  }, []);

  const formItemSetting = {
    labelCol: { span: 0, offset: 0 },
    wrapperCol: { span: 24, offset: 0 }
  };

  return (
    !loading && (
      <FormLayout style={{ backgroundColor: 'transparent' }}>
        <LayoutContent style={{ backgroundColor: 'transparent' }}>
          <div
            style={{
              backgroundColor: '#3578ac',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              margin: '0px -5px',
              marginTop: '-5px',
              padding: '5px',
              minHeight: '40px',
              height: '40px',
            }}
            className="propertiesdock_header"
          >
            <div
              style={{
                fontSize: 'var(--font-size-md)'
              }}
              className="propertiesdock_button-wrapper"
            >
              تنظیمات
            </div>
            <div className="propertiesdock_button-wrapper" style={{ marginRight: 'auto' }}>
              <Icon style={{
                fontSize: '20px'
              }} type="arrow-left" onClick={toggleFormDockHandler} />
            </div>
          </div>
          <FormRow>
            <FormItem
              label={`${translate("Name")} ${translate("Form")}`}
              {...formItemSetting}
            >
              {getFieldDecorator('FormName', { initialValue: Label, rules: [{ required: true }] })(
                <Input
                  type="text"
                  onChange={handleFormNameChange}
                ></Input>)}
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem
              label={`${translate("DataModelName")}`}
              {...formItemSetting}
            >
              {getFieldDecorator('DataModelName', { initialValue: DataModelInfo?.Name, rules: [{ required: true, pattern: validNameRegex, message: translate('DDMModelerTableNameincorrect') }] })(
                <Input
                  type="text"
                  onChange={handleDataModelNameChange}
                  disabled={currentLayout.SimpleDesignerDataModelState !== 'Added'}
                ></Input>)}
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem
              label={`${translate("Bookmark")}`}
              {...formItemSetting}
            >
              {getFieldDecorator('Bookmark', { initialValue: DataModelInfo?.Bookmark, rules: [] })(
                <Input
                  type="text"
                  onChange={handleBookmarkChange}
                ></Input>)}
            </FormItem>
          </FormRow>
          <FormRow>
            <Form.Item
              label={translate("DDMSearchSetting")}
              labelCol={{ span: 0, offset: 0 }}
              wrapperCol={{ span: 24, offset: 0 }}
            >
              {form.getFieldDecorator("SearchSetting", {
                 initialValue: archiveLayoutWidgetSetting.SearchSetting
              })(
                <SearchSettingInput
                  layoutItems={layoutItems}
                  onChange={handleSearchSettingChange}
                ></SearchSettingInput>
              )}
            </Form.Item>
          </FormRow>
          <FormRow>
            <div style={{ marginTop: 10 }}>
              <Form.Item
                label={translate("DDMArchivePagination")}
                labelCol={{ span: 8, offset: 0 }}
                wrapperCol={{ span: 16, offset: 0 }}
              >
                {form.getFieldDecorator("HasPagination", {
                  initialValue: archiveLayoutWidgetSetting.HasPagination,
                  valuePropName: "checked"
                })(<Checkbox
                  onChange={handleHasPaginationChange}
                ></Checkbox>)}
              </Form.Item>
            </div>
          </FormRow>
          <FormRow>
            <div style={{ marginTop: 10 }}>
              <Form.Item
                label={translate("DDMColumnSort")}
                labelCol={{ span: 8, offset: 0 }}
                wrapperCol={{ span: 16, offset: 0 }}
              >
                {form.getFieldDecorator("HasSort", {
                  initialValue: archiveLayoutWidgetSetting.HasSort,
                  valuePropName: "checked"
                })(<Checkbox
                  onChange={handleHasSortChange}
                ></Checkbox>)}
              </Form.Item>
            </div>
          </FormRow>
          {plugins.filter(p => p.pluggableId === PluggableId.archiveLayoutPropertiesDock).map(p => {
            const PluginComponent = getDDMPlugin(p.name);
            const pluginProps = {
              dataModel: currentDataModel
            };
            return <FormRow>
              <div style={{ marginTop: 10 }}>
                <Form.Item
                  label={p.name}
                  labelCol={{ span: 8, offset: 0 }}
                  wrapperCol={{ span: 16, offset: 0 }}
                >
                  <PluginComponent {...pluginProps} onChange={(val) => { onPluginValueChange(p.guid, val) }} />
                </Form.Item>
              </div>
            </FormRow>
          })}
          <FormRow>
            <Form.Item
              labelCol={{ span: 12, offset: 0 }}
              wrapperCol={{ span: 12, offset: 0 }}
              label={translate("MaxRow")}
            >
              {form.getFieldDecorator("MaxRow", {
                initialValue: archiveLayoutWidgetSetting.MaxRow, rules: [
                  { max: 1000, min: 1, type: 'number', message: translate('ValueRangeViolation').replace('{1}', '1000').replace('{0}', '1') },
                ]
              })(<NumericalInput onChange={handleMaxRowChange} />)}
            </Form.Item>
          </FormRow>
          <FormRow>
            <Form.Item
              labelCol={{ span: 12, offset: 0 }}
              wrapperCol={{ span: 12, offset: 0 }}
              label={translate("MinRow")}
            >
              {form.getFieldDecorator("MinRow", {
                initialValue: archiveLayoutWidgetSetting.MinRow, rules: [
                  { max: 1000, min: 1, type: 'number', message: translate('ValueRangeViolation').replace('{1}', '1000').replace('{0}', '1') },
                  { validator: (_, value) => (value && form.getFieldValue('MaxRow')) ? value <= form.getFieldValue('MaxRow') : true, message: translate('MinRowShouldLesserOrEqualMaxRow') }
                ]
              })(<NumericalInput onChange={handleMinRowChange} />)}
            </Form.Item>
          </FormRow>
            <Form.Item labelCol={{ span: 12, offset: 0 }}
              wrapperCol={{ span: 12, offset: 0 }}
              label={translate("CanAddRow")}>
              {form.getFieldDecorator("ImpossibilityAdd", {
                initialValue: archiveLayoutWidgetSetting.ImpossibilityAdd,
                valuePropName: "checked"
              })(<Checkbox onChange={handleCanAddRowChange} />)}
            </Form.Item>
            <Form.Item
              labelCol={{ span: 12, offset: 0 }}
              wrapperCol={{ span: 12, offset: 0 }}
              label={translate("CanRemoveRow")}
            >
              {form.getFieldDecorator("ImpossibilityRemove", {
                initialValue: archiveLayoutWidgetSetting.ImpossibilityRemove,
                valuePropName: "checked"
              })(<Checkbox onChange={handleCanRemoveRowChange} />)}
            </Form.Item>
        </LayoutContent>
      </FormLayout>
    )
  );
};

export default Form.create()(ArchiveLayoutPropertiesDock);
