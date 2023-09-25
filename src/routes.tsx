import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./pages";
import Navbar from "./Components/Navbar";
import Test from "./Components/Test";
import Role from "./Components/Role";
import AddRole from "./Components/Role/addRole";
import AddUser from "./Components/User/addUser";
import Users from "./Components/User/users";
import AssignPrivileges from "./Components/assigningPrevelges";
import AddDepartment from "./Components/Department/addDepartment";
import Departments from "./Components/Department";
import Tests from "./pages/tests/index";
import AddTest from "./pages/tests/addTest";
import { useState } from "react";
import AddProfile from "./Components/Profile/addProfile";
import Profiles from "./Components/Profile";
import AddPackage from "./Components/Packages/addPackage";
import Packages from "./Components/Packages";
import PriceLists from "./Components/PriceList";
import RefLabs from "./Components/RefLab";
import AddRefLab from "./Components/RefLab/addRefLab";
import RefDoctors from "./Components/refDoctor";
import AddRefDoctor from "./Components/refDoctor/addRefdoctor";
import PatientCreation from "./Components/Patient/patientcreation";
import PatientStatus from "./Components/Patient/patientStatus";
import PatientProfile from "./Components/Patient/profile";

export default function Router1() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      {token && <Navbar setToken={setToken} />}
      {token ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
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
          <Route path="/patient/profile/:id" element={<PatientProfile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      )}
    </>
    // </BrowserRouter>
  );
}
