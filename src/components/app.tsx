import { css } from "@emotion/react";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import tw from "twin.macro";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="lolz"
            element={
              <div
                css={css`
                  background-color: red;
                `}
              >
                Hic sunt (React XVIII) lolz
                <button tw="btn btn-xs">Button</button>
              </div>
            }
          />
          <Route
            path="gags"
            element={
              <div>
                Hic sunt brutte gags
                <button className="" css={[tw`btn btn-sm`]}>
                  Button
                </button>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const Layout = () => {
  return (
    <div>
      <h1 tw="text-gray-500">Hic sunt React XVIII!</h1>
      <nav>
        <Link to="lolz">Lolz</Link> | <Link to="gags">Gags</Link>
      </nav>
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="40"
        tw="range"
      ></input>
      <input type="checkbox" tw="toggle" defaultChecked></input>
      <div
        tw="radial-progress"
        css={css`
          --value: 70;
        `}
      >
        70%
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
