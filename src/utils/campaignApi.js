// import api from "./api"; 

// export const campaignApi = {
  
//   // STEP 1: Create the Campaign Container
//   createCampaign: (payload) => {
//     return api.post("/dmsapi/acquirer-campaigns", payload);
//   },

//   // STEP 1 (Edit Mode): Update the Campaign Container
//   updateCampaign: (id, payload) => {
//     return api.put(`/dmsapi/acquirer-campaigns/${id}`, payload);
//   },

//   // STEP 5: Create the Discount Rule (Linking Segments & Shares)
//   createDiscount: (payload) => {
//     return api.post("/dmsapi/discounts", payload);
//   },

//   // Optional: Get details if needed
//   getCampaignById: (id) => {
//     return api.get(`/dmsapi/acquirer-campaigns/${id}`);
//   },

//   approveCampaign: (id) => {
//     return api.post(`/dmsapi/acquirer-campaigns/${id}/approve`);
//   },
//   updateCampaign: (id, payload) => {
//     return api.put(`/dmsapi/acquirer-campaigns/${id}`, payload);
//   },
//   updateDiscount: (discountId, payload) => {
//     return api.put(`/dmsapi/discounts/${discountId}`, payload);
//   },
// };
