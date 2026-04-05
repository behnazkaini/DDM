import DDM_API from "./services/APIs";
import { DidgahDeferred, utility } from 'didgah/common';
import { LayoutType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { ValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { ComplexValidationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ComplexValidationViewModel";
import { ConditionGroupViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";
import { DefineArchiveLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { getApiUrl, loadJsResourcesSync } from "../../Utility/helpers";
import { AddLayoutViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddLayoutViewModel";

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

  const currentLayoutGuid = await API.CopyLayout({
	LayoutGuid: layoutGuid,
	LayoutName: label
  })
  return currentLayoutGuid;
}

export function loadSoftwaresPrerequisiteResources(ajax) {
  return new Promise<void>((res, rej) => {
	ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetPrerequisiteResources'), {}).then((result) => {
	  loadJsResourcesSync({
		resources: result, index: 0, render: true, onComplete: () => {
		  res();
		}
	  })
	}).catch(() => {
	  rej();
	});
	res();
  })
}
