// import { Diagram, GraphObject, TextBlock, Tool } from "gojs";
// import Column from "../GraphModels/Column";
// import { TextEditor } from "./TextEditor";

// export class ColumnNameTextEditor extends TextEditor<HTMLInputElement> {
//     onBeforeShow(graphObject: GraphObject, diagram: Diagram, tool: Tool) {
//         graphObject.part.elements.each(x => {
//             const column = x.panel.data as Column;
//             if (column.selected) {
//                 diagram.model.setDataProperty(column, "selected", false);
//             }
//         });
//         const column = graphObject.panel.data as Column;
//         diagram.model.setDataProperty(column, "selected", true);
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