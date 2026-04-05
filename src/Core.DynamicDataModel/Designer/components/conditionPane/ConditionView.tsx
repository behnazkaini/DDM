import {
  Button,
  Modal,
  TableExColumnProps,
  TextEditorField,
  TextViewerField,
} from "didgah/ant-core-component";
import React from "react";
import QueryBuilderPanel from "./QueryBuilderPanel";
import ValidationTable from "./ValidationTable";
import {
  DesignerComplexValidationViewModel,
  IWidgetFactory,
} from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { TableExEditStore } from "didgah/ant-core-component/providers";
import { translate, utility } from "didgah/common";
import { useAppDispatch } from "../../../Designer/store/hook";
import {
  AddLayoutComplexValidation,
  GlobalPropsContext,
} from "../../../Designer/store/reducers/designLayoutSlice";
import { ConditionGroupType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";
import {
  ConditionType as ConditionTypeView,
  FieldEditorType,
  FieldViewerType,
} from "@models/didgah-components";

interface ConditionViewProps {
  ComplexValidations: DesignerComplexValidationViewModel[];
  widgetFactory: IWidgetFactory;
  layoutItems: LayoutItemViewModel[];
}

const ConditionView = (props: ConditionViewProps) => {
  const dispatch = useAppDispatch();
  const tableStore =
    React.useRef<
      TableExEditStore<DesignerComplexValidationViewModel, string>
    >();
  const globalProps = React.useContext(GlobalPropsContext);
  const { ComplexValidations, widgetFactory, layoutItems } = props;
  const [tableVisible, setTableVisible] = React.useState(false);
  const [queryPanelVisible, setQueryPanelVisible] = React.useState(false);
  const [selectedRow, setselectedRow] =
    React.useState<DesignerComplexValidationViewModel>(null);
  const [queryPanelMode, setQueryPanelMode] = React.useState<"add" | "edit">(
    "add"
  );

  const QueryButton = (props) => {
    const onClickHandle = () => {
      handleSelectRow(props.record.Guid);
    };
    return (
      <Button onClick={onClickHandle}>
        {translate("DDMQueryBuilderDetailBtn")}
      </Button>
    );
  };

  const handleSelectRow = (rowGuid: string) => {
    setselectedRow(
      tableStore.current
        .getAll()
        .find((row) => row.Guid.toLowerCase() === rowGuid.toLowerCase())
    );
    setQueryPanelMode("edit");
    setQueryPanelVisible(true);
  };

  const getColumns = () => {
    const tableColumns: TableExColumnProps<
      DesignerComplexValidationViewModel | any
    >[] = [
      {
        title: translate("Message"),
        dataIndex: "Message",
        viewType: new TextViewerField(),
        editType: new TextEditorField(),
        required: true,
        sortEnabled: false,
        editDisabled: true,
        width: 85,
      },
    ];

    if (!globalProps.permission.readOnly) {
      tableColumns.push({
        title: "",
        dataIndex: "EditQuery",
        viewType: {
          type: FieldViewerType.Custom,
        },
        editType: {
          type: FieldEditorType.Custom,
        },
        getDynamicProps: () => ({
          Key: null,
        }),
        editComponent: QueryButton,
        viewComponent: QueryButton,
        align: "center",
        sortEnabled: false,
        width: 15,
      });
    }

    return tableColumns;
  };

  const onRowDoubleClick = (record: DesignerComplexValidationViewModel) => {
    setselectedRow(record);
    setQueryPanelMode("edit");
    setQueryPanelVisible(true);
  };

  const onSaveQueryBuilder = (data: DesignerComplexValidationViewModel) => {
    if (queryPanelMode === "add") {
      tableStore.current.insertRow(data, 0);
    } else {
      tableStore.current.update(data);
    }

    const designerValidations = tableStore.current
      .getAllDataExceptDeletedOne()
      .map((row) => {
        return {
          Guid: row.Guid,
          Message: row.Message,
          ConditionGroup: row.ConditionGroup,
          __status: row["__status"],
        };
      });

    dispatch(
      AddLayoutComplexValidation({
        LayoutGuid: globalProps.layoutGuid,
        DesignerValidationGroup: designerValidations,
      })
    );

    setQueryPanelVisible(false);
  };

  const onBeforeAdd = (
    records: DesignerComplexValidationViewModel[]
  ): boolean => {
    setQueryPanelMode("add");
    setQueryPanelVisible(true);

    return false;
  };

  const onAfterDelete = (
    deletedRecords: DesignerComplexValidationViewModel[]
  ) => {
    const designerValidations = tableStore.current
      .getAllDataExceptDeletedOne()
      .map((row) => {
        return {
          Guid: row.Guid,
          Message: row.Message,
          ConditionGroup: row.ConditionGroup,
          __status: row["__status"],
        };
      });

    dispatch(
      AddLayoutComplexValidation({
        LayoutGuid: globalProps.layoutGuid,
        DesignerValidationGroup: designerValidations,
      })
    );
  };

  React.useEffect(() => {
    tableStore.current = new TableExEditStore<
      DesignerComplexValidationViewModel,
      string
    >({
      data: [
        ...ComplexValidations.map(
          (val) =>
            ({
              Message: val.Message,
              Guid: val.Guid,
              ConditionGroup: val.ConditionGroup,
              __status: val["__status"],
            } as DesignerComplexValidationViewModel)
        ),
      ],
      keyField: "Guid",
      pageSize: 10,
      keyGeneratorCallback: () => utility.newGuid(),
    });
    setTableVisible(true);

    return () => {
      setTableVisible(false);
    };
  }, []);

  const tableColumns = getColumns();

  return (
    <>
      {tableVisible && (
        <>
          <ValidationTable
            onRowDoubleClick={onRowDoubleClick}
            onBeforeAdd={onBeforeAdd}
            onAfterDelete={onAfterDelete}
            store={tableStore.current}
            columns={tableColumns}
            permission={globalProps.permission}
          ></ValidationTable>
          {queryPanelVisible && (
            <Modal
              width={"90%"}
              visible={queryPanelVisible}
              title={translate("DDMQueryBuilderDetailBtn")}
              onOk={null}
              onCancel={() => setQueryPanelVisible(false)}
              footer={null}
            >
              <QueryBuilderPanel
                mode={queryPanelMode}
                layoutValidation={selectedRow}
                widgetFactory={widgetFactory}
                layoutItems={layoutItems}
                onSave={onSaveQueryBuilder}
              ></QueryBuilderPanel>
            </Modal>
          )}
        </>
      )}
    </>
  );
};

export default ConditionView;
