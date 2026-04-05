import { ValidationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType";
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { RelationNature } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import {
  DesignerItemType,
  DisplayWidget,
  EditWidget,
  FieldTypes,
  NoneBindableTypeId,
  NoneBindableWidgetType,
  ReferenceTypes,
} from "../../typings/Core.DynamicDataModel/Enums";
import { FieldTypeWidgets, IDictionary, ReferenceTypeWidgets, SettingType } from "../../typings/Core.DynamicDataModel/Types";
import { DataModelViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { DataModelType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { ColumnDataType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";

export const Setting = {
  Label: "Label",
  Direction: "Direction",
  WrapperLabel: "WrapperLabel",
  WrapperCol: "WrapperCol",
  LabelMutable: "LabelMutable",
  HelpTooltip: "HelpTooltip",
  ItemList: "ItemList",
  DefaultValue: "DefaultValue",
  DefaultValueTime: "DefaultValueTime",
  DefaultValueDate: "DefaultValueDate",
  DefaultValueDateTime: "DefaultValueDateTime",
  HelpBlock: "HelpBlock",
  HelpBlockType: "HelpBlockType",
  HelpBlockClosable: "HelpBlockClosable",
  HelpBlockShowMessage: "HelpBlockShowMessage",
  HelpBlockMessage: "HelpBlockMessage",
  HelpBlockDescription: "HelpBlockDescription",
  HelpBlockShowIcon: "HelpBlockShowIcon",
  ReferenceAutoCompleteColumnsConfige: "ReferenceAutoCompleteColumnsConfige",
  ReferenceTokenContainerColumnsConfige: "ReferenceTokenContainerColumnsConfige",
  CascadeDropDownLevel: "CascadeDropDownLevel",
  CascadeDropdownSelectedColumns: "CascadeDropdownSelectedColumns",
  DefaultStaff:"DefaultStaff"
};

export const editWidgetToDefaultDisplay = {
  [EditWidget.TextBox]: DisplayWidget.Label,
  [EditWidget.TextArea]: DisplayWidget.Label,
  [EditWidget.CommaSeparableComboBox]: DisplayWidget.Label,
  [EditWidget.Email]: DisplayWidget.Label,
  [EditWidget.URL]: DisplayWidget.Label,
  [EditWidget.InputDecimal]: DisplayWidget.Label,
  [EditWidget.InputDecimalWithSeperator]: DisplayWidget.Label,
  [EditWidget.InputNumber]: DisplayWidget.Label,
  [EditWidget.InputNumberWithSeperator]: DisplayWidget.Label,
  [EditWidget.InputHotkey]:  DisplayWidget.Label,
  [EditWidget.CommaSeparableNumberComboBox]: DisplayWidget.Label,
  [EditWidget.Checkbox]: DisplayWidget.ReadonlyCheckbox,
  [EditWidget.Switch]: DisplayWidget.SwitchViewer,
  [EditWidget.DateTimePicker]:  DisplayWidget.DateTimeViewer,
  [EditWidget.DatePicker]: DisplayWidget.DateViewer,
  [EditWidget.TimePicker]: DisplayWidget.TimeViewer

}

export const FieldTypesWidget: FieldTypeWidgets = {
  "1": {
    Name: FieldTypes.String,
    EditWidget: {
      "0": EditWidget.TextBox,
      "1": EditWidget.TextArea,
      "2": EditWidget.CommaSeparableComboBox,
      "3": EditWidget.Email,
      "4": EditWidget.URL,
      "5": EditWidget.InputHotkey,
    },
    DisplayWidget: {
      "0": DisplayWidget.Label,
    },
    DisabledWidget: {
      "0": EditWidget.TextBox,
      "1": EditWidget.TextArea,
      "2": EditWidget.CommaSeparableComboBox,
      "3": EditWidget.Email,
      "4": EditWidget.URL,
    },
    SearchWidget: {
      "0": EditWidget.TextBox,
    }
  },
  "2": {
    Name: FieldTypes.Decimal,
    EditWidget: {
      "0": EditWidget.InputDecimal,
      "1": EditWidget.InputDecimalWithSeperator,
    },
    DisplayWidget: {
      "0": DisplayWidget.Label,
      "1": DisplayWidget.LabelDecimalWithSeperator,
    },
    DisabledWidget: {
      "0": EditWidget.InputDecimal,
      "1": EditWidget.InputDecimalWithSeperator,
    },
    SearchWidget: {
      "0": EditWidget.InputDecimal,
    }
  },
  "3": {
    Name: FieldTypes.Integer,
    EditWidget: {
      "0": EditWidget.InputNumber,
      "1": EditWidget.InputNumberWithSeperator,
      "2": EditWidget.CommaSeparableNumberComboBox,
    },
    DisplayWidget: {
      "0": DisplayWidget.Label,
      "1": DisplayWidget.LabelNumberWithSeperator,
    },
    DisabledWidget: {
      "0": EditWidget.InputNumber,
      "1": EditWidget.InputNumberWithSeperator,
      "2": EditWidget.CommaSeparableNumberComboBox,
    },
    SearchWidget: {
      "0": EditWidget.InputDecimal,
    }
  },
  "4": {
    Name: FieldTypes.Boolean,
    EditWidget: {
      "0": EditWidget.Checkbox,
      "1": EditWidget.Switch,
    },
    DisplayWidget: {
      "0": DisplayWidget.ReadonlyCheckbox,
      "1": DisplayWidget.SwitchViewer,
    },
    DisabledWidget: {
      "0": EditWidget.Checkbox,
      "1": EditWidget.Switch,
    },
    SearchWidget: {
      "0": EditWidget.Checkbox,
    },
  },
  "5": {
    Name: FieldTypes.DateTime,
    EditWidget: {
      "0": EditWidget.DateTimePicker,
      "1": EditWidget.DatePicker,
      "2": EditWidget.TimePicker,
    },
    DisplayWidget: {
      "0": DisplayWidget.DateTimeViewer,
      "1": DisplayWidget.DateViewer,
      "2": DisplayWidget.TimeViewer,
    },
    DisabledWidget: {
      "0": EditWidget.DateTimePicker,
      "1": EditWidget.DatePicker,
      "2": EditWidget.TimePicker,
    },
    SearchWidget: {
      "0": EditWidget.DateTimePicker,
    },
  },
  "6": {
    Name: FieldTypes.BigInteger,
    EditWidget: {
      "0": EditWidget.InputNumber,
      "1": EditWidget.InputNumberWithSeperator,
    },
    DisplayWidget: {
      "0": DisplayWidget.Label,
      "1": DisplayWidget.LabelNumberWithSeperator,
    },
    DisabledWidget: {
      "0": EditWidget.InputNumber,
      "1": EditWidget.InputNumberWithSeperator,
    },
    SearchWidget: {
      "0": EditWidget.InputNumber,
    },
  }
};

export const getRelationCandidatesType = (dataModel: DataModelViewModel) => {
  if(dataModel.Type === DataModelType.Permanent) {
    return DesignerItemType.PermanentAggregation;
  } else if(dataModel.Type === DataModelType.Software) {
    return DesignerItemType.SoftwareModelAggregation;
  }
}

type FieldTypeByWidget = {
  Widget: string;
  FieldTypes: string[];
}[]

export const FieldTypesWidgetToList = () => {
  const result = [];
  for (let item in FieldTypesWidget) {
    result.push(FieldTypesWidget[item]);
  }
  return result;
}


export const findWidgetIdBySimpleDesignerWidgetType = (simpleDesignerWidgetType, widgetMode: 'EditWidget' | 'DisplayWidget') => {
  let id;
  const FieldTypesWidgetList = FieldTypesWidgetToList();
  const fieldTypesWidget = FieldTypesWidgetList.find(item => {
    let find = false; 
    for (let _editWidget in item[widgetMode]) {
      if (item[widgetMode][_editWidget] === simpleDesignerWidgetType) {
        find = true;
      }
    }
    return find;
  });

  for (let item in fieldTypesWidget[widgetMode]) {
    if (fieldTypesWidget[widgetMode][item] === simpleDesignerWidgetType) {
      id = item;
    }
  }
  return id;
}
 
export const findDefaultWidgetTypeForDataType = (dataType, widgetMode: 'EditWidget' | 'DisplayWidget') => {
  let widgetType;
  const FieldTypesWidgetList = FieldTypesWidgetToList();
  for (let item of FieldTypesWidgetList) {
    if (ColumnDataType[item.Name] === dataType) {
      widgetType = item.EditWidget[0];
    } 
  }
  return widgetType;
}


export const groupFieldTypesByWidget = () => {
  const findEditWidgetInFieldTypesWidget = (input) => {
    const fieldTypes = [];
    for (let item in FieldTypesWidget) {
      for (let editWidget in FieldTypesWidget[item].EditWidget) {
        if (FieldTypesWidget[item].EditWidget[editWidget] === input) {
          fieldTypes.push(FieldTypesWidget[item].Name);
        }
      }
    }
    return fieldTypes;
  }

  const result: FieldTypeByWidget = [];
  for (let item in EditWidget) {
    const fieldTypes = findEditWidgetInFieldTypesWidget(item);
    if (fieldTypes.length === 0) {
      continue;
    }
    result.findIndex(i => i.Widget === EditWidget[item])
    result.push({
      Widget: EditWidget[item],
      FieldTypes: fieldTypes
    })
  }
  return result;
}

export const NoneBindableWidget: { [key: number]: NoneBindableWidgetType } = {
  [NoneBindableTypeId.Tabs]: NoneBindableWidgetType.Tabs,
  [NoneBindableTypeId.TabPane]: NoneBindableWidgetType.TabPane,
  [NoneBindableTypeId.Fieldset]: NoneBindableWidgetType.Fieldset,
  [NoneBindableTypeId.HelpBlock]: NoneBindableWidgetType.HelpBlock,
};

export const ReferenceTypeWidgetProxy = (natureType: RelationNature, layoutType: RelationType, ReferenceMap: ReferenceTypeWidgets) => {
  if (natureType === RelationNature.Aggregation && layoutType === RelationType.OneToOne) {
    return ReferenceMap["2"];
  } else if (natureType === RelationNature.Aggregation && layoutType === RelationType.OneToMany) {
    return ReferenceMap["4"];
  } else if (natureType === RelationNature.Composition && layoutType === RelationType.OneToOne) {
    return ReferenceMap["1"];
  } else if (natureType === RelationNature.Composition && layoutType === RelationType.OneToMany) {
    return ReferenceMap["3"];
  }
}

export const ReferenceTypeWidget: ReferenceTypeWidgets = {
  "1": {
    Name: ReferenceTypes.OneToOneComposition,
    EditWidget: {
      "0": EditWidget.ReferenceDefine,
    },
    DisplayWidget: {
      "0": DisplayWidget.ReferenceDefineViewer,
    },
    DisabledWidget: {
      "0": EditWidget.ReferenceDefine,
    },
    SearchWidget: null
  },
  "2": {
    Name: ReferenceTypes.OneToOneAggregation,
    EditWidget: {
      "0": EditWidget.ReferenceAutoComplete,
      "1": EditWidget.CascadeDropdown,
    },
    DisplayWidget: {
      "0": DisplayWidget.ReferenceAutoCompleteViewer,
      "1": DisplayWidget.CascadeDropdown,
    },
    DisabledWidget: {
      "0": EditWidget.ReferenceAutoComplete,
      "1": EditWidget.CascadeDropdown,
    },
    SearchWidget: null
  },
  "3": {
    Name: ReferenceTypes.OneToManyComposition,
    EditWidget: {
      "0": EditWidget.ReferenceArchive,
      "1": EditWidget.ReferenceInlineArchive,
      "2": EditWidget.ReferenceDefineArchive,
    },
    DisplayWidget: {
      "0": DisplayWidget.ReferenceArchiveViewer,
      "1": DisplayWidget.ReferenceInlineArchiveViewer,
      "2": DisplayWidget.ReferenceDefineArchiveViewer,
    },
    DisabledWidget: {
      "0": EditWidget.ReferenceArchive,
      "1": EditWidget.ReferenceInlineArchive,
      "2": EditWidget.ReferenceDefineArchive,
    },
    SearchWidget: null
  },
  "4": {
    Name: ReferenceTypes.OneToManyAggregation,
    EditWidget: {
      "0": EditWidget.ReferenceTokenContainer,
      "1": EditWidget.CascadeDropdown,
    },
    DisplayWidget: {
      "0": DisplayWidget.ReferenceTokenContainerViewer,
      "1": DisplayWidget.CascadeDropdown,
    },
    DisabledWidget: {
      "0": EditWidget.ReferenceTokenContainer,
      "1": EditWidget.CascadeDropdown,
    },
    SearchWidget: null
  },
};

export const CommonSetting = [
  Setting.Label,
  Setting.HelpTooltip,
  Setting.Direction,
  Setting.LabelMutable,
];

const ArchiveColumn = [
  Setting.Label,
  Setting.HelpTooltip,
  Setting.Direction,
];

export const GroupWidgetSetting: IDictionary<SettingType> = {
  [NoneBindableWidgetType.Fieldset]: { [LayoutType.Define]: [Setting.Label] },
  [NoneBindableWidgetType.HelpBlock]: {
    [LayoutType.Define]: [
      Setting.HelpBlock,
    ]
  },
};

export const DisplayWidgetSetting: IDictionary<SettingType> = {
  [DisplayWidget.DateViewer]: { [LayoutType.Define]: [...CommonSetting, Setting.DefaultValueDate], [LayoutType.Archive]: [...ArchiveColumn, Setting.DefaultValueDate] },
  [DisplayWidget.DateTimeViewer]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.DefaultValueDateTime,
    ], [LayoutType.Archive]: [...ArchiveColumn,
    Setting.DefaultValueDateTime,]
  },
  [DisplayWidget.TimeViewer]: { [LayoutType.Define]: [...CommonSetting, Setting.DefaultValueTime], [LayoutType.Archive]: [...ArchiveColumn, Setting.DefaultValueTime] },
  [DisplayWidget.Label]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [DisplayWidget.LabelNumberWithSeperator]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [DisplayWidget.LabelDecimalWithSeperator]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [DisplayWidget.ReadonlyCheckbox]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [DisplayWidget.SwitchViewer]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [DisplayWidget.ReferenceAutoCompleteViewer]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.ReferenceAutoCompleteColumnsConfige,
    ], [LayoutType.Archive]: [...ArchiveColumn, Setting.ReferenceAutoCompleteColumnsConfige,]
  },
  [DisplayWidget.ReferenceTokenContainerViewer]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.ReferenceTokenContainerColumnsConfige,
    ], [LayoutType.Archive]: [...ArchiveColumn,
    Setting.ReferenceTokenContainerColumnsConfige,]
  },
  [DisplayWidget.ReferenceDefineViewer]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [DisplayWidget.ReferenceDefineArchiveViewer]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [DisplayWidget.ReferenceArchiveViewer]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [DisplayWidget.ReferenceInlineArchiveViewer]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
};

export const EditWidgetSetting: IDictionary<SettingType> = {
  [EditWidget.TextBox]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.Checkbox]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.CommaSeparableComboBox]: { [LayoutType.Define]: [...CommonSetting, Setting.ItemList], [LayoutType.Archive]: [...ArchiveColumn, Setting.ItemList] },
  [EditWidget.CommaSeparableNumberComboBox]: { [LayoutType.Define]: [...CommonSetting, Setting.ItemList], [LayoutType.Archive]: [...ArchiveColumn, Setting.ItemList] },
  [EditWidget.DatePicker]: { [LayoutType.Define]: [...CommonSetting, Setting.DefaultValueDate], [LayoutType.Archive]: [...ArchiveColumn, Setting.DefaultValueDate] },
  [EditWidget.DateTimePicker]: { [LayoutType.Define]: [...CommonSetting, Setting.DefaultValueDateTime], [LayoutType.Archive]: [...ArchiveColumn, Setting.DefaultValueDateTime] },
  [EditWidget.TimePicker]: { [LayoutType.Define]: [...CommonSetting, Setting.DefaultValueTime], [LayoutType.Archive]: [...ArchiveColumn, Setting.DefaultValueTime] },
  [EditWidget.Email]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.InputDecimal]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.InputDecimalWithSeperator]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.InputNumber]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.InputNumberWithSeperator]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.InputHotkey]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.Switch]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.TextArea]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.URL]: { [LayoutType.Define]: [...CommonSetting], [LayoutType.Archive]: [...ArchiveColumn] },
  [EditWidget.ReferenceAutoComplete]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.ReferenceAutoCompleteColumnsConfige,
    ], [LayoutType.Archive]: [...ArchiveColumn, Setting.ReferenceAutoCompleteColumnsConfige]
  },
  [EditWidget.ReferenceTokenContainer]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.ReferenceTokenContainerColumnsConfige,
    ], [LayoutType.Archive]: [...ArchiveColumn, Setting.ReferenceTokenContainerColumnsConfige]
  },
  [EditWidget.ReferenceDefine]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [EditWidget.ReferenceDefineArchive]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [EditWidget.ReferenceArchive]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [EditWidget.ReferenceInlineArchive]: { [LayoutType.Define]: [], [LayoutType.Archive]: [] },
  [EditWidget.CascadeDropdown]: {
    [LayoutType.Define]: [
      ...CommonSetting,
      Setting.CascadeDropDownLevel,
      Setting.CascadeDropdownSelectedColumns,
    ], [LayoutType.Archive]: [...ArchiveColumn],

  },
  [EditWidget.StaffSelectorOneToOne]: {
    [LayoutType.Define]: [...CommonSetting,Setting.DefaultStaff],
    [LayoutType.Archive]: [...ArchiveColumn,Setting.DefaultStaff]
  },
  [EditWidget.StaffSelectorOneToMany]: {
    [LayoutType.Define]: [...CommonSetting,Setting.DefaultStaff],
    [LayoutType.Archive]: [...ArchiveColumn,Setting.DefaultStaff]
  },
};

export const EditWidgetInitialValidation: IDictionary<Array<object>> = {
  [EditWidget.Email]: [{
    Type: ValidationType.Regex,
    Setting: JSON.stringify({ Regex: '^\\s*(((?!\\.)[a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9\\-]+\\.)+([a-zA-Z]{2,}))\\s*$' }),
  }],
  [EditWidget.URL]: [{
    Type: ValidationType.Regex,
    Setting: JSON.stringify({ Regex: '^[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$' }),
  }]
};

export const WidgetSettingMap = {
  ...DisplayWidgetSetting,
  ...EditWidgetSetting,
  ...GroupWidgetSetting,
};

export const EditWidgetIcon = {
 [EditWidget.TextBox]: 'text-field',
 [EditWidget.Checkbox]: 'checkbox',
 [EditWidget.CommaSeparableComboBox]: 'dropdown',
 [EditWidget.CommaSeparableNumberComboBox]: 'dropdown',
 [EditWidget.DatePicker]: 'calendar',
 [EditWidget.DateTimePicker]: 'calendar',
 [EditWidget.Email]: 'mail',
 [EditWidget.EmptyBlock]: '',
 [EditWidget.ExtensionLite]: '',
 [EditWidget.Guid]: '',
 [EditWidget.InputDecimal]: 'numerical-field',
 [EditWidget.InputDecimalWithSeperator]: 'numerical-field',
 [EditWidget.InputNumber]: 'numerical-field',
 [EditWidget.InputNumberWithSeperator]: 'numerical-field',
 [EditWidget.InputHotkey]: 'hotkey-field',
 [EditWidget.Switch]: 'switch',
 [EditWidget.TextArea]: 'textarea',
 [EditWidget.TimePicker]: 'clock',
 [EditWidget.URL]: 'url',
 [EditWidget.HelpBlock]: 'info-circle-o'
}