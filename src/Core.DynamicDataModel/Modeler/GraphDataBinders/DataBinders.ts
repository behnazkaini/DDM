//  import go from "gojs";

// export abstract class DataBinder extends go.Binding {
//   abstract sourceName: string;
//   abstract sourceProperty: string;
//   abstract targetProperty: string;
//   abstract mode: go.EnumValue;
// }

// export abstract class ConvertableDataBinder<TValue, TTargetValue, TTargetObject extends go.GraphObject, TSourceData> extends DataBinder {
//   converter = (value: any, targetObj: any): any => {
//     return this.convert(value, targetObj);
//   }
//   backConverter = (value: any, sourceData: any, model: any): any => {
//     return this.convertBack(value, sourceData, model);
//   }
//   abstract convert(value: TValue, targetObj: TTargetObject): TTargetValue;
//   abstract convertBack(value: TTargetValue, sourceData: TSourceData, model: go.GraphLinksModel): TValue;
// }