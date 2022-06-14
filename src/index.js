import { createRoot } from "react-dom/client";

import App from "./App";

import './assets/reset.css';
import './assets/style.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);