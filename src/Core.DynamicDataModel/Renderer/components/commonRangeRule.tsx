import { DataModelSetting } from '../../../typings/Core.DynamicDataModel/Types';
import { ColumnDataType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType';
import { DecimalDataTypeSettingViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DecimalDataTypeSettingViewModel';
import { translate } from 'didgah/common';
import { ValidationType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ValidationType';

export const validationRules = {
	set setting(settings) {
		this.settingResult = JSON.parse(settings);
	},
	set colType(type) {
		this.type = type;
	},
	settingResult: undefined,
	type: undefined,
	get [ValidationType.Required]() {
		return { required: this.settingResult.Required, message: translate('RequiredField') }
	},
	get [ValidationType.Range]() {

		const rule: { min: number; max: number; message: string; type?: string } = {
			min: this.settingResult.Min,
			max: this.settingResult.Max,
			message: translate('ValueRangeViolation').replace('{0}', this.settingResult.Min || 0).replace('{1}', this.settingResult.Max)
		};

		if (this.type === ColumnDataType.Integer || this.type === ColumnDataType.BigInteger || this.type === ColumnDataType.Decimal) {
			rule.type = 'number';
		}
		return rule;
	},

	get [ValidationType.Regex]() {
		return { pattern: this.settingResult.Regex }
	},

}

export const dataModelRules = {
	set setting(settings) {
		this.settingResult = settings;

	},
	set rules(rules) {
		this.componentRules = rules
	},
	settingResult: undefined,
	componentRules: undefined,

	get [ColumnDataType.Integer]() {
		const min = typeof (this.componentRules?.min) === 'number' ? this.componentRules.min : -2147483648;
		const max = typeof (this.componentRules?.max) === 'number' ? this.componentRules.max : 2147483647;
		return {
			min: min,
			max: max,
			type: 'number',
			message: translate('ValueRangeViolation').replace('{0}', `${min}`).replace('{1}', `${max}`)
		}

	},
	[ColumnDataType.BigInteger]: {
		min: -9223372036854775808,
		max: 9223372036854775807,
		type: 'number',
		message: translate('ValueRangeViolation').replace('{0}', '-9223372036854775808').replace('{1}', '9223372036854775807')
	},

	get [ColumnDataType.Decimal]() {
		const setting: DecimalDataTypeSettingViewModel = this.settingResult?.setting
		const maxValue = (Math.pow(10, (setting.Precision - setting.Scale))) - (Math.pow(10, -setting.Scale));
		const minValue = -(((Math.pow(10, (setting.Precision - setting.Scale)))) - (Math.pow(10, -setting.Scale)));
		const maxOfMin = typeof (this.componentRules?.min) === 'number' ? Math.max(minValue, this.componentRules.min) : minValue;
		const minOfMax = typeof (this.componentRules?.min) === 'number' ? Math.min(maxValue, this.componentRules.max) : maxValue;
		return {
			min: maxOfMin,
			max: minOfMax,
			type: 'number',
			message: translate('ValueRangeViolation').replace('{0}', `${maxOfMin}`).replace('{1}', `${minOfMax}`)
		}
	}
} 