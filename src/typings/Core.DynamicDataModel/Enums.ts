export enum LayoutTabs {
  Designer = "Designer",
  Preview = "Preview",
  OperationOnEvent = 'OperationOnEvent',
}

export enum DefineDesignerTabs {
  Container = "Container",
  Sorting = "Sorting",
  Fields = "Fields",
  Relations = "Relations",
  Shapes = "Shapes",
}

export enum ArchiveDesignerTabs {
  Columns = "Columns",
}

export enum PropertiesDockTabs {
  Widget = "Widget",
  Setting = "Setting",
  Validation = "Validation",
  Connection = "Connection"
}

export enum ArrangementType {
  NoneBindableGroup = 1,
  Row = 2,
  Column = 3,
  Empty = 4,
  SubLayout = 5,
  Shape = 6,
}

export enum DirectionType {
  Auto = "unset",
  Right = "rtl",
  Left = "ltr",
}

export enum ColumnAlign {
  Auto = "auto",
  Right = "rtl",
  Left = "ltr",
}

export enum DesignerItemType {
  Canvas = "Canvas",
  Tabs = "Tabs",
  TabPane = "TabPane",
  Fieldset = "Fieldset",
  Row = "Row",
  Column = "Column",
  DataField = "DataField",
  HelpBlock = "HelpBlock",
  Composition = "Composition",
  Aggregation = "Aggregation",
  // These are for simple designer - start
  PermanentAggregation = "PermanentAggregation",
  SoftwareModelAggregation = "SoftwareModelAggregation",
  TableComposition = "TableComposition",
  // These are for simple designer - end
}

export enum NoneBindableTypeId {
  Fieldset = 1,
  HelpBlock = 2,
  Tabs = 3,
  TabPane = 4,
}

export enum NoneBindableWidgetType {
  Fieldset = "Fieldset",
  TabPane = "TabPane",
  Tabs = "Tabs",
  HelpBlock = "HelpBlock"
}

export enum FieldTypes {
  String = "String",
  Decimal = "Decimal",
  Integer = "Integer",
  Boolean = "Boolean",
  DateTime = "DateTime",
  BigInteger = "BigInteger",
  Reference = "Reference",
}

export enum ReferenceTypes {
  OneToOneComposition = "OneToOneComposition",
  OneToOneAggregation = "OneToOneAggregation",
  OneToManyComposition = "OneToManyComposition",
  OneToManyAggregation = "OneToManyAggregation",
}

export enum OptionType {
  Delete = 0,
  Setting = 1,
  Designer = 2,
}

export enum SignType {
  Validation = 0,
  Event = 1,
}

export enum WidgetType {
  EditWidget = "EditWidget",
  DisplayWidget = "DisplayWidget",
  DisabledWidget = "DisabledWidget",
  SearchWidget = "SearchWidget",
}

export enum EditWidget {
  TextBox = "TextBox",
  Checkbox = "Checkbox",
  CommaSeparableComboBox = "CommaSeparableComboBox",
  CommaSeparableNumberComboBox = "CommaSeparableNumberComboBox",
  DatePicker = "DatePicker",
  DateTimePicker = "DateTimePicker",
  Email = "Email",
  EmptyBlock = "EmptyBlock",
  ExtensionLite = "ExtensionLite",
  Guid = "Guid",
  HelpBlock = "HelpBlock",
  InputDecimal = "InputDecimal",
  InputDecimalWithSeperator = "InputDecimalWithSeperator",
  InputNumber = "InputNumber",
  InputNumberWithSeperator = "InputNumberWithSeperator",
  InputHotkey = "InputHotkey",
  Switch = "Switch",
  TextArea = "TextArea",
  TimePicker = "TimePicker",
  URL = "URL",
  ReferenceAutoComplete = "ReferenceAutoComplete",
  ReferenceTokenContainer = "ReferenceTokenContainer",
  ReferenceDefine = "ReferenceDefine",
  ReferenceDefineArchive = "ReferenceDefineArchive",
  ReferenceArchive = "ReferenceArchive",
  ReferenceInlineArchive = "ReferenceInlineArchive",
  CascadeDropdown = "CascadeDropdown",
  CascadeDropdownInGrid = "CascadeDropdownInGrid",
  StaffSelectorOneToOne = "StaffSelectorOneToOne",
  StaffSelectorOneToMany = "StaffSelectorOneToMany"

}

export enum DisplayWidget {
  DateViewer = "DateViewer",
  DateTimeViewer = "DateTimeViewer",
  EmptyBlockViewer = "EmptyBlockViewer",
  FileListDownloader = "FileListDownloader",
  HelpBlockViewer = "HelpBlockViewer",
  IndicatorViewer = "IndicatorViewer",
  Label = "Label",
  LabelNumberWithSeperator = "LabelNumberWithSeperator",
  LabelDecimalWithSeperator = "LabelDecimalWithSeperator",
  ReadonlyCheckbox = "ReadonlyCheckbox",
  TimeViewer = "TimeViewer",
  ReferenceAutoCompleteViewer = "ReferenceAutoCompleteViewer",
  ReferenceTokenContainerViewer = "ReferenceTokenContainerViewer",
  ReferenceDefineViewer = "ReferenceDefineViewer",
  ReferenceDefineArchiveViewer = "ReferenceDefineArchiveViewer",
  ReferenceArchiveViewer = "ReferenceArchiveViewer",
  ReferenceInlineArchiveViewer = "ReferenceInlineArchiveViewer",
  SwitchViewer = "SwitchViewer",
  UndefinedComponent = "UndefinedComponent",
  CascadeDropdown = "CascadeDropdown",
  StaffSelectorOneToOne = "StaffSelectorOneToOne",
  StaffSelectorOneToMany = "StaffSelectorOneToMany"
}

export enum SearchWidget { }

enum SettingType {
  Label = "Label",
  Direction = "Direction",
  WrapperLabel = "WrapperLabel",
  WrapperCol = "WrapperCol",
  LabelMutable = "LabelMutable",
  HelpTooltip = "HelpTooltip",
  ItemList = "ItemList",
  DefaultValue = "DefaultValue",
  AllowedExtensions = "AllowedExtensions",
  AllowedFileCount = "AllowedFileCount",
}

export enum HelpBlockType {
  success = "success",
  info = "info",
  warning = "warning",
  error = "error",
}

export enum ErrorDesignType {
  GroupEmpty = 0,
  ColumnEmpty = 2,
  DesignPaneEmpty = 3,
  ArchiveDefineEmpty = 4,
  ArchiveColumnsEmpty = 5,
  ArchiveColumnsDuplicate = 6,
  LayoutHasNotName = 7,
  WrongFormInfo = 8,
  WrongFieldInfo = 9,
  WrongColumnInfo = 10,
}

export enum DesignerMode {
  add = "add",
  edit = "edit",
}

export enum Events {
  onChange = 1
}

export enum ColumnActions {
  setFieldsValue = 1,
  Disabled = 2,
  Required = 3
}

export enum ReferenceActions {
  Disabled = 1,
  Required = 2
}