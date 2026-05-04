import { IConditionBase } from "@models/didgah-components";
import { ConditionType as QueryBuilderConditionType } from "@models/didgah-components";
import { QueryBuilderConditionGroupViewModel, QueryBuilderConditionViewModel, QueryBuilderConditionSettingViewModel, LayoutItemColumnSetting } from "../../../../typings/Core.DynamicDataModel/Types";
import { ConditionGroupViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionGroupViewModel";
import { ConditionViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ConditionViewModel";
import { LayoutViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { SaveConditionGroupViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveConditionGroupViewModel";
import { SaveConditionViewModel } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveConditionViewModel";
import { translate, utility } from "didgah/common";
import { ConditionType } from "../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionType";

export default class ConditionGroupMapper {
    pattern = new RegExp('^(((?=.*}$){)|((?!.*}$)))((?!.*-.*)|(?=(.*[-].*){4}))[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}?[}]?$');
    public toQueryBuilderConditionGroupViewModel(layout: LayoutViewModel, conditionGroup: ConditionGroupViewModel): QueryBuilderConditionGroupViewModel {
        const conditions: IConditionBase[] = [
            ...conditionGroup.ConditionGroups.map(x => this.toQueryBuilderConditionGroupViewModel(layout, x)),
            ...conditionGroup.Conditions.map(x => this.toQueryBuilderConditionViewModel(layout, x))
        ]

        return {
            Id: conditionGroup.Guid,
            OperatorId: conditionGroup.Type,
            Type: QueryBuilderConditionType.Complex,
            Condition: conditions
        }
    }

    private toQueryBuilderConditionViewModel(layout: LayoutViewModel, condition: ConditionViewModel): QueryBuilderConditionViewModel {
        const layoutItem = layout.Items.find(x => x.Guid == condition.ItemGuid);
        const fieldLabel = (JSON.parse(layoutItem.Design) as LayoutItemColumnSetting).Label;
        const valueVal = (JSON.parse(condition.Setting) as QueryBuilderConditionSettingViewModel).Value;

        return {
            Id: condition.Guid,
            Field: condition.ItemGuid,
            Operator: condition.Type,
            Value: (JSON.parse(condition.Setting) as QueryBuilderConditionSettingViewModel).Value,
            Type: QueryBuilderConditionType.Simple,
            Text: `" ${fieldLabel} ${translate(ConditionType[condition.Type])} ${valueVal} "`,
        }
    }

    public toSaveConditionGroupViewModel(layout: LayoutViewModel, designerConditionGroup: QueryBuilderConditionGroupViewModel): SaveConditionGroupViewModel | SaveConditionViewModel {

        const guidIsValid = this.pattern.test(designerConditionGroup.Id.toLowerCase());
        const result: SaveConditionGroupViewModel = {
            Guid: guidIsValid ? designerConditionGroup.Id : utility.newGuid(),
            Type: designerConditionGroup.OperatorId,
            Conditions: designerConditionGroup.Condition.filter((cond) => cond.Type === QueryBuilderConditionType.Simple).map((x) => this.toSaveSimpleConditionViewModel(layout, x)),
            ConditionGroups: designerConditionGroup.Condition.filter((cond) => cond.Type === QueryBuilderConditionType.Complex).map((x) => this.toSaveConditionGroupViewModel(layout, x) as SaveConditionGroupViewModel),
        }

        return result;
    }

    private toSaveSimpleConditionViewModel(layout: LayoutViewModel, designerCondition: QueryBuilderConditionGroupViewModel): SaveConditionViewModel {

        const guidIsValid = this.pattern.test(designerCondition.Id.toLowerCase());
        return {
            Guid: guidIsValid ? designerCondition.Id : utility.newGuid(),
            LayoutItemGuid: designerCondition["Field"],
            Type: designerCondition["Operator"],
            Setting: JSON.stringify({ Value: designerCondition["Value"] })
        } as SaveConditionViewModel
    }
}