import { getString } from 'didgah-language-cache';
import { softwareGuid as commonSoftwareGuid } from './helpers';

const translate = (key: string, softwareGuid?: string | System.Guid) => getString(key, (softwareGuid || commonSoftwareGuid) as string);
const translateBySoftwareGuid = (key: string, targetSofwareGuid: string) => getString(key, targetSofwareGuid);

export { translate, translateBySoftwareGuid }