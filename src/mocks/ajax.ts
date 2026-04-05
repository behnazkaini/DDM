/**
 * mocks/ajax.ts
 *
 * Mock for the Didgah ajax context (__Didgah_Ajax.AjaxContext).
 *
 * The real transportLayer.ts calls:
 *   ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetValueByPrimaryKey'), data)
 *   ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetBrief'), data)
 *   ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'GetWebSoftwareComponents'), {})
 *   ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'Get'), data)
 *   ajax.post(getApiUrl('DynamicDataModel', 'Layout', 'SaveValue'), data)
 *
 * getApiUrl(controller, module, action) produces a URL like:
 *   /Didgah/DynamicDataModel/Layout/GetValueByPrimaryKey
 *
 * This mock intercepts every post() call, matches on the URL, and returns
 * the appropriate mock data.
 */

import { mockApiData, mockLayoutBrief, mockWebSoftwareComponents } from '../mockData';

type PostFn = (url: string, data?: any) => Promise<any>;

function matchUrl(url: string, ...segments: string[]): boolean {
  return segments.every(s => url.toLowerCase().includes(s.toLowerCase()));
}

const post: PostFn = (url, data) => {
  // Simulate async network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // ── DynamicDataModel Layout endpoints ──────────────────────────────
      if (matchUrl(url, 'Layout', 'GetValueByPrimaryKey') ||
          matchUrl(url, 'Layout', 'GetValue')) {
        resolve({ ...mockApiData });
        return;
      }

      if (matchUrl(url, 'Layout', 'GetConditionedValueByPrimaryKey')) {
        resolve({ ...mockApiData });
        return;
      }

      if (matchUrl(url, 'Layout', 'GetBrief')) {
        resolve(mockLayoutBrief);
        return;
      }

      if (matchUrl(url, 'Layout', 'GetWebSoftwareComponents')) {
        resolve(mockWebSoftwareComponents);
        return;
      }

      if (matchUrl(url, 'Layout', 'Get')) {
        resolve({ ...mockApiData });
        return;
      }

      if (matchUrl(url, 'Layout', 'SaveValue')) {
        console.log('[mock ajax] SaveValue payload:', data);
        resolve({ success: true, message: 'ذخیره شد (mock)' });
        return;
      }

      // ── PrerequisiteResources (used in layoutRenderer) ─────────────────
      if (matchUrl(url, 'PrerequisiteResources') || matchUrl(url, 'GetPrerequisite')) {
        resolve({ Plugins: [], SoftwareComponents: [] });
        return;
      }

      // ── Fallback: log unknown URL and return empty object ──────────────
      console.warn('[mock ajax] Unhandled URL:', url, 'data:', data);
      resolve({});
    }, 150);
  });
};

export const mockAjax = { post };

// Type alias used in the Renderer's ConstructorArgs
export type AjaxContext = typeof mockAjax;
