import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.scss";
import routerConfig from "./router/routerConfig";
import useWebSocketStore from "./store/webSocketStore";

function App() {
  const router = createBrowserRouter(routerConfig, {
    basename: import.meta.env.BASE_URL,
  });

  const connect = useWebSocketStore((state) => state.connect);

  useEffect(() => {
    connect(`ws://localhost:3000/ws?clientId=${crypto.randomUUID()}`);
  }, [connect]);

  return <RouterProvider router={router} />;
}

export default App;
