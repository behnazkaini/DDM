import React, { useEffect } from "react"
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { DataModelType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType";
import { translate } from "../../../Utility/language";
import modelerTransportLayer from '../../Modeler/transportLayer';
import { AutoComplete, Form, FormComponentProps, SelectEx, SelectItem } from "didgah/ant-core-component";
import { RelationType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType';
import { useAppDispatch } from "../store/hook";
import { SimpleDesignerGlobalPropsContext, UpdateRelationInformation } from "../store/reducers/designLayoutSlice";
import { LayoutItemViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemViewModel";
import useFloorStack from "../hooks/useFloorStack";
import { DesignerItemType, WidgetType } from "../../../typings/Core.DynamicDataModel/Enums";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { IGetReferenceDefaultSettingResult, RichLayoutItem } from "../../../typings/Core.DynamicDataModel/Types";
import { RelationViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel";
import { DataModelBriefViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel";

const relationNature = RelationNature.Aggregation;
const relationTypeDataSource = Object.keys(RelationType).filter((r) => !isNaN(Number(r))).map(r => ({
  key: RelationType[r],
  value: r 
}));
const dataModelType = DataModelType.Dynamic;
interface Props extends FormComponentProps {
  handleRelationInfoChange: (value) => void;
  layoutItem: RichLayoutItem;
}

const ReferenceProperties = ({ form, handleRelationInfoChange, layoutItem}: Props) => {
  const { getFieldDecorator, getFieldValue } = form;
  const [relationCandidatesDs, setRelationCandidatesDs] = React.useState<(didgah_components.DataSourceItemObject & { extraData: any})[]>([]);
  const { getRelationCandidates, getBehaviorInformations } = modelerTransportLayer();
  const [behaviourInformations, setBehaviourInformations] = React.useState([]);
  const selectedRelationType = getFieldValue('relationType');
  const referenceDataModelGuid = getFieldValue('ReferenceDataModelGuid');
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { DataModelInfo } = layoutItem.simpleDesignerData as any;
  const disabled = React.useRef(!!DataModelInfo.ReferenceDataModelGuid).current;

  const filterCandidates = (candidates: DataModelBriefViewModel[]) => {
    let dataModelType; 
    if(layoutItem.simpleDesignerData.relationCandidatesType === DesignerItemType.PermanentAggregation) {
      dataModelType = DataModelType.Permanent;
    }

    if(layoutItem.simpleDesignerData.relationCandidatesType === DesignerItemType.SoftwareModelAggregation) {
      dataModelType = DataModelType.Software;
    }

    return candidates.filter(c => c.Type === dataModelType);
  }

  useEffect(() => {
    ((async () => {
      const behaviourInformations = await getBehaviorInformations();
      setBehaviourInformations(behaviourInformations);
    })());
  }, []);

  useEffect(() => {
    ((async () => {
      if (selectedRelationType) {
        const result = await getRelationCandidates({
          DataModelType: dataModelType,
          ScopeGuid: globalProps.scopeGuid,
          SoftwareGuid: globalProps.softwareGuid,
          RelationType: Number(selectedRelationType),
          CurrentDataModelGuid: DataModelInfo.guid /* This property should be removed */
        });
        const behaviourInformation = behaviourInformations.find(info => info.Type === dataModelType).RelationBehaviors.find(relationBehavior => relationBehavior.DataModelType === dataModelType).Details.find(detail => detail.RelationType === Number(selectedRelationType) && detail.RelationNature === Number(relationNature))
        const canCreate = behaviourInformation.CanCreate;
        const canReuse = behaviourInformation.CanReuse;
        const ds = canReuse ? filterCandidates(result).map(rc => ({ value: rc.Guid, label: `${translate(rc.Label)}`, extraData: {
          dataModelType: rc.Type
        } })) : [];

        setRelationCandidatesDs(ds);
      }
    })());
  }, [selectedRelationType]);
 
  useEffect(() => {
    if(!disabled) {
      if (referenceDataModelGuid) {
        handleRelationInfoChange({
          referenceDataModelGuid,
          relationType: selectedRelationType,
          relationNature,
          referenceDataModelType: relationCandidatesDs.find(item => item.value === referenceDataModelGuid).extraData.dataModelType
        })
      }
    }
  }, [referenceDataModelGuid]);

  return (
    <Form>
      <Form.Item label={translate('DDMModeler_RelationType')}>
        {getFieldDecorator("relationType", { initialValue: DataModelInfo.Type, rules: [{ required: true }] })(
          <SelectEx
            dataSource={relationTypeDataSource}
            disabled={disabled}
          />
        )}
      </Form.Item>
      <Form.Item label={translate('DDMModeler_Model')}>
        {getFieldDecorator("ReferenceDataModelGuid", { initialValue: DataModelInfo.ReferenceDataModelGuid, rules: [{ required: true }] })(
          <AutoComplete
            dataSource={relationCandidatesDs}
            disabled={disabled}
          />
        )}
      </Form.Item>
    </Form>
  )
};

export default Form.create()(ReferenceProperties);
