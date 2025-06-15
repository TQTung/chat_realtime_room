import { useContext } from "react";
import { AccountContext } from "../context/account";

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};
