import { SaveConditionGroupViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveConditionGroupViewModel";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { DesignerComplexValidationViewModel } from "../../../../typings/Core.DynamicDataModel/Types";
import ConditionGroupMapper from "./conditionGroupMapper";
import { SaveComplexValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveComplexValidationViewModel";
import { ComplexValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ComplexValidationViewModel";
import { ValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ValidationViewModel";
import { SaveValidationViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveValidationViewModel";

export default class ValidationMapper {

    constionGroupMapper = new ConditionGroupMapper();

    public toDesignerViewModelComplex(layout: LayoutViewModel, validations: ComplexValidationViewModel[]): DesignerComplexValidationViewModel[] {
        return validations.map(x => {
            return {
                Guid: x.Guid,
                ConditionGroup: this.constionGroupMapper.toQueryBuilderConditionGroupViewModel(layout, x.ConditionGroup),
                Message: x.Message
            }
        });
    }

    public toSaveViewModelComplex(layout: LayoutViewModel, designerValidations: DesignerComplexValidationViewModel[]): SaveComplexValidationViewModel[] {
        return designerValidations.map(x => {
            return {
                Guid: x.Guid,
                ConditionGroup: this.constionGroupMapper.toSaveConditionGroupViewModel(layout, x.ConditionGroup) as SaveConditionGroupViewModel,
                Message: x.Message
            }
        });
    }

    public toDesignerViewModelSample(validations: ValidationViewModel[]): ValidationViewModel[] {
        if (validations == null)
            return [];

        return [...validations];
    }

    public toSaveViewModelSample(validations: ValidationViewModel[]): SaveValidationViewModel[] {
        return validations.map((x) => {
            return {
                ...x
            }
        })
    }
}