import { Message, ReactiveCommandHandler, Modal, SelectItem } from 'didgah/ant-core-component';
import { translate } from './language';
import { GenericKeyValuePair } from '../Models/Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair';
import { ListItem } from '@models/didgah-components';
import { object } from "didgah/common";
import { ErrorType } from "../Models/Chargoon.Didgah.Common.Domain.Enumeration.ErrorType";
import { getString } from 'didgah-language-cache';
import { NationalityValidatorType } from '../Models/Chargoon.Didgah.Common.Domain.Enumeration.NationalityValidatorType';

export function getApiUrl(category: string, controller: string, action: string) {
  return `/didgah/Core/Common/${category}/${controller}/${action}`;
}

export function getApiUrlTwoInit(controller: string, action: string) {
  return `/didgah/Core/Common/default/${controller}/${action}`;
}

export function getInfoApiUrl(controller: string, action: string) {
  const category = 'common';
  return `/didgah/Core5/Zagros/${category}/${controller}/${action}`;
}

function appendPackageId(url: string) {
  if (!url) {
    throw 'Url have to be specified.';
  }

  if (typeof url !== 'string') {
    throw 'Invalid url. Url must be a string.';
  }

  let refinedUrl = url;

  if (url.charAt(url.length - 1) === '/') {
    refinedUrl = url.substring(0, url.length - 1);
  }

  if (url.indexOf('?') === -1) {
    refinedUrl = `${url}?Package=${General.Package}`;
  }
  else if (url.indexOf('Package=') === -1) {
    refinedUrl = `${url}&Package=${General.Package}`;
  }
  return refinedUrl;
}

function getSoftwareScriptManagerVariableName(url: string) {
  const softwaresRootDir = 'Applications';
  const variableName = url.substring(url.lastIndexOf(softwaresRootDir) + softwaresRootDir.length, url.indexOf('build')).split('/').join('') + 'ScriptManager';
  return variableName.charAt(0).toLowerCase() + variableName.slice(1);
}

export const loadJsResourcesSync = ({ resources, index, render, onComplete }: { resources: string[], index: number, render: boolean, onComplete: () => void; }) => {
  const loadNextResource = () => {
    if (index + 1 < resources.length) {
      loadJsResourcesSync({ resources, index: index + 1, render, onComplete });
    }
    else {
      onComplete();
    }
  };
  const resourceUrl = resources[index];
  importModule(resourceUrl)
    .then(loadNextResource)
    .catch(loadNextResource);
};

function getSoftwareScriptManagerVariableNameNew(url: string) {
  const softwaresRootDir = 'Content/SharedJs';
  const variableName = url.substring(url.lastIndexOf(softwaresRootDir) + softwaresRootDir.length, url.indexOf('scriptManager')).split('/').join('') + 'ScriptManager';
  return variableName.charAt(0).toLowerCase() + variableName.slice(1)
}

export function importModule(initUrl: string) {
  const url = appendPackageId(initUrl);
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => {
      if (url.includes('scriptManager')) {
        importModule(window[getSoftwareScriptManagerVariableNameNew(url)]).then(() => {
          resolve();
        }).catch(() => {
          alert(url);
          reject(new Error('Failed to load module script with URL ' + url));
        });
      } else {
        resolve();
        if (!!script.remove) {
          script.remove();
        }
        else {
          // IE support
          script['removeNode'](); // tslint:disable-line
        }
      };
    };
    script.onerror = () => {
      reject(new Error('Failed to load module script with URL ' + url));
      script.remove();
    };
    document.head.appendChild(script);
  });
}

export function importStyleSheet(url: string) {
  const refinedUrl = appendPackageId(url);
  return new Promise((resolve, reject) => {
    const style = document.createElement('link');
    style.href = refinedUrl;
    style.rel = 'stylesheet';

    style.onload = () => {
      resolve(style);
    };

    style.onerror = () => {
      reject(style);
    };

    document.head.appendChild(style);
  });
}

export const softwareGuid = 'B90F03A0-5B3B-4027-B9EC-247C2D6DDAAC';

export function getNextIncrementalCode(codes: number[]) {
  // should be unique numbers
  const refinedCodes = codes.filter((v, i, a) => v !== 0 && a.indexOf(Number(v)) === i);
  let index = 0;
  const length = refinedCodes.length;
  const sortedCodes = refinedCodes.sort((a, b) => a - b);
  for (let i = 0; i < length; i++) {
    const code = sortedCodes[i];
    if (i + 1 < length) {
      if (refinedCodes[i + 1] !== code + 1) {
        index = i;
        break;
      }
    }
    else {
      index = i;
      break;
    }
  }
  return (refinedCodes[index] || 0) + 1;
}

export function showSucceedMessage() {
  Message.success(translate('SaveSuccessful'));
}

export function buildSelectItem(items: ListItem[]) {
  return (items || []).map(x => ({ value: x.Id, key: x.Title }));
}

export function genericKeyValuePairToSelectItem(items: GenericKeyValuePair<number>[]) {
  return (items || []).map(x => ({ value: x.Identifier.toString(), key: translate(x.Title) }));
}

export function setWindowTitle(commandHandler: ReactiveCommandHandler, title: string) {
  commandHandler.setTitle(`${commandHandler.currentWindow.caption} - ${title}`);
}

export function promisify<T = any>(ajaxResponse: __Didgah_Ajax.AjaxResponse) {
  return new Promise<T>((resolve, reject) => {
    ajaxResponse.then(resolve).fail(reject);
  });
}

interface BuilderArgs {
  routeParts: string[];
  delimiter?: string;
  queryStringParts: string[];
}

export function urlBuilder({ delimiter = '/', queryStringParts, routeParts }: BuilderArgs): string | null {
  let url = '/';

  const hasQueryString = !!queryStringParts && queryStringParts.length;
  const hasUrlPart = !!routeParts && routeParts.length;

  if (hasUrlPart) {
    routeParts.forEach((urlPart: string, index: number) => {
      const sanitizedValue = sanitizePart({ part: urlPart, delimiter: '/' });
      url += sanitizedValue + (index === routeParts.length - 1 ? '' : `${delimiter}`);
    });

    if (hasQueryString) {
      url += '?';
    }
  }

  if (hasQueryString) {
    if (!hasUrlPart) {
      // Something is wrong here !
      return null;
    }

    queryStringParts.forEach((queryPart: string, index: number) => {
      const sanitizedValue = sanitizeQueryStringPart({ part: queryPart });
      url += sanitizedValue + (index === queryStringParts.length - 1 ? '' : `&`);
    });
  }

  return url;
}

function sanitizePart({ part, delimiter }: { part: string; delimiter: string; }) {
  if (!part) {
    return '';
  }

  let result = '';
  const atomicParts = part.split(delimiter);
  const sanitizedParts = atomicParts.filter(p => p !== '');

  sanitizedParts.forEach((urlPart: string, index: number) => {
    result += urlPart + (index === sanitizedParts.length - 1 ? '' : `${delimiter}`);
  });

  return result;
}

function sanitizeQueryStringPart({ part }: { part: string; }) {
  return sanitizePart({ part, delimiter: '&' });
}

export function handleErrors(errors: ErrorType) {
  Modal.error(
    object.assign({
      content: translate(`${ErrorType[errors]}`),
    })
  );
}

export function colSizeSetter(labelColSpan: number, wrapperColSpan: number = labelColSpan) {
  return {
    labelCol: { span: labelColSpan },
    wrapperCol: { span: wrapperColSpan },
  };
}

export const removeDuplicatesByProperty = <T, K extends keyof T>(inputList: T[], property: K): T[] => {
  const uniqueValues = new Set<T[K]>();
  const nonDuplicatedList: T[] = [];

  for (const obj of inputList) {
    const value = obj[property];
    if (value === undefined || !uniqueValues.has(value)) {
      uniqueValues.add(value);
      nonDuplicatedList.push(obj);
    }
  }

  return nonDuplicatedList;
};

export function buildEnumDataSource(enumObject, softwareGuid: string, startIndex: number, addEmptyItem = false): Array<SelectItem> {
  let typeDataSource = [];
  let numberValues = [], stringValues = [];

  if (addEmptyItem) {
    typeDataSource.push({
      key: '',
      value: ''
    });
  }

  for (let type in enumObject) {

    if (!isNaN(Number(type))) {
      numberValues.push(type);
    }
    else {

      let translatedValue = type;

      try {
        translatedValue = getString(type, softwareGuid);
      }
      catch { }

      stringValues.push(translatedValue);
    }

  }

  for (let i = startIndex; i < numberValues.length; i++) {
    typeDataSource.push({
      key: stringValues[i].toString(),
      value: Number(numberValues[i]).toString()
    });
  }

  return typeDataSource
}
export function createValidator() {
  return {
    isValidSsn(ssn: string, type: NationalityValidatorType) {
      if (type == NationalityValidatorType.IranianNationalityValidator) {
        if (!ssn) {
          return false
        }
        if (!/^(?!([0-9])\1{9})\d{10}$/.test(ssn)) {
          return false;
        }
        const check = parseInt(ssn.substring(9, 10), 10);
        const sum = Array.from({ length: 9 }, (_, x) =>
          parseInt(ssn.charAt(x), 10) * (10 - x)
        ).reduce((acc, val) => acc + val, 0) % 11;
        return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
      }
      return true
    },

    isValidEconomicalUniqueId(economicalUniqueId: string, type: NationalityValidatorType) {
      if (!economicalUniqueId) {
        return false
      }
      if (type === NationalityValidatorType.IranianNationalityValidator) {

        if (economicalUniqueId.length !== 11 || economicalUniqueId === "0") {
          return false;
        }

        const controlNumber = parseInt(economicalUniqueId.substring(10, 11), 10);
        const tensNumber = parseInt(economicalUniqueId.substring(9, 10), 10) + 2;
        const factorNumbers = [29, 27, 23, 19, 17, 29, 27, 23, 19, 17];
        const tenLeftNumbers = economicalUniqueId.substring(0, 10);

        let sum = 0;
        for (let index = 0; index < 10; index++) {
          const leftNumber = parseInt(tenLeftNumbers.charAt(index), 10);
          sum += (leftNumber + tensNumber) * factorNumbers[index];
        }

        let mod = sum % 11;
        mod = mod === 10 ? 0 : mod;

        return mod === controlNumber;
      }
      return true
    },
    isValidWorkshopCode(workshopCode: string) {
      if (!workshopCode) {
        return true
      }
      else if (workshopCode.length !== 10) {
        return false;
      }
      else {
        return true
      }
    }
  }
}

export function useRebrandIcons(): boolean {
    return General.UseRebrandIcons
}
