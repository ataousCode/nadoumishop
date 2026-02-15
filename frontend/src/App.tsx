import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import type { AppDispatch, RootState } from "./store";
import { router } from "./routes";
import { checkAuth, setInitialized } from "./features/auth/authSlice";
import "./index.css";
import { Loader2 } from "lucide-react";

const AppInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(checkAuth());
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <Provider store={store}>
      <AppInit />
    </Provider>
  );
}

export default App;
