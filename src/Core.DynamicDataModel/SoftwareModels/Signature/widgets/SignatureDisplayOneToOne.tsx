import * as React from "react";
import * as Components from "didgah/ant-core-component";
import { DidgahContextProps, injectContext, Message } from "didgah/ant-core-component";
import { translate } from "didgah/common";
import { AggregationOneToOneValue } from "../types";
import MODEL_API from "./API";
import { SignatureReferenceDataModelGuid } from "..";
import { Individual } from "@models/didgah-components";

const Row = Components.Row;
const Col = Components.Col;

interface FileFieldValue {
	ExtraData: { UserFullName: string; SignatureGuid: string; };
	FileName: string;
}
interface SignatureDisplayOneToOneProps {
	value: AggregationOneToOneValue;
	context?: DidgahContextProps;
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

function SignatureDisplayOneToOne(props: SignatureDisplayOneToOneProps) {
	const { value = emptyObj, context } = props;

	const [tokenItems, setTokenItems] = React.useState<FileFieldValue>();

	function SignatureOwner(porps: { value: AggregationOneToOneValue; owner: string }) {
		const { value, owner } = porps;
		return (
			<div className={"dynamicdatamodel-signature-owner"}>
				{!!value.key && `${translate("UserSigner")}: ${owner}`}
			</div>
		);
	}

	function SignatureIcon(props: {
		value: AggregationOneToOneValue;
		editable: boolean;
	}) {
		const { value, editable } = props;
		// if for editable and readonly ...
		return (
			<React.Fragment>
				{!!value?.key && (
					<div className={"common mohr-emza-shode"}></div>
				)}
				{!value?.key && <div className={"common mohr-emza-nashode"}></div>}
			</React.Fragment>
		);
	}

	function SignaturePanel(props: {
		value: AggregationOneToOneValue;
		editable: boolean;
	}) {
		const { value, editable } = props;
			return (
				<React.Fragment>
					{!!value?.key && tokenItems && (
						<SignatureOwner
							owner={
								tokenItems.ExtraData.UserFullName
							}
							value={value}
						/>
					)}
					{!!value?.key && (
						<div className={"dynamicdatamodel-signature-SignedPanel"}>
							<SignatureIcon value={value} editable={editable} />
						</div>
					)}
					{!value?.key && (
						<div className={"dynamicdatamodel-signature-NotSignedPanel"}>
							<SignatureIcon value={value} editable={editable} />
						</div>
					)}
				</React.Fragment>
			);
		

	}

	// const GetSignatureViewModelObject = (sigatureToken: {
	// 	FileName: string;
	// 	Token: string;
	// 	ExtraData: any;
	// }): FileFieldValue => {
	// 	return {
	// 		Token: sigatureToken.Token,
	// 		FileName: sigatureToken.FileName,
	// 		ExtraData: JSON.stringify({
	// 			UserId: '',
	// 			Username: sigatureToken.ExtraData.Username,
	// 			UserFullName: sigatureToken.ExtraData.Username,
	// 		}),
	// 	};
	// }

	React.useEffect(() => {
		if (value.rowData.length > 0) {
			setTokenItems({
				FileName: '',
        ExtraData: {
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
					<Col style={{ width: "auto", display: "flex" }}>
						<SignaturePanel editable={false} value={value} />
					</Col>
				}
			</Row>
		</React.Fragment>
	);
}

export default injectContext(SignatureDisplayOneToOne);
