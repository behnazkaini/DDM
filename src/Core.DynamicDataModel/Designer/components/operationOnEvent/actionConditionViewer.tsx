import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FieldValue } from '@didgah-components/ant-querybuilder';
import BasicActionConditionViewer from './basicActionConditionViewer';
import GridActionConditionViewer from './gridActionConditionViewer';

function QueryBuilderActionConditionViewer(props: any) {
    const { isGridEventSelected } = props;
    return isGridEventSelected  ? <GridActionConditionViewer
        {...props}
    /> :
        <BasicActionConditionViewer
            {...props}
        />
        ;
}
export default QueryBuilderActionConditionViewer;