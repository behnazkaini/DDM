import React, { useEffect, useMemo, useState } from 'react';
import { Form, FormComponentProps, Modal, SelectEx, AutoComplete } from 'didgah/ant-core-component';
import { RelationType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType';
import { DataModelBriefViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBriefViewModel';
import transportLayer from '../transportLayer';
import { DataModelBehaviorInformationViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBehaviorInformationViewModel';
import { translate } from 'didgah/common';
import { RelationNature } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature';
import { DataModelType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.DataModelType';

const relationTypeDataSource = Object.keys(RelationType).filter((r) => !isNaN(Number(r))).map(r => ({
  key: RelationType[r],
  value: r
}));

const relationNatureDataSource = Object.keys(RelationNature).filter((r) => !isNaN(Number(r))).map(r => ({
  key: RelationNature[r],
  value: r
}));

interface RelationDetailFormType {
  relationType: RelationType;
  relationNature: RelationNature;
  model: DataModelBriefViewModel;
}

interface Props extends FormComponentProps<RelationDetailFormType> {
  softwareGuid: string;
  scopeGuid: string;
  dataModelType: number;
  closeModal: () => void;
  handleAddRelation: (relationType: RelationType, relationNature: RelationNature, modelerGuid: string) => void;
  behaviourInformations: DataModelBehaviorInformationViewModel[];
  selectedTable: string;
}

function RelationDetailModal({
  form,
  softwareGuid,
  scopeGuid,
  dataModelType,
  handleAddRelation,
  closeModal,
  behaviourInformations,
  selectedTable
}: Props) {

  const { getFieldDecorator, getFieldValue } = form;
  const { getRelationCandidates } = transportLayer();
  const [relationCandidatesDs, setRelationCandidatesDs] = useState<didgah_components.DataSourceItemType[]>([]);
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const selectedRelationType = getFieldValue('relationType');
  const selectedNature = getFieldValue('relationNature');

  useEffect(() => {
    setModalVisible(true);
  }, [])

  useEffect(() => {
    ((async () => {
      if (selectedRelationType) {
        const result = await getRelationCandidates({
          DataModelType: dataModelType,
          ScopeGuid: scopeGuid,
          SoftwareGuid: softwareGuid,
          RelationType: Number(selectedRelationType),
          CurrentDataModelGuid: selectedTable
        });
        const behaviourInformation = behaviourInformations.find(info => info.Type === dataModelType).RelationBehaviors.find(relationBehavior => relationBehavior.DataModelType === dataModelType).Details.find(detail => detail.RelationType === Number(selectedRelationType) && detail.RelationNature === Number(selectedNature))
        const canCreate = behaviourInformation.CanCreate;
        const canReuse = behaviourInformation.CanReuse;
        const ds = canReuse ? result.map(rc => ({ value: rc.Guid, label: `${rc.Name}, ${translate(rc.Label)}, ${translate('DDMModeler_' + DataModelType[rc.Type])}` })) : [];
        if (canCreate && +selectedNature!==+RelationNature.Aggregation) {
          ds.splice(0, 0, {
            label: translate('DDMModeler_AddModel'),
            value: '-1'
          });
        }
        setRelationCandidatesDs(ds);
      }
    })())

  }, [selectedRelationType, selectedNature]);

  function handleOk() {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      handleAddRelation(Number(selectedRelationType), Number(getFieldValue('relationNature')), getFieldValue('model'))
    })
  }

  return (
    <Modal
      title={translate('DDMModeler_AddRelation')}
      visible={modalVisible}
      onOk={handleOk}
      onCancel={closeModal}
    >
      <Form>
        <Form.Item label={translate('DDMModeler_RelationNature')}>
          {getFieldDecorator("relationNature", { rules: [{ required: true }] })(
            <SelectEx
              dataSource={relationNatureDataSource}
            />
          )}
        </Form.Item>
        <Form.Item label={translate('DDMModeler_RelationType')}>
          {getFieldDecorator("relationType", { rules: [{ required: true }] })(
            <SelectEx
              dataSource={relationTypeDataSource}
            />
          )}
        </Form.Item>
        <Form.Item label={translate('DDMModeler_Model')}>
          {getFieldDecorator("model", { rules: [{ required: true }] })(
            <AutoComplete
              dataSource={relationCandidatesDs}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create()(RelationDetailModal);