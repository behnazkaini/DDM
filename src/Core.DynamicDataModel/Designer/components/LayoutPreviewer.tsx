import WrapperLayouts from "../../Renderer/components/wrapperLayouts";
import * as React from "react";
import { LayoutValueResponseViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutValueResponseViewModel";
import { LayoutType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutType";
import { WebSoftwareComponentViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.WebSoftwareComponentViewModel";

interface ILayoutPreviewerProps {
  mode: "add" | "edit";
  inLoadableMode: boolean;
  previewInitialDataForDesigner: LayoutValueResponseViewModel;
  layoutGuid: string;
  dataModelGuid: string;
  layoutType: LayoutType;
  designVersion: number;
  webSoftwareComponents: Array<WebSoftwareComponentViewModel>;
}

const LayoutPreviewer = ({
  mode,
  inLoadableMode,
  previewInitialDataForDesigner,
  layoutGuid,
  dataModelGuid,
  layoutType,
  designVersion,
  webSoftwareComponents,
}: ILayoutPreviewerProps) => {
  const [IsLoading, setIsLoading] = React.useState(true);
  const timeoutIndex = React.useRef(null);
  const previousDesignVersion = React.useRef(null);

  if (designVersion !== previousDesignVersion.current) {
    previousDesignVersion.current = designVersion;
    setIsLoading(true);
  }

  React.useEffect(() => {
    timeoutIndex.current = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(timeoutIndex.current);
    }, 500);
  }, [designVersion]);

  return (
    <div>
      {!IsLoading && (
        <WrapperLayouts
          mode={mode}
          inLoadableMode={inLoadableMode}
          previewInitialDataForDesigner={previewInitialDataForDesigner}
          layoutGuid={layoutGuid}
          dataModelGuid={dataModelGuid}
          layoutType={layoutType}
          webSoftwareComponents={webSoftwareComponents}
        ></WrapperLayouts>
      )}
    </div>
  );
};

export default LayoutPreviewer;
