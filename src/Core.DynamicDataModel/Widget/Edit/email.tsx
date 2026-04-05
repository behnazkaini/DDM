import * as React from 'react';
import { injectContext, Input } from 'didgah/ant-core-component';
import { ComponentProps, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetType } from '../../../typings/Core.DynamicDataModel/Enums';
import { checkIsWidgetDisabled } from './helper';

export class Email extends React.Component<ComponentProps<string>, any> {
  render() {
    const { value, onChange, Disabled, Widget, mode } = this.props;

    return (
      <Input direction='ltr' disabled={checkIsWidgetDisabled(Disabled, Widget, mode)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} value={value} />
    )
  }
}

export default {
  component: injectContext(Email),
} as IWidget
