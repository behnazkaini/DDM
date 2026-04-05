export interface SoftwareScopeStateViewModel {
  softwareGuid: string;
  softwareTitle: string;
  scopes: ScopeStateViewModel[];
}

export  interface ScopeStateViewModel {
  guid: string;
  name: string;
  isShared: boolean;
}

export interface Action {
  type: 'INIT' | 'CURRENT_SOFTWARE_SCOPE' | 'SAVE'
  payload: any;
}