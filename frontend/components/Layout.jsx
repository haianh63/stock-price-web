import { Outlet } from "react-router-dom";
import logo from "../src/assets/doge.png";
import { Link } from "react-router-dom";
function Layout() {
  return (
    <div>
      <header className="mx-10 my-6 hover:cursor-pointer">
        <Link to="/" className="flex items-center gap-3">
          <img className="w-10 h-10" src={logo} alt="logo" />
          <p className="font-bold text-2xl">STOXIE</p>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
