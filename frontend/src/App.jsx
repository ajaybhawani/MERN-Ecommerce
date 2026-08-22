import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import NotFound from "./pages/NotFound.jsx";
import { ToastProvider } from "./components/Toast.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/admin/products", element: <AdminProducts /> },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
