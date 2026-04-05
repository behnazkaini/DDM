// import { Diagram, HTMLInfo, Spot, TextBlock, TextEditingTool, Tool } from "gojs";

// export abstract class TextEditor<TElement extends HTMLElement> extends HTMLInfo {
// 	element: TElement;
// 	show = (graphObject: go.GraphObject, diagram: Diagram, tool: go.Tool) => {
// 		if (!(graphObject instanceof TextBlock)) {
// 			return;
// 		}
// 		this.onBeforeShow(graphObject, diagram, tool);
// 		const textBlock = graphObject as TextBlock;
// 		const editingTool = tool as TextEditingTool;
// 		this.element = this.createElement(textBlock);
// 		this.element.addEventListener("keydown", (e: KeyboardEvent) => {
// 			if (e.key === "Enter") {
// 				editingTool.acceptText(TextEditingTool.Enter);
// 				return;
// 			} else if (e.key === "Tab") {
// 				editingTool.acceptText(TextEditingTool.Tab);
// 				e.preventDefault();
// 				return false;
// 			} else if (e.key === "Escape") {
// 				tool.doCancel();
// 				if (tool.diagram) {
// 					tool.diagram.focus();
// 				}
// 			}
// 		}, false);
// 		const location = textBlock.getDocumentPoint(Spot.TopLeft);
// 		const position = diagram.transformDocToView(location);
// 		const bounds = textBlock.getDocumentBounds();
// 		this.element.style.left = (position.x - 2) + "px";
// 		this.element.style.top = (position.y - 2) + "px";
// 		this.element.style.position = "absolute";
// 		this.element.style.zIndex = "100";
// 		this.element.style.width = bounds.width + "px";
// 		diagram.div.appendChild(this.element);
// 	}
// 	hide = (diagram: Diagram, tool: Tool) => {
// 		diagram.div.removeChild(this.element);
// 	}
// 	valueFunction = () => {
// 		return this.getValue(this.element);
// 	}

// 	abstract onBeforeShow(graphObject: go.GraphObject, diagram: Diagram, tool: go.Tool): void;

// 	abstract createElement(textBlock: TextBlock): TElement;

// 	abstract getValue(element: TElement): any;
// }