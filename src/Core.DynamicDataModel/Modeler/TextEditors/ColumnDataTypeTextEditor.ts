// import { Diagram, GraphObject, TextBlock, Tool } from "gojs";
// import { ColumnDataType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
// import { $enum } from "ts-enum-util";
// import { TextEditor } from "./TextEditor";

// export class ColumnDataTypeTextEditor extends TextEditor<HTMLSelectElement> {
//     onBeforeShow(graphObject: GraphObject, diagram: Diagram, tool: Tool) {
        
//     }
//     createElement(textBlock: TextBlock): HTMLSelectElement {
//         const element = document.createElement("select");
//         $enum(ColumnDataType).getKeys().forEach(key => {
//             const option = document.createElement("option");
//             option.value = key;
//             option.text = key;
//             element.add(option);
//         });
//         element.value = textBlock.text;
//         return element;
//     }
//     getValue(element: HTMLSelectElement) {
//         return element.value;
//     }
// }