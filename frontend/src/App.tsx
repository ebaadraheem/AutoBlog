import ArticleDetail from "./components/ArticleDetail";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/description/:id" element={<ArticleDetail />} />
        </Routes>
    </>
  );
};

export default App;
