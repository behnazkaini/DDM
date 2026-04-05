import { WidgetNames } from "../types";
import SignatureSelectorOneToOne from "./SignatureSelectorOneToOne";
import SignatureDisplayOneToOne from "./SignatureDisplayOneToOne";
import { IWidget } from "../../Staff/types";

const WIDGETS: { [name: string]: IWidget } = {
	[WidgetNames.SignatureDisplayOneToOne]: {
		component: SignatureDisplayOneToOne,
	},
	[WidgetNames.SignatureSelectorOneToOne]: {
		component: SignatureSelectorOneToOne,
	},
};
    
export default (id: string) => {
	return WIDGETS[id] && { ...WIDGETS[id] };
};
