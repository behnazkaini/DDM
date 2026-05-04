import {
  ArchiveDesignerTabs,
  ArrangementType,
  DefineDesignerTabs,
  OptionType,
  SignType,
} from "../../../../typings/Core.DynamicDataModel/Enums";
import { translate } from "didgah/common";
import { Icon, Popconfirm } from "didgah/ant-core-component";
import * as React from "react";
import { FormValidationError } from "../../../../typings/Core.DynamicDataModel/Types";
import { errorMesseage } from "../../services/widgetManager";
import {
  SimpleDesignerGlobalPropsContext,
  LocalPropsContext,
} from "../../store/reducers/designLayoutSlice";
import SortableBox from "./SortableBox";
import { OptionComponents, SignComponents } from "./ActionBarFrame";

type ButtonItemList = Array<{ Type: OptionType; onHandler: () => void }>;
type SignList = Array<{ Type: SignType }>;

interface ActionBarFrameProps {
  Options: ButtonItemList;
  style?: React.CSSProperties;
  children?: any;
  designError: FormValidationError[];
  signs: SignList;
  isFocus?: boolean;
  sortable?: boolean;
  design?: string;
  onFindElement?: (id) => any;
  onElementMove?: (draggedId, overIndex, item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }) => void;
  id?: number;
  type?: ArrangementType;
}


const ActionBarFrameContainer = (props: ActionBarFrameProps) => {
  const {
    Options,
    designError,
    signs,
  } = props;

  const columnStyle = "ActionBarBorderActive"
  const focusStyle: React.CSSProperties = props.isFocus ? {
    position: 'relative',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  } : {};

  return (
      <div 
      
      className={`${columnStyle}`}
      style={
        focusStyle
      }
      >
        <ul>
          {/* {!permission.readOnly && ( */}
            <OptionComponents
              Options={Options}
              style={{
                // display: isActive ? "inline-block" : "none",
              }}
              isFocus={props.isFocus}
            />
          {/* )} */}
          {designError.map((error) => errorMesseage(error))}
          <SignComponents Options={signs} />
        </ul>

        <div style={{flex: 1}}>{props.children}</div>
      </div>
  );
};

export default ActionBarFrameContainer;
