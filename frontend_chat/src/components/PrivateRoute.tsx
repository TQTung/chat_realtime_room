import { Fragment, type FC } from "react";
import { useAccount } from "../hooks/useAccount";
import { Navigate } from "react-router-dom";

const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { account } = useAccount();
  if (!account) {
    return <Navigate to="/signin" replace />;
  }
  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
