import { useContext } from "react";
import { HomePageContext } from "../context/homePageContext";

export const useHomePage = () => {
  const context = useContext(HomePageContext);

  if (context === null) {
    throw new Error(
      "useHomePage must be used within a HomePageContextProvider"
    );
  }
  return context;
};
