export default interface GraphModel {
  type: 'table' | 'column' | 'relation'
  invalid?: boolean;
  invalidField?: string;
}