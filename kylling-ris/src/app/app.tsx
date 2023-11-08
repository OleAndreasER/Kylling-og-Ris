import "./app.css";
import Mainpage from "../pages/mainpage/mainpage.tsx";
import { useRoutes } from "react-router-dom";
import LoginPage from "../pages/loginpage/loginpage.tsx";
import RegisterPage from "../pages/loginpage/registerpage.tsx";
import ErrorPage from "../pages/errorpage/errorpage.tsx";

export default function App() {
  const routes = useRoutes([
    { path: "/", element: <Mainpage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "*", element: <ErrorPage /> }
  ]);
  return routes;
}
