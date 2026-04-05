import * as React from 'react';
import { Spin, Loadable } from "didgah/ant-core-component";

const DDMSearch = Loadable({
	loader: () => import('../searchFormGenerator' /* webpackChunkName: 'DDMSearch' */),
	loading() {
		return <Spin spinning={true} />
	}
});

export { DDMSearch }