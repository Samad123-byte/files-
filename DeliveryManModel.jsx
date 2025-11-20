export const deliveryManModel = {
  totalRecordCount: 10,
  deliveryManId: 0,
  companyId: 0,
  shopId: 0,
  name: "",
  mobile: "",
  description: "",
  readOnly: 0,
  sortOrder: 0,
};

export const gridSearchModel = {
  startIndex: 0,
  endIndex: 10,
  shopId: 1,
  name: "",
  mobile: "",
  description: "",
};

export const gridModel = [
  { name: "name", columnType: "string", csvHeader: "Name" },
  { name: "mobile", columnType: "string", csvHeader: "Mobile" },
  { name: "description", columnType: "string", csvHeader: "Description" },
  { name: "store", columnType: "string", csvHeader: "Store" },
];

export const headers = [
  { name: "name", columnType: "string" },
  { name: "mobile", columnType: "string" },
  { name: "description", columnType: "string" },
  { name: "store", columnType: "string" },
];

export const articleModel = [
  {
    articleLink: "https://support.nimbusrms.com/cloud-retail/defining-delivery-men/",
    articleText: "Defining Delivery Man",
  },
];
