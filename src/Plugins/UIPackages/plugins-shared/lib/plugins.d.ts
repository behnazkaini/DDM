export enum PluggableId {
    archiveLayoutPropertiesDock = 0
}

export type DDMPlugin = {
    guid: string;
    name: string;
    pluggableId: PluggableId;
};

export const FilterGrid: DDMPlugin;

