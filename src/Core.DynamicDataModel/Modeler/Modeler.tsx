import { guid, translate, utility } from "didgah/common";
import { Button, FormLayout, Message, Modal, useAppContext, useCommandHandler } from "didgah/ant-core-component";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import { APIError } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.APIs.APIError";
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { SaveDataModelChangesViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveDataModelChangesViewModel";
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { DataModelType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import ColumnProperties, { ColumnPropertiesForm } from "./Components/ColumnProperties";
import PropertiesWrapper from "./Components/PropertiesWrapper";
import TableProperties, { TablePropertiesForm } from "./Components/TableProperties";
import Column from "./GraphModels/Column";
import Table from "./GraphModels/Table";
import transportLayer from './transportLayer';
import { convertRelationToGoJsModel, getErrorsDescription, getLinkDataArrayFromTables, getLinkLabel, getNewTable, getRelationInfo, mapGoJSColumnToViewModel, mapLinkDataToRelationModel, mapSettingToGoJsModel, ModelerErrorType, validateColumnFields, validateRelationField, validateTableFields, validNameRegex } from "./Utility";
import RelationDetailModal from "./Components/RelationDetailModal";
import { RelationType } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType';
import LinkData from "./GraphModels/LinkData";
import RelationProperties from "./Components/RelationProperties";
import reducer, { initialState, ModelerStore } from "./reducer";
import { RelationNature } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { TableValidationResultViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.TableValidationResultViewModel";
import { DataModelBehaviorInformationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBehaviorInformationViewModel";
import { getDefaultDataTypeSetting } from "../TS/Validations";

export interface ModelerProps {
  mode: 'add' | 'edit';
  dataModelGuid: string;
  softwareGuid: string;
  scopeGuid: string;
  dataModelType: DataModelType;
}

export default function Modeler({ dataModelGuid, softwareGuid, scopeGuid, dataModelType, mode }: ModelerProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reactDiagramRef = useRef<ReactDiagram>();
  const diagramRef = useRef<go.Diagram>();
  const { get, save, getBehaviorInformations } = transportLayer();
  const commandHandler = useCommandHandler();
  const context = useAppContext();
  const initialTablesKey = useRef<string[]>([]);
  const behaviourInformation = useRef<DataModelBehaviorInformationViewModel[]>();
  const initialLinkDataArray = useRef<LinkData[]>([]);
  const takenTableNumbers = useRef<{ parentTableKey: string; takenNumbers: number[] }[]>([]);
  const latestStateRef = useRef<ModelerStore>(state);
  latestStateRef.current = state;

  function getState() {
    return latestStateRef.current;
  }

  useEffect(() => {
    (async () => {
      const behaviourInformationResult = await getBehaviorInformations()
      behaviourInformation.current = behaviourInformationResult;
      if (mode === 'edit') {
        const { tables, linkDataArray } = await getInitialData();
        initialTablesKey.current = tables.map(table => table.key);
        initialLinkDataArray.current = linkDataArray || [];
        dispatch({ type: 'SET_INITIAL_DATA', payload: { tables, linkDataArray } });
      }
      else {
        const mainTable = { ...getNewTable(scopeGuid, softwareGuid, dataModelType), guid: dataModelGuid };
        initialTablesKey.current.push(mainTable.key);
        dispatch({ type: 'SET_INITIAL_DATA', payload: { tables: [mainTable], linkDataArray: [] } });
      }

    })();
    return () => {
      // Important: After loading this component gojs sets go object to window. It must be cleaned after unmounting.
      window.go = undefined;
    }
  }, []);

  useEffect(() => {
    if (diagramRef.current && getLinkDataArray()) {
      const newLinkDataArray = [...getLinkDataArray()];
      const removedIndexs = [];
      let currentTables = [...state.tables];
      getLinkDataArray().forEach((linkData, i) => {
        const fromTableIndex = state.tables.findIndex(table => table.key === linkData.from);
        const toTableIndex = state.tables.findIndex(table => table.key === linkData.to);
        if (fromTableIndex === -1 || toTableIndex === -1) {
          currentTables = deleteTableOfLink(newLinkDataArray[i], currentTables);
          removedIndexs.push(i);
        }

      })
      removedIndexs.forEach((i) => {
        newLinkDataArray.splice(i, 1);
      })
      setLinkDataArray(newLinkDataArray)
    }

  }, [state.tables]);

  function isTableEditable(tableSoftwareGuid: string, dataModelType: number) {
    return tableSoftwareGuid.toUpperCase() === softwareGuid.toUpperCase() && behaviourInformation.current.find(info => info.Type === dataModelType).Editable
  }

  function hasTableOtherLinks(tableKey: string, linkDataArray: LinkData[]) {
    return linkDataArray.find(linkData => linkData.to === tableKey);;
  }

  function checkIfShouldRemoveTable(tableKey: string, linkDataArray: LinkData[]) {
    const hasLinkToMain = hasTableOtherLinks(tableKey, linkDataArray);
    if (hasLinkToMain) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    // unmount prev form
    dispatch({ type: 'SET_SELECT_LOADING', payload: false })
  }, [state.selectedItem]);

  function setGoJsDataSelected(data, selected) {
    diagramRef.current.model.setDataProperty(data, "selected", selected);
  }

  async function getInitialData() {
    const tables = await get({
      Guid: dataModelGuid
    })
    let newTables: Table[] = tables.map(table => {
      const key = utility.newGuid();
      return ({
        key: table.Guid,
        guid: table.Guid,
        name: table.Name,
        settings: table?.Settings ?? [],
        softEditable: false,
        hardEditable: isTableEditable(table.SoftwareGuid, table.Type),
        isNew: false,
        deletable: false,
        selected: false,
        added: false,
        type: 'table',
        relations: [],
        softwareGuid: table.SoftwareGuid,
        scopeGuid: table.ScopeGuid,
        label: table.Label,
        dataModelType: table.Type,
        columns: table.Columns.map(column => ({
          key: column.Guid,
          name: column.Name,
          editable: false,
          dataType: column.DataType,
          setting: column.Setting ? mapSettingToGoJsModel(JSON.parse(column.Setting)) : null,
          label: column.Label,
          bookmark: column.Bookmark,
          type: 'column',
          selected: false,
          added: false,
          tableKey: table.Guid,
          bookmarkType: column.BookmarkType
        }))
      });
    });

    newTables = newTables.map(table => ({
      ...table,
      relations: convertRelationToGoJsModel(table.key, tables.find(tb => tb.Guid === table.guid).Relations, newTables)
    }))
    return {
      tables: newTables,
      linkDataArray: getLinkDataArrayFromTables(newTables)
    }
  }

  function addColumn(e: go.InputEvent, graphObj: go.GraphObject): void {
    const table = graphObj.part.data as Table;
    if (!table.hardEditable) {
      return;
    }
    const data: Column = {
      editable: true,
      key: guid.newGuid(),
      name: `Column${table.columns.length + 1}`,
      dataType: ColumnDataType.Integer,
      setting: getDefaultDataTypeSetting(ColumnDataType.Integer),
      label: `ستون ${table.columns.length + 1}`,
      bookmark: '',
      added: true,
      type: 'column',
      tableKey: table.key,
      bookmarkType: 0
    };
    const newTables = [...getState().tables];
    const tableIndex = newTables.findIndex(tb => tb.key === table.key);
    newTables[tableIndex] = { ...table, columns: [...table.columns, ...[data]] };
    dispatch({ type: 'UPDATE_TABLES', payload: newTables });
  }

  function removeColumn(e: go.InputEvent, graphObj: go.GraphObject): void {
    const column = graphObj.panel.data as Column;
    if (column.editable) {
      Modal.confirm({
        title: translate('AreYouSure'),
        okText: translate('OK'),
        cancelText: translate('Cancel'),
        onOk: () => {
          const table = diagramRef.current.model.cloneDeep(graphObj.part.data as Table);
          const tableIndex = getState().tables.findIndex(tb => tb.key === table.key);
          const columnIndex = table.columns.findIndex(col => col.key === column.key);
          table.columns.splice(columnIndex, 1);
          const newTables = [...getState().tables];
          newTables[tableIndex] = table;
          dispatch({ type: 'UPDATE_TABLES', payload: newTables })
        }
      });
    }
  }

  function initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    const columnTemplate =
      $(go.Panel, go.Panel.Table,
        {
          width: 200,
          height: 24,
          defaultColumnSeparatorStroke: "lightgray",
          defaultColumnSeparatorStrokeWidth: 1
        },
        [new go.Binding("background", "selected", (sel: boolean) => sel ? "#52a6eb" : "white"), new go.Binding("")],
        $(go.RowColumnDefinition, { column: 0, width: 24 }),
        $(go.RowColumnDefinition, { column: 1, stretch: go.GraphObject.Fill },
          new go.Binding("background", "selected", (sel: boolean) => sel ? "#52a6eb" : "white"),
          new go.Binding("background", "invalid", (inv: boolean) => inv ? "#ffd9d9" : "transparent")
        ),
        $("Button",
          {
            alignment: go.Spot.Center,
            desiredSize: new go.Size(12, 12),
            "ButtonBorder.figure": "XLine",
            "ButtonBorder.strokeWidth": 3,
            click: removeColumn
          },
          [new go.Binding("ButtonBorder.stroke", "editable", (e: boolean) => e ? "red" : "grey"),
          new go.Binding("_buttonStrokeOver", "editable", (e: boolean) => e ? "#b31b15" : "grey")
          ]),
        $(go.TextBlock,
          {
            row: 0, column: 1,
            editable: false,
            margin: new go.Margin(2, 10, 2, 10),
            stretch: go.GraphObject.Horizontal,
            overflow: go.TextBlock.OverflowEllipsis,
            alignment: go.Spot.Center,
            click: (e, obj) => {
              const selectedItemNode = findSelectedItemNodeFromGojs();
              if (selectedItemNode && selectedItemNode.key === obj.panel.data.key) {
                return;
              } else if (selectedItem) {
                setGoJsDataSelected(selectedItemNode, false);
              }
              setGoJsDataSelected(obj.panel.data, true);
              dispatch({ type: 'SET_SELECTED_ITEM', payload: obj.panel.data });
            }
          },
          new go.Binding("text", "name").makeTwoWay(),
          new go.Binding("font", "editable",
            (e: boolean) => e
              ? "normal 12px sans-serif"
              : "italic 12px sans-serif"
          ),
          new go.Binding("stroke", "editable",
            (e: boolean) => e ? "black" : "gray"
          )
        )
      );

    const tableTemplate =
      $(go.Node, go.Node.Auto,
        {
          selectionAdorned: true,
          resizable: false,
          isShadowed: true,
          shadowOffset: new go.Point(3, 3),
          shadowColor: "#C5C1AA",
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
          minSize: new go.Size(200, 100),
          deletable: false,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        [new go.Binding("visible", "COLUMNS", (v: boolean) => v)],

        $(go.Shape, "RoundedRectangle", {
          fill: 'white',
          stroke: "#eeee",
          strokeWidth: 3,
          minSize: new go.Size(200, 100)
        }),

        $(go.Panel, go.Panel.Table, { stretch: go.GraphObject.Fill, rowSizing: go.RowColumnDefinition.None, minSize: new go.Size(200, 100) },
          $(go.RowColumnDefinition, { row: 0, alignment: go.Spot.Right }),
          $(go.RowColumnDefinition, { row: 1, separatorPadding: 5 }),
          $(go.RowColumnDefinition, { row: 2, separatorStroke: "lightgray", separatorStrokeWidth: 1 }),

          $(go.TextBlock, "Auto", {
            row: 1, column: 0,
            editable: false,
          },
            [
              new go.Binding("text", "name").makeTwoWay(),
              new go.Binding("font", "editable", (e: boolean) =>
                e ? "normal 12px sans-serif" : "italic 12px sans-serif"
              ),
              new go.Binding("stroke", "editable", (e: boolean) =>
                e ? "black" : "gray"
              ),
              new go.Binding("background", "invalid", (v) => v ? "#ffd9d9" : "transparent")
              ,
              {
                click: (e, tb) => {
                  const selectedItemNode = findSelectedItemNodeFromGojs();
                  if (selectedItemNode && selectedItemNode.key === tb.panel.panel.data.key) {
                    return;
                  } else if (selectedItemNode) {
                    setGoJsDataSelected(selectedItemNode, false);
                  }
                  setGoJsDataSelected(tb.panel.panel.data, true);
                  dispatch({ type: 'SET_SELECTED_ITEM', payload: tb.panel.panel.data });
                }
              }
            ],

            {
              contextMenu:
                $("ContextMenu",
                  $("ContextMenuButton",
                    {
                      "ButtonBorder.fill": "white",
                      "_buttonFillOver": "skyblue"
                    },
                    $(go.TextBlock, translate('DDMModeler_AddRelation'), {
                      font: `normal normal 300 14px ${context.Font}`
                    },
                      [
                        new go.Binding("stroke", "editable", function (v) { return v ? "black" : "grey"; })
                      ]),
                    {
                      click: (e, obj) => {
                        if (!(obj.part.data as Table).hardEditable) {
                          return;
                        }
                        const selectedItemNode = findSelectedItemNodeFromGojs();
                        if (selectedItemNode) {
                          setGoJsDataSelected(selectedItemNode, false);
                        }
                        dispatch({ type: 'SET_MULTIPLE_STATE', payload: { selectedItem: obj.part.data, relationDetailModalVisible: true } });
                      }
                    }
                  )
                )
            },
          ),
          $("PanelExpanderButton", "COLUMNS", {
            row: 1,
            column: 1,
            alignment: go.Spot.TopRight,
            margin: new go.Margin(0, 5, 0, 0)
          }),

          $(go.Panel, go.Panel.Table, { row: 2, name: "COLUMNS", alignment: go.Spot.TopLeft },
            $(go.Panel, go.Panel.Vertical,
              { row: 0, itemTemplate: columnTemplate },
              [new go.Binding("itemArray", "columns")]
            ),
            $("Button", {
              row: 1, alignment: go.Spot.Left, desiredSize: new go.Size(15, 15), margin: 3,
              "ButtonBorder.figure": "PlusLine", "_buttonStrokeOver": "green",
              "ButtonBorder.strokeWidth": 3, "ButtonBorder.stroke": "#2bb542",
              click: addColumn,
            },
              [
                new go.Binding("ButtonBorder.stroke", "hardEditable", (v) => v ? "green" : "grey"),
                new go.Binding("_buttonStrokeOver", "hardEditable", (v) => v ? "#b31b15" : "grey")
              ]
            )
          ),
        ));

    diagramRef.current = $(go.Diagram, {
      'undoManager.isEnabled': true,
      'undoManager.maxHistoryLength': 0,
      nodeTemplate: tableTemplate,
    });

    (diagramRef.current.model as go.GraphLinksModel).linkKeyProperty = 'key';
    diagramRef.current.linkTemplate =
      $(go.Link,
        {
          deletable: false,
          routing: go.Link.AvoidsNodes,
          corner: 10,
          click: (e, link: any) => {
            const selectedItemNode = findSelectedItemNodeFromGojs();
            if (selectedItemNode) {
              setGoJsDataSelected(selectedItemNode, false);
            }
            setGoJsDataSelected(link.data, true);
            dispatch({ type: 'SET_SELECTED_ITEM', payload: link.data });
          }
        },
        $(go.Shape,
          {
            strokeWidth: 2,
            stroke: "#75909C" // Default line color
          },
          new go.Binding('stroke', 'relationNature', type => ({
            1: '#1d0575',
            2: '#D23428'
          })[type] || '#75909C')
        ),  // the link shape
        $(go.Shape,   // the arrowhead
          {
            toArrow: 'Standard',
            stroke: null, fill: '#CCCCCC', scale: 1.5
          },
          new go.Binding('fill', 'relationNature', type => ({
            1: '#1d0575',
            2: '#D23428'
          })[type] || '#75909C')

        ),
        $(go.TextBlock, [
          new go.Binding("stroke", "relationNature", type => ({
            1: '#1d0575',
            2: '#D23428'
          })[type] || '#75909C'),
          new go.Binding("text", "fromLabel"),
        ], {
          segmentIndex: NaN,
          segmentFraction: 0.2,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright,
          scale: 1.2
        }),
        $(go.TextBlock, [
          new go.Binding("stroke", "relationNature", type => ({
            1: '#1d0575',
            2: '#D23428'
          })[type] || '#75909C'),
          new go.Binding("text", "relationNature", function (relationNature) { return getLinkLabel(relationNature) }),
        ], {
          segmentIndex: NaN,
          segmentFraction: 0.5,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright,
          scale: 1.2
        }),
        $(go.TextBlock, [
          new go.Binding("stroke", "relationNature", type => ({
            1: '#1d0575',
            2: '#D23428'
          })[type] || '#75909C'),
          new go.Binding("text", "toLabel"),
        ], {
          stroke: '#75909C',
          segmentIndex: NaN,
          segmentFraction: 0.8,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright,
          scale: 1.2
        }),

      )
    diagramRef.current.layout = $(go.GridLayout, { spacing: new go.Size(300, 300) })

    return diagramRef.current;
  }

  function updateSelectedItemDataInGojs(fieldName: 'label' | 'bookmark' | 'setting' | 'dataType', value) {
    diagramRef.current.model.setDataProperty(getState().selectedItem, fieldName, value);
  }

  function findNodeFromGojs(key) {
    return diagramRef.current.model.nodeDataArray.find(node => node.key === key);
  }

  function syncTablesDataWithGojs(tables) {
    return getState().tables.map(table => findNodeFromGojs(table.key));
  }

  function getUniqueTables(tables: Table[]) {
    return tables.filter(function (table1, pos) {
      return tables.findIndex(table2 => table2.guid === table1.guid) == pos;
    });
  }

  function getNewTableName() {
    let newTableIndexName;
    const currentTakenTableNumbersIndex = takenTableNumbers.current.findIndex(tb => tb.parentTableKey === getState().selectedItem.key);
    const currentTakenTableNumbers = takenTableNumbers.current[currentTakenTableNumbersIndex];
    if (!!currentTakenTableNumbers) {
      newTableIndexName = currentTakenTableNumbers.takenNumbers[currentTakenTableNumbers.takenNumbers.length - 1] + 1;
      takenTableNumbers.current[currentTakenTableNumbersIndex].takenNumbers.push(newTableIndexName);
    } else {
      newTableIndexName = 1;
      takenTableNumbers.current.push({ parentTableKey: getState().selectedItem.key, takenNumbers: [newTableIndexName] });
    }
    const getNameOfNewTable = (getState().selectedItem as Table).name + '_' + `Table${newTableIndexName}`;
    return getNameOfNewTable;
  }

  async function addRelation(relationType: RelationType, relationNature: RelationNature, referenceGuid: string) {
    let newTables: Table[] = [];
    // -1 means to create new table and link to it
    if (referenceGuid === '-1') {
      newTables = [{ ...getNewTable(scopeGuid, softwareGuid, dataModelType), deletable: true }];

      newTables[0].name = getNewTableName();
    } else {
      const dataModel = await get({
        Guid: referenceGuid
      });
      newTables = dataModel.map(table => ({
        key: table.Guid,
        guid: table.Guid,
        name: table.Name,
        softEditable: false,
        hardEditable: isTableEditable(table.SoftwareGuid, Number(table.Type)),
        selected: false,
        added: false,
        deletable: false,
        type: 'table',
        softwareGuid: table.SoftwareGuid,
        scopeGuid: table.ScopeGuid,
        label: table.Label,
        relations: [],
        isNew: false,
        dataModelType: table.Type,
        settings: table?.Settings ?? [],
        columns: table.Columns.map(column => ({
          key: column.Guid,
          name: column.Name,
          editable: false,
          dataType: column.DataType,
          setting: column.Setting ? mapSettingToGoJsModel(JSON.parse(column.Setting)) : null,
          label: column.Label,
          bookmark: column.Bookmark,
          type: 'column',
          selected: false,
          added: false,
          tableKey: table.Guid,
          bookmarkType: column.BookmarkType,

        }))
      }));
      newTables = newTables.map(table => ({
        ...table,
        relations: convertRelationToGoJsModel(table.key, dataModel.find(tb => tb.Guid === table.guid).Relations, newTables)
      }))
    }
    const uniqueTables = getUniqueTables([...syncTablesDataWithGojs(getState().tables), ...newTables] as any);
    const relationInfo = getRelationInfo(relationType);
    const newLinkDataArray = (getLinkDataArray() ? getLinkDataArray() : []).concat(getLinkDataArrayFromTables(newTables));
    const fromTable = (getState().selectedItem as Table);
    const toTable = referenceGuid === '-1' ? newTables[0] : newTables.find(table => table.guid === referenceGuid);
    newLinkDataArray.push(
      {
        key: utility.newGuid(),
        // @ts-ignore
        guid: utility.newGuid(),
        from: fromTable.key,
        to: toTable.key,
        fromLabel: relationInfo.fromLabel,
        toLabel: relationInfo.toLabel,
        relationType: relationType,
        relationNature: relationNature,
        type: 'relation',
        bookmark: '',
        label: `${fromTable.label}_${toTable.label}`,
        added: true,
        editable: true,
        deletable: true,
        name: `${fromTable.name}_${toTable.name}`,
        color: "#FF6B6B",
        settings: toTable?.settings ?? []
      }
    )
    dispatch({ type: 'SET_MULTIPLE_STATE', payload: { linkDataArray: newLinkDataArray, tables: uniqueTables, relationDetailModalVisible: false } })

  }

  function validateModeler() {
    let erros = [];
    getState().tables.forEach((table: Table) => {
      erros = erros.concat(validateTableFields(table));
      table.columns.forEach((column: Column) => {
        erros = erros.concat(validateColumnFields(column, table.columns));
      })
    });
    getLinkDataArray().forEach((linkData: LinkData) => {
      erros = erros.concat(validateRelationField(linkData));
    })
    return erros;
  }

  function setGojsDataValidation(data: Table | Column | LinkData, field: string, invalid) {
    diagramRef.current.model.setDataProperty(data, 'invalid', invalid);
    diagramRef.current.model.setDataProperty(data, 'invalidField', field);
  }


  function handleSave() {
    const errors = validateModeler();
    errors.forEach(error => {
      setGojsDataValidation(error.data, error.field, true);
    });
    if (!!errors.length) {
      if (errors[0].data.key !== getState().selectedItem.key) {
        const newSelectedItem = errors[0].data;
        setGoJsDataSelected(getState().selectedItem, false);
        setGoJsDataSelected(newSelectedItem, true);
        dispatch({ type: 'SET_SELECTED_ITEM', payload: newSelectedItem });
      }
      return;
    }

    dispatch({ type: 'SET_SAVE_LOADING', payload: true });
    const data: SaveDataModelChangesViewModel = {
      Added: getState().tables.filter(table => table.added && isTableEditable(table.softwareGuid, Number(table.dataModelType))).map((table: Table) => ({
        Type: dataModelType,
        Name: table.name,
        Label: table.label,
        Guid: table.guid,
        ScopeGuid: scopeGuid,
        SoftwareGuid: table.softwareGuid,
        AddedRelations: getState().linkDataArray.filter(linkData => linkData.from === table.key && linkData.added).map(mapLinkDataToRelationModel),
        ParentGuid: null,
        AddedColumns: table.columns.map(mapGoJSColumnToViewModel),
      })),
      Modified: getState().tables.filter(table => !table.added && isTableEditable(table.softwareGuid, Number(table.dataModelType))).map((table: Table) => ({
        Guid: table.guid,
        Label: table.label,
        AddedColumns: table.columns.filter(col => col.added).map(mapGoJSColumnToViewModel),
        ModifiedColumns: table.columns.filter(col => !col.added).map(mapGoJSColumnToViewModel),
        AddedRelations: getState().linkDataArray.filter(linkData => linkData.from === table.key && linkData.added).map(mapLinkDataToRelationModel),
        ModifiedRelations: getState().linkDataArray.filter(linkData => linkData.from === table.key && !linkData.added).map(mapLinkDataToRelationModel),
      })),
    }

    save(data).then(() => {
      Message.success(translate('SucceedOperation'));
      commandHandler.closeWindow(true);
    }).catch((error: APIError & { Value: TableValidationResultViewModel[] }[]) => {
      if (!error[0]?.Value) {
        Message.error(translate('DuplicateTitle'));
        return;
      }
      for (let result of error[0].Value) {
        if (!result.Succeed) {
          Message.error(result.Name + ' ' + translate(result.ErrorMessage));
        } else {
          for (let column of result.Columns) {
            if (!column.Succeed) {
              Message.error(result.Name + ': ' + translate(column.ErrorMessage));
            }
          }
        }
      }
    }).finally(() => {
      dispatch({ type: 'SET_SAVE_LOADING', payload: false });
    });
  }

  function handleColumnPropertyChange(column: any) {
    const selectedItem = getState().selectedItem;
    const tableIndex = getState().tables.findIndex(table => table.key === (selectedItem as Column).tableKey);
    const newTables = [...getState().tables];
    const tableOfCurrentColumn = diagramRef.current.model.cloneDeep(newTables[tableIndex]);
    const columnIndex = tableOfCurrentColumn.columns.findIndex(column => column.key === (selectedItem as Column).key);
    let newColumn;
    for (let key in column) {
      if (selectedItem.invalid && key === selectedItem.invalidField) {
        newColumn = { ...selectedItem as Column, ...column, invalid: false };
        tableOfCurrentColumn.columns[columnIndex] = newColumn;
      } else {
        newColumn = { ...selectedItem as Column, ...column };
        tableOfCurrentColumn.columns[columnIndex] = newColumn;
      }
    }
    newTables[tableIndex] = tableOfCurrentColumn;
    dispatch({ type: 'SET_MULTIPLE_STATE', payload: { tables: newTables, selectedItem: newColumn } });
  }

  function handleTablePropertyChange(fieldName: 'name' | 'label', value) {
    const selectedItem = getState().selectedItem;
    const tableIndex = getState().tables.findIndex(table => table.key === selectedItem.key);
    const newTables = [...getState().tables];
    let newTable;
    if (selectedItem.invalid && fieldName === selectedItem.invalidField) {
      newTable = { ...selectedItem as Table, [fieldName]: value, invalid: false };
      newTables[tableIndex] = newTable;
    } else {
      newTable = { ...selectedItem as Table, [fieldName]: value };
      newTables[tableIndex] = { ...selectedItem as Table, [fieldName]: value };
    }
    dispatch({ type: 'SET_MULTIPLE_STATE', payload: { tables: newTables, selectedItem: newTable } });
  }

  function handleRelationPropertyChange(fieldName: 'name' | 'label' | 'bookmark' | 'settings', value) {
    const selectedItem = getState().selectedItem;
    const newLinkDataArray = [...getLinkDataArray()];
    const selectedLinkIndex = newLinkDataArray.findIndex(linkData => linkData.key === selectedItem.key);
    const selectedLinkData = newLinkDataArray[selectedLinkIndex];
    newLinkDataArray.splice(selectedLinkIndex, 1)
    const newSelectedItem = { ...selectedLinkData, [fieldName]: value };
    newLinkDataArray.push(newSelectedItem);
    dispatch({ type: 'SET_MULTIPLE_STATE', payload: { linkDataArray: newLinkDataArray, selectedItem: newSelectedItem } });
  }

  function handleDeleteRelation(key: string) {
    const newLinkDataArray = [...getLinkDataArray()];
    const relationIndex = newLinkDataArray.findIndex(linkData => linkData.key === key);
    const relation = { ...newLinkDataArray[relationIndex] };
    dispatch({ type: 'SET_SELECT_LOADING', payload: true });
    if (relationIndex > -1) {
      newLinkDataArray.splice(relationIndex, 1);
      setLinkDataArray(newLinkDataArray);
      deleteTableOfLink(relation, newLinkDataArray);
    }
  }

  function handleDeleteTable(key: string) {
    const newTables = [...getState().tables];
    const tableIndex = newTables.findIndex(table => table.key === key);
    dispatch({ type: 'SET_SELECT_LOADING', payload: true });
    if (tableIndex > -1) {
      newTables.splice(tableIndex, 1);
      dispatch({ type: 'UPDATE_TABLES', payload: newTables })
    }
  }

  function deleteTableOfLink(linkData: LinkData, newLinkDataArray, currentTables = getState().tables) {
    const newTables = [...currentTables];
    if (newLinkDataArray) {
      let targetTableIndex = newTables.findIndex(table => table.key === linkData.to);
      if (targetTableIndex > -1) {
        const table = newTables[targetTableIndex];
        const shouldRemoveTable = checkIfShouldRemoveTable(table.key, newLinkDataArray);
        if (shouldRemoveTable) {
          newTables.splice(targetTableIndex, 1);
          dispatch({ type: 'SET_MULTIPLE_STATE', payload: { selectLoading: true, tables: newTables } })
        }
      }
    }
    return newTables;
  }

  function setLinkDataArray(linkDataArray: LinkData[]) {
    dispatch({ type: 'UPDATE_LINKDATAARRAY', payload: linkDataArray })
  }

  function getLinkDataArray() {
    return getState().linkDataArray;
  }

  function findTableFromGojs(key) {
    return diagramRef.current.model.nodeDataArray.find(table => table.key === key);
  }

  function findColumnFromGojs(key, tableKey) {
    return findTableFromGojs(tableKey).columns.find(col => col.key === key);
  }

  function findRelationFromGojs(key) {
    return (diagramRef.current.model as go.GraphLinksModel).linkDataArray.find(linkData => linkData.key === key);
  }

  function findSelectedItemNodeFromGojs() {
    const selectedItem = getState().selectedItem;
    if (!selectedItem) {
      return null
    }
    switch (selectedItem.type) {
      case 'table':
        return findTableFromGojs(selectedItem.key);
      case 'column':
        return findColumnFromGojs(selectedItem.key, (selectedItem as Column).tableKey);
      case 'relation':
        return findRelationFromGojs(selectedItem.key);
    }
  }

  const selectedItem = getState().selectedItem;
  return (
    <FormLayout>
      <FormLayout.LayoutContent>
        <div className="dynamic-data-model-modeler">
          {!state.selectLoading && selectedItem && (
            <PropertiesWrapper name={selectedItem.type === 'relation' ? '' : (selectedItem as Table | Column).name}>
              {(() => {
                switch (selectedItem.type) {
                  case 'table':
                    return <TableProperties
                      selectedItem={selectedItem as Table}
                      onTablePropertyChange={handleTablePropertyChange}
                      onDelete={handleDeleteTable}
                    />
                  case 'column':
                    return <ColumnProperties
                      hostSoftwareGuid={softwareGuid}
                      table={findNodeFromGojs((selectedItem as Column).tableKey) as Table}
                      selectedItem={selectedItem as Column}
                      onColumnPropertyChange={handleColumnPropertyChange}
                    />
                  case 'relation':
                    return <RelationProperties
                      selectedItem={selectedItem as LinkData}
                      onRelationPropertyChange={handleRelationPropertyChange}
                      onDelete={handleDeleteRelation}
                    />
                }
              })()}
            </PropertiesWrapper>
          )}
          {state.relationDetailModalVisible && (
            <RelationDetailModal
              selectedTable={(selectedItem as Table).guid}
              behaviourInformations={behaviourInformation.current}
              softwareGuid={(selectedItem as Table).softwareGuid}
              scopeGuid={(selectedItem as Table).scopeGuid}
              dataModelType={dataModelType}
              closeModal={() => {
                dispatch({ type: 'SET_RELATION_DETAIL_MODAL_VISIBLE', payload: false });
              }}
              handleAddRelation={addRelation}
            />)}
          {!state.fetchLoading && <ReactDiagram
            ref={reactDiagramRef}
            divClassName='dynamic-data-model-modeler_diagram'
            initDiagram={initDiagram}
            nodeDataArray={state.tables}
            linkDataArray={state.linkDataArray}
            skipsDiagramUpdate={false}
          />}
        </div>
      </FormLayout.LayoutContent>
      <FormLayout.ActionBar>
        <Button type='primary' onClick={handleSave} loading={state.saveLoading}>{translate('Save')}</Button>
      </FormLayout.ActionBar>
    </FormLayout>
  )
}