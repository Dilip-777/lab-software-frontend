import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Home from './pages';
import Navbar from './Components/Navbar';
import { useEffect, useState } from 'react';
import { routes } from './store/routes';
import { api } from './Api';

export default function Router1() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [privileges, setPrivileges] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user')!);

  const fetchPrivileges = async () => {
    if (user?.roleId) {
      const res = await api.get(`/role/getprivileges?roleid=${user.roleId}`);
      const privileges = res.data.data || [];
      const privilegesArray = privileges.map((privilege: any) => {
        return privilege.name;
      });
      setPrivileges(privilegesArray);
    }
  };

  useEffect(() => {
    fetchPrivileges();
  }, []);

  return (
    <>
      {token && <Navbar setToken={setToken} />}
      {token ? (
        <Routes>
          <Route path="/" element={<Home />} />
          {routes
            .filter((r) => privileges.includes(r.privilege))
            .map((route) =>
              route.paths.map(({ path, element: Component }) => <Route path={path} element={<Component />} />)
            )}
          {/* <Route path="/test" element={<Test />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/role/:id" element={<AddRole />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/:id" element={<AddUser />} />
          <Route path="/assignprivileges" element={<AssignPrivileges />} />
          <Route path="/department/:id" element={<AddDepartment />} />
          <Route path="/department" element={<Departments />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/test/:id" element={<AddTest />} />
          <Route path="/profile/:id" element={<AddProfile />} />
          <Route path="/profile" element={<Profiles />} />
          <Route path="/package/:id" element={<AddPackage />} />
          <Route path="/package" element={<Packages />} />
          <Route path="/pricelist" element={<PriceLists />} />
          <Route path="/reflab" element={<RefLabs />} />
          <Route path="/reflab/:id" element={<AddRefLab />} />
          <Route path="/refdoctor" element={<RefDoctors />} />
          <Route path="/refdoctor/:id" element={<AddRefDoctor />} />
          <Route path="/patient/:id" element={<PatientCreation />} />
          <Route path="/patient/status" element={<PatientStatus />} />
          <Route path="/patient/profile/:id" element={<PatientProfile />} /> */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
    // </BrowserRouter>
  );
}
