import { translate } from "didgah/common";
import { Button, Form, Input, Tag } from "didgah/ant-core-component";
import React from "react";
import { ReactElement } from "react";
import { SettingFormItemProps } from "../types";

const TagsContainer = (props: {
	onChange?: (e: any) => void;
	value?: Array<string> | null;
}): ReactElement => {
	const { onChange, value } = props;
	const [Tags, setTags] = React.useState(value != null ? value : []);
	const [inputVisible, setinputVisible] = React.useState(false);
	const [inputValue, setinputValue] = React.useState("");

	const handleClose = (removedTag: string) => {
		const modifiedTags = Tags.filter((tag) => tag !== removedTag);
		setTags(modifiedTags);
		onChange(modifiedTags);
	};

	const handleInputConfirm = () => {
		if (inputValue && Tags.indexOf(inputValue) === -1) {
			setTags([...Tags, inputValue]);
			onChange([...Tags, inputValue]);
		}
		setinputValue("");
		setinputVisible(false);
	};

	const handleInputChange = (e) => {
		setinputValue(e.target.value);
	};

	const showInput = () => {
		setinputVisible(true);
	};

	return (
		<div>
			{!!Tags &&
				Tags.map((tag, index) => {
					const isLongTag = tag.length > 20;
					const tagElem = (
						<Tag
							key={tag}
							closable={true}
							afterClose={() => handleClose(tag)}
						>
							{isLongTag ? `${tag.slice(0, 20)}...` : tag}
						</Tag>
					);
					return isLongTag ? "" : tagElem;
				})}
			{inputVisible && (
				<Input
					type="text"
					size="small"
					style={{ width: 78 }}
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputConfirm}
					onPressEnter={handleInputConfirm}
				/>
			)}
			{!inputVisible && (
				<Button size="small" type="dashed" onClick={showInput}>
					{`${translate("New")}+`}
				</Button>
			)}
		</div>
	);
};

const AllowedExtensions = ({
	form,
	settingName,
	initialSettingValues,
	onSave,
	key
}: SettingFormItemProps<Array<string>>) => (
	<Form.Item
		key={key}
		label={translate("AllowedExtensions")}
		labelCol={{ span: 0 }}
		wrapperCol={{ span: 24 }}
	>
		{form.getFieldDecorator(settingName, {
			initialValue: initialSettingValues[settingName],
		})(<TagsContainer onChange={onSave} />)}
	</Form.Item>
)

export default AllowedExtensions