import React from 'react';
import { FormComponentProps, EditorProps, Form, useAjax } from 'didgah/ant-core-component';
import { LayoutItemViewModel } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel';

import BasicActionConditionEditor from './basicActionConditionEditor';
import GridActionConditionEditor from './gridActionConditionEditor';
import { ITreeNode } from '@models/didgah-components/lib/Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeNode';

interface Props extends EditorProps {
    onCancel?: () => void;
	layoutItemDataSource: ITreeNode<LayoutItemViewModel>[];
}

export default function QueryBuilderActionConditionEditor(props: Props & FormComponentProps) {
    const { isGridEventSelected } = props;
    return isGridEventSelected ? <GridActionConditionEditor
        {...props}
    />
        : <BasicActionConditionEditor
            {...props}
        />

}