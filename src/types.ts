// ─── Data Model DTOs ────────────────────────────────────────────────────────

export interface DataModelDto {
  Guid: string;
  SoftwareGuid: string;
  ScopeGuid: string;
  Name: string;
  Label: string;
  Type: number;
  Columns: ColumnDto[];
  Relations: RelationDto[];
  Variables: any[];
  InputVariableType: any;
}

export interface ColumnDto {
  Guid: string;
  DataType: ColumnDataType;
  Name: string;
  Label: string;
  Setting: string | null;
  Bookmark: string;
  BookmarkType: number;
}

export interface RelationDto {
  Guid: string;
  ReferenceDataModelGuid: string;
  Name: string;
  Label: string;
  Nature: RelationNature;
  Type: RelationType;
  Bookmark: string;
  VariableGuid: string | null;
  Settings: any[];
}

// ─── Layout DTOs ─────────────────────────────────────────────────────────────

export interface LayoutDto {
  Guid: string;
  DataModelGuid: string;
  Label: string;
  Type: LayoutType;
  PlatformType: number;
  Design: string; // JSON → LayoutDesign
  IsDefault: boolean;
  Items: LayoutItemDto[];
  Plugins: any[];
  Validations?: ValidationDto[];
  ComplexValidations?: any[];
  DefineLayoutGuid?: string;
}

export interface LayoutItemDto {
  Guid: string;
  ParentGuid: string | null;
  Type: LayoutItemType;
  Design: string; // JSON → LayoutItemDesign
  OrderIndex: number;
  ColumnGuid?: string;
  RelationGuid?: string;
  SubLayoutGuid?: string;
}

export interface ValidationDto {
  Guid: string;
  LayoutItemGuid: string;
  Type: number;
  Setting: string;
}

// ─── Design JSON (parsed from LayoutDto.Design) ───────────────────────────────

export interface LayoutDesign {
  IsResponsive: boolean;
  Arrangement: ArrangementNode[];
  Events: EventGroup[];
  DesignType: number;
}

export type ArrangementNode =
  | GroupNode
  | RowNode
  | ColumnNode
  | SubLayoutNode
  | EmptyNode;

export interface GroupNode {
  Id: number;
  Type: ArrangementType.NoneBindableGroup;
  LayoutItemGuid: string;
  Children: ArrangementNode[];
}

export interface RowNode {
  Id: number;
  Type: ArrangementType.Row;
  Columns: ArrangementNode[];
}

export interface ColumnNode {
  Id: number;
  Type: ArrangementType.Column;
  LayoutItemGuid: string;
  Col: number;
}

export interface SubLayoutNode {
  Id: number;
  Type: ArrangementType.SubLayout;
  LayoutItemGuid: string;
  Col: number;
}

export interface EmptyNode {
  Id: number;
  Type: ArrangementType.Empty;
  Col: number;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface EventGroup {
  Title: string;
  LayoutItems: EventTrigger[];
  Actions: EventAction[];
}

export interface EventTrigger {
  Guid: string;
  EventId: number;
  ExtraData?: any;
}

export interface EventAction {
  Guid: string;
  ActionId: number;
  CodeXml?: string | null;
  ExtraData?: {
    isGridAction?: boolean;
    isGridEvent?: boolean;
    functionName?: string;
    layoutItem?: { Id: string; Text: string; [k: string]: any };
    targetLayoutItem?: { Id: string; Text: string; [k: string]: any };
  };
}

// ─── Layout Item Design JSON ──────────────────────────────────────────────────

export interface LayoutItemDesign {
  Label?: string;
  Widget?: string | { Id: number };
  EditWidget?: { Id: number };
  DisplayWidget?: { Id: number };
  Direction?: string;
  HelpTooltip?: string | null;
  LabelMutable?: boolean;
  WrapperCol?: number;
  WrapperLabel?: number;
}

// ─── Mock API response (Layout/GetValueByPrimaryKey) ─────────────────────────

export interface MockApiData {
  DataModels: DataModelDto[];
  Layouts: LayoutDto[];
  Row: RowValueDto | null;
  Variables: any;
}

export interface RowValueDto {
  PrimaryKey: string;
  KeyValues: KeyValueDto[];
}

export interface KeyValueDto {
  Key: string;
  Value: any;
}

// ─── Enumerations ────────────────────────────────────────────────────────────

export enum ColumnDataType {
  String = 1,
  Decimal = 2,
  Integer = 3,
  Boolean = 4,
  DateTime = 5,
  BigInteger = 6,
}

export enum LayoutType {
  Define = 1,
  Archive = 2,
  DefineArchive = 3,
  InlineArchive = 4,
}

export enum LayoutItemType {
  Group = 1,
  Column = 2,
  Reference = 3,
  SubLayout = 4,
  NoneBindable = 5,
}

export enum ArrangementType {
  NoneBindableGroup = 1,
  Row = 2,
  Column = 3,
  Empty = 4,
  SubLayout = 5,
  Shape = 6,
}

export enum RelationNature {
  Composition = 1,
  Aggregation = 2,
}

export enum RelationType {
  OneToOne = 1,
  OneToMany = 2,
}

// ─── Runtime form state ───────────────────────────────────────────────────────

/** A single row of data in a grid (keyed by ColumnGuid) */
export type GridRow = Record<string, any> & { _id: string };

/** Flat form values for a define layout (keyed by ColumnGuid) */
export type FormValues = Record<string, any>;

/** Computed field definition derived from parsing the layout events */
export interface ComputedFieldDef {
  /** LayoutItemGuid of the field whose value is derived */
  targetLayoutItemGuid: string;
  computation: GridSumComputation | BlocklyMultiplyComputation;
}

export interface GridSumComputation {
  type: 'grid';
  functionName: 'SUM';
  /** LayoutItemGuid (in the archive sub-layout items) for the column to sum */
  sourceLayoutItemGuid: string;
}

export interface BlocklyMultiplyComputation {
  type: 'blockly';
  op: 'MULTIPLY' | 'ADD' | 'MINUS' | 'DIVIDE';
  /** LayoutItemGuid of operand A */
  layoutItemGuidA: string;
  /** LayoutItemGuid of operand B */
  layoutItemGuidB: string;
}
