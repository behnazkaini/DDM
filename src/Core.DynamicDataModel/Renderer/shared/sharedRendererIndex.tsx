import * as React from 'react';
import { Spin, Loadable } from "didgah/ant-core-component";

const DDMFormRenderer = Loadable({
	loader: () => import('../layoutRenderer' /* webpackChunkName: 'DDMFormRenderer' */),
	loading() {
		return <Spin spinning={true} />
	}
});

export { DDMFormRenderer }