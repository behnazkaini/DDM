import { SaveRowViewModel } from '../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel';
import * as React from 'react';
import { ValidationResult } from '../../typings/Core.DynamicDataModel/Types';

export default function useLayoutRenderer() {

  const getterDataFunctions = React.useRef([]);
  const validationResult = React.useRef<ValidationResult>(null);

  function store({ getterData }: { getterData: any }): any {
    getterDataFunctions.current = getterData;
  }

  async function runGetterSavedData(fn, disableValidation) {
    return new Promise<{ value: SaveRowViewModel, validationValue: ValidationResult }>((resolve, reject) => {
      fn(disableValidation).then(result => {
        resolve({ value: result.value, validationValue: result?.validationResult })
      })
        .catch((error) => reject(error))
    });
  }


  async function getSavedData(disableValidation = false) {
    let savedData: SaveRowViewModel;
    for (let i = 0; i < getterDataFunctions.current.length; i++) {
      const fn = getterDataFunctions.current[i];
      await runGetterSavedData(fn, disableValidation).then(({ value, validationValue }: { value: SaveRowViewModel; validationValue: ValidationResult }) => {
        savedData = value;
        validationResult.current = validationValue
      });
    }
    return savedData;
  }

  async function getSavedDataWithoutValidation() {
    return getSavedData(true)
  }

  function getValidationResult() {
    return validationResult.current;
  }

  return {
    store: { store, getSavedDataWithoutValidation },
    getFormData: getSavedData,
    getFormDataWithoutValidation: getSavedDataWithoutValidation,
    getValidationResult: getValidationResult
  }
}