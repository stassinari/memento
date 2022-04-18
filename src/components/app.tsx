import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="lolz" element={<div>Hic sunt (React XVIII) lolz</div>} />
          <Route path="gags" element={<div>Hic sunt brutte gags</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const Layout = () => {
  return (
    <div>
      <h1>Hic sunt React XVIII!</h1>
      <nav>
        <Link to="lolz">Lolz</Link> | <Link to="gags">Gags</Link>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
