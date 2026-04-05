import { DDMPlugin } from '@didgah/ddm-plugins';
import * as React from 'react';
import { importModule } from '../../Utility/helpers';

export enum PluggableId {
    archiveLayoutPropertiesDock = 0
}

export function loadDDMPlugin(name: string, debugMode) {
    return new Promise<void>((res, rej) => {
        importModule("/Content/SharedJs/Common/shared.js")
            .then(() => {
                importModule(`/Applications/ExtraModel/Plugins.${ name }/build/${ name }.${ debugMode? 'js': 'min.js' }`).then(() => {
                    res();
                }).catch(() => {
                    rej();
                })
            })
    })
}

export function getDDMPlugin(name: string): React.ComponentType<any> {
    return window["DDMPlugins"][name].default;
}

export function getDDMPluginsByPluggableId(pluggableId: number): DDMPlugin[] {
    return (window["DDMPlugins"] as DDMPlugin[]).filter(p => p.pluggableId === pluggableId);
}