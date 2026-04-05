i want to refactor Operation on event concept in Renderer Folder in this code , now it is driven on event (when the field chenge the event triggre) and i want refactor to driven on data ,  
 
the init data from api:Layout/GetValueByPrimaryKey is in mockData.ts

```
function DDMRender({ layoutPrimaryModel: { PrimaryGuid, LayoutGuid, IsAdd }, getDDMData, readOnly }: Props) {
  const { store, getFormData } = useDDMFormRenderer();

  React.useEffect(() => {
    getDDMData(getFormData as any);
  }, []);

  return (
    <DDMFormRenderer
      primaryKey={PrimaryGuid}
      layoutGuid={LayoutGuid}
      mode={IsAdd ? 'add' : 'edit'}
      inLoadableMode={true}
      store={store}
      widgetsMode={readOnly ? WidgetType.DisplayWidget : WidgetType.EditWidget}
    />
  );
}
```

Dev server starts in 808 ms. Here's a summary of everything that was implemented:

Option D — Hybrid: AntD Form + Derived-Field Layer — complete

Two new files:

FormValuesStore.ts — plain class, no React; holds fields, gridRows, derived; exposes subscribe/getSnapshot for useSyncExternalStore plus setField(rowKey, value) and setGrid(subLayoutRowKey, rows) which both recompute the derivation graph on every mutation.

derivationParser.ts — buildDerivationGraph(events, layout) converts raw FormEvents[] from the layout Design JSON into a Map<targetRowKey, Derivation>. Supports GridSum (SUM of a grid column) and BlocklyOp (MULTIPLY/ADD/MINUS/DIVIDE) parsed from Blockly XML with a lightweight regex — no Blockly runtime.

Four modified files:

defineLayout.tsx — removed all Blockly imports and the getActions/codes-building loop; setupManagers now calls buildDerivationGraph + new FormValuesStore(graph) and passes store to LayoutContent.

layoutContent.tsx — adds store prop; subscribes with React.useSyncExternalStore; a useEffect pushes snapshot.derived into form.setFieldsValue() whenever derived values change.

useDefineLayoutHook.tsx — script-injection useEffect removed; all eval-based functions (getAction, getActionForSetFieldValue, getActionsList, getSublayoutAction, layoutItemFieldValues) removed; only save/validation logic remains.

recursiveComponents.tsx — handleChange → store.setField(data.rowKey, value); handleChangeSublayout → store.setGrid(data.rowKey, value); setDisabeldFormItem/setRequiredRuleByAction return undefined (no Disabled/Required actions in test data); UseDefineHook interface in Types.ts trimmed to match.
