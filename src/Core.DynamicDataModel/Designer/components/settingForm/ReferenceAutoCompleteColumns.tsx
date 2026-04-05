import {
  Alert,
  Button,
  CheckboxItem,
  CheckboxList,
  Form,
  Input,
  Label,
  Modal,
  Spin,
  StackPanel,
  Tag,
  Tooltip,
} from "didgah/ant-core-component";
import React from "react";
import { translate } from "../../../../Utility/language";
import { IDictionary, ReferenceAutoComplete, RichLayoutItem, SettingFormItemProps } from "../../../../typings/Core.DynamicDataModel/Types";
import { ColumnViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { CheckboxListStore } from "didgah/ant-core-component";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import modelerTransportLayer from '../../../Modeler/transportLayer';

interface ViewModel {
  columns: ColumnViewModel[];
  onChange?: (value: {
    Columns: IDictionary<{ order: number }>;
    SeperableCharachter: string;
  }) => void;
  value?: {
    Columns: IDictionary<{ order: number }>;
    SeperableCharachter: string;
  };
}

const RefrenceAutoCompleteColumns = (
  props: SettingFormItemProps<ReferenceAutoComplete> & { layoutItem: LayoutItemViewModel; isSimpleDesignerMode: boolean; }
) => {
  const [visibleModel, setvisibleModel] = React.useState<boolean>(false);
  const { initialSettingValues, form, settingName, onSave, key, layoutItem, isSimpleDesignerMode } = props;
  const [dataModel, setDataModel] = React.useState(props.isSimpleDesignerMode ? null : props.dataModel);

  const WrapperInput = ({ onChange, value, columns }: ViewModel) => {
    const [errors, setErrors] = React.useState<Array<string>>([]);
    const store1 = React.useRef(new CheckboxListStore()).current;
    const [checkBoxItems, setCheckBoxItem] = React.useState(() => {
      return columns.map((column) => {
        const isSelected = value.Columns[column.Guid] == null ? false : true;
        return { text: column.Label, value: column.Guid, selected: isSelected };
      });
    })


    const sortDictionary = (
      obj: IDictionary<{ order: number }>
    ): Array<{ key: string; value: { order: number } }> => {
      const items = Object.keys(obj).map(function (key) {
        return { key: key, value: obj[key] };
      });

      items.sort(function (
        first: { key: string; value: { order: number } },
        second: { key: string; value: { order: number } }
      ) {
        if (first["value"].order > second["value"].order) {
          return +1;
        } else if (first["value"].order < second["value"].order) {
          return -1;
        } else {
          return 0;
        }
      });

      return [
        ...items.sort(function (
          first: { key: string; value: { order: number } },
          second: { key: string; value: { order: number } }
        ) {
          if (first["value"].order < second["value"].order) {
            return -1;
          } else if (first["value"].order > second["value"].order) {
            return +1;
          } else {
            return 0;
          }
        }),
      ];
    };

    const [selectedColumnsTag, setSelectedColumnsTag] = React.useState<
      Array<CheckboxItem>
    >(() => {
      const sortedArray = sortDictionary(value.Columns);

      return [
        ...sortedArray.map((columnItem, index) => {
          const label = columns.find(
            (column) =>
              column.Guid.toLowerCase() === columnItem.key.toLowerCase()
          );

          return { value: columnItem.key, text: label.Label, selected: true };
        }),
      ];
    });

    const [seperableCharacter, setseperableCharacter] = React.useState(
      value.SeperableCharachter
    );

    const onClickArrowTags = (tags: CheckboxItem[]) => {
      setSelectedColumnsTag(tags);
    };

    //Component
    const TagColumn = (props: {
      tags: CheckboxItem[];
      onChangeTagOrder: (tags: CheckboxItem[]) => void;
    }) => {
      const { tags, onChangeTagOrder } = props;

      const arrayMoveItem = (
        arr: CheckboxItem[],
        old_index: number,
        new_index: number
      ): CheckboxItem[] => {
        const tempArr = [...arr];
        if (new_index >= tempArr.length) {
          var k = new_index - tempArr.length + 1;
          while (k--) {
            tempArr.push(undefined);
          }
        }

        tempArr.splice(new_index, 0, tempArr.splice(old_index, 1)[0]);

        return [...tempArr];
      };

      const handleLeft = (
        payload: { guid: string; currentIndex: number },
        e
      ) => {
        const { guid, currentIndex } = payload;

        const newIndex =
          currentIndex < tags.length - 1 ? currentIndex + 1 : currentIndex;

        onChangeTagOrder(arrayMoveItem(tags, currentIndex, newIndex));
      };

      const handleRight = (
        payload: { guid: string; currentIndex: number },
        e
      ) => {
        const { guid, currentIndex } = payload;

        const newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;

        onChangeTagOrder(arrayMoveItem(tags, currentIndex, newIndex));
      };

      return (
        <>
          {" "}
          {tags.map((selectedColumn, index) => (
            <Tag
              key={selectedColumn.value}
              closable={false}
              afterClose={null}
              style={{ height: "30px", padding: "3px 5px" }}
            >
              {
                <>
                  {selectedColumn.text + " "}
                  <Tooltip placement="top" title="Move to right">
                    <Button
                      type={"ghost"}
                      onClick={handleRight.bind(null, {
                        guid: selectedColumn.value,
                        currentIndex: index,
                      })}
                      size="small"
                      style={{
                        minWidth: "30px",
                        minHeight: "20px",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {"<"}
                    </Button>
                  </Tooltip>
                  <Tooltip placement="top" title="Move to left">
                    <Button
                      type={"ghost"}
                      onClick={handleLeft.bind(null, {
                        guid: selectedColumn.value,
                        currentIndex: index,
                      })}
                      size="small"
                      style={{
                        minWidth: "30px",
                        minHeight: "20px",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {">"}
                    </Button>
                  </Tooltip>
                </>
              }
            </Tag>
          ))}
        </>
      );
    };

    const handleOnChangeCheckbox = (value: CheckboxItem) => {
      const checkboxSelectedItems = store1.getSelectedData();

      if (value.selected === true) {
        const newColumn = columns.find(
          (column) => column.Guid.toLowerCase() === value.value.toLowerCase()
        );
        const tempColumnsTag: CheckboxItem[] = [].concat(
          [{ value: newColumn.Guid, text: newColumn.Label, selected: true }],
          selectedColumnsTag
        );

        setSelectedColumnsTag(tempColumnsTag);
        setCheckBoxItem(prevCheckBoxItem => prevCheckBoxItem.map(item => item.value.toLocaleLowerCase() === value.value.toLocaleLowerCase() ? ({ ...item, selected: true }) : item))

      } else if (value.selected === false) {
        setSelectedColumnsTag(prevSelectedColumn => prevSelectedColumn.filter(col => col.value.toLocaleLowerCase() !== value.value.toLocaleLowerCase()));
        setCheckBoxItem(prevCheckBoxItem => prevCheckBoxItem.map(item => item.value.toLocaleLowerCase() === value.value.toLocaleLowerCase() ? ({ ...item, selected: false }) : item))
      }

      if (checkboxSelectedItems.length === 0) {
        setErrors([translate("ColumnRequired")]);
      } else {
        setErrors([]);
      }
    };

    const handleOkModal = () => {
      if (selectedColumnsTag.length <= 0) {
        return;
      }

      const columnsDictionary: IDictionary<{ order: number }> = {};
      selectedColumnsTag.forEach((column, index) => {
        columnsDictionary[column.value] = { order: index };
      });

      //prepare setting value
      onChange({
        Columns: columnsDictionary,
        SeperableCharachter: seperableCharacter,
      });

      form.setFieldsValue({
        [settingName]: {
          Columns: columnsDictionary,
          SeperableCharachter: seperableCharacter,
        },
      });
      onSave();
      setvisibleModel(false);
    };

    const handleCancelModal = () => {
      setvisibleModel(false);
    };

    const handleClickOnElipsis = () => {
      setvisibleModel(true);
    };

    const makePreviewValue = (columns: CheckboxItem[]) => {
      let labelAutoComplete = "";

      if (columns == null) {
        return labelAutoComplete;
      }

      columns.forEach((column) => {
        labelAutoComplete += ` ${seperableCharacter} [${column.text}]`;
      });

      return labelAutoComplete.substring(2);
    };

    const errorList = (errors: Array<string>) => {
      return (
        <ul>
          {errors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      );
    };

    const autoCompletePreview = makePreviewValue(selectedColumnsTag);

    return (
      <>
        <StackPanel verticalMode={false}>
          <Label>{autoCompletePreview}</Label>
          <Button
            type="ghost"
            icon="ellipsis"
            onClick={handleClickOnElipsis}
          ></Button>
        </StackPanel>
        <Modal
          title={`${translate("Settings")} ${dataModel.Label}`}
          visible={visibleModel}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
        >
          <Form>
            <Form.Row>
              <Form.Item
                label={translate("SeperableCharacter")}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 4 }}
              >
                <Input
                  maxLength={1}
                  value={seperableCharacter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setseperableCharacter(e.target.value)
                  }
                />
              </Form.Item>
            </Form.Row>
            <Form.Row>
              <Form.Item
                label={translate("Columns")}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <div>
                  <CheckboxList
                    fieldsetTitle="Test"
                    hasFieldset={false}
                    height="100px"
                    showSelectAll={false}
                    columnCount={3}
                    store={store1}
                    onChangeCheckboxItem={handleOnChangeCheckbox}
                    checkboxItems={checkBoxItems}
                  ></CheckboxList>
                </div>
              </Form.Item>
            </Form.Row>
            <Form.Row>
              <Form.Item
                label={translate("Order")}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <div>
                  <TagColumn
                    tags={selectedColumnsTag}
                    onChangeTagOrder={onClickArrowTags}
                  ></TagColumn>
                </div>
              </Form.Item>
            </Form.Row>
            <Form.Row>
              <Form.Item
                label={translate("Preview")}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <div>
                  <Label>{autoCompletePreview}</Label>
                </div>
              </Form.Item>
            </Form.Row>
          </Form>
          {errors.length > 0 && (
            <Alert
              type={"error"}
              message={errorList(errors)}
              showIcon={true}
              closable={false}
            ></Alert>
          )}
        </Modal>
      </>
    );
  };

  const getDataModel = modelerTransportLayer().get;
  React.useEffect(() => {
    if (isSimpleDesignerMode) {
      getDataModel({ Guid: (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid }).then((r) => {
        setDataModel(r.find(d => d.Guid === (layoutItem as RichLayoutItem).simpleDesignerData.DataModelInfo.ReferenceDataModelGuid));
      })
    }
  }, []);


  return dataModel ? (
    <Form.Item
      key={key}
      label={translate(settingName)}
      labelCol={{ span: 0, offset: 0 }}
      wrapperCol={{ span: 24, offset: 0 }}
    >
      {form.getFieldDecorator(settingName, {
        initialValue:
          initialSettingValues.ReferenceAutoCompleteColumnsConfige,
      })(<WrapperInput columns={dataModel.Columns} />)}
    </Form.Item>
  ) : <Spin />;
};

export default RefrenceAutoCompleteColumns;
