import * as Blockly from 'blockly';

function getToolbox(blockOptions) {
	const toolbox = {
		"kind": "categoryToolbox",
		"contents": [
			{
				"kind": "category",
				"name": "Variables",
				"custom": "VARIABLE"
			},
			{
				"kind": "category",
				"name": "Logic",
				"contents": [
					{
						"kind": "block",
						"type": "logic_compare"
					},
					{
						"kind": "block",
						"type": "logic_operation"
					},
					{
						"kind": "block",
						"type": "logic_negate"
					},
					{
						"kind": "block",
						"type": "logic_boolean"
					},
					{
						"kind": "block",
						"type": "logic_null"
					},
					{
						"kind": "block",
						"type": "logic_ternary"
					},
					{
						"kind": "block",
						"type": "controls_if"
					}
				]
			},
			{
				"kind": "category",
				"name": "Loops",
				"contents": [
					{
						"kind": "block",
						"type": "controls_repeat_ext"
					},
					{
						"kind": "block",
						"type": "controls_whileUntil"
					},
					{
						"kind": "block",
						"type": "controls_for"
					},
					{
						"kind": "block",
						"type": "controls_forEach"
					},
					{
						"kind": "block",
						"type": "controls_flow_statements"
					},

				]
			},
			{
				"kind": "category",
				"name": "Math",
				"contents": [
					{
						"kind": "block",
						"type": "math_number"
					},
					{
						"kind": "block",
						"type": "math_arithmetic"
					},
					{
						"kind": "block",
						"type": "math_single"
					},
					{
						"kind": "block",
						"type": "math_trig"
					},
					{
						"kind": "block",
						"type": "math_constant"
					},
					{
						"kind": "block",
						"type": "math_number_property"
					},
					{
						"kind": "block",
						"type": "math_round"
					},
					{
						"kind": "block",
						"type": "math_on_list"
					},
					{
						"kind": "block",
						"type": "math_modulo"
					},
					{
						"kind": "block",
						"type": "math_constrain"
					},
				]
			},
			{
				"kind": "category",
				"name": "Lists",
				"contents": [
					{
						"kind": "block",
						"type": "lists_create_empty"
					},
					{
						"kind": "block",
						"type": "lists_create_with"
					},
					{
						"kind": "block",
						"type": "lists_repeat"
					},
					{
						"kind": "block",
						"type": "lists_length"
					},
					{
						"kind": "block",
						"type": "lists_isEmpty"
					},
					{
						"kind": "block",
						"type": "lists_indexOf"
					},
					{
						"kind": "block",
						"type": "lists_getIndex"
					},
					{
						"kind": "block",
						"type": "lists_setIndex"
					},
					{
						"kind": "block",
						"type": "variables_get"
					},
				]
			},
			{
				"kind": "category",
				"name": "Functions",
				"contents": [
					{
						"kind": "block",
						"type": "procedures_defreturn",
					},
				]
			},
			{
				"kind": "category",
				"name": "Text",
				"contents": [
					{
						"kind": "block",
						"type": "text",
					},
				]
			}
		]
	};

	blockOptions.forEach((block: any) => {
		// @ts-ignore
		toolbox.contents.find(item => item.name === block.category).contents.push({
			kind: "block",
			type: block.name
		})
	});
	return toolbox;
};

export function createWorkSpace(divId, blocks = [], mainFunctionCheck) {
	Blockly.Blocks['main_func'] = {
		init: function() {
			this.appendDummyInput()
					.appendField("main(parameters)");
			this.appendStatementInput("STATEMENT")
					.setCheck(null);
			this.appendDummyInput()
					.setAlign(Blockly.ALIGN_RIGHT)
					.appendField("return");
			this.appendValueInput("RETURN")
					.setCheck(mainFunctionCheck);
			this.setInputsInline(true);
			this.setColour(330);
	 this.setTooltip("");
	 this.setHelpUrl("");
		}
	};

	(Blockly as any).JavaScript['main_func'] = function(block) {
		var statements_statement = (Blockly as any).JavaScript.statementToCode(block, 'STATEMENT');
		var value_return = (Blockly as any).JavaScript.valueToCode(block, 'RETURN', (Blockly as any).JavaScript.ORDER_ATOMIC);
		var code = 'function main(parameters) {' +'\n' + statements_statement+ '\n' + 'return ' + value_return + ';' + '\n }';
		return code;
	};

	blocks.forEach((block) => {
		switch (block.type) {
			case 'Dropdown':
				Blockly.Blocks[block.name] = {
					init: function () {
						this.appendDummyInput()
							.appendField(new 	Blockly.FieldDropdown(block.options.map(option => ([option.title, option.guid]))), "NAME");
						this.setOutput(true, ['Number', 'Boolean', 'String', 'Array']);
						this.setColour(230); 
						this.setTooltip("");
						this.setHelpUrl("");
					}
				};
				(Blockly as any).JavaScript[block.name] = function (b) {
					var dropdown_value = b.getFieldValue('NAME');
					var code = `parameters['${block.options.find(option => option.guid === dropdown_value).name}']`;
					return [code, (Blockly as any).JavaScript.ORDER_NONE];
				};
				break;
		}

	})

	var workspace = Blockly.inject(divId, { toolbox: getToolbox(blocks) as any, sounds: false });
	return workspace;
}