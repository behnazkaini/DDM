import React from 'react'
import { Button, CheckboxItem, Tag, Tooltip } from "didgah/ant-core-component";
import { FC } from "react";

const classNames = {
  Wrapper: 'DDM_Column_Tag_Order_Editor_Wrapper',
  MoveButton: 'DDM_Column_Tag_Order_Editor_Move_Button'
}

interface TagOrderEditorProps {
  tags: CheckboxItem[];
  onChange: (tags: CheckboxItem[]) => void;
}

const ColumnTagOrderEditor: FC<TagOrderEditorProps> = ({ tags, onChange }) => {

  const moveRight = (index: number) =>
    onChange(moveItem(tags, index, Math.max(index - 1, 0)));

  const moveLeft = (index: number) =>
    onChange(moveItem(tags, index, Math.min(index + 1, tags.length - 1)));

  const moveItem = <T,>(list: T[], from: number, to: number): T[] => {
    if (from === to) return list;
    const result = [...list];
    const [item] = result.splice(from, 1);
    result.splice(to, 0, item);
    return result;
  };

  return (
    <>
      {tags.map((tag, index) => (
        <Tag key={tag.value} closable={false} className={classNames.Wrapper}>
          <Tooltip title="MoveRight">
            <Button
              size="small"
              type="ghost"
              onClick={() => moveRight(index)}
              className={classNames.MoveButton}
            >
              {"<"}
            </Button>
          </Tooltip>
          {` ${tag.text} `}
          <Tooltip title="MoveLeft">
            <Button
              size="small"
              type="ghost"
              onClick={() => moveLeft(index)}
              className={classNames.MoveButton}
            >
              {">"}
            </Button>
          </Tooltip>
        </Tag>
      ))}
    </>
  );
};

export default ColumnTagOrderEditor