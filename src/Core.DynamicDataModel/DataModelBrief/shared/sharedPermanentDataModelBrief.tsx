import * as React from 'react';
import { Spin, Loadable } from "didgah/ant-core-component";

const PermanentDataModelBrief = Loadable({
  loader: () => import('../permanentDataModelBrief' /* webpackChunkName: 'PermanentDataModelBrief' */),
  loading() {
    return <Spin spinning={true} />
  }
});

export { PermanentDataModelBrief }