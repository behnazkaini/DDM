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
import { errorMesseage } from "../../../SimpleDesigner/services/widgetManager";
import {
  SimpleDesignerGlobalPropsContext,
  LocalPropsContext,
} from "../../../SimpleDesigner/store/reducers/designLayoutSlice";
import SortableBox from "./SortableBox";

type ButtonItemList = Array<{ Type: OptionType; onHandler: () => void }>;
type SignList = Array<{ Type: SignType }>;
const sortableTabs = [];

interface ActionBarFrameProps {
  Options: ButtonItemList;
  style?: React.CSSProperties;
  children?: any;
  designError: FormValidationError[];
  currentTab: DefineDesignerTabs | ArchiveDesignerTabs;
  beActiveTab: Array<DefineDesignerTabs | ArchiveDesignerTabs>;
  signs: SignList;
  isFocus?: boolean;
  sortable?: boolean;
  design?: string;
  onFindElement?: (id) => any;
  onElementMove?: (draggedId, overIndex, item: { originalIndex: number; id: number; metadata: { type: ArrangementType } }) => void;
  id?: number;
  type?: ArrangementType;
}

export const OptionComponents = (porps: {
  Options: ButtonItemList;
  style: any;
  isFocus: boolean;
}): JSX.Element => {
  const { Options, style, isFocus } = porps;

  const Items = Options.map((option) => {
    switch (option.Type) {
      case OptionType.Delete:
        if (isFocus) {
          return null;
        }
        return (
          <li
            key={Math.random()}
            style={{
              float: "left",
              margin: "2px",
              cursor: "pointer",
              ...style,
            }}
          >
            <Popconfirm
              key={Math.random()}
              onConfirm={option.onHandler}
              title={translate("AreYouSure")}
            >
              <Icon type="delete" style={{ fontSize: "16px" }} />
            </Popconfirm>
          </li>
        );
      case OptionType.Setting:
        return (
          <li
            key={Math.random()}
            style={{
              float: "left",
              margin: "2px",
              cursor: "pointer",
              ...style,
            }}
          >
            <div>
              <Icon
                key={Math.random()}
                type="setting"
                style={{ fontSize: "16px" }}
                onClick={option.onHandler}
              />
            </div>
          </li>
        );
      default:
        break;
    }
  });
  return <>{Items}</>;
};

export const SignComponents = (props: { Options: SignList }) => {
  const Signs = props.Options.map((sign) => {
    switch (sign.Type) {
      case SignType.Validation:
        return (
          <li
            key={Math.random()}
            style={{ float: "right", margin: "2px", cursor: "auto" }}
          >
            <div>
              <Icon
                key={Math.random()}
                type="safety"
                style={{ fontSize: "16px" }}
              />
            </div>
          </li>
        );
      case SignType.Event:
        return (
          <li
            key={Math.random()}
            style={{ float: "right", margin: "2px", cursor: "auto" }}
          >
            <div>
              <Icon
                key={Math.random()}
                type="exception"
                style={{ fontSize: "16px" }}
              />
            </div>
          </li>
        );
      default:
        break;
    }
  });
  return <ul>{Signs}</ul>;
};

const ActionBarFrame = (props: ActionBarFrameProps) => {
  const { permission } = React.useContext(SimpleDesignerGlobalPropsContext);
  const {
    Options,
    style,
    designError,
    currentTab,
    beActiveTab,
    signs,
    sortable,
    design,
    id,
    type,
    onFindElement,
    onElementMove,
  } = props;
  const isActive: boolean =
    beActiveTab.findIndex((tab) => tab === currentTab) > -1 ? true : false;
  const columnStyle = !isActive
    ? "ActionBarBorderDeactive"
    : "ActionBarBorderActive";
  const focusStyle = props.isFocus ? "DDM-container-focus" : undefined;
  const sortableState =
    !!sortable &&
    isActive &&
    (currentTab === DefineDesignerTabs.Container ||
      currentTab === DefineDesignerTabs.Sorting);
      
  return (
    <SortableBox
      id={id}
      draggable={sortableState}
      onElementMove={onElementMove}
      onFindElement={onFindElement}
      type={type}
    >
      <div style={style} className={`${columnStyle} ${focusStyle}`}>
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

        <div >{props.children}</div>
      </div>
    </SortableBox>
  );
};

export default ActionBarFrame;
