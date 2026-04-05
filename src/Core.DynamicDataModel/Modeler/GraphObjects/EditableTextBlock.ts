// import { GraphObject, HTMLInfo, Margin, Spot, TextBlock, TextEditingTool } from "gojs";

// export abstract class EditableTextBlock extends TextBlock {

//     editable = false;
//     margin = new Margin(2, 10, 2, 10);
//     stretch = GraphObject.Horizontal;
//     overflow = TextBlock.OverflowEllipsis;
//     alignment = Spot.Center;
//     abstract textEditor: HTMLInfo;

//     errorFunction = (tool: TextEditingTool, oldString: string, newString: string) => {
//         const $ = GraphObject.make;
//         const toolManager = tool.diagram.toolManager;
//         toolManager.hideToolTip();
//         const node = tool.textBlock.part;
//         const toolTip =
//             $("ToolTip", { "Border.fill": "pink", "Border.stroke": "red", "Border.strokeWidth": 2 },
//                 $(TextBlock, this.getErrorMessage(oldString, newString))
//             );
//         toolManager.showToolTip(toolTip, node);
//     }

//     textValidation = (textBlock: TextBlock, oldString: string, newString: string): boolean => {
//         const isValid = this.isTextValid(oldString, newString);
//         return isValid;
//     }

//     textEdited = (textBlock: TextBlock, oldString: string, newString: string) => {
//         const toolManager = textBlock.diagram.toolManager;
//         toolManager.hideToolTip();
//     }

//     abstract isTextValid(oldString: string, newString: string): boolean;

//     abstract getErrorMessage(oldString: string, newString: string): string;

// }