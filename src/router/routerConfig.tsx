import Home from "@/pages/Home";
import Results from "@/pages/Results";

const routerConfig = [
  { path: "/", element: <Home /> },
  {
    path: "/results",
    element: <Results />,
  },
];

export default routerConfig;
