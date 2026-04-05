import React from "react";
import { DidgahContextProvider } from "didgah/ant-core-component";
import { DDM_LayoutRenderer } from "./Core.DynamicDataModel/Renderer";
import { useDDMFormRenderer } from "./Core.DynamicDataModel/Renderer/shared/sharedDDMFormRendererHook";
import { WidgetType } from "./typings/Core.DynamicDataModel/Enums";
import { mockAjax } from "./mocks/ajax";
import { DEMO_LAYOUT_GUID } from "./mockData";

// ── Context provided to the renderer (uses mock ajax so no real server needed)
const appContext = { ajax: mockAjax };

// ── Prop types ────────────────────────────────────────────────────────────────

interface LayoutPrimaryModel {
  PrimaryGuid?: string;
  LayoutGuid: string;
  IsAdd: boolean;
}

interface Props {
  layoutPrimaryModel: LayoutPrimaryModel;
  getDDMData: (fn: any) => void;
  readOnly?: boolean;
}

// ── DDMRender — thin wrapper around DDM_LayoutRenderer ────────────────────────
//
// Exposes getFormData via the getDDMData callback so the parent can retrieve
// the current form values (e.g. on a Save button click).
//
function DDMRender({
  layoutPrimaryModel: { PrimaryGuid, LayoutGuid, IsAdd },
  getDDMData,
  readOnly,
}: Props) {
  const { store, getFormData } = useDDMFormRenderer();

  React.useEffect(() => {
    getDDMData(getFormData as any);
  }, []);

  return (
    <DDM_LayoutRenderer
      primaryKey={PrimaryGuid}
      layoutGuid={LayoutGuid}
      mode={IsAdd ? "add" : "edit"}
      inLoadableMode={true}
      store={store}
      widgetsMode={readOnly ? WidgetType.DisplayWidget : WidgetType.EditWidget}
    />
  );
}

// ── App — root demo component ─────────────────────────────────────────────────

export default function App() {
  const getDataRef = React.useRef<any>(null);

  function handleGetDDMData(fn: any) {
    getDataRef.current = fn;
  }

  async function handleSave() {
    if (!getDataRef.current) return;
    try {
      const data = await getDataRef.current();
      console.log("[Demo] Form data:", data);
      alert("Form data logged to console.");
    } catch (e) {
      console.error("[Demo] Validation failed:", e);
    }
  }

  return (
    <DidgahContextProvider value={appContext}>
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          padding: "24px",
          direction: "rtl",
          fontFamily: "Tahoma, Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "24px 32px",
          }}
        >
          <h2 style={{ marginBottom: 24, color: "#1677ff" }}>
            DynamicDataModel Demo — فرم۴
          </h2>

          <DDMRender
            layoutPrimaryModel={{
              PrimaryGuid: undefined,
              LayoutGuid: DEMO_LAYOUT_GUID,
              IsAdd: true,
            }}
            getDDMData={handleGetDDMData}
            readOnly={false}
          />

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-start" }}>
            <button
              onClick={handleSave}
              style={{
                padding: "8px 24px",
                background: "#1677ff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ذخیره (Get Form Data)
            </button>
          </div>
        </div>
      </div>
    </DidgahContextProvider>
  );
}
