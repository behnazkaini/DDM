// import go from "gojs";
// import Table from "../GraphModels/Table";
// import { TableNameTextBlock } from "../GraphObjects/TableNameTextBlock";
// import { ConvertableDataBinder, DataBinder } from "./DataBinders";

// class TableNameDataBinder extends DataBinder {
//   sourceName: string = null;
//   sourceProperty = "name";
//   targetProperty = "text";
//   mode = go.Binding.TwoWay;
// }

// class IsTableNameEditableDataBinder extends DataBinder {
//   sourceName: string = null;
//   sourceProperty: string = "editable";
//   targetProperty: string = "editable";
//   mode = go.Binding.OneWay;
// }

// class TableNameFontDataBinder extends ConvertableDataBinder<boolean, string, TableNameTextBlock, Table> {
//   sourceName: string = null;
//   sourceProperty: string = "editable";
//   targetProperty: string = "font";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: TableNameTextBlock): string {
//     return value ? "bold 14px sans-serif" : "italic 14px sans-serif";
//   }
//   convertBack(value: string, sourceData: Table, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// class TableNameFontColorDataBinder extends ConvertableDataBinder<boolean, string, TableNameTextBlock, Table> {
//   sourceName: string = null;
//   sourceProperty: string = "editable";
//   targetProperty: string = "stroke";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: TableNameTextBlock): string {
//     return value ? "black" : "gray";
//   }
//   convertBack(value: string, sourceData: Table, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// class TableExpanderDataBinder extends ConvertableDataBinder<boolean, go.Size, TableNameTextBlock, Table> {
//   sourceName: string = null;
//   constructor(panelName: string) {
//     super();
//     this.sourceName = panelName;
//   }
//   sourceProperty: string = "visible";
//   targetProperty: string = "desiredSize";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: TableNameTextBlock): go.Size {
//     return new go.Size(NaN, NaN);
//   }
//   convertBack(value: go.Size, sourceData: Table, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// class TableColumnsDataBinder extends DataBinder {
//   sourceName: string = null;
//   sourceProperty: string = "columns";
//   targetProperty: string = "itemArray";
//   mode = go.Binding.TwoWay;
// }

// export {
//   TableNameDataBinder,
//   IsTableNameEditableDataBinder,
//   TableNameFontDataBinder,
//   TableNameFontColorDataBinder,
//   TableExpanderDataBinder,
//   TableColumnsDataBinder
// };

