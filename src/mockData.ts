import { data1, data2, data3, data4, data5, toMockApiData, datasetConfigs } from './Core.DynamicDataModel/mockData';

// Change ACTIVE to datasetConfigs.data2 or datasetConfigs.data3 to switch datasets
const ACTIVE = datasetConfigs.data5;

export const mockApiData = toMockApiData(ACTIVE.data);
export const DEMO_LAYOUT_GUID: string = ACTIVE.layoutGuid;

const _mainLayout = (mockApiData.Layouts as any[])?.find((l: any) => l.Guid === ACTIVE.layoutGuid);

export const mockLayoutBrief = {
  Guid: ACTIVE.layoutGuid,
  DataModelGuid: _mainLayout?.DataModelGuid ?? '',
  Label: _mainLayout?.Label ?? ACTIVE.label,
  Type: _mainLayout?.Type ?? 1,
  PlatformType: _mainLayout?.PlatformType ?? 1,
  IsDefault: false,
};

export const mockWebSoftwareComponents: any[] = [];

// Re-export raw datasets and helpers for convenience
export { data1, data2, data3, data4, data5, toMockApiData, datasetConfigs };
