import * as React from "react";
import { ComponentProps, HelpBlockProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { Alert, injectContext } from "didgah/ant-core-component";

interface IHelpBlockProps extends ComponentProps, HelpBlockProps {}

export function HelpBlock(props: IHelpBlockProps) {
  const {
    Direction,
    HelpBlockType,
    HelpBlockShowMessage,
    HelpBlockMessage,
    HelpBlockDescription,
    HelpBlockClosable,
    HelpBlockShowIcon,
  } = props;

  return (
    <Alert
      style={{ direction: Direction }}
      message={!!HelpBlockShowMessage ? HelpBlockMessage : null}
      description={HelpBlockDescription}
      type={HelpBlockType}
      closable={HelpBlockClosable}
      showIcon={HelpBlockShowIcon}
    />
  );
}

export default {
  component: injectContext(HelpBlock),
} as IWidget;
