import { ComplexValidationResultProps, IWidgetFactory, SubLayoutResultsModel, ValidationResult } from "../../../../typings/Core.DynamicDataModel/Types";
import { LayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Common5.UI.Models.DynamicDataModel.LayoutItemViewModel";
import { ConditionGroupViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";
import { SubLayoutItemViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel";
import { ConditionGroupType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";
import { LayoutItemType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { ComplexValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ComplexValidationViewModel";
import { DataModelViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel";
import { DefineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineArchiveLayoutViewModel";
import { DefineLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DefineLayoutViewModel";
import { InlineArchiveLayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.InlineArchiveLayoutViewModel";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { SaveRowViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";
import { LayoutType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { RowState } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";
import LayoutItemColumnValidator from './layoutItemColumnValidator';
import LayoutItemReferenceValidator from './layoutItemReferenceValidator';
import LayoutItemValidator from "./layoutItemValidator";
import SubLayoutItemValidator from './subLayoutItemValidator'
import { RelationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { LayoutItemReferenceViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemReferenceViewModel";
import { utility } from 'didgah/common';
import React from "react";

export default class ComplexValidator {

	private layouts: LayoutViewModel[];
	private dataModels: DataModelViewModel[];
	public validatorList: LayoutItemValidator<any>[];

	constructor({ layouts, dataModels }: { layouts: LayoutViewModel[], dataModels: DataModelViewModel[] }) {
		this.layouts = layouts;
		this.dataModels = dataModels;
		this.validatorList = [
			new LayoutItemColumnValidator(),
			new LayoutItemReferenceValidator(),
			new SubLayoutItemValidator(),
		];
	}

	public validateLayout(layout: LayoutViewModel, rows: SaveRowViewModel[]): ValidationResult {
		const currentLayout = layout.Type === LayoutType.DefineArchive ?
			this.layouts.find(x => x.Guid == (layout as DefineArchiveLayoutViewModel).DefineLayoutGuid) as DefineLayoutViewModel :
			layout;


		const validatioResult = this.validate(currentLayout, rows);
		let finalResult: ValidationResult;
		if (!!validatioResult.length) {
			validatioResult.every(x => {
				if (!!x.SubLayoutResults.length) {
					const subLayoutValidationResult = x.SubLayoutResults[0].results.find(y => !y.Succeedded);
					if (!!subLayoutValidationResult) {
						finalResult = { succeedded: false, message: subLayoutValidationResult.Message, result: x.SubLayoutResults[0].results }
						return false
					}
				}
				if (!x.Succeedded) {
					let finalMsg: React.ReactNode[] = [];
					const validatioResultList = utility.groupBy(validatioResult.filter(y => !y.Succeedded), 'ValidationGuid');
					
					for (const key in validatioResultList) {
						finalMsg.push(React.createElement("li", {}, validatioResultList[key][0].Message));
					}
					finalResult = { succeedded: false, message: finalMsg, result: validatioResult }
					return false
				}

				finalResult = { succeedded: true }
				return true;
			})
		}
		else {
			finalResult = {
				succeedded: true,
			}
		}
		return finalResult
	}

	private validate(layout: LayoutViewModel, rows: SaveRowViewModel[]) {
		const validations = this.getValidations(layout);
		const result: ComplexValidationResultProps[] = [];

		rows?.forEach(row => {
			if (row.State !== RowState.Deleted) {
				result.push(...this.validateRow(row, validations, layout, rows))
			}
		});

		return result

	}

	private validateRow(row: SaveRowViewModel, validations: ComplexValidationViewModel[], layout: LayoutViewModel, rows: SaveRowViewModel[]) {
		const dataModel = this.dataModels.find(x => x.Guid === layout.DataModelGuid);
		const result: ComplexValidationResultProps[] = [];
		validations.forEach(validation => {
			result.push({
				Message: validation.Message,
				ValidationGuid: validation.Guid,
				PrimaryKey: row.PrimaryKey,
				SubLayoutResults: this.validateSubLayoutItems(row, layout, rows),
				Succeedded: !this.recursiveConditionGroupValidation(layout, validation.ConditionGroup, row, dataModel, rows).Succeedded
			})
		});
		return result
	}

	private validateSubLayoutItems(row: SaveRowViewModel, layout: LayoutViewModel, rows: SaveRowViewModel[]) {
		const subLayoutItems = layout.Items.filter(x => x.Type === LayoutItemType.SubLayout) as SubLayoutItemViewModel[];
		const subLayoutItemsThatShouldBeValidated = [];
		const rowsOfSublayout = [];
		row.KeyValues?.forEach(x => {
			const item = subLayoutItems.find(item => item.RelationGuid === x.Key)
			if (!!item) {
				subLayoutItemsThatShouldBeValidated.push(item);
				if (!!(x.Value as []).length) {
					rowsOfSublayout.push(x.Value[0]);
				}
			}
		})

		const result: SubLayoutResultsModel[] = []

		subLayoutItemsThatShouldBeValidated.forEach(x => {
			if (!!rowsOfSublayout.length) {
				result.push({
					layoutGuid: x.SubLayoutGuid,
					results: this.validate(this.layouts.find(y => y.Guid === x.SubLayoutGuid), rowsOfSublayout)
				})
			}
		});

		return result
	}

	private recursiveConditionGroupValidation(layout: LayoutViewModel, conditionGroup: ConditionGroupViewModel, row: SaveRowViewModel, dataModel: DataModelViewModel, rows: SaveRowViewModel[]) {
		const booleanResult = [];
		if (!!conditionGroup.ConditionGroups.length) {
			conditionGroup.ConditionGroups.forEach(x => {
				booleanResult.push(this.recursiveConditionGroupValidation(layout, x, row, dataModel, rows));
			});
		}
		conditionGroup.Conditions.forEach(condition => {
			const layoutItem = this.getLayoutItem(layout, condition.ItemGuid);
			const itemShouldNotBeValidate = row.State === RowState.Deleted
			if (!itemShouldNotBeValidate) {

				booleanResult.push({ Succeedded: this.findValidator(layoutItem.Type).isTrue(layoutItem, row, condition.Type, condition.Setting, dataModel) });
			}
		});

		const reducer = (result = { Succeedded: true }, curr: { Succeedded: boolean }) => {
			return (conditionGroup.Type === ConditionGroupType.AND ? (result.Succeedded && curr.Succeedded) : (curr.Succeedded || result.Succeedded))
		}

		if (!!booleanResult.length) {
			const Succeedded = booleanResult.length === 1 ? booleanResult[0].Succeedded : booleanResult?.reduce(reducer);
			return {
				Succeedded
			}
		} else {
			return {
				Succeedded: false
			}
		}
	}

	private getLayoutItem(layout: LayoutViewModel, layoutItemGuid) {
		return layout.Items.find(x => x.Guid === layoutItemGuid)
	}

	private getValidations(layout: LayoutViewModel): ComplexValidationViewModel[] {
		if (layout.Type === LayoutType.Define) {
			return (layout as DefineLayoutViewModel).ComplexValidations;
		}
		if (layout.Type === LayoutType.InlineArchive) {
			return (layout as InlineArchiveLayoutViewModel).ComplexValidations;
		}
		else if (layout.Type === LayoutType.DefineArchive) {
			const defineLayout = this.layouts.find(x => x.Guid == (layout as DefineArchiveLayoutViewModel).DefineLayoutGuid) as DefineLayoutViewModel;
			return defineLayout.ComplexValidations
		}
		else {
			return [];
		}
	}

	private findValidator(type: LayoutItemType) {
		return this.validatorList.find(x => x.layoutItemType === type)
	}
}