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

  //   uploadletterhead   Boolean    @default(false)
  // topbottommargin   Boolean   @default(false)
  // testnewpage   Boolean   @default(false)
  // signdepartmentwise   Boolean   @default(false)
  // profilenewpage   Boolean   @default(false)
  // testprofilesamepage   Boolean   @default(false)
  // departmentwise   Boolean   @default(false)
  // disableqrcode  Boolean   @default(false)
  // pagenumber  Boolean   @default(false)
  // showendline  Boolean   @default(false)
  // endlineposition  String?
  // endline    String?

  interface PrintSetting {
    id: number;
    uploadletterhead: boolean;
    letterhead: string | null;
    departmentwisesigns: boolean;
    testnewpage: boolean;
    profilefirst: boolean;
    signdepartmentwise: boolean;
    profilenewpage: boolean;
    testprofilesamepage: boolean;
    departmentwise: boolean;
    commonsigns: boolean;
    disableqrcode: boolean;
    pagenumber: boolean;
    showendline: boolean;
    endlineposition: string | null;
    endline: string | null;
    topmargin: number;
    bottommargin: number;
    leftmargin: number;
    rightmargin: number;
    signs?: Signs[];
  }

  interface Signs {
    id: number;
    specialisation: string | null;
    doctorname: string;
    signature: string | null;
    settingsId: number;
    settings: PrintSetting;
  }

  interface User {
    id: number;
    username: string;
    phonenumber: string | null;
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
    order: number;
    tests: Test[];
  }

  interface Test {
    id: number;
    name: string;
    testcode: string | null;
    departmentId: number | null;
    departmentName: string | null;
    sampletype: string | null;
    container: string | null;
    samplesize: string | null;
    sampleunit: string | null;
    reportwithin: string | null;
    reportwithinType: string | null;
    testmethodtype: string | null;
    regularprice: number;
    note: string | null;
    orderTest: OrderTest[];
    pricelist: PriceList[];
    referencesValues: Reference[];
    department: Department | null;
    package: Package[];
    profile: Profile[];
    formulas: Formulas[];
    headings: Headings[];
  }

  interface Profile {
    id: number;
    name: string;
    testcode: string | null;
    testnames: string | null;
    departmentId: number | null;
    sampletype: string | null;
    sampleunit: string | null;
    container: string | null;
    samplesize: string | null;
    reportwithin: string | null;
    reportwithinType: string | null;
    regularprice: number;
    note: string | null;
    department: Department | null;
    pricelist: PriceList[];
    package: Package[];
    test: Test[];
    formulas: Formulas[];
    orderprofile: OrderProfile[];
    headings: Headings[];
  }

  interface Headings {
    id: number;
    heading: string;
    tests: Test[];
    profileId: number;
    profile: Profile;
  }

  interface Formulas {
    id: number;
    firsttest: string | null;
    firstoperator: string | null;
    secondtest: string | null;
    secondoperator: string | null;
    thirdtest: string | null;
    profileId: number;
    testId: number;
    references: Reference[];
    test: Test;
    profile: Profile;
  }

  interface Package {
    id: number;
    name: string;
    sampletype: string | null;
    departmentId: number | null;
    container: string | null;
    samplesize: string | null;
    sampleunit: string | null;
    reportwithin: string | null;
    reportwithinType: string | null;
    regularprice: number;
    note: string | null;
    pricelist: PriceList[];
    department: Department | null;
    profile: Profile[];
    test: Test[];
    orderpackage: OrderPackage[];
  }

  interface PriceList {
    id: number;
    label: string;
    price: number;
    profileprice: number;
    packageprice: number;
    testId: number | null;
    profileId: number | null;
    packageId: number | null;
    package: Package | null;
    profile: Profile | null;
    test: Test | null;
  }

  interface Reference {
    id: number;
    gender: string;
    minAge: number;
    maxAge: number;
    lowerValue: number;
    upperValue: number;
    unit: string;
    note: string | null;
    testId: number;
    test: Test;
    formulatestId: number | null;
    formulatest: Formulas | null;
  }

  interface RefLab {
    id: number;
    diagonsticname: string;
    phonenumber: string;
    emailId: string;
    address: string | null;
    autoselectpricelist: string;
    autoreportsendmode: string;
    autoreporttype: boolean;
    reporttype: string | null;
    customisedletterhead: boolean;
    letterhead: string | null;
    orders: Order[];
  }

  interface RefDoctor {
    id: number;
    doctorname: string;
    specialisation: string | null;
    phonenumber: string;
    emailId: string;
    percentage: number;
    autoselectpricelist: string;
    autoreportsendmode: string;
    autoreporttype: boolean;
    reporttype: string | null;
    customisedletterhead: boolean;
    letterhead: string | null;
    orders: Order[];
  }

  interface Order {
    id: number;
    orderDate: Date;
    patientId: number;
    doctorId: number | null;
    labId: number | null;
    totalamount: number;
    discount: number;
    discountType: string | null;
    netamount: number;
    paymentmethod: string;
    paidamount: number;
    balanceamount: number;
    remarks: string | null;
    bill: string | null;
    orderstatus: string;
    collectiontime: Date | null;
    processtime: Date | null;
    reporttime: Date | null;
    doctor: RefDoctor | null;
    lab: RefLab | null;
    patient: Patient;
    packages: OrderPackage[];
    profiles: OrderProfile[];
    tests: OrderTest[];
  }

  interface OrderTestHeadings {
    id: number;
    heading: string;
    profileId: number;
    tests: OrderTest[];
    profile: OrderProfile;
  }

  interface OrderProfile {
    id: number;
    orderId: number | null;
    packageId: number | null;
    name: string;
    sampletype: string | null;
    samplesize: string | null;
    sampleunit: string | null;
    reportwithin: string | null;
    price: number;
    note: string | null;
    profileId: number;
    profile: Profile | null;
    order: Order | null;
    package: OrderPackage | null;
    tests: OrderTest[];
    headings: OrderTestHeadings[];
  }

  interface OrderPackage {
    id: number;
    orderId: number | null;
    name: string;
    sampletype: string | null;
    samplesize: string | null;
    sampleunit: string | null;
    reportwithin: string | null;
    price: number;
    note: string | null;
    order: Order | null;
    profiles: OrderProfile[];
    tests: OrderTest[];
    packageId: number | null;
    package: Package | null;
  }

  interface OrderTest {
    id: number;
    orderId: number | null;
    name: string;
    sampletype: string | null;
    samplesize: string | null;
    sampleunit: string | null;
    reportwithin: string | null;
    price: number;
    note: string | null;
    highlight: string | null;
    observedValue: number | null;
    bold: boolean;
    testId: number;
    profileId: number | null;
    packageId: number | null;
    testmethodtype: string | null;
    headingId: number | null;
    heading: OrderTestHeadings | null;
    order: Order | null;
    package: OrderPackage | null;
    profile: OrderProfile | null;
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
