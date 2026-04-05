/**
 * mocks/antCoreComponent.tsx
 *
 * Shim for  "didgah/ant-core-component"
 *
 * The real package wraps Ant Design v3/v4 (Form.create HOC, getFieldDecorator, etc.)
 * and adds Didgah-specific primitives.  Here we emulate all of that on top of
 * Ant Design v5 so the real Renderer code can run without modification.
 *
 * Exported names must exactly match what the Renderer files import.
 */

import React, { createContext, useContext, useRef } from 'react';
import {
  Form as AntForm,
  Button as AntButton,
  Spin as AntSpin,
  Row as AntRow,
  Col as AntCol,
  Modal as AntModal,
  Alert as AntAlert,
  message,
  Checkbox as AntCheckbox,
  Input as AntInput,
  InputNumber as AntInputNumber,
  Select as AntSelect,
  Switch as AntSwitch,
  Tooltip as AntTooltip,
  DatePicker as AntDatePicker,
  TimePicker as AntTimePicker,
  AutoComplete as AntAutoComplete,
  Radio as AntRadio,
  Card as AntCard,
  Space,
  Popconfirm as AntPopconfirm,
  Tag as AntTag,
  Tabs as AntTabs,
  Menu as AntMenu,
  Dropdown as AntDropdown,
} from 'antd';
import { mockAjax } from './ajax';

// ── Re-export Ant Design primitives unchanged ─────────────────────────────────
export const Button    = AntButton;
export const Spin      = AntSpin;
export const Row       = AntRow;
export const Col       = AntCol;
export const Modal     = AntModal;
export const Alert     = AntAlert;
export const Checkbox  = AntCheckbox;
export const Input     = AntInput;
export const Select    = AntSelect;
export const Switch    = AntSwitch;
export const Tooltip   = AntTooltip;
export const DatePicker = AntDatePicker;
export const TimePicker = AntTimePicker;
export const InputNumber = AntInputNumber;
export const Card = AntCard;

// ── TimePickerEx — Didgah TimePicker extension ───────────────────────────────
export const TimePickerEx = AntTimePicker;

// ── HotkeyInput — keyboard-shortcut capture input ────────────────────────────
export const HotkeyInput: React.FC<{
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  [key: string]: any;
}> = ({ value, onChange, disabled, placeholder, ...rest }) => (
  <AntInput
    value={value}
    onChange={e => onChange?.(e.target.value)}
    disabled={disabled}
    placeholder={placeholder ?? 'Press a key combination…'}
    {...rest}
  />
);

// ── useCommandHandler — no-op hook (command bus, not used in Renderer demo) ──
export function useCommandHandler(_handler?: any): void {}

// ── NumericalInput — Didgah's integer/decimal input, mock as antd InputNumber ──
export const NumericalInput: React.FC<{
  value?: number | null;
  onChange?: (v: number | null) => void;
  disabled?: boolean;
  allowNegativeNumbers?: boolean;
  allowFloatNumbers?: boolean;
}> = ({ value, onChange, disabled, allowFloatNumbers }) => (
  <AntInputNumber
    value={value ?? undefined}
    onChange={onChange}
    disabled={disabled}
    precision={allowFloatNumbers ? undefined : 0}
    style={{ width: '100%' }}
  />
);

// ── Label — display-only text wrapper ─────────────────────────────────────────
export const Label: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span style={{ display: 'inline-block', lineHeight: '32px' }}>{children}</span>
);

// ── DatePickerEx — Jalali/Gregorian date picker shim ─────────────────────────
export const DatePickerEx = AntDatePicker;

// ── DateTimePicker — shim using antd DatePicker with time ────────────────────
export const DateTimePicker = (props: React.ComponentProps<typeof AntDatePicker>) => (
  <AntDatePicker showTime {...props} />
);

// ── Icon — antd v3/v4 icon shim (maps type string to a span) ─────────────────
export const Icon: React.FC<{
  type?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}> = ({ type, style }) => (
  <span
    role="img"
    aria-label={type}
    className={`anticon anticon-${type}`}
    style={style}
  />
);

// ── Message (notification utility) ───────────────────────────────────────────
export const Message = {
  success: (text: string) => message.success(text),
  error:   (text: string) => message.error(text),
  warning: (text: string) => message.warning(text),
  info:    (text: string) => message.info(text),
};

// ── Loadable (lazy-loaded component wrapper) ──────────────────────────────────
export function Loadable({ component: Comp, ...props }: any) {
  return <Comp {...props} />;
}

// ── DidgahContextProps (Didgah app-wide context shape) ────────────────────────
export type DidgahContextProps = {
  ajax: typeof mockAjax;
  commandHandler?: any;
  [key: string]: any;
};

export type IAppContext = DidgahContextProps;

// ── ReactiveCommandHandler — type-only stub ───────────────────────────────────
export type ReactiveCommandHandler = {
  setTitle: (title: string) => void;
  currentWindow: { caption: string };
  getDidgahSoftwares: () => any[];
  [key: string]: any;
};

// ── SelectItem — type-only stub ───────────────────────────────────────────────
export type SelectItem = { key: string; value: string };

// ── widgetFactory — stub (used in LayoutManager import, not called at runtime) ─
export const widgetFactory = null;

const DidgahContext = createContext<DidgahContextProps>({ ajax: mockAjax });

// ── injectContext (HOC — injects DidgahContext as `context` prop) ─────────────
export function injectContext<P extends { context: DidgahContextProps }>(
  WrappedComponent: React.ComponentType<P>
) {
  function InjectedComponent(props: Omit<P, 'context'>) {
    const ctx = useContext(DidgahContext);
    return <WrappedComponent {...(props as P)} context={ctx} />;
  }
  InjectedComponent.displayName = `injectContext(${(WrappedComponent as any).displayName ?? WrappedComponent.name ?? 'Component'})`;
  return InjectedComponent;
}

// ── useAjax ───────────────────────────────────────────────────────────────────
export function useAjax(): typeof mockAjax {
  return mockAjax;
}

// ── WrappedFormUtils (v3/v4 Form API shape) ───────────────────────────────────
export interface WrappedFormUtils<V = any> {
  getFieldValue(name: string): any;
  getFieldsValue(names?: string[]): Record<string, any>;
  setFieldsValue(values: Record<string, any>): void;
  setFieldValue?(name: string, value: any): void;
  validateFields(callback?: (errors: any, values: V) => void): Promise<V>;
  resetFields(names?: string[]): void;
  getFieldError(name: string): string[];
  getFieldDecorator(
    name: string,
    options?: {
      rules?: any[];
      initialValue?: any;
      valuePropName?: string;
      trigger?: string;
    }
  ): (element: React.ReactElement) => React.ReactElement;
}

export type FormComponentProps<V = any> = { form: WrappedFormUtils<V> };

// ── Form (with Form.create HOC) ───────────────────────────────────────────────
//
// The real Renderer code uses:
//   export default Form.create<Props>(config?)(MyComponent)
//   // inside the component:
//   form.getFieldDecorator('field', { rules, initialValue })(<Input />)
//
// We emulate this by:
//   • Form.create() returns a HOC that creates an Ant Design v5 form instance
//   • Passes a WrappedFormUtils adapter down as the `form` prop
//   • getFieldDecorator returns a Form.Item-wrapped element (v5 style)
//
function buildWrappedFormUtils(
  antForm: ReturnType<typeof AntForm.useForm>[0]
): WrappedFormUtils {
  return {
    getFieldValue:  (name) => antForm.getFieldValue(name),
    getFieldsValue: (names?) => antForm.getFieldsValue(names),
    setFieldsValue: (values) => antForm.setFieldsValue(values),
    setFieldValue:  (name, value) => antForm.setFieldValue(name, value),
    validateFields: (callback) => {
      const p = antForm.validateFields();
      if (callback) p.then(v => callback(null, v)).catch(e => callback(e, {}));
      return p;
    },
    resetFields: (names?) => antForm.resetFields(names),
    getFieldError: (name) => antForm.getFieldError(name) as string[],
    getFieldDecorator: (name, options = {}) => (element) => (
      <AntForm.Item
        key={name}
        name={name}
        rules={options.rules}
        initialValue={options.initialValue}
        valuePropName={options.valuePropName ?? 'value'}
      >
        {element}
      </AntForm.Item>
    ),
  };
}

// Extend the real Ant Design Form with a .create() static method
const Form = Object.assign(
  (props: React.ComponentProps<typeof AntForm>) => <AntForm {...props} />,
  {
    ...AntForm,
    // Form.create<Props>(config?)(Component)
    create: <P extends {}>(_config?: any) =>
      (WrappedComponent: React.ComponentType<P & FormComponentProps>) => {
        const FormCreated = (
          props: Omit<P, keyof FormComponentProps>
        ) => {
          const [antFormInstance] = AntForm.useForm();
          const wrappedForm = React.useMemo(
            () => buildWrappedFormUtils(antFormInstance),
            [antFormInstance]
          );

          return (
            <AntForm form={antFormInstance} layout="vertical" style={{ direction: 'rtl' }}>
              <WrappedComponent {...(props as P)} form={wrappedForm} />
            </AntForm>
          );
        };
        FormCreated.displayName = `Form.create(${
          (WrappedComponent as any).displayName ?? WrappedComponent.name ?? 'Component'
        })`;
        return FormCreated;
      },
    Item:    AntForm.Item,
    List:    AntForm.List,
    useForm: AntForm.useForm,
  }
) as typeof AntForm & {
  create: <P extends {}>(config?: any) => (
    C: React.ComponentType<P & FormComponentProps>
  ) => React.FC<Omit<P, keyof FormComponentProps>>;
};

export { Form };

// ── FormLayout (Didgah-specific page layout with action bar) ──────────────────
function FormLayoutRoot({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{children}</div>;
}
function FormLayoutContent({ children }: { children: React.ReactNode }) {
  return <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>{children}</div>;
}
function FormLayoutActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderTop: '1px solid #f0f0f0',
        padding: '12px 16px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}

export const FormLayout = Object.assign(FormLayoutRoot, {
  LayoutContent: FormLayoutContent,
  ActionBar: FormLayoutActionBar,
});

// ── DidgahContext provider (allows nesting) ───────────────────────────────────
export function DidgahContextProvider({
  value,
  children,
}: {
  value: DidgahContextProps;
  children: React.ReactNode;
}) {
  return <DidgahContext.Provider value={value}>{children}</DidgahContext.Provider>;
}

// ── Radio / RadioGroup ────────────────────────────────────────────────────────
export const Radio      = AntRadio;
export const RadioGroup = AntRadio.Group;

// ── AutoCompleteEx — Didgah AutoComplete shim ─────────────────────────────────
export const AutoCompleteEx: React.FC<{
  value?: string;
  onChange?: (v: string) => void;
  dataSource?: { value: string; text: string }[];
  placeholder?: string;
  disabled?: boolean;
  [key: string]: any;
}> = ({ value, onChange, dataSource = [], placeholder, disabled, ...rest }) => (
  <AntAutoComplete
    value={value}
    onChange={onChange as any}
    options={dataSource.map(d => ({ value: d.value, label: d.text }))}
    placeholder={placeholder}
    disabled={disabled}
    style={{ width: '100%' }}
    {...rest}
  />
);

// ── SelectEx — Didgah Select shim (same shape as antd Select) ─────────────────
// The real Didgah SelectEx accepts a `dataSource: { key, value }[]` prop.
// Antd Select uses `options: { value, label }[]` instead — translate here.
export const SelectEx: React.FC<any> = ({ dataSource, options, ...props }) => {
  const resolvedOptions = options ?? dataSource?.map((item: any) =>
    typeof item === 'object' ? { value: item.value ?? item.key, label: item.value ?? item.key } : { value: item, label: item }
  );
  return <AntSelect options={resolvedOptions} {...props} />;
};

// ── StackPanel — simple flex div wrapper ──────────────────────────────────────
export const StackPanel: React.FC<{
  children?: React.ReactNode;
  horizontal?: boolean;
  style?: React.CSSProperties;
  [key: string]: any;
}> = ({ children, horizontal, style, ...rest }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      gap: 4,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

// ── TokenContainer — antd Select in tags/multiple mode ────────────────────────
export const TokenContainer: React.FC<{
  value?: any[];
  onChange?: (v: any[]) => void;
  options?: { value: any; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  [key: string]: any;
}> = ({ value, onChange, options = [], disabled, placeholder, ...rest }) => (
  <AntSelect
    mode="multiple"
    value={value}
    onChange={onChange as any}
    options={options}
    disabled={disabled}
    placeholder={placeholder}
    style={{ width: '100%' }}
    {...rest}
  />
);

// ── CheckboxItem — single checkbox with label ─────────────────────────────────
export const CheckboxItem: React.FC<{
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  value?: any;
  [key: string]: any;
}> = ({ checked, onChange, label, disabled, ...rest }) => (
  <AntCheckbox
    checked={checked}
    onChange={e => onChange?.(e.target.checked)}
    disabled={disabled}
    {...rest}
  >
    {label}
  </AntCheckbox>
);

// ── CheckboxList — list of checkboxes ─────────────────────────────────────────
export const CheckboxList: React.FC<{
  value?: any[];
  onChange?: (v: any[]) => void;
  items?: { key: any; value: string }[];
  disabled?: boolean;
  [key: string]: any;
}> = ({ value = [], onChange, items = [], disabled }) => (
  <AntCheckbox.Group
    value={value}
    onChange={vals => onChange?.(vals as any[])}
    disabled={disabled}
    options={items.map(i => ({ label: i.value, value: i.key }))}
  />
);

// ── CheckboxListStore — observable store stub for CheckboxList ────────────────
export class CheckboxListStore {
  items: { key: any; value: string }[] = [];
  setItems(items: { key: any; value: string }[]) { this.items = items; }
}

// ── SideBar — Didgah sidebar panel (Designer-only) ───────────────────────────
export const SideBar: React.FC<{ children?: React.ReactNode; [key: string]: any }> =
  ({ children, ...rest }) => <div className="mock-sidebar" {...rest}>{children}</div>;

// ── useAppContext — returns app-level context stub ────────────────────────────
export function useAppContext(): any { return {}; }

// ── Passthrough antd exports ──────────────────────────────────────────────────
export const Popconfirm = AntPopconfirm;
export const Tag        = AntTag;
export const Tabs       = AntTabs;
export const Menu       = AntMenu;
export const Dropdown   = AntDropdown;
export const AutoComplete = AntAutoComplete;

// ── CustomIcon — maps a name to a span element ────────────────────────────────
export const CustomIcon: React.FC<{ name?: string; style?: React.CSSProperties; [key: string]: any }> =
  ({ name, style }) => <span role="img" aria-label={name} style={style} className={`custom-icon icon-${name}`} />;

// ── TextViewerField / TextEditorField / TextViewerComponentField (stubs) ──────
export const TextViewerField: React.FC<{ value?: any; [key: string]: any }> =
  ({ value }) => <span>{value ?? ''}</span>;
export const TextEditorField: React.FC<{ value?: any; onChange?: (v: any) => void; [key: string]: any }> =
  ({ value, onChange }) => <AntInput value={value ?? ''} onChange={e => onChange?.(e.target.value)} />;
export const TextViewerComponentField: React.FC<{ value?: any; [key: string]: any }> =
  ({ value }) => <span>{value ?? ''}</span>;

// ── TableEx — stub data table (Designer-only) ─────────────────────────────────
export const TableEx: React.FC<any> = () => null;

// ── Fieldset — labelled section card ─────────────────────────────────────────
export const Fieldset: React.FC<{
  legend?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}> = ({ legend, children, style, ...rest }) => (
  <AntCard
    size="small"
    title={legend}
    style={{ marginBottom: 8, ...style }}
    {...rest}
  >
    {children}
  </AntCard>
);
