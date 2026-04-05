import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Spin, DidgahContextProps, injectContext, KeyValuePairViewerField, withAppContext, IAppContext, SelectItem } from 'didgah/ant-core-component';
import transportLayer from './transportLayer'
import ConditionEditor from './conditionEditor';
import { translate } from '../../Utility/language';
import SearchFormGeneratorContext from './SearchFormGeneratorContext';
import ViewRenderer from './viewRenderer';
import { CommonWidgetFactory } from '../../DynamicDataModel/widgetFactory';
import { SearchTreeNodeMetadataModel } from './types';
import { LogicalOperatorType } from '../../Models/Chargoon.Didgah.DynamicDataModel.Enumerations.LogicalOperatorType'
import { RelationalOperatorType } from '../../Models/Chargoon.Didgah.DynamicDataModel.Enumerations.RelationalOperatorType';
import { ConditionGroupModel } from '../../Models/Chargoon.Didgah.Core.DDM.BaseAPI.Models.Search.ConditionGroupModel';
import { ISimpleCondition, IComplexCondition, ITreeNode, ConditionType } from '@models/didgah-components';
import QueryBuilder  from '@didgah-components/ant-querybuilder';
import { QueryBuilderStore } from '@didgah-components/ant-querybuilder/utils';
import { TreeStore } from '@didgah-components/ant-tree-ex/utils';
import { DataModelViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelViewModel';
import { generateTreeFromTables, getComponent, logProxy, } from './helper';
import { SearchRequestViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchRequestViewModel';
import { SearchConditionGroupViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SearchConditionGroupViewModel';
export type SearchTreeItemType = Omit<ITreeNode<SearchTreeNodeMetadataModel>, 'Text' | 'Children' | 'Hierarchy'> & { Children: SearchTreeItemType[] }
import { ConditionGroupType } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ConditionGroupType";

interface SearchFormGeneratorProps {
  initialData?: SearchRequestViewModel;
  onChange: (searchData: SearchRequestViewModel | null) => void;
  context?: DidgahContextProps;
  appContext?: IAppContext;
  dataModelGuid: System.Guid;
  onPluginCreate?: (obj: { validate?: () => boolean, isEmpty?: () => boolean }) => void;
}

const operationDataSource: SelectItem[] = [
  { key: translate('And'), value: ConditionGroupType.AND },
  { key: translate('Or'), value: ConditionGroupType.OR }
]

function SearchFormGenerator(props: SearchFormGeneratorProps) {
  const { dataModelGuid, onChange, context, initialData, onPluginCreate = () => { } } = props;
  const queryBuilderStore = useRef(null);
  const treeNodes = useRef<ITreeNode<any>[]>([]);
  const operators = useRef<number[]>([]);
  const fieldsOperators = useRef<{ [key: string]: RelationalOperatorType[]; }>();
  const [fetchLoading, setFetchLoading] = useState(true);
  /* This is only for getting Text from node */
  const textReceiverPurposeTreeStore = useRef(new TreeStore({}));
  const { getTables } = transportLayer(context.ajax);

  async function getQueryBuilderTreeData() {
    const tables = await getTables({ Guid: dataModelGuid }) as DataModelViewModel[];
    treeNodes.current = generateTreeFromTables(tables, dataModelGuid)
    textReceiverPurposeTreeStore.current.setNodes(treeNodes.current as any);
    queryBuilderStore.current = new QueryBuilderStore(initialData ? {
      Condition: {
        Id: Math.random().toString(),
        Type: ConditionType.Complex,
        OperatorId: initialData.ConditionGroup.Type,
        Condition: convertSearchModelToQueryBuilder(initialData.ConditionGroup)
      }
    } as any : null,
      operationDataSource[0].value,
      operationDataSource[0].value)

    const getValid = () => queryBuilderStore.current?.valid
    const isEmpty = () => queryBuilderStore.current?.getDataWithoutValidation()?.Condition?.length === 0
    onPluginCreate({
      validate: getValid,
      isEmpty
    });
    setFetchLoading(false);

  }

  function mapConditionsToQueryBuilderConditionModel(conditions) {

    return conditions.map(cg => {
      return {
        Id: Math.random(),
        Type: ConditionType.Simple,
        Value: cg.Value,
        Operator: cg.Type,
        Field: {
          Id: cg.FieldId,
          Text: textReceiverPurposeTreeStore.current.getNodeInJs(cg.FieldId)?.Text || cg.Text,
          ParentId: cg.ParentId,
          Metadata: {
            ParentType: cg.ParentType,
            Type: cg.Metadat.Type,
            DataType: cg.Metadat.DataType,
            Operator: cg.Type,
            DataModelGuid: cg.DataModelGuid,
            RelationGuid: cg.RelationGuid,
            ColumnGuid: cg.ColumnGuid
          }
        }
      }
    })
  }

  function convertSearchModelToQueryBuilder(conditionGroup: SearchConditionGroupViewModel) {
    const condition = [...mapConditionsToQueryBuilderConditionModel(conditionGroup.Conditions)];
    conditionGroup.ConditionGroups.forEach((cg) => {
      condition.push({
        Id: Math.random(),
        Type: ConditionType.Complex,
        OperatorId: conditionGroup.Type,
        Condition: convertSearchModelToQueryBuilder(cg)
      });
    })
    return condition;
  }

  function convertQueryBuilderModelToSearch(conditionGroup: IComplexCondition) {
    return {
      Conditions: (conditionGroup.Condition) ? (conditionGroup.Condition as any[]).filter(condition => !!!(condition.Condition))
        .map(condition => {
          const Field = condition.Field as any;
          const { Value, Operator } = (condition as ISimpleCondition);

          const retValue = {
            DataModelGuid: Field.Metadata.DataModelGuid,
            RelationGuid: Field.Metadata.RelationGuid,
            ColumnGuid: Field.Metadata?.ColumnGuid ? Field.Metadata.ColumnGuid : Field.Metadata.Type === 'Column' ? Field.Id : null,
            Type: Operator as unknown as RelationalOperatorType,
            Value: Value,
            Metadat: Field.Metadata,
            Text: Field.Text
          }
          return (retValue);
        }) : [],
      ConditionGroups: (conditionGroup.Condition) ? (conditionGroup.Condition as any[]).filter(condition => !!(condition).Condition).map(condition => convertQueryBuilderModelToSearch(condition)) : [],
      Type: conditionGroup.OperatorId as unknown as LogicalOperatorType
    }
  }

  useEffect(() => {
    (async () => {
      getQueryBuilderTreeData()
    })()
  }, [])

  const getViewComponent = (type: 'Column' | 'Relation', metadata: { DataType?: number, RelationType?: number, RelationNature?: number }) => { return getComponent(type, 'Display', metadata).component; };
  const getEditComponent = (type: 'Column' | 'Relation', metadata: { DataType?: number, RelationType?: number, RelationNature?: number }) => { return getComponent(type, 'Edit', metadata).component; };

  const handleQueryBuilderModelChange = (model) => {
    const searchData: SearchRequestViewModel = {
      DataModelGuid: dataModelGuid,
      ColumnGuids: [],
      ConditionGroup: convertQueryBuilderModelToSearch(model.Condition),
      MaxCount: null
    };

    onChange(searchData);
  }

  return <Spin spinning={fetchLoading} stretch={true}>
    {!fetchLoading &&
      <SearchFormGeneratorContext.Provider
        value={{
          getViewComponent: getViewComponent,
          getEditComponent: getEditComponent,
          searchTreeNodes: treeNodes.current,
          fieldsOperators: fieldsOperators.current
        }}>
        <QueryBuilder
          conditionDataSource={operationDataSource}
          store={queryBuilderStore.current}
          viewRenderer={ViewRenderer}
          conditionEditor={ConditionEditor}
          inline
          onChange={handleQueryBuilderModelChange}
        />
      </SearchFormGeneratorContext.Provider>
    }
  </Spin>

}

export default injectContext(withAppContext(SearchFormGenerator));