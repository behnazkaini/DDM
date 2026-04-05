import React from 'react';
import { translate, utility } from "didgah/common";
import { AddColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.AddColumnViewModel";
import { ColumnDataType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import Column from "../GraphModels/Column";
import Table from "../GraphModels/Table";
import { ColumnPropertiesForm } from '../Components/ColumnProperties';
import { RelationType } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType';
import { RelationViewModel } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RelationViewModel';
import Relation from '../GraphModels/Relation';
import LinkData from '../GraphModels/LinkData';
import { RelationNature } from '../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature';

export type ModelerErrorType = {
  guid: string;
  name: string;
  message: string;
  type: 'Table' | 'Column';
  errorType: 'FormValidation' | 'GoValidation'
}


export function getNewTable(scopeGuid: string, softwareGuid: string, dataModelType: number): Table {
  const key = utility.newGuid()
  return {
    key: key,
    guid: key,
    name: "Table1",
    softEditable: true,
    hardEditable: true,
    deletable: false,
    type: 'table',
    selected: false,
    added: true,
    label: 'جدول ۱',
    softwareGuid: softwareGuid,
    scopeGuid: scopeGuid,
    relations: [],
    isNew: true,
    dataModelType,
    settings: [],
    columns: [{
      key: utility.newGuid(),
      name: 'Column1',
      bookmark: '',
      dataType: ColumnDataType.Integer,
      editable: true,
      label: 'ستون ۱',
      setting: null,
      type: 'column',
      added: true,
      selected: false,
      tableKey: key,
      bookmarkType: 0
    }]
  }
}

export const validNameRegex = /^[A-Z]{1}[A-za-z0-9]*$/;

export function mapGoJSColumnToViewModel(col: Column): AddColumnViewModel {
  return {
    Guid: col.key,
    Name: col.name,
    Setting: col.setting ? JSON.stringify(mapGoJsSettingToModel(col.setting)) : null,
    Label: col.label,
    Bookmark: col.bookmark,
    DataType: col.dataType,
    BookmarkType: col.bookmarkType
  }
}

export function getErrorsDescription(errors) {
  const paragraphs = [];
  errors.forEach(error => {
    paragraphs.push(<p>نام آیتم: {error.name}</p>)
    paragraphs.push(<p>عنوان خطا: {error.message}</p>)
  })
  return paragraphs;
}


export function getTranslatedFieldName(errorField: keyof ColumnPropertiesForm) {
  let fieldName;
  switch (errorField) {
    case 'name':
      fieldName = 'Title';
      break;
    case 'label':
      fieldName = 'Label';
      break;
    case 'bookmark':
      fieldName = 'Bookmark';
      break;
    case 'maxLength':
      fieldName = 'DDMModelerMaxLength';
      break;
    case 'precision':
      fieldName = 'DDMModelerPrecision';
      break;
    case 'scale':
      fieldName = 'DDMModelerScale';
      break;
  }

  return translate(fieldName)
}


const tableFieldValidation = {
  name: {
    regex: validNameRegex,
    message: translate(`DDMModelerTableNameincorrect`)
  },
  label: {
    required: true
  }
}

const columnFieldValidation = {
  name: {
    regex: validNameRegex,
    message: translate(`DDMModelerColumnNameincorrect`)
  },
  label: {
    required: true
  }
}

const relationFieldValidation = {
  name: {
    regex: validNameRegex,
  },
  label: {
    required: true
  }
}

function getRequiredError(guid, name, field, data) {
  return {
    guid,
    name,
    message: `${getTranslatedFieldName(field)} الزامی است`,
    field: field,
    data: data
  }
}

function validator(values, fieldsValidations) {
  const errors = [];
  for (let field in fieldsValidations) {
    for (let rule in fieldsValidations[field]) {
      switch (rule) {
        case 'regex':
          if (!fieldsValidations[field]['regex'].test(values.name)) {
            errors.push({
              guid: values.guid,
              name: values.name,
              message: fieldsValidations[field]['message'],
              field: field,
              data: values
            });
          }
          break;
        case 'required':
          switch (typeof values[field]) {
            case 'string':
              if (!values[field] || !!!values[field].trim()) {
                errors.push(getRequiredError(values.guid, values.name, field, values))
              }
            default:
              if (!values[field]) {
                errors.push(getRequiredError(values.guid, values.name, field, values))
              }
          }

          break;
        case 'validator':
          const error = fieldsValidations[field]['validator']();
          if (error) {
            errors.push(error);
          }
          break;

      }
    }
  }
  return errors;
}

export function validateTableFields(table: Table) {
  return validator(table, tableFieldValidation);
}

export function validateColumnFields(column: Column, allColumns: Column[]) {
  const errors = validator(column, columnFieldValidation);
  const settingFieldValidation: any = {};
  if (allColumns.filter(col => col.key !== column.key).find(col => col.label === column.label)) {
    errors.push({
      guid: column.guid,
      name: column.name,
      message: translate('DDMModelerDuplicateLabel'),
      field: column,
      data: column
    })
  }

  switch (column.dataType) {
    case ColumnDataType.Decimal:

      settingFieldValidation.precision = {
        validator: () => {
          if (column.setting.scale > column.setting.precision) {
            return (
              {
                guid: column.key,
                name: column.name,
                field: 'precision',
                data: column
              }
            )
          } else {
            return null
          }
        }
      }

      return errors.concat(validator(column.setting, settingFieldValidation).map(error => ({ ...error, data: column })));
    default:
      return errors;
  }
}

export function validateRelationField(relation: LinkData) {
  const errors = validator(relation, relationFieldValidation).map(error => ({ ...error, data: relation }));
  return errors;
}

export function mapSettingToGoJsModel(setting) {
  const parsedSetting: any = { ...setting };
  const goJsSetting: any = {};
  for (let item in parsedSetting) {
    switch (item) {
      case 'MaxLength':
        goJsSetting.maxLength = parsedSetting.MaxLength;
        break;
      case 'Max':
        goJsSetting.max = parsedSetting.Max;
        break;
      case 'Precision':
        goJsSetting.precision = parsedSetting.Precision;
        break;
      case 'Scale':
        goJsSetting.scale = parsedSetting.Scale;
        break;
    }
  }
  return goJsSetting
}

export function mapGoJsSettingToModel(setting) {
  const parsedSetting: any = { ...setting };
  const goJsSetting: any = {};
  for (let item in parsedSetting) {
    switch (item) {
      case 'maxLength':
        goJsSetting.MaxLength = parsedSetting.maxLength;
        break;
      case 'max':
        goJsSetting.Max = parsedSetting.max;
        break;
      case 'precision':
        goJsSetting.Precision = parsedSetting.precision;
        break;
      case 'scale':
        goJsSetting.Scale = parsedSetting.scale;
        break;
    }
  }
  return goJsSetting
}

export function getRelationInfo(relationType: RelationType) {
  let info: { fromLabel: string, toLabel: string };
  switch (relationType) {
    case RelationType.OneToOne:
      info = { fromLabel: '1', toLabel: '1' };
      break;
    case RelationType.OneToMany:
      info = { fromLabel: '1', toLabel: 'n' };
      break;
  }
  return info
}

export function convertRelationToGoJsModel(key: string, relations: RelationViewModel[], tables: Table[]): Relation[] {
  const getSettings = (relation: RelationViewModel) => {
    const tableSettings = tables.find(t => t.guid === relation.ReferenceDataModelGuid)?.settings ?? [];

    if (!relation.Settings?.length) return tableSettings;

    tableSettings.forEach((s: any) => {
      const match = relation.Settings!.find(r => r.Guid === s.Guid);
      if (match) s.Value = match.Value;
    });

    return tableSettings;
  };

  return relations.map(relation => {
    return ({
      guid: relation.Guid,
      tableGuid: key,
      referencedTableGuid: tables.find(table => table.guid === relation.ReferenceDataModelGuid).key,
      relationType: relation.Type,
      relationNature: relation.Nature,
      type: 'relation',
      bookmark: relation.Bookmark,
      label: relation.Label,
      editable: false,
      name: relation.Name,
      bookmarkType: relation.BookmarkType,
      settings: getSettings(relation)
    });
  })
}

export function getLinkDataArrayFromTables(tables: Table[]) {
  const linkDataArray: LinkData[] = [];
  tables.forEach(table => {
    table.relations.forEach(relation => {
      const { fromLabel, toLabel } = getRelationInfo(relation.relationType);
      linkDataArray.push({
        key: relation.guid,
        from: relation.tableGuid,
        to: relation.referencedTableGuid,
        fromLabel,
        toLabel,
        relationType: relation.relationType,
        added: false,
        editable: false,
        label: relation.label,
        bookmark: relation.bookmark,
        type: 'relation',
        deletable: false,
        relationNature: relation.relationNature,
        name: relation.name,
        bookmarkType: relation.bookmarkType,
        settings: relation?.settings ?? []
      })
    })
  });
  return linkDataArray;
}

export function getLinkLabel(nature: RelationNature) {
  switch (Number(nature)) {
    case RelationNature.Composition:
      return 'composition'
    case RelationNature.Aggregation:
      return 'aggregation'
  }
}

export function mapLinkDataToRelationModel(linkData: LinkData): RelationViewModel {
  const { key, label, bookmark, from, to, relationType, relationNature, name, bookmarkType, settings } = linkData;
  return ({
    Guid: key,
    Label: label,
    Bookmark: bookmark,
    ReferenceDataModelGuid: to,
    Type: relationType,
    Nature: relationNature,
    Name: name,
    BookmarkType: bookmarkType,
    Settings: settings.map(s => ({ Guid: s.Guid, Type: s.Type, Value: s.Value }))
  })
}