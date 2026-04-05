
enum PluggableId {
    archiveLayoutPropertiesDock = 0
}

type DDMPlugin = {
    guid: string;
    name: string;
    pluggableId: PluggableId;
};

export const FilterGrid:DDMPlugin = {
    guid: '04850A16-891B-4745-99F0-4E100A6D607D',
    name: 'FilterGrid',
    pluggableId: PluggableId.archiveLayoutPropertiesDock
}