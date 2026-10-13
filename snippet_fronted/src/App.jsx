
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateSnippet from "./pages/CreateSnippet";
import AllSnippets from "./pages/AllSnippets";
import SnippetDetails from "./pages/SnippetDetails";
import EditSnippet from "./pages/EditSnippet";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/ProtectedRoutes";
import OAuthSuccess from "./pages/OAuthSuccess";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/oauth2/success"
          element={<OAuthSuccess />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/snippets/new" element={<CreateSnippet />} />
          <Route path="/snippets" element={<AllSnippets />} />
          <Route path="/snippets/:snippetId" element={<SnippetDetails />} />
          <Route
            path="/snippets/:snippetId/edit"
            element={<EditSnippet />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

