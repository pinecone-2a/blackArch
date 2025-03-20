import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./app/pages/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    children: [{ path: "Cart", element: <Cart /> }],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
