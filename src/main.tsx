import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx';
import NotFound from './pages/notfound/NotFound.tsx';
import SignIn from './pages/signin/SignIn.tsx';
import SignUp from './pages/signup/SignUp.tsx';
import Store from './pages/store/Store.tsx';
import TopUp from './pages/topup/TopUp.tsx';
import TopUpCode from './pages/topup/code/TopUpCode.tsx';
import Profile from './pages/profile/Profile.tsx';
import Product from './pages/product/Product.tsx';

import Dashboard from './pages/dashboard/Dashboard.tsx';
import CodeDashboard from './pages/dashboard/code/CodeDashboard.tsx';
import UserDashboard from './pages/dashboard/user/UserDashboard.tsx';
import ProductDashboard from './pages/dashboard/product/ProductDashboard.tsx';
import StockDashboard from './pages/dashboard/stock/StockDashboard.tsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/store",
    element: <Store />,
  },
  {
    path: "/topup",
    element: <TopUp />,
  },
  {
    path: "/topup/code",
    element: <TopUpCode />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/code",
    element: <CodeDashboard />,
  },
  {
    path: "/dashboard/user",
    element: <UserDashboard />,
  },
  {
    path: "/dashboard/product",
    element: <ProductDashboard />,
  },
  {
    path: "/dashboard/stock",
    element: <StockDashboard />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)