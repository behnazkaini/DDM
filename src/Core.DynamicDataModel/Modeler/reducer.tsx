import { DataModelBehaviorInformationViewModel } from "../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModelBehaviorInformationViewModel";
import Column from "./GraphModels/Column";
import LinkData from "./GraphModels/LinkData";
import Table from "./GraphModels/Table";

export type ModelerStore = {
  tables: Table[],
  linkDataArray: LinkData[],
  loading: boolean;
  fetchLoading: boolean;
  selectedItem: Table | Column | LinkData;
  selectLoading: boolean;
  saveLoading: boolean;
  relationDetailModalVisible: boolean;
}

export const initialState: ModelerStore = {
  tables: [],
  linkDataArray: [],
  loading: true,
  fetchLoading: true,
  selectedItem: null,
  selectLoading: false,
  saveLoading: false,
  relationDetailModalVisible: false
}; 

type actionTypes = 'SET_LOADING' | 'SET_BEHAVIOR_INFORMATION' | 'UPDATE_TABLES' | 'SET_INITIAL_DATA' | 'UPDATE_LINKDATAARRAY' | 'UPDATE_TABLES_AND_LINKDATAARRAY' | 'SET_SELECTED_ITEM' | 'SET_SELECT_LOADING' |
'SET_SAVE_LOADING' | 'SET_RELATION_DETAIL_MODAL_VISIBLE' | 'SET_MULTIPLE_STATE';

export default function reducer(state: ModelerStore, action: { type: actionTypes, payload: any }): ModelerStore {
  switch (action.type) {
    case 'SET_INITIAL_DATA':
      return { ...state, tables: action.payload.tables,linkDataArray: action.payload.linkDataArray, fetchLoading: false  };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'UPDATE_TABLES':
      return { ...state, tables: action.payload };
    case 'UPDATE_LINKDATAARRAY':
      return { ...state, linkDataArray: action.payload };
    case 'UPDATE_TABLES_AND_LINKDATAARRAY':
      return { ...state, linkDataArray: action.payload.linkDataArray, tables: action.payload.tables };
    case 'SET_SELECTED_ITEM':
      return {...state, selectedItem: action.payload, selectLoading: true}
    case 'SET_SELECT_LOADING':
        return {...state, selectLoading: action.payload}
    case 'SET_SAVE_LOADING':
        return {...state, saveLoading: action.payload}
    case 'SET_RELATION_DETAIL_MODAL_VISIBLE':
        return {...state, relationDetailModalVisible: action.payload}
    case 'SET_MULTIPLE_STATE':
      return {...state, ...action.payload}
    default:
      return state;
  }
}