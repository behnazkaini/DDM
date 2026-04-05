import { WidgetType } from "../../../typings/Core.DynamicDataModel/Enums"

export function checkIsWidgetDisabled(disabled: boolean, widgetType: WidgetType, mode: "design" | "render") {
  if (mode === 'design') return disabled || widgetType === WidgetType.DisabledWidget
  return disabled !== undefined
    ? disabled
    : (widgetType === WidgetType.DisabledWidget)
} 