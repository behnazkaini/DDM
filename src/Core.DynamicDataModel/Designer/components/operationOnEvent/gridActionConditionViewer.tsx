import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FieldValue } from '@didgah-components/ant-querybuilder';
import { GlobalPropsContext } from '../../store/reducers/designLayoutSlice';
import useFloorStack from '../../hooks/useFloorStack';
import { ColumnActions, ReferenceActions } from '../../../../typings/Core.DynamicDataModel/Enums';
import { LayoutItemType } from '../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { WidgetFactory } from '../../../Widget/WidgetFactory';
import { translate } from 'didgah/common';

function GridActionConditionViewer(props: FieldValue) {
  const { field, operator, value, extraData } = props;

  const content = () => {
    if (extraData) {
      const { functionName, layoutItem, targetLayoutItem } = extraData;
      return (
        <div>
          {targetLayoutItem.Text} {translate(`DDM_${ColumnActions[operator]}`)} {functionName} {layoutItem.Text}

        </div>
      )
    }
    else {
      return <></>;
    }
  }
  return (
    content()
  )
}
export default GridActionConditionViewer;