// import go, { EnumValue, TextBlock } from "gojs";
// import { DecimalDataTypeSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DecimalDataTypeSettingViewModel";
// import { StringDataTypeSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.StringDataTypeSettingViewModel";
// import { ColumnDataType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
// import { $enum } from "ts-enum-util";
// import Column from "../GraphModels/Column";
// import { ConvertableDataBinder, DataBinder } from "./DataBinders";

// class NameDataBinder extends DataBinder {
//   sourceName: string = null;
//   sourceProperty = "name";
//   targetProperty = "text";
//   mode = go.Binding.TwoWay;
// }

// class DataTypeDataBinder extends ConvertableDataBinder<ColumnDataType, string, TextBlock, Column> {
//   sourceName: string = null;
//   sourceProperty: string = "dataType";
//   targetProperty: string = "text";
//   mode = go.Binding.TwoWay;
//   convert(value: ColumnDataType, targetObj: TextBlock): string {
//     return $enum(ColumnDataType).getKeyOrThrow(value);
//   }
//   convertBack(value: string, sourceData: Column, model: go.GraphLinksModel): ColumnDataType {
//     return $enum(ColumnDataType).getValueOrThrow(value);
//   }
// }

// class TextFontDataBinder extends ConvertableDataBinder<boolean, string, TextBlock, Column> {
//   sourceName: string = null;
//   sourceProperty: string = "editable";
//   targetProperty: string = "font";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: TextBlock): string {
//     return value ? "normal 12px sans-serif" : "italic 12px sans-serif";
//   }
//   convertBack(value: string, sourceData: Column, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// class TextColorDataBinder extends ConvertableDataBinder<boolean, string, TextBlock, Column> {
//   sourceName: string = null;
//   sourceProperty: string = "editable";
//   targetProperty: string = "stroke";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: TextBlock): string {
//     return value ? "black" : "gray";
//   }
//   convertBack(value: string, sourceData: Column, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// class SettingDataBinder extends ConvertableDataBinder<string, string, TextBlock, Column> {
//   sourceName: string = null;
//   sourceProperty: string = "setting";
//   targetProperty: string = "text";
//   mode: EnumValue = go.Binding.TwoWay;
//   convert(value: string, targetObj: go.TextBlock): string {
//     const column = targetObj.panel.data as Column;
//     switch (column.dataType) {
//       case ColumnDataType.String:
//         {
//           const setting = JSON.parse(column.setting) as StringDataTypeSettingViewModel;
//           return `Max Length: ${setting.MaxLength}`;
//         }
//       case ColumnDataType.Decimal:
//         {
//           const setting = JSON.parse(column.setting) as DecimalDataTypeSettingViewModel;
//           return `Precision: ${setting.Precision}, Scale: ${setting.Scale}`;
//         }
//     }
//     return null;
//   }
//   convertBack(value: string, sourceData: Column, model: go.GraphLinksModel): string {
//     return value;
//   }
// }

// class ColumnBackgroundDataBinder extends ConvertableDataBinder<boolean, string, go.Panel, Column> {
//   sourceName: string = null;
//   sourceProperty: string = "selected";
//   targetProperty: string = "background";
//   mode = go.Binding.OneWay;
//   convert(value: boolean, targetObj: go.Panel): string {
//     return value ? "#52a6eb" : "white";
//   }
//   convertBack(value: string, sourceData: Column, model: go.GraphLinksModel): boolean {
//     throw new Error("Method not implemented.");
//   }
// }

// const columnDataBinders = {
//   panel: [
//     new ColumnBackgroundDataBinder()
//   ],
//   row: [
//     new ColumnBackgroundDataBinder()
//   ],
//   name: [
//     new NameDataBinder(),
//     new TextFontDataBinder(),
//     new TextColorDataBinder()
//   ],
//   dataType: [
//     new DataTypeDataBinder(),
//     new TextFontDataBinder(),
//     new TextColorDataBinder()
//   ],
//   setting: [
//     new SettingDataBinder(),
//     new TextFontDataBinder(),
//     new TextColorDataBinder()
//   ]
// }

// export default columnDataBinders;
