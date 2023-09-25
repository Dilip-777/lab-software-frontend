export {};

declare global {
  interface headcell {
    id: string;
    label: string;
    align?: "right" | "left" | "center";
    minWidth?: number;
    nested?: string;
    editor?: boolean;
  }

 interface User {
  id: number;
  username: string;
  phonenumber: string;
  password: string;
  rolename: string;
  roleId: number;
  role: Role;
}

interface Role {
  id: number;
  name: string;
  previliges: Privilege[];
  users: User[];
}

interface Department {
  id: number;
  name: string;
  doctor: string;
  doctorSignature: string;
  tests: Test[];
}

interface Test {
  id: number;
  name: string;
  testcode?: string | null;
  departmentId?: number | null;
  departmentName?: string | null;
  sampletype?: string | null;
  container?: string | null;
  samplesize?: string | null;
  sampleunit?: string | null;
  reportwithin?: string | null;
  reportwithinType?: string | null;
  testmethodtype?: string | null;
  regularprice: number;
  note?: string | null;
  profile: Profile[];
  package: Package[];
  referencesValues: Reference[];
  pricelist: PriceList[];
  department: Department | null;
}

interface Profile {
  id: number;
  name: string;
  testcode?: string | null;
  testnames?: string | null;
  sampletype?: string | null;
  sampleunit?: string | null;
  container?: string | null;
  samplesize?: string | null;
  reportwithin?: string | null;
  reportwithinType?: string | null;
  regularprice: number;
  note?: string | null;
  test: Test[];
  package: Package[];
  pricelist: PriceList[];
}

interface Package {
  id: number;
  name: string;
  sampletype?: string | null;
  container?: string | null;
  samplesize?: string | null;
  sampleunit?: string | null;
  reportwithin?: string | null;
  reportwithinType?: string | null;
  regularprice: number;
  note?: string | null;
  test: Test[];
  profile: Profile[];
  pricelist: PriceList[];
}

interface PriceList {
  id: number;
  label: string;
  price: number;
  profileprice: number;
  packageprice: number;
  testId?: number | null;
  test?: Test | null;
  profileId?: number | null;
  profile?: Profile | null;
  packageId?: number | null;
  package?: Package | null;
}

interface Reference {
  id: number;
  gender: string;
  minAge: number;
  maxAge: number;
  lowerValue: number;
  upperValue: number;
  unit: string;
  testId: number;
  test: Test;
}

interface RefLab {
  id: number;
  diagonsticname: string;
  phonenumber: string;
  emailId: string;
  address?: string | null;
  autoselectpricelist: string;
  autoreportsendmode: string;
  autoreporttype: boolean;
  reporttype?: string | null;
  customisedletterhead: boolean;
  letterhead?: string | null;
  orders: Order[];
}

interface RefDoctor {
  id: number;
  doctorname: string;
  specialisation?: string | null;
  phonenumber: string;
  emailId: string;
  percentage: number;
  autoselectpricelist: string;
  autoreportsendmode: string;
  autoreporttype: boolean;
  reporttype?: string | null;
  customisedletterhead: boolean;
  letterhead?: string | null;
  orders: Order[];
}

interface Order {
  id: number;
  orderDate: Date;
  patientId: number;
  patient: Patient;
  doctorId?: number | null;
  doctor?: RefDoctor | null;
  labId?: number | null;
  lab?: RefLab | null;
  tests: OrderTest[];
  profiles: OrderProfile[];
  packages: OrderPackage[];
  totalamount: number;
  discount: number;
  discountType?: string | null;
  netamount: number;
  paymentmethod: string;
  paidamount: number;
  balanceamount: number;
  remarks?: string | null;
  bill?: string | null;
  orderstatus: string;
}

interface OrderProfile {
  id: number;
  orderId?: number | null;
  packageId?: number | null;
  name: string;
  sampletype?: string | null;
  samplesize?: string | null;
  sampleunit?: string | null;
  reportwithin?: string | null;
  price?: number | null;
  note?: string | null;
  package?: OrderPackage | null;
  tests: OrderTest[];
  order?: Order | null;
}

interface OrderPackage {
  id: number;
  orderId: number;
  name: string;
  sampletype?: string | null;
  samplesize?: string | null;
  sampleunit?: string | null;
  reportwithin?: string | null;
  price: number;
  note?: string | null;
  profiles: OrderProfile[];
  tests: OrderTest[];
  order: Order;
}

interface OrderTest {
  id: number;
  orderId?: number | null;
  name: string;
  sampletype?: string | null;
  samplesize?: string | null;
  sampleunit?: string | null;
  reportwithin?: string | null;
  testmethodtype?: string | null;
  price: number;
  note?: string | null;
  highlight?: string | null;
  heading?: string | null;
  referenceValue?: number | null;
  observedValue?: number | null;
  profileId?: number | null;
  profile?: OrderProfile | null;
  packageId?: number | null;
  package?: OrderPackage | null;
  order?: Order | null;
  testId: number;
  test: Test;
}

interface Patient {
  id: number;
  name: string;
  nameprefix?: string | null;
  identityNumber?: string | null;
  identityType?: string | null;
  gender: string;
  phonenumber: string;
  emailId: string;
  age: number;
  agesuffix?: string | null;
  address?: string | null;
  orders: Order[];
}

interface Privilege {
  id: number;
  name: string;
  roleId: number;
  role: Role;
}


}
