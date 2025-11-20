export const gridSearchModel = {
  startIndex: 0,
  endIndex: 10,
 //companyId: 1,
  shopId: 1,
  firstName: "",
  lastName: "",
  mobile1: "",
  mobile2: "",
  description: "",
};

export const gridModel = [
 //{ name: "deliveryManId", columnType: "number", csvHeader: "ID" },
  { name: "firstName", columnType: "string", csvHeader: "First Name" },
 { name: "lastName", columnType: "string", csvHeader: "Last Name" },
 { name: "mobile1", columnType: "string", csvHeader: "Mobile 1" },
  { name: "mobile2", columnType: "string", csvHeader: "Mobile 2" },
  { name: "description", columnType: "string", csvHeader: "Description" },
];

export const headers = [
  //{ name: "deliveryManId", columnType: "number" },
  { name: "firstName", columnType: "string" },
  { name: "lastName", columnType: "string" },
  { name: "mobile1", columnType: "string" },
  { name: "mobile2", columnType: "string" },
  { name: "description", columnType: "string" }
];


export const articleModel = [
  {
    articleLink: "https://support.nimbusrms.com/cloud-retail/defining-delivery-men/",
    articleText: "Defining Delivery Man",
  },
];

export const deliveryManModel = {
  totalRecordCount: 10,
  deliveryManId: 0,
  companyId: 0,
  shopId: 0,
  firstName: "",
  lastName: "",
  mobile1: "",
  mobile2: "",
  description: "",
  readOnly: 0,
  sortOrder: 0,
};
