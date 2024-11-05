export const GenderOptions = ["male", "female"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "Ali Hassan",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Fatima Khan",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "Umar Farooq",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Bilal Ahmed",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Aisha Siddiqui",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Rizwan Malik",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Sadia Ali",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Zainab Mirza",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hamza Sheikh",
  },
];


export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};