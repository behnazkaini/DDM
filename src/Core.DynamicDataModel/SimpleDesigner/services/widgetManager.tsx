import { LayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { SubLayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import {
  ArrangementType,
  DesignerItemType,
  ErrorDesignType,
} from "../../../typings/Core.DynamicDataModel/Enums";
import {
  ArchiveLayoutSetting,
  ArchiveLayoutSimpleDesignerViewModel,
  ColumnItem,
  DefineArchiveLayoutDesignerViewModel,
  DefineArchiveLayoutSimpleDesignerViewModel,
  DefineLayoutSimpleDesignerViewModel,
  Design,
  DesignerComplexValidationViewModel,
  EmptyItem,
  FormEvents,
  FormValidationError,
  GroupHook,
  GroupItem,
  IDictionary,
  LayoutItemColumnSetting,
  LayoutItemDesignerViewModel,
  LayoutItemNoneBindableSetting,
  LayoutItemReferenceSetting,
  QueryBuilderConditionGroupViewModel,
  RichLayoutItem,
  RowItem,
  SimpleDesignerLayoutViewModelWithState,
} from "../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import { translate } from "didgah/common";
import React from "react";
import { ConditionType } from "@models/didgah-components";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";
import { validNameRegex } from "../../../Core.DynamicDataModel/Modeler/Utility";

const DropAllowed: IDictionary<Array<DesignerItemType>> = {
  [DesignerItemType.Canvas.toString()]: [
    DesignerItemType.Fieldset,
    DesignerItemType.Tabs,
    DesignerItemType.Composition,
  ],
  [DesignerItemType.Tabs.toString()]: [DesignerItemType.TabPane],
  [DesignerItemType.TabPane.toString()]: [DesignerItemType.Fieldset],
  [DesignerItemType.Fieldset.toString()]: [DesignerItemType.Row],
  [DesignerItemType.Column.toString()]: [
    DesignerItemType.DataField,
    DesignerItemType.HelpBlock,
    DesignerItemType.PermanentAggregation,
    DesignerItemType.SoftwareModelAggregation,
    DesignerItemType.TableComposition,

  ],
};

export const isDropAllowed = (
  item: DesignerItemType,
  container: DesignerItemType
) => {
  let isValid = false;

  for (const ItemType in DropAllowed) {
    if (ItemType.toString() === container.toString()) {
      const element = DropAllowed[ItemType];

      if (element.findIndex((ItemType) => ItemType === item) > -1)
        isValid = true;
    }
  }

  return isValid;
};

export const getParsedDesignValue = (LayoutItem: LayoutItemViewModel) => {
  switch (LayoutItem.Type) {
    case LayoutItemType.NoneBindable:
      return JSON.parse(LayoutItem.Design) as LayoutItemNoneBindableSetting;
    case LayoutItemType.Column:
      return JSON.parse(LayoutItem.Design) as LayoutItemColumnSetting;
    case LayoutItemType.Reference:
      return JSON.parse(LayoutItem.Design) as LayoutItemReferenceSetting;
    case LayoutItemType.SubLayout:
      return null;
  }
};

export const getFlatArrangementGroup = (arrangement: Design): GroupItem[] => {
  const groups: GroupItem[] = [...arrangement.Arrangement];
  const result: GroupItem[] = [];

  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;
  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        result.push(collection);
      }

      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive(collection.Children);
      }
    });
    return;
  };

  recursive(groups);

  return result;
};

export const addGroup = (
  designObj: Design,
  NewLayoutItemGuid: string,
  ParentLayoutItemGuid: string | null
) => {
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem) => {
      if (
        collection.Type === ArrangementType.NoneBindableGroup &&
        ParentLayoutItemGuid.toLowerCase() ===
        collection.LayoutItemGuid.toLowerCase()
      ) {
        collection.Children.push({
          Id: Math.random(),
          Type: ArrangementType.NoneBindableGroup,
          LayoutItemGuid: NewLayoutItemGuid,
          Children: [],
        });
        return;
      }

      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive(collection.Children);
      }
    });
    return;
  };

  if (ParentLayoutItemGuid == null) {
    newDesignObj.Arrangement.push({
      Id: Math.random(),
      Type: ArrangementType.NoneBindableGroup,
      LayoutItemGuid: NewLayoutItemGuid,
      Children: [],
    });
  } else {
    recursive(newDesignObj.Arrangement);
  }

  return newDesignObj;
};

export const removeGroup = (designObj: Design, GroupLayoutItemGuid: string) => {
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  function deleteItems(array: GroupItem[], Guid: string) {
    var i = array.length;
    while (i--) {
      if (
        array[i].LayoutItemGuid === Guid &&
        array[i].Type === ArrangementType.NoneBindableGroup &&
        !!(array[i] as GroupItem).Children
      ) {
        array.splice(i, 1);
        continue;
      }
      array[i].Type === ArrangementType.NoneBindableGroup &&
        !!(array[i] as GroupItem).Children &&
        deleteItems(array[i].Children as GroupItem[], Guid);
    }
  }

  deleteItems(newDesignObj.Arrangement, GroupLayoutItemGuid);

  return newDesignObj;
};

export const addRowToGroup = (props: {
  designObj: Design;
  LayoutItemGuid: string;
  Cols: Array<number>;
  RowId: number;
}): Design => {
  const { designObj, LayoutItemGuid, Cols, RowId } = props;
  const newDesignObj = { ...designObj };

  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const addColumns = (
    colArray: Array<number>
  ): Array<EmptyItem | ColumnItem> => {
    const columnsArr: Array<EmptyItem | ColumnItem> = [];
    return columnsArr.concat(
      colArray.map((col) => ({
        Id: Math.random(),
        Type: ArrangementType.Empty,
        LayoutItemGuid: null,
        Col: col,
      }))
    );
  };

  const newRowObj: RowItem = {
    Id: RowId,
    Type: ArrangementType.Row,
    Columns: addColumns(Cols),
  };

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem) => {
      if (
        collection.Type === ArrangementType.NoneBindableGroup &&
        LayoutItemGuid.toLowerCase() === collection.LayoutItemGuid.toLowerCase()
      ) {
        collection.Children.push(newRowObj);
        return;
      }

      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive(collection.Children);
      }

      if (collection.Type === ArrangementType.Row) {
        recursive(collection.Columns);
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return newDesignObj;
};

export const removeRowFromGroup = (
  designObj: Design,
  LayoutItemGroupGuid: string,
  RowId: number
): Design => {
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem) => {
      if (
        collection.Type === ArrangementType.NoneBindableGroup &&
        LayoutItemGroupGuid.toLowerCase() ===
        collection.LayoutItemGuid.toLowerCase()
      ) {
        collection.Children = [
          ...collection.Children.filter((row: RowItem) => row.Id !== RowId),
        ];
        return;
      }

      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive((collection as GroupItem).Children);
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return newDesignObj;
};

export const addFieldToColumn = (
  designObj: Design,
  rowId: number,
  columnId: number,
  arrangementType: ArrangementType,
  layoutItemGuid: string
) => {
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem) => {
      if (
        collection.Type === ArrangementType.NoneBindableGroup &&
        !!collection.Children
      ) {
        recursive(collection.Children);
      }

      if (collection.Type === ArrangementType.Row && collection.Id === rowId) {
        collection.Columns.forEach((column: ColumnItem) => {
          if (column.Id === columnId) {
            column.LayoutItemGuid = layoutItemGuid;
            column.Type = arrangementType;
          }
        });
      }

      if (collection.Type === ArrangementType.Row) {
        recursive(collection.Columns);
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return newDesignObj;
};

export const getDesignItemCount = (designObj: Design) => {
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;
  let result = {
    Group: 0,
    Row: 0,
    Field: 0,
    Column: 0,
  };

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem | ColumnItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        result.Group += 1;
        recursive((collection as GroupItem).Children);
      }

      if (collection.Type === ArrangementType.Row) {
        recursive((collection as RowItem).Columns);
        result.Row += 1;
        result.Column += (collection as RowItem).Columns.length;
      }

      if (
        collection.Type === ArrangementType.Column ||
        collection.Type === ArrangementType.Shape ||
        collection.Type === ArrangementType.SubLayout
      ) {
        if (collection.LayoutItemGuid !== null) {
          result.Field += 1;
        }
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return result;
};

export const removeFieldFromColumn = (
  designLayoutObj: Design,
  LayoutItemGuid: string
) => {
  const newDesignObj = { ...designLayoutObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem | EmptyItem | ColumnItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive((collection as GroupItem).Children);
      }

      if (collection.Type === ArrangementType.Row) {
        recursive((collection as RowItem).Columns);
      }

      if (
        collection.Type === ArrangementType.Column ||
        collection.Type === ArrangementType.SubLayout ||
        collection.Type === ArrangementType.Shape
      ) {
        if (
          (collection as ColumnItem).LayoutItemGuid != null &&
          (collection as ColumnItem).LayoutItemGuid.toLowerCase() ===
          LayoutItemGuid.toLowerCase()
        ) {
          (collection as ColumnItem).LayoutItemGuid = null;
          (collection as ColumnItem).Type = ArrangementType.Empty;
        }
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return newDesignObj;
};

export const formDefineDesignerValidator = (props: {
  layout: SimpleDesignerLayoutViewModelWithState;
}): Array<FormValidationError> => {
  const errors: Array<FormValidationError> = [];
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;
  const { layout } = props;
  const designObj: Design = JSON.parse(layout.Design);

  // Check empty group - row - column
  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem | ColumnItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive((collection as GroupItem).Children);

        if ((collection as GroupItem).Children.length === 0) {
          errors.push({
            FormItemType: ArrangementType.NoneBindableGroup,
            ErrorType: ErrorDesignType.GroupEmpty,
            FormItemId: collection.Id,
            LayoutItemGuid: collection.LayoutItemGuid,
          });
        }
      }

      if (collection.Type === ArrangementType.Row) {
        recursive((collection as RowItem).Columns);
      }

      if (
        (collection as ColumnItem).Type === null &&
        (collection as ColumnItem).LayoutItemGuid === null
      ) {
        errors.push({
          FormItemType: ArrangementType.Column,
          ErrorType: ErrorDesignType.ColumnEmpty,
          FormItemId: collection.Id,
          LayoutItemGuid: null,
        });
      }
    });
    return;
  };

  if (designObj.Arrangement.length === 0) {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.DesignPaneEmpty,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }

  if (layout.Label == null || layout.Label.trim() === "") {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.LayoutHasNotName,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }

  recursive(designObj.Arrangement);

  if (!layout.DataModelInfo || !layout.DataModelInfo.Name || !validNameRegex.test(layout.DataModelInfo.Name)) {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.WrongFormInfo,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }
 
  for (let item of layout.Items) {
    const { simpleDesignerData } = (item as RichLayoutItem);
    switch (item.Type) {
      case LayoutItemType.Column:
        if (!simpleDesignerData || !simpleDesignerData.DataModelInfo.name || !validNameRegex.test(simpleDesignerData.DataModelInfo.name) || !simpleDesignerData.DataModelInfo.label ) {
          errors.push({
            FormItemType: null,
            ErrorType: ErrorDesignType.WrongFieldInfo,
            FormItemId: null,
            LayoutItemGuid: null,
          });
        }
        break;
      case LayoutItemType.Reference:
        if (!simpleDesignerData || !simpleDesignerData.DataModelInfo.Type || !simpleDesignerData.DataModelInfo.ReferenceDataModelGuid) {
          errors.push({
            FormItemType: null,
            ErrorType: ErrorDesignType.WrongFieldInfo, 
            FormItemId: null, 
            LayoutItemGuid: null,
          });
        }
        break;
    }
  }
  
  return errors;
};
   
export const formArchiveDesignerValidator = (props: {
  layout: ArchiveLayoutSimpleDesignerViewModel;
}): Array<FormValidationError> => {
  const errors: Array<FormValidationError> = [];
  const { layout } = props;

  const columnsLabel = layout.Items.map(function (
    item: LayoutItemColumnViewModel
  ) {
    return (
      JSON.parse(item.Design) as LayoutItemColumnSetting
    ).Label.toString();
  });

  const isDuplicateColumns = columnsLabel.some(function (item, idx) {
    return columnsLabel.indexOf(item) != idx;
  });

  if (isDuplicateColumns) {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.ArchiveColumnsDuplicate,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }

  if (layout.Type === LayoutType.DefineArchive) {
    if (
      (layout as DefineArchiveLayoutDesignerViewModel).DefineLayoutGuid == null
    ) {
      errors.push({
        FormItemType: null,
        ErrorType: ErrorDesignType.ArchiveDefineEmpty,
        FormItemId: null,
        LayoutItemGuid: null,
      });
    }
  }

  if (layout.Items.length === 0) {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.ArchiveColumnsEmpty,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }

  if (!layout.DataModelInfo || !layout.DataModelInfo.Name  || !validNameRegex.test(layout.DataModelInfo.Name) || !layout.Label) {
    errors.push({
      FormItemType: null,
      ErrorType: ErrorDesignType.WrongFormInfo,
      FormItemId: null,
      LayoutItemGuid: null,
    });
  }

  for (let item of layout.Items) {
    const { simpleDesignerData } = (item as RichLayoutItem);
    if (!simpleDesignerData || !simpleDesignerData.DataModelInfo || !validNameRegex.test(simpleDesignerData.DataModelInfo.name) || !simpleDesignerData.DataModelInfo.name || !simpleDesignerData.DataModelInfo.label) {
      errors.push({
        FormItemType: null,
        ErrorType: ErrorDesignType.WrongColumnInfo,
        FormItemId: null,
        LayoutItemGuid: item.Guid,
      });
    }
  }
  return errors;
};

export const getLayoutItemsOfRow = (props: {
  rowId: number;
  designObj: Design;
}): Array<string> => {
  const { rowId, designObj } = props;
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;
  const layoutItemGuid: Array<string> = [];
  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem | EmptyItem | ColumnItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive((collection as GroupItem).Children);
      }

      if (collection.Type === ArrangementType.Row) {
        if (collection.Id === rowId) {
          const allGuid = (collection as RowItem).Columns.map((column) =>
            !!(column as ColumnItem).LayoutItemGuid
              ? (column as ColumnItem).LayoutItemGuid.toLowerCase()
              : null
          );
          layoutItemGuid.push(...allGuid.filter((guid) => guid !== null));
        }
      }
    });

    return;
  };

  recursive(designObj.Arrangement);

  return layoutItemGuid;
};

export const addSubLayoutToColumn = (props: {
  designObj: Design;
  arrangementType: ArrangementType;
  subLayoutItemGuid: string;
  rowId: number;
  columnId: number;
}) => {
  const { designObj, arrangementType, subLayoutItemGuid, rowId, columnId } =
    props;
  const newDesignObj = { ...designObj };
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;

  const recursive = (arr: Items) => {
    arr.forEach((collection: GroupItem | RowItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        recursive(collection.Children);
      }

      if (collection.Type === ArrangementType.Row && collection.Id === rowId) {
        collection.Columns.forEach((column: ColumnItem) => {
          if (column.Id === columnId) {
            column.LayoutItemGuid = subLayoutItemGuid;
            column.Type = arrangementType;
          }
        });
      }

      if (collection.Type === ArrangementType.Row) {
        recursive(collection.Columns);
      }
    });
    return;
  };

  recursive(newDesignObj.Arrangement);

  return newDesignObj;
};

export const getArchiveDefineChildsLayout = (props: {
  subLayout: DefineArchiveLayoutSimpleDesignerViewModel;
  layoutGuid: string;
  layouts: LayoutViewModel[];
}) => {
  const { subLayout, layoutGuid, layouts } = props;
  const result: string[] = [];
  const getLayout = (guid: string) => layouts.find((layout) => layout.Guid.toLowerCase() === guid.toLowerCase());

  const recur = (items: LayoutItemViewModel[]) => {
    items.forEach((item) => {
      if (item.Type === LayoutItemType.SubLayout) {
        const layoutChild = layouts.find(
          (layout) => layout.Guid.toLowerCase() === (item as SubLayoutItemViewModel).SubLayoutGuid.toLowerCase()
        );
        result.push(layoutChild.Guid.toLowerCase());
        if (layoutChild.Type === LayoutType.DefineArchive) {
          const layoutInputDefineGuid = (layoutChild as DefineArchiveLayoutDesignerViewModel).DefineLayoutGuid;
          result.push(layoutInputDefineGuid.toLowerCase());

          recur(getLayout(layoutInputDefineGuid).Items);
          recur(layoutChild.Items);
        }
        if (layoutChild.Type === LayoutType.Define) {
          recur(layoutChild.Items);
        }
      }
    });
    return;
  };

  if (subLayout.Type === LayoutType.DefineArchive) {
    result.push(
      (subLayout as DefineArchiveLayoutDesignerViewModel).DefineLayoutGuid
    );
    recur(getLayout((subLayout as DefineArchiveLayoutDesignerViewModel).DefineLayoutGuid).Items);
  }

  recur(subLayout.Items);

  return layouts.filter((layout) =>
    result.includes(layout.Guid.toLowerCase(), 0)
  );
};

export const errorMesseage = (erroType: FormValidationError) => {
  let message;

  if (!!erroType) {
    switch (erroType.ErrorType) {
      case ErrorDesignType.GroupEmpty:
        message = translate("AddRowToFieldsetError");
        break;
      case ErrorDesignType.ColumnEmpty:
        message = translate("AddFieldToColumnError");
        break;
      case ErrorDesignType.ArchiveColumnsDuplicate:
        message = translate("ArchiveColumnsDuplicateError");
        break;
      case ErrorDesignType.ArchiveColumnsEmpty:
        message = translate("ArchiveColumnsEmptyError");
        break;
      case ErrorDesignType.ArchiveDefineEmpty:
        message = translate("ArchiveDefineEmptyError");
        break;
      default:
        message = null;
        break;
    }
  }

  return (
    !!erroType && (
      <li
        key={Math.random()}
        style={{ marginTop: "5px", display: "inline-block" }}
      >
        <span className={"DDM-ActionBar-Error-Message"}>{message}</span>
      </li>
    )
  );
};

export const getAllValidationFields = (
  validations: DesignerComplexValidationViewModel[]
): string[] => {
  const fields = [];
  const recCod = (group: QueryBuilderConditionGroupViewModel) => {
    if (group.Type === ConditionType.Complex) {
      group.Condition.forEach((condition) => {
        recCod(condition);
      });
    } else {
      fields.push(group["Field"].toString().toLowerCase());
      return;
    }
  };

  validations.forEach((validation) => {
    recCod(validation.ConditionGroup);
  });

  return [...fields];
};

export const isExistLayoutitemInCondition = (
  layoutItemGuid: string,
  validations: DesignerComplexValidationViewModel[]
) => {
  const fieldsInValidation = getAllValidationFields(validations);
  return fieldsInValidation.findIndex(
    (LayoutitemGuid) =>
      LayoutitemGuid.toLowerCase() === layoutItemGuid.toLowerCase()
  ) > -1
    ? true
    : false;
};

export const isExistFromGroupInCondition = (
  id: string,
  layoutDesign: string,
  arrangementType: ArrangementType,
  fieldsInValidation: string[]
): string[] => {
  type Items = Array<GroupItem | RowItem | EmptyItem | ColumnItem>;
  const designObj: Design = JSON.parse(layoutDesign);
  const fieldExist = [];

  const recursive = (arr: Items, Target: boolean) => {
    arr.forEach((collection: GroupItem | RowItem | ColumnItem) => {
      if (collection.Type === ArrangementType.NoneBindableGroup) {
        const isTarget =
          collection.LayoutItemGuid.toLowerCase() ===
          id.toString().toLowerCase();

        recursive((collection as GroupItem).Children, Target || isTarget);
      }

      if (collection.Type === ArrangementType.Row) {
        const isTarget =
          collection.Id.toString().toLowerCase() ===
          id.toString().toLowerCase();
        recursive((collection as RowItem).Columns, Target || isTarget);
      }

      if (collection.Type === ArrangementType.Column && Target) {
        if (collection.LayoutItemGuid !== null) {
          if (
            fieldsInValidation.findIndex(
              (val) =>
                val.toLowerCase() === collection.LayoutItemGuid.toLowerCase()
            ) > -1
          ) {
            fieldExist.push(collection.LayoutItemGuid);
          }
        }
      }
    });
    return;
  };

  recursive(
    designObj.Arrangement,
    arrangementType === ArrangementType.Column ? true : false
  );

  return fieldExist;
};

export const getSoftwareModelItem = (
  referenceDataModelGuid: string,
  softwareModels: Array<WebSoftwareComponentViewModel>
) => {
  return softwareModels.find(
    (softwareModel) =>
      softwareModel.DataModelGuid.toLowerCase() ===
      referenceDataModelGuid.toLowerCase()
  );
};

export const getAllLayoutItemGuidinEvent = (design: string) => {
  const result = [];
  const Events = !!(JSON.parse(design) as Design).Events
    ? ((JSON.parse(design) as Design).Events as Array<FormEvents>)
    : [];

  Events.forEach((field) => {
    result.push(...field.Actions.map((acn) => acn.Guid.toLowerCase()));
    field.LayoutItems.forEach((item) => result.push(item.Guid.toLowerCase()));
  });

  return result;
};

export const isExistLayoutitemInEvent = (
  layoutItemGuid: string,
  design: string
) => {
  const fieldsInEvents: string[] = getAllLayoutItemGuidinEvent(design);
  return fieldsInEvents.findIndex(
    (LayoutitemGuid) =>
      LayoutitemGuid.toLowerCase() === layoutItemGuid.toLowerCase()
  ) > -1
    ? true
    : false;
};

export const updateLocationFieldset = (props: {
  list: Array<GroupItem>;
  currentIndex: number;
  newIndex: number;
  Id: number;
}): Array<GroupItem> => {
  const { list, currentIndex, newIndex, Id } = props;
  const grouptTarget = list.find((item) => item.Id === Id);

  list.splice(currentIndex, 1);
  list.splice(newIndex, 0, grouptTarget);
  return [...list];
};

const findGroup = (design: Design, rowId: number): GroupItem => {
  const allGroup = getFlatArrangementGroup(design);
  let groupResult = null;

  allGroup.forEach((group) => {
    if (!!group.Children.find((row: RowItem) => row.Id === rowId)) {
      groupResult = group;
    }
  });

  return { ...groupResult };
};

export const updateLocationRow = (props: {
  design: Design;
  currentIndex: number;
  newIndex: number;
  Id: number;
}): Array<GroupItem> => {
  const { design, currentIndex, newIndex, Id } = props;
  const groupOftarget = findGroup(design, Id);
  const rowTarget = { ...groupOftarget.Children[currentIndex] };

  groupOftarget.Children.splice(currentIndex, 1);
  groupOftarget.Children.splice(newIndex, 0, rowTarget);

  design.Arrangement.forEach((group) => {
    if (group.Id === groupOftarget.Id) {
      group.Children = groupOftarget.Children;
    }
  });

  return [...design.Arrangement];
};
