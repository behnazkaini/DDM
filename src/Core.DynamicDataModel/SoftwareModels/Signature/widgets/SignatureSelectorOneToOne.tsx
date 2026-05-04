import * as React from "react";
import {
  Button,
  DidgahContextProps,
  Row,
  Col,
  Modal,
  Tooltip,
  injectContext,
  Message,
} from "didgah/ant-core-component";
import { General } from "didgah/global";
import { translate } from "didgah/common";
import { IUserSignatureSettings } from "@models/didgah-components";
import MODEL_API, { SaveFileParams } from "./API";
import { AggregationOneToOneValue } from "../types";
import { SignatureReferenceDataModelGuid } from "..";
import { UserSignatureGuidSetting } from "../../../../Models/Chargoon.Didgah.Common5.UI.Models.Extension.UserSignatureGuidSetting";
import { Controls } from "../../../../Models/Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { WidgetType } from "../../../../typings/Core.DynamicDataModel/Enums";
import { handleErrors } from '../../../../Utility/helpers';

interface FileFieldValue {
  ExtraData: { UserFullName: string; SignatureGuid: string; };
  FileName: string;
}

interface SignatureSelectorOneToOneProps {
  ReferenceFieldId: string;
  onInitData: Array<{ value: string, label: string }>;
  onChange: (value: AggregationOneToOneValue) => void;
  value: AggregationOneToOneValue;
  initValue: AggregationOneToOneValue;
  context?: DidgahContextProps;
  dataModelGuid: string;
  primaryKey?: string;
  Disabled: boolean;
  DefaultValue: boolean;
  resetForm: () => void;
  Widget: WidgetType
}

const emptyObj: AggregationOneToOneValue = {
  key: '',
  label: '',
  metadata: {
    ColumnGuids: [],
    DataModelGuid: "00000000-0000-0000-0000-000000000000"
  },
  rowData: []
}

function SignatureSelectorOneToOne({ value = emptyObj, onChange, context, initValue, Disabled = false, primaryKey, dataModelGuid, DefaultValue, resetForm, Widget }: SignatureSelectorOneToOneProps) {
  const [tokenItems, setTokenItems] = React.useState<FileFieldValue>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const API_Model: MODEL_API = new MODEL_API({ ajax: context.ajax });

  const handleSignatureClone = async (guid: string) => {
    const result = await API_Model.cloneSignature({ SignatureGuid: guid });
    const newGuid = result.NewSignatureGuid;

    onChange({
      key: newGuid,
      label: '',
      rowData: [{
        Key: initValue.metadata.ColumnGuids[0],
        Value: General.UserFullName
      }],
      metadata: initValue.metadata,
    });

    setTokenItems({
      FileName: '',
      ExtraData: {
        UserFullName: General.UserFullName,
        SignatureGuid: newGuid
      }
    });

    typeof resetForm === "function" && resetForm();
  };

  const openSign = async () => {
    setLoading(true);
    try {
      const userSignatureSetting: UserSignatureGuidSetting =
        await API_Model.GetSignatureSettings();
  
      if (userSignatureSetting.HasSignature) {
        let signatureGuid;
  
        if (userSignatureSetting.MustSelectSignature) {
          const selectedSignatureId =
            await context.commandHandler.openControlFormByCode({
              controlCode: Controls.UserSignatures,
              controlCodeParameters: "Select=true",
              options: { alwaysOnTop: true },
              dtoObject: { selectedItemIdentifier: 'Guid' }
            });
  
          if (selectedSignatureId !== -1 && selectedSignatureId !== 0) {
            signatureGuid = selectedSignatureId;
          }
        } else {
          signatureGuid = userSignatureSetting.SignatureGuid;
        }
  
        if (!signatureGuid) return;
  
        await handleSignatureClone(signatureGuid);
      } else {
        Modal.warning({
          title: translate("SignatureNotFound"),
          content: translate("SignatureNotFoundMsg"),
          okText: translate("IGotIt"),
          cancelText: null,
        });
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  }


  function removeSignature() {
    onChange(undefined);
    setTokenItems(undefined);
  }

  function SettingButtons() {
    return (
      <div style={{
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>
          {!!value.key && (
            <Tooltip placement="top" title={translate("ChangeSignature")}>
              <Button
                type="ghost"
                loading={loading}
                disabled={Disabled && loading}
                onClick={openSign}
                icon="edit"
                className={"dynamicdatamodel-signature-panel-footer-editButton"}
              ></Button>
            </Tooltip>
          )}
        </div>
        <div>
          {!!value.key && (
            <Tooltip placement="top" title={translate("RemoveSignature")}>
              <Button
                type="ghost"
                onClick={removeSignature}
                icon="delete"
                className={"dynamicdatamodel-signature-panel-footer"}
              ></Button>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  function SignatureOwner(porps) {
    return (
      <div className={"dynamicdatamodel-signature-owner"}>
        {!!value.key &&
          `${translate("UserSigner")} : ${porps.owner}`}
      </div>
    );
  }

  function SignatureIcon() {
    return (
      <React.Fragment>
        {!!value.key && (
          <div className={"common mohr-emza-shode"}></div>
        )}
        {!value && <div className={"common mohr-emza-nashode"}></div>}
      </React.Fragment>
    );
  }

  function SignaturePanel() {
    return (
      <React.Fragment>
        {!!value.key && tokenItems && (
          <SignatureOwner owner={tokenItems.ExtraData.UserFullName} />
        )}
        {!!value.key && tokenItems && (
          <div className={"dynamicdatamodel-signature-panel"}>
            <SignatureIcon />
            <SettingButtons />
          </div>
        )}
      </React.Fragment>
    );
  }

  React.useEffect(() => {
    if (value.rowData.length > 0) {
      setTokenItems({
        FileName: '', ExtraData: {
          UserFullName: value.rowData[0].Value,
          SignatureGuid: ''
        }
      });
    }
  }, [value]);

  return (
    <React.Fragment>
      <Row
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "stretch",
        }}
      >
        {
          <Col
            style={{
              width: "auto",
              display: !!value ? "flex" : "none",
              marginLeft: 1,
            }}
          >
            <SignaturePanel />
          </Col>
        }
        <Col style={{ width: "auto" }}>
          {!value.key && (
            <Button
              type="primary"
              loading={loading}
              disabled={(loading && Disabled) || Widget === WidgetType.DisabledWidget || Disabled}
              onClick={openSign}
            >
              {translate("DefineDigitalSignature")}
            </Button>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default injectContext(SignatureSelectorOneToOne);
