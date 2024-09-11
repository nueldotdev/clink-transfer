import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { MdAccountCircle, MdDevices, MdFolder } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import './style/Layout.css'; // Optional, for styling
import Logo from "./Logo";


const routes = [
  { path: "/app", element: <GoHomeFill />, name: "Home" },
  { path: "/app/devices", element: <MdDevices />, name: "Devices" },
  { path: "/app/pods", element: <MdFolder />, name: "Pods" },
  { path: "/app/account", element: <MdAccountCircle />, name: "Account" }
]


const Layout = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="layout fixed w-screen">
      {/* SideNav */}
      <aside className={`w-1/5 py-4 relative min-h-screen max-md:hidden bg-[#e9f3f3d0] text-light flex flex-col justify-between transition-all ${isNavOpen ? 'w-1/5' : 'w-fit'}`}>
        <div className="px-6">
          <Logo />

          <div className={`p-2 text-lg text-dark bg-[#e9f3f3d0] transition-all absolute right-[-15px] top-[10px] rounded-lg flex items-center justify-center cursor-pointer`} onClick={() => setIsNavOpen(!isNavOpen)}>
            <FiChevronRight className={`${isNavOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
        <nav className="h-4/6">
          <ul className={`h-full flex flex-col justify-center text-2xl ${isNavOpen ? "" : "text-center"}`}>
            {routes.map((route) => (
              <li key={route.path} className="px-2 text-dark">
                <NavLink
                  to={route.path}
                  end={route.path === "/app"}
                  className={({ isActive }) =>
                    isActive ? `bg-[#40bde431] p-3 mb-3 transition flex items-center gap-x-4 rounded-lg ${isNavOpen ? '' : 'justify-center'}` : `hover:bg-[#40bde431] p-3 mb-3 transition flex items-center gap-x-4 rounded-lg ${isNavOpen ? '' : 'justify-center'}`
                  }
                >
                  <span className="icon">{route.element}</span>
                  <span className={`text ${isNavOpen ? '' : 'hidden'}`}>{route.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <footer>
          <p className={`text-center text-dark`}><span className={`${isNavOpen ? '' : 'hidden'}`}>© 2024 </span>Clink</p>
        </footer>
      </aside>

      {/* Main Content */}
      <main className="main-content h-screen overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
