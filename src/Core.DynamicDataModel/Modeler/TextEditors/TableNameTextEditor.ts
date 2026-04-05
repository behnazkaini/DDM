// import { Diagram, GraphObject, TextBlock, Tool } from "gojs";
// import Column from "../GraphModels/Column";
// import Table from "../GraphModels/Table";
// import { TextEditor } from "./TextEditor";

// export class TableNameTextEditor extends TextEditor<HTMLInputElement> {
//     onBeforeShow(graphObject: GraphObject, diagram: Diagram, tool: Tool) {
//         // TODO: set selected false for the other tables;
//         const table = graphObject.part.data as Table;
//         table.columns.forEach(x => {
//             if (x.selected) {
//                 diagram.model.setDataProperty(x, "selected", false);
//             }
//         });
//         diagram.model.setDataProperty(table, "selected", true);
//     }
//     createElement(textBlock: TextBlock): HTMLInputElement {
//         const element = document.createElement("input");
//         element.value = textBlock.text;
//         return element;
//     }
//     getValue(element: HTMLInputElement) {
//         return element.value;
//     }
// }