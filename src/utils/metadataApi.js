import api from "./api";

export const metadataApi = {
  // Used in Step 1 (Campaign Details) & Step 5 (Fund Setup)
  getCurrencies: () => {
    return api.get("/dmsapi/metadata/currencies", {
      params: { limit: 100, sort: "code", direction: "asc" },
    });
  },

  // Used in Step 2 (BIN Config) - To select segments you created earlier
  getSegments: () => {
    return api.get("/dmsapi/metadata/segments", {
      params: { limit: 100, sort: "segment_name", direction: "asc" },
    });
  },

  // --- 2. Merchant & Terminal Metadata (For Step 4 - Restrictions) ---

  // Get list of Companies (Merchants)
  getCompanies: (params = {}) => {
    // <-- Accept optional params object
    // Define default parameters, explicitly including skip: 0
    const defaultParams = {
      skip: 0, // Explicitly set skip to 0 by default
      limit: 10, // Keep the default high limit
      sort: "name",
      direction: "asc",
    };

    // Merge defaults with any provided parameters (e.g., limit: 10)
    const finalParams = { ...defaultParams, ...params };

    return api.get("/dmsapi/metadata/companies", {
      params: finalParams,
    });
  },

  // Get Brands for a specific Company
  getBrands: (companyId) => {
    // Use String(companyId) to guarantee the value is a primitive string/number,
    // preventing complex serialization by the API client.
    const cleanCompanyId =
      typeof companyId === "object" && companyId !== null
        ? companyId.id // If it's the full company object, extract the ID
        : companyId; // Otherwise, use the ID directly

    if (!cleanCompanyId) return Promise.resolve({ data: [] });

    return api.get("/dmsapi/metadata/brands", {
      params: {
        // Ensure the API parameter receives a simple, non-object value
        company_id: String(cleanCompanyId),
        limit: 100,
        sort: "name",
        direction: "asc",
      },
    });
  },

  // Get Terminals for a specific Brand
  getTerminals: (brandId) => {
    if (!brandId) return Promise.resolve({ data: [] });
    return api.get("/dmsapi/metadata/terminals", {
      params: {
        brand_id: brandId,
        limit: 100,
        sort: "identifier",
        direction: "asc",
      },
    });
  },

  // --- 3. MCC Metadata (For Step 4 - Restrictions) ---

// ✅ CORRECTED API FUNCTION
getMccs: (params = {}) => {
  return api.get("/dmsapi/metadata/mccs", {
    params: { 
      limit: 6, 
      sort: "code", 
      direction: "asc",
      ...params // ✅ This merges your 'skip' value into the request
    },
  });
},

  getMccGroups: () => {
    return api.get("/dmsapi/metadata/mcc-groups", {
      params: { limit: 100, sort: "group_name", direction: "asc" },
    });
  },

  getCardTypes: (params = {}) => {
    return api.get("/dmsapi/metadata/card-types", {
      params: { 
        skip: 0,
        limit: 10, 
        sort: "name", 
        direction: "asc", 
        ...params // Merges overrides like { skip: 10 }
      },
    });
  },

  getCardNetworks: (params = {}) => {
    return api.get("/dmsapi/metadata/card-networks", {
      params: { 
        skip: 0,
        limit: 12, 
        sort: "name", 
        direction: "asc", 
        ...params // Merges overrides like { skip: 10 }
      },
    });
  },



  getCampaignTypes: () => {
    return api.get("/dmsapi/metadata/campaign-types", {
      params: { limit: 100 },
    });
  },

  getCampaignStatuses: () => {
    return api.get("/dmsapi/metadata/campaign-statuses", {
      params: { limit: 100 },
    });
  },
};

export const segmentApi = {
  getAll: (params = {}) => {
    const defaultParams = {
      skip: 0,
      limit: 10,
      sort: "id", // Default sort updated as requested
      direction: "desc",
    };

    const finalParams = { ...defaultParams, ...params };

    return api.get("/dmsapi/segments", {
      params: finalParams,
    });
  },

  getById: (id) => {
    return api.get(`/dmsapi/segments/${id}`);
  },

  create: (payload) => {
    return api.post("/dmsapi/segments", payload);
  },

  update: (id, payload) => {
    return api.put(`/dmsapi/segments/${id}`, payload);
  },

  delete: (id) => {
    return api.delete(`/dmsapi/segments/${id}`);
  },
};

export const campaignApi = {
  getCampaigns: (params) => {
    // The 'params' object should contain { limit, skip, sort, direction }
    // Example usage in component: getCampaigns({ limit: 10, skip: 0, sort: 'id', direction: 'desc' })
    return api.get("/dmsapi/acquirer-campaigns", { params });
  },

  // STEP 1: Create the Campaign Container
  createCampaign: (payload) => {
    return api.post("/dmsapi/acquirer-campaigns", payload);
  },

  // STEP 1 (Edit Mode): Update the Campaign Container
  updateCampaign: (id, payload) => {
    return api.put(`/dmsapi/acquirer-campaigns/${id}`, payload);
  },

  // STEP 5: Create the Discount Rule (Linking Segments & Shares)
  createDiscount: (payload) => {
    return api.post("/dmsapi/discounts", payload);
  },

  // Optional: Get details if needed
  getCampaignById: (id) => {
    return api.get(`/dmsapi/acquirer-campaigns/${id}`);
  },

  approveCampaign: (id) => {
    return api.post(`/dmsapi/acquirer-campaigns/${id}/approve`);
  },
  updateCampaign: (id, payload) => {
    return api.put(`/dmsapi/acquirer-campaigns/${id}`, payload);
  },
  updateDiscount: (discountId, payload) => {
    return api.put(`/dmsapi/discounts/${discountId}`, payload);
  },
  getDiscounts: (params) => {
    return api.get("/dmsapi/discounts", { params });
  },
  getDiscountById: (id) => {
    // Corresponds to the URL pattern: {{baseUrl}}/dmsapi/discounts/3
    return api.get(`/dmsapi/discounts/${id}`);
  },
  deleteDiscount: (id) => {
    return api.delete(`/dmsapi/discounts/${id}`);
  },
};

export const campaignDiscountApi = {
  getAll: (params = {}) => {
    const defaultParams = {
      skip: 0,
      limit: 10,
      sort: "id",
      direction: "asc",
    };

    const finalParams = { ...defaultParams, ...params };

    return api.get("/dmsapi/campaign-discounts", {
      params: finalParams,
    });
  },

  getById: (id) => {
    return api.get(`/dmsapi/campaign-discounts/${id}`);
  },

  create: (payload) => {
    return api.post("/dmsapi/campaign-discounts", payload);
  },

  update: (id, payload) => {
    return api.put(`/dmsapi/campaign-discounts/${id}`, payload);
  },

  delete: (id) => {
    return api.delete(`/dmsapi/campaign-discounts/${id}`);
  },

  makerSubmit: (id, payload = {}) => {
    return api.post(`/dmsapi/campaigns/${id}/submit`, payload);
  },
  makerPause: (id) => {
    return api.post(`/dmsapi/campaigns/${id}/pause`);
  },

  // ✅ New Maker Resume API
  makerResume: (id) => {
    return api.post(`/dmsapi/campaigns/${id}/resume`);
  },
  
};


export const discountCheckerApi = {
  // 1. Approve Campaign
  // URL: {{baseUrl}}/dmsapi/campaigns/:id/approve?comments=...
  approve: (id, comments) => {
    return api.post(`/dmsapi/campaigns/${id}/approve`, null, {
      params: { comments: comments }
    });
  },


  reject: (id, comments) => {
    return api.post(`dmsapi/campaigns/${id}/reject`, null, {
      params: { comments: comments }
    });
  },


  approveDelete: (id, comments) => {
    return api.post(`/dmsapi/campaigns/${id}/delete-approve`, null, {
      params: { comments: comments }
    });
  },


  rejectDelete: (id, comments) => {
    return api.post(`/dmsapi/campaigns/${id}/delete-reject`, null, {
      params: { comments: comments }
    });
  },
};

