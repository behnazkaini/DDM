import React from "react";
import { SaveRowViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SaveRowViewModel";

export type FormApiType = {
  store: ({ getterData }: { getterData: SaveRowViewModel[] }) => void;
  getSavedDataWithoutValidation: () => Promise<SaveRowViewModel[] | undefined>;
};

const FormApiContext = React.createContext<FormApiType | null>(null);

export function FormApiProvider({
  value,
  children,
}: {
  value: FormApiType | null;
  children: React.ReactNode;
}) {

  return (
    <FormApiContext.Provider value={value}>
      {children}
    </FormApiContext.Provider>
  );
}

export function useFormApi() {
  const context = React.useContext(FormApiContext);
  return context;
}