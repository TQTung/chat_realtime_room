import { lazy } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import PublicRoute from "../components/PublicRoute";
import SettingPage from "../pages/SettingPage";
import PrivateRoute from "../components/PrivateRoute";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import { HomePageContextProvider } from "../context/homePageContext";

const Signup = lazy(() => import("../pages/SignupPage"));
const Signin = lazy(() => import("../pages/SigninPage"));

const routes: RouteObject[] = [
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <Signin />
      </PublicRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      // <PublicRoute>
      <SettingPage />
      // </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <HomePageContextProvider>
          <HomePage />
        </HomePageContextProvider>
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
];

const Router = () => {
  const elements = useRoutes(routes);
  return elements;
};

export default Router;
