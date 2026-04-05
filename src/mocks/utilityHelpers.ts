/**
 * mocks/utilityHelpers.ts
 *
 * Shim for "Utility/helpers"
 *
 * The real implementation uses many Didgah-internal packages.
 * For the demo we only need the functions that LayoutManager actually calls.
 */

export function importModule(_url: string): Promise<void> {
  return Promise.resolve();
}

export function importStyleSheet(_url: string): Promise<void> {
  return Promise.resolve();
}

export const softwareGuid = 'B90F03A0-5B3B-4027-B9EC-247C2D6DDAAC';

export function getApiUrl(category: string, controller: string, action: string): string {
  return `/Didgah/${category}/${controller}/${action}`;
}

export function getNextIncrementalCode(codes: number[]): number {
  const refinedCodes = codes.filter((v, i, a) => v !== 0 && a.indexOf(Number(v)) === i);
  let index = 0;
  const sortedCodes = refinedCodes.sort((a, b) => a - b);
  for (let i = 0; i < refinedCodes.length; i++) {
    if (i + 1 < refinedCodes.length && refinedCodes[i + 1] !== sortedCodes[i] + 1) {
      index = i;
      break;
    } else {
      index = i;
    }
  }
  return (refinedCodes[index] || 0) + 1;
}

export function showSucceedMessage(): void {
  console.log('[mock] SaveSuccessful');
}

export function loadJsResourcesSync(_opts: any): void {}

export function removeDuplicatesByProperty<T, K extends keyof T>(inputList: T[], property: K): T[] {
  const seen = new Set<T[K]>();
  return inputList.filter(obj => {
    const v = obj[property];
    if (seen.has(v)) return false;
    seen.add(v);
    return true;
  });
}

export function useRebrandIcons(): boolean {
  return false;
}

export function createValidator() {
  return {
    isValidSsn: () => true,
    isValidEconomicalUniqueId: () => true,
    isValidWorkshopCode: () => true,
  };
}

export function handleErrors(error: any): void {
  console.error('[mock] handleErrors:', error);
}

export function formatDate(_date: any, _format?: string): string {
  return '';
}

export function parseDate(_str: string): Date | null {
  return null;
}
