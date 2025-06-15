import { Fragment, type FC } from "react";
import { useAccount } from "../hooks/useAccount";
import { Navigate } from "react-router-dom";

const PublicRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account } = useAccount();
  if (account) {
    return <Navigate to="/" replace />;
  }
  return <Fragment>{children}</Fragment>;
};

export default PublicRoute;
