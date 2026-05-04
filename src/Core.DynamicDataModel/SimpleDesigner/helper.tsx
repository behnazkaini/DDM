import DDM_API from "./services/APIs";
import { DidgahDeferred, translate, utility } from 'didgah/common';
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { ValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { ComplexValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ComplexValidationViewModel";
import { ConditionGroupViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";
import { DefineArchiveLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { getApiUrl, loadJsResourcesSync } from "../../Utility/helpers";
import { AddLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddLayoutViewModel";
import { Column } from "Scripts/Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.Column";

export type LayoutViewModelExtended = (LayoutViewModel & { ComplexValidations: ComplexValidationViewModel[]; Validations: ValidationViewModel[]; });

export function replaceComplexValidationsGuid(complexValidations: ComplexValidationViewModel[], childItemReplayArray) {
  complexValidations.forEach(complexValidation => {
    complexValidation.Guid = utility.newGuid();
    complexValidation.ConditionGroup = replaceConditionGroupGuid(complexValidation.ConditionGroup, childItemReplayArray);
  });
  return complexValidations;
}

export function replaceConditionGroupGuid(conditionGroup: ConditionGroupViewModel, childItemReplayArray) {
  conditionGroup.Guid = utility.newGuid();
  conditionGroup.Conditions.forEach(conditionGroupCondition => {
    conditionGroupCondition.Guid = utility.newGuid();
    const newLayoutItemGuid = childItemReplayArray.find(item => item.old === conditionGroupCondition.ItemGuid).new;
    // @ts-ignore
    conditionGroupCondition.LayoutItemGuid = newLayoutItemGuid;
  });
  conditionGroup.ConditionGroups.forEach(conditionGroupChild => {
    conditionGroupChild = replaceConditionGroupGuid(conditionGroupChild, childItemReplayArray);
  });
  return conditionGroup;
}

export async function copyDesignerForm(ajax, layoutGuid: string, label: string) {
  const API = new DDM_API({ ajax });
  const layout = await API.GetLayoutByGuid({
    Guid: layoutGuid
  });
  const childItemReplayArray: { old: string; new: string }[] = [];
  layout.Layouts.forEach(async (childLayout: LayoutViewModelExtended) => {
    childLayout.Label = label;
    const guid = utility.newGuid();
    childLayout.Guid = guid;
    childLayout.Items.filter(item => !item.ParentGuid).forEach((parentItem) => {
      const parentItemGuidTemp = utility.newGuid();
      childLayout.Items.filter(childItem => childItem.ParentGuid === parentItem.Guid).forEach(childItem => {
        childItem.ParentGuid = parentItemGuidTemp;
      })
      childItemReplayArray.push({ old: parentItem.Guid, new: parentItemGuidTemp })
      childLayout.Design = childLayout.Design.replace(new RegExp(`${parentItem.Guid}`, "g"), `${parentItemGuidTemp}`)

      parentItem.Guid = parentItemGuidTemp;
    });

    childLayout.Items.filter(item => !!item.ParentGuid).forEach(item => {
      const itemGuidTemp = utility.newGuid();
      childLayout.Validations = childLayout.Validations?.map(validation => validation.LayoutItemGuid === item.Guid ? ({ ...validation, Guid: utility.newGuid(), LayoutItemGuid: itemGuidTemp }) : validation);
      childItemReplayArray.push({ old: item.Guid, new: itemGuidTemp });
      childLayout.Design = childLayout.Design.replace(new RegExp(`${item.Guid}`, "g"), `${itemGuidTemp}`)
      item.Guid = itemGuidTemp;

    });

    if (childLayout.ComplexValidations) {
      childLayout.ComplexValidations = replaceComplexValidationsGuid(childLayout.ComplexValidations, childItemReplayArray);
    }

    if (childLayout.Type === LayoutType.DefineArchive) {
      await copyDesignerForm(ajax, label, (childLayout as unknown as DefineArchiveLayoutViewModel).DefineLayoutGuid);
      return;
    }

  });

  await API.SaveLayout({
    Added: layout.Layouts as AddLayoutViewModel[],
    Modified: []
  })
  return layout.Layouts;
}

export function loadSoftwaresPrerequisiteResources(ajax) {
  return new Promise<void>((res, rej) => {
    ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetPrerequisiteResources'), {}).then((result) => {
      if (result.length > 0) {
        loadJsResourcesSync({
          resources: result, index: 0, render: true, onComplete: () => {
            res();
          }
        });
      } else {
        res();
      }
    }).catch(() => {
      rej();
    });
    res();
  })
}

export function getLayoutState(currentState: "Added" | "Modified" | "Unchanged" = "Added", action: "Added" | "Modified"  ) {
  let result: "Added" | "Modified" |"Unchanged";
  switch(currentState) {
    case 'Added':
      result = 'Added';
      break; 
    case 'Modified':
      result = 'Modified';
      break;
    default:
      result = action;
  }
  return result;
}

export function getDataModelState(currentState: "Added" | "Modified" | "Unchanged" = "Added", action: "Modified"  ) {
  let result: "Added" | "Modified" |"Unchanged";
  switch(currentState) {
    case 'Added':
      result = 'Added';
      break; 
    case 'Modified':
      result = 'Modified';
      break;
    default:
      result = action;
  }
  return result;
}

export function getLayoutItemState(currentState: "added" | "modified" | "notchanged" = 'added', action: "added" | "modified" | "notchanged") {
  let result: "added" | "modified" | "notchanged";
  switch(currentState) {
    case 'added':
      result = 'added';
      break;
    default:
      result = action;
  }
  return result;
}

export function getNextAvailableColumnName(reservedNames: string[]) {
  let counter = 1;
  let result;
  while(!result) {
    const tempResult = 'Column' + counter;
    if(!reservedNames.includes(tempResult)) {
      result = tempResult;
    } else {
      counter +=1;
    }
  }
  return result;
}

export function getNextAvailableColumnLabel(reservedLabels: string[]) {
  let counter = 1;
  let result;
  while(!result) {
    const tempResult = translate('Column') + counter;
    if(!reservedLabels.includes(tempResult)) {
      result = tempResult;
    } else {
      counter +=1;
    }
  }
  return result;
}