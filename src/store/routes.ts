import Departments from '../Components/Department';
import AddDepartment from '../Components/Department/addDepartment';
import Packages from '../Components/Packages';
import AddPackage from '../Components/Packages/addPackage';
import PatientStatus from '../Components/Patient/patientStatus';
import PatientCreation from '../Components/Patient/patientcreation';
import PatientProfile from '../Components/Patient/profile';
import PriceLists from '../Components/PriceList';
import Profiles from '../Components/Profile';
import AddProfile from '../Components/Profile/addProfile';
import RefLabs from '../Components/RefLab';
import AddRefLab from '../Components/RefLab/addRefLab';
import Role from '../Components/Role';
import AddRole from '../Components/Role/addRole';
import Testing from '../Components/Test';
import AddUser from '../Components/User/addUser';
import Users from '../Components/User/users';
import AssignPrivileges from '../Components/assigningPrevelges';
import RefDoctors from '../Components/refDoctor';
import AddRefDoctor from '../Components/refDoctor/addRefdoctor';
import Tests from '../pages/tests';
import AddTest from '../pages/tests/addTest';

export const routes = [
  {
    privilege: 'Department Creation',
    paths: [
      { path: '/department', element: Departments },
      { path: '/department/:id', element: AddDepartment },
    ],
  },
  {
    privilege: 'Test Creation',
    paths: [
      { path: '/tests', element: Tests },
      { path: '/test/:id', element: AddTest },
      { path: '/test', element: Testing },
    ],
  },
  {
    privilege: 'Profile Creation',
    paths: [
      { path: '/profile', element: Profiles },
      { path: '/profile/:id', element: AddProfile },
    ],
  },
  {
    privilege: 'Package Creation',
    paths: [
      { path: '/package', element: Packages },
      { path: '/package/:id', element: AddPackage },
    ],
  },
  {
    privilege: 'Price List Creation',
    paths: [{ path: '/pricelist', element: PriceLists }],
  },
  {
    privilege: 'Ref Lab',
    paths: [
      { path: '/reflab', element: RefLabs },
      { path: '/reflab/:id', element: AddRefLab },
    ],
  },
  {
    privilege: 'Ref Doctor',
    paths: [
      { path: '/refdoctor', element: RefDoctors },
      { path: '/refdoctor/:id', element: AddRefDoctor },
    ],
  },
  {
    privilege: 'Patient Creation',
    paths: [
      { path: '/patient/:id', element: PatientCreation },
      { path: '/patient/profile/:id', element: PatientProfile },
    ],
  },
  {
    privilege: 'Patient Details Edit',
    paths: [],
  },
  {
    privilege: 'Patient Status',
    paths: [{ path: '/order/status', element: PatientStatus }],
  },
  {
    privilege: 'Role Creation',
    paths: [
      { path: '/roles', element: Role },
      { path: '/role/:id', element: AddRole },
    ],
  },
  {
    privilege: 'Assign Privilege',
    paths: [{ path: '/assignprivileges', element: AssignPrivileges }],
  },
  {
    privilege: 'User Creation',

    paths: [
      { path: '/users', element: Users },
      { path: '/user/:id', element: AddUser },
    ],
  },
];
