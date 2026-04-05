import React from 'react';
import { translate } from 'didgah/common';

function PropertiesWrapper({ name, children }) {
	return (
		<div className="dynamic-data-model-modeler_properties">
					<div className="dynamic-data-model-modeler_properties_header">
						{translate('DDMModelerProperties')}
					</div>
					<div className="dynamic-data-model-modeler_properties_content">
					<b className="dynamic-data-model-modeler_properties_title">{name}</b>
						{children}
					</div>
		</div>
	);
}
export default PropertiesWrapper