// // import React, { useState, useEffect } from "react";
// // import {
// //   Plus,
// //   Percent,
// //   Search as LucideSearch,
// //   Calendar,
// //   Box,
// //   Eye,
// //   Edit,
// //   Trash2,
// //   Filter,
// //   Loader2,
// //   X
// // } from "lucide-react";

// // // 👇 Using ONLY campaignDiscountApi
// // import { campaignDiscountApi } from "../utils/metadataApi"; 

// // import CampaignForm from "./CampaignForm";
// // import Pagination from "../Components/Pagination";
// // import Swal from "sweetalert2"; 

// // function CampaignCard({ c, onEdit, onDelete }) {
// //   const used = c.budgetUsed || 0;
// //   const total = c.totalBudget || 1;
// //   const percentUsed = Math.round(Math.min(100, (used / total) * 100));

// //   return (
// //     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_6px_18px_rgba(13,38,59,0.04)] w-full">
// //       <div className="flex items-start justify-between">
// //         <div className="flex items-start gap-3">
// //           <div className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-100 bg-green-50 text-green-700">
// //             <Percent size={15} />
// //           </div>
// //           <div>
// //             <h3 className="campaign-inside-head text-[15px] leading-tight">{c.title}</h3>
// //             <div className="text-[10px] uppercase tracking-wide text-gray-700 mt-[2px]">{c.type}</div>
// //           </div>
// //         </div>
// //         <div>
// //           <span className={`inline-block px-3 py-[3px] text-[11px] font-medium rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
// //             {c.status}
// //           </span>
// //         </div>
// //       </div>

// //       <p className="mt-3 card-inside-para text-[#7C3F44]" style={{ lineHeight: "1.4", fontSize: "12px" }}>
// //         {c.description || "No description provided."}
// //       </p>

// //       <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-[#7C3F44]">
// //         <div className="space-y-2">
// //           <div className="flex items-center gap-2">
// //             <Percent size={13} className="text-[#7C3F44]" />
// //             <div>Value: <span className="font-medium text-[#7C3F44]">{c.value}</span></div>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Box size={13} className="text-[#7C3F44]" />
// //             <div className="font-medium">{c.meta.merchant}</div>
// //           </div>
// //         </div>
// //         <div className="space-y-2 text-right">
// //           <div className="flex items-center justify-end gap-2">
// //             <Calendar size={13} className="text-[#7C3F44]" />
// //             <div className="font-medium">{c.meta.ends}</div>
// //           </div>
// //           <div className="flex items-center justify-end gap-2">
// //             <div className="font-medium">{c.meta.card}</div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="mt-3 flex items-center justify-between">
// //         <div className="text-[11px] text-gray-500">Budget Used</div>
// //         <div className="text-[13px] font-medium text-gray-600">{c.budgetDisplay}</div>
// //       </div>

// //       <div className="mt-1">
// //         <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
// //           <div className="h-full rounded-full" style={{ width: `${percentUsed}%`, background: "linear-gradient(90deg,#8b5cf6,#c084fc)" }} />
// //         </div>
// //         <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
// //           <div>{percentUsed}% Used</div>
// //           <div>{(c.transactions || 0).toLocaleString()} transactions</div>
// //         </div>
// //       </div>

// //       <div className="mt-3 border-t border-gray-100" />

// //       <div className="mt-2 flex items-center justify-end text-gray-500 gap-3">
// //         <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="view"><Eye size={15} /></button>
// //         <button className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600" aria-label="edit" onClick={() => onEdit(c.id)}>
// //           <Edit size={15} />
// //         </button>
// //         <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="pause">
// //           <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
// //             <rect x="6" y="4" width="4" height="16" rx="1"></rect>
// //             <rect x="14" y="4" width="4" height="16" rx="1"></rect>
// //           </svg>
// //         </button>
// //         <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500" aria-label="delete" onClick={() => onDelete(c.id)}>
// //           <Trash2 size={15} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function CampaignsPage() {
// //   const [showForm, setShowForm] = useState(false);
// //   const [campaigns, setCampaigns] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0 });

// //   const [editingCampaign, setEditingCampaign] = useState(null);
// //   const [isFetchingDetails, setIsFetchingDetails] = useState(false);
// //   const [isStep1Completed, setIsStep1Completed] = useState(false);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalItems, setTotalItems] = useState(0);
// //   const itemsPerPage = 6;

// //   const LOCAL_STORAGE_KEY = "campaignFormData";

// //   // 1. GET ALL CAMPAIGNS (Uses campaignDiscountApi.getAll)
// //   const fetchCampaigns = async () => {
// //     setLoading(true);
// //     try {
// //       const skip = (currentPage - 1) * itemsPerPage;

// //       const res = await campaignDiscountApi.getAll({
// //         limit: itemsPerPage,
// //         skip: skip,
// //         sort: 'id',
// //         direction: 'desc'
// //       });

// //       const responseData = res.data || {};
// //       const rows = responseData.rows || [];
// //       const total = responseData.total || 0;
      
// //       setTotalItems(total);

// //       // Extract stats from nested campaign object
// //       const active = rows.filter(r => r.campaign?.status === 1).length;
// //       const pending = rows.length - active; 
// //       const rejected = 0; 
// //       setStats({ total: total, active, pending, rejected });

// //       // Map API Response -> UI Card Data
// //       const mappedData = rows.map((item, index) => {
// //         const c = item.campaign || {};
// //         const d = item.discount || {};

// //         // Calculate Value Label
// //         let realValue = ""; 
// //         if (d.discount_amounts && d.discount_amounts.length > 0) {
// //             const amt = d.discount_amounts[0];
// //             if (amt.is_percentage) {
// //                 realValue = `${amt.discount_percentage}%`;
// //             } else {
// //                 realValue = `${amt.discount_amount}`;
// //             }
// //         }

// //         let realCardInfo = "";
// //         if (d.discount_card_types && d.discount_card_types.length > 0) {
// //             realCardInfo = d.discount_card_types.map(t => t.card_type_name).join(", ");
// //         } else if (d.discount_card_networks && d.discount_card_networks.length > 0) {
// //             realCardInfo = d.discount_card_networks.map(n => n.card_network_name).join(", ");
// //         }

// //         return {
// //           id: c.id || `temp-${index}`,
// //           title: c.name || "",
// //           type: (c.type || "").toUpperCase(),
// //           description: c.description || "",
// //           status: c.status === 1 ? "Active" : "Inactive",
// //           budgetDisplay: `${(c.budget_used || 0).toLocaleString()} / ${(c.total_budget || 0).toLocaleString()}`,
// //           budgetUsed: c.budget_used || 0,
// //           totalBudget: c.total_budget || 1, 
// //           transactions: c.transactions_count || 0,
// //           value: realValue, 
// //           meta: {
// //             merchant: c.company_name || c.bank_name || "", 
// //             card: realCardInfo, 
// //             ends: c.end_date ? new Date(c.end_date).toLocaleDateString() : ""
// //           }
// //         };
// //       });

// //       setCampaigns(mappedData);
// //     } catch (err) {
// //       console.error("Failed to fetch campaigns", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCampaigns();
// //   }, [currentPage]);

// //   const handleFormClose = (needsRefresh = false) => {
// //     if (needsRefresh) {
// //         localStorage.removeItem(LOCAL_STORAGE_KEY);
// //         setShowForm(false);
// //         setEditingCampaign(null);
// //         setIsStep1Completed(false);

// //         if (currentPage === 1) fetchCampaigns();
// //         else setCurrentPage(1);
// //         return;
// //     }

// //     if (isStep1Completed) {
// //         const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
// //         let draftId = null;
// //         if (savedData) {
// //             try {
// //                 const parsed = JSON.parse(savedData);
// //                 draftId = parsed.step1?.id;
// //             } catch (e) {}
// //         }

// //         Swal.fire({
// //             title: "Unsaved Progress",
// //             text: "You have an incomplete campaign. Do you want to discard it?",
// //             icon: "warning",
// //             showCancelButton: true,
// //             confirmButtonColor: "#d33",
// //             cancelButtonColor: "#3085d6",
// //             confirmButtonText: "Discard & Close",
// //             cancelButtonText: "Keep Editing"
// //         })
        
// //         .then(async (result) => {
// //             if (result.isConfirmed) {
// //                 // if (draftId && !editingCampaign) {
// //                 //     try {
// //                 //         console.log("Deleting draft ID:", draftId);
// //                 //         // ✅ Uses campaignDiscountApi.delete
// //                 //         await campaignDiscountApi.delete(draftId);
// //                 //     } catch (e) {
// //                 //         console.error("Failed to delete draft", e);
// //                 //     }
// //                 // }
// //                 localStorage.removeItem(LOCAL_STORAGE_KEY);
// //                 setShowForm(false);
// //                 setEditingCampaign(null);
// //                 setIsStep1Completed(false);
// //                 if (currentPage === 1) fetchCampaigns();
// //             }
// //         });

// //     } else {
// //         setShowForm(false);
// //         setEditingCampaign(null);
// //         setIsStep1Completed(false);
// //     }
// //   };

// //   const handlePageChange = (page) => {
// //     setCurrentPage(page);
// //   };

// //   // 2. GET SINGLE CAMPAIGN (Uses campaignDiscountApi.getById)
// //   const handleEdit = async (id) => {
// //     setIsFetchingDetails(true);
// //     try {
// //       const res = await campaignDiscountApi.getById(id);
// //       // The API returns { data: { campaign: ..., discount: ... } }
// //       // Pass res.data directly to CampaignForm
// //       setEditingCampaign(res.data);
// //       setIsStep1Completed(false);
// //       setShowForm(true);
// //     } catch (err) {
// //       console.error("Failed to fetch campaign details", err);
// //       alert("Could not load campaign details.");
// //     } finally {
// //       setIsFetchingDetails(false);
// //     }
// //   };

// //   // 3. DELETE CAMPAIGN (Uses campaignDiscountApi.delete)
// //   const handleDelete = async (id) => {
// //     // if (window.confirm("Are you sure you want to delete this campaign?")) {
// //     //   try {
// //     //     await campaignDiscountApi.delete(id);
// //     //     fetchCampaigns();
// //     //   } catch (err) {
// //     //     console.error("Failed to delete campaign", err);
// //     //     alert("Failed to delete campaign.");
// //     //   }
// //     // }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col pl-5 pr-5 pt-5">
// //       {isFetchingDetails && (
// //         <div className="fixed inset-0 bg-white/50 z-[60] flex items-center justify-center">
// //           <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
// //         </div>
// //       )}

// //       <div className="max-w-[1200px] mx-auto space-y-6 w-full flex-1 flex flex-col">
// //         <div className="flex items-start justify-between">
// //           <div>
// //             <h1 className="head">Campaign Management</h1>
// //             <p className="para mt-3" style={{ fontSize: "12px" }}>Manage discount campaigns, loyalty programs, and promotional offers</p>
// //           </div>

// //           <button
// //             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm ${showForm
// //                 ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// //                 : "btn-primary-violet"
// //               }`}
// //             onClick={() => {
// //               if (showForm) {
// //                 handleFormClose(false);
// //               } else {
// //                 setEditingCampaign(null);
// //                 setIsStep1Completed(false);
// //                 setShowForm(true);
// //               }
// //             }}
// //           >
// //             {showForm ? <X size={16} /> : <Plus size={16} />}
// //             {showForm ? "Close" : "New Campaign"}
// //           </button>
// //         </div>

// //         <CampaignForm
// //           visible={showForm}
// //           initialData={editingCampaign}
// //           onRefresh={fetchCampaigns}
// //           onClose={() => handleFormClose(false)}
// //           onSuccess={() => handleFormClose(true)}
// //           onStep1Complete={() => setIsStep1Completed(true)}
// //         />

// //         {!showForm && (
// //           <div className="flex flex-col flex-1">
// //             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
// //                 <div>
// //                   <p className="text-xs font-medium text-gray-500">Total Request</p>
// //                   <span className="text-[14px] font-medium text-gray-800">{stats.total}</span>
// //                 </div>
// //                 <Calendar size={18} className="text-gray-400" />
// //               </div>
// //               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
// //                 <div>
// //                   <p className="text-xs font-medium text-gray-500">Approved</p>
// //                   <span className="text-[14px] font-medium text-gray-800">{stats.active}</span>
// //                 </div>
// //                 <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Live</span>
// //               </div>
// //               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
// //                 <div>
// //                   <p className="text-xs font-medium text-gray-500">Pending</p>
// //                   <span className="text-[14px] font-medium text-gray-800">{stats.pending}</span>
// //                 </div>
// //                 <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Review</span>
// //               </div>
// //               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
// //                 <div>
// //                   <p className="text-xs font-medium text-gray-500">Rejected</p>
// //                   <span className="text-[14px] font-medium text-gray-800">{stats.rejected}</span>
// //                 </div>
// //                 <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">Blocked</span>
// //               </div>
// //             </section>

// //             <div className="bg-[#FEFFFF] border border-[#F2F3F5] rounded-lg shadow-[0px_4px_8px_0px_#00000006] p-2 mb-6 flex items-center justify-between">
// //               <div className="flex items-center gap-2">
// //                 <div className="relative w-[180px]">
// //                   <LucideSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
// //                   <input type="text" placeholder="Search..." className="pl-8 pr-3 py-[6px] w-full rounded-md text-xs font-normal text-[#64748B] border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
// //                 </div>
// //                 <button className="flex items-center gap-1.5 px-3 py-[6px] rounded-md text-xs font-medium text-[#8B5563] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6]">
// //                   <Filter size={12} className="text-[#8B5563]" /> <span>Type</span>
// //                 </button>
// //                 <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Date Range</button>
// //                 <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Merchant</button>
// //               </div>
// //               <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">{totalItems} campaigns</span>
// //             </div>

// //             {loading ? (
// //               <div className="flex justify-center py-10"><span className="text-gray-500 text-sm">Loading campaigns...</span></div>
// //             ) : (
// //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
// //                 {campaigns.length > 0 ? (
// //                   campaigns.map((c) => (
// //                     <CampaignCard
// //                       c={c}
// //                       key={c.id}
// //                       onEdit={handleEdit}
// //                       onDelete={handleDelete}
// //                     />
// //                   ))
// //                 ) : (
// //                   <div className="col-span-full text-center py-10 text-gray-500 text-sm">No campaigns found.</div>
// //                 )}
// //               </div>
// //             )}

// //             <Pagination
// //               currentPage={currentPage}
// //               totalItems={totalItems}
// //               itemsPerPage={itemsPerPage}
// //               onPageChange={handlePageChange}
// //             />
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Percent,
//   Search as LucideSearch,
//   Calendar,
//   Box,
//   Eye,
//   Edit,
//   Trash2,
//   Filter,
//   Loader2,
//   X
// } from "lucide-react";

// // 👇 Using ONLY campaignDiscountApi
// import { campaignDiscountApi } from "../utils/metadataApi"; 

// import CampaignForm from "./CampaignForm";
// import Pagination from "../Components/Pagination";
// import Swal from "sweetalert2"; 

// function CampaignCard({ c, onEdit, onDelete }) {
//   const used = c.budgetUsed || 0;
//   const total = c.totalBudget || 1;
//   const percentUsed = Math.round(Math.min(100, (used / total) * 100));

//   return (
//     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_6px_18px_rgba(13,38,59,0.04)] w-full">
//       <div className="flex items-start justify-between">
//         <div className="flex items-start gap-3">
//           <div className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-100 bg-green-50 text-green-700">
//             <Percent size={15} />
//           </div>
//           <div>
//             <h3 className="campaign-inside-head text-[15px] leading-tight">{c.title}</h3>
//             <div className="text-[10px] uppercase tracking-wide text-gray-700 mt-[2px]">{c.type}</div>
//           </div>
//         </div>
//         <div>
//           <span className={`inline-block px-3 py-[3px] text-[11px] font-medium rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
//             {c.status}
//           </span>
//         </div>
//       </div>

//       <p className="mt-3 card-inside-para text-[#7C3F44]" style={{ lineHeight: "1.4", fontSize: "12px" }}>
//         {c.description || "No description provided."}
//       </p>

//       <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-[#7C3F44]">
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <Percent size={13} className="text-[#7C3F44]" />
//             <div>Value: <span className="font-medium text-[#7C3F44]">{c.value}</span></div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Box size={13} className="text-[#7C3F44]" />
//             <div className="font-medium">{c.meta.merchant}</div>
//           </div>
//         </div>
//         <div className="space-y-2 text-right">
//           <div className="flex items-center justify-end gap-2">
//             <Calendar size={13} className="text-[#7C3F44]" />
//             <div className="font-medium">{c.meta.ends}</div>
//           </div>
//           <div className="flex items-center justify-end gap-2">
//             <div className="font-medium">{c.meta.card}</div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-3 flex items-center justify-between">
//         <div className="text-[11px] text-gray-500">Budget Used</div>
//         <div className="text-[13px] font-medium text-gray-600">{c.budgetDisplay}</div>
//       </div>

//       <div className="mt-1">
//         <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
//           <div className="h-full rounded-full" style={{ width: `${percentUsed}%`, background: "linear-gradient(90deg,#8b5cf6,#c084fc)" }} />
//         </div>
//         <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
//           <div>{percentUsed}% Used</div>
//           <div>{(c.transactions || 0).toLocaleString()} transactions</div>
//         </div>
//       </div>

//       <div className="mt-3 border-t border-gray-100" />

//       <div className="mt-2 flex items-center justify-end text-gray-500 gap-3">
//         <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="view"><Eye size={15} /></button>
//         <button className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600" aria-label="edit" onClick={() => onEdit(c.id)}>
//           <Edit size={15} />
//         </button>
//         <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="pause">
//           <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//             <rect x="6" y="4" width="4" height="16" rx="1"></rect>
//             <rect x="14" y="4" width="4" height="16" rx="1"></rect>
//           </svg>
//         </button>
//         <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500" aria-label="delete" onClick={() => onDelete(c.id)}>
//           <Trash2 size={15} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function CampaignsPage() {
//   const [showForm, setShowForm] = useState(false);
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0 });

//   const [editingCampaign, setEditingCampaign] = useState(null);
//   const [isFetchingDetails, setIsFetchingDetails] = useState(false);
//   const [isStep1Completed, setIsStep1Completed] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const itemsPerPage = 6;

//   const LOCAL_STORAGE_KEY = "campaignFormData";

//   // 1. GET ALL CAMPAIGNS (Uses campaignDiscountApi.getAll)
//   const fetchCampaigns = async () => {
//     setLoading(true);
//     try {
//       const skip = (currentPage - 1) * itemsPerPage;

//       const res = await campaignDiscountApi.getAll({
//         limit: itemsPerPage,
//         skip: skip,
//         sort: 'id',
//         direction: 'desc'
//       });

//       const responseData = res.data || {};
//       const rows = responseData.rows || [];
//       const total = responseData.total || 0;
      
//       setTotalItems(total);

//       // Extract stats from nested campaign object
//       const active = rows.filter(r => r.campaign?.status === 1).length;
//       const pending = rows.length - active; 
//       const rejected = 0; 
//       setStats({ total: total, active, pending, rejected });

//       // Map API Response -> UI Card Data
//       const mappedData = rows.map((item, index) => {
//         const c = item.campaign || {};
//         const d = item.discount || {};

//         // Calculate Value Label
//         let realValue = ""; 
//         if (d.discount_amounts && d.discount_amounts.length > 0) {
//             const amt = d.discount_amounts[0];
//             if (amt.is_percentage) {
//                 realValue = `${amt.discount_percentage}%`;
//             } else {
//                 realValue = `${amt.discount_amount}`;
//             }
//         }

//         let realCardInfo = "";
//         if (d.discount_card_types && d.discount_card_types.length > 0) {
//             realCardInfo = d.discount_card_types.map(t => t.card_type_name).join(", ");
//         } else if (d.discount_card_networks && d.discount_card_networks.length > 0) {
//             realCardInfo = d.discount_card_networks.map(n => n.card_network_name).join(", ");
//         }

//         return {
//           id: c.id || `temp-${index}`,
//           title: c.name || "",
//           type: (c.type || "").toUpperCase(),
//           description: c.description || "",
//           status: c.status === 1 ? "Active" : "Inactive",
//           budgetDisplay: `${(c.budget_used || 0).toLocaleString()} / ${(c.total_budget || 0).toLocaleString()}`,
//           budgetUsed: c.budget_used || 0,
//           totalBudget: c.total_budget || 1, 
//           transactions: c.transactions_count || 0,
//           value: realValue, 
//           meta: {
//             merchant: c.company_name || c.bank_name || "", 
//             card: realCardInfo, 
//             ends: c.end_date ? new Date(c.end_date).toLocaleDateString() : ""
//           }
//         };
//       });

//       setCampaigns(mappedData);
//     } catch (err) {
//       console.error("Failed to fetch campaigns", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, [currentPage]);

//   const handleFormClose = (needsRefresh = false) => {
//     if (needsRefresh) {
//         localStorage.removeItem(LOCAL_STORAGE_KEY);
//         setShowForm(false);
//         setEditingCampaign(null);
//         setIsStep1Completed(false);

//         if (currentPage === 1) fetchCampaigns();
//         else setCurrentPage(1);
//         return;
//     }

//     // ✅ CHECK: Only show warning if Step 1 is done AND we are NOT in edit mode
//     // If editingCampaign is not null, we skip the warning block
//     if (isStep1Completed && !editingCampaign) {
//         const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
//         let draftId = null;
//         if (savedData) {
//             try {
//                 const parsed = JSON.parse(savedData);
//                 draftId = parsed.step1?.id;
//             } catch (e) {}
//         }

//         Swal.fire({
//             title: "Unsaved Progress",
//             text: "You have an incomplete campaign. Do you want to discard it?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Discard & Close",
//             cancelButtonText: "Keep Editing"
//         })
//         .then(async (result) => {
//             if (result.isConfirmed) {
//                 // if (draftId && !editingCampaign) { ... delete logic ... }
//                 localStorage.removeItem(LOCAL_STORAGE_KEY);
//                 setShowForm(false);
//                 setEditingCampaign(null);
//                 setIsStep1Completed(false);
//                 if (currentPage === 1) fetchCampaigns();
//             }
//         });

//     } else {
//         // If not started OR if we are in Edit Mode, close immediately
//         setShowForm(false);
//         setEditingCampaign(null);
//         setIsStep1Completed(false);
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // 2. GET SINGLE CAMPAIGN (Uses campaignDiscountApi.getById)
//   const handleEdit = async (id) => {
//     setIsFetchingDetails(true);
//     try {
//       const res = await campaignDiscountApi.getById(id);
//       // The API returns { data: { campaign: ..., discount: ... } }
//       // Pass res.data directly to CampaignForm
//       setEditingCampaign(res.data);
//       setIsStep1Completed(false);
//       setShowForm(true);
//     } catch (err) {
//       console.error("Failed to fetch campaign details", err);
//       alert("Could not load campaign details.");
//     } finally {
//       setIsFetchingDetails(false);
//     }
//   };

//   // 3. DELETE CAMPAIGN (Uses campaignDiscountApi.delete)
//   const handleDelete = async (id) => {
//     // if (window.confirm("Are you sure you want to delete this campaign?")) {
//     //   try {
//     //     await campaignDiscountApi.delete(id);
//     //     fetchCampaigns();
//     //   } catch (err) {
//     //     console.error("Failed to delete campaign", err);
//     //     alert("Failed to delete campaign.");
//     //   }
//     // }
//   };

//   return (
//     <div className="min-h-screen flex flex-col pl-5 pr-5 pt-5">
//       {isFetchingDetails && (
//         <div className="fixed inset-0 bg-white/50 z-[60] flex items-center justify-center">
//           <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
//         </div>
//       )}

//       <div className="max-w-[1200px] mx-auto space-y-6 w-full flex-1 flex flex-col">
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="head">Campaign Management</h1>
//             <p className="para mt-3" style={{ fontSize: "12px" }}>Manage discount campaigns, loyalty programs, and promotional offers</p>
//           </div>

//           <button
//             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm ${showForm
//                 ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
//                 : "btn-primary-violet"
//               }`}
//             onClick={() => {
//               if (showForm) {
//                 handleFormClose(false);
//               } else {
//                 setEditingCampaign(null);
//                 setIsStep1Completed(false);
//                 setShowForm(true);
//               }
//             }}
//           >
//             {showForm ? <X size={16} /> : <Plus size={16} />}
//             {showForm ? "Close" : "New Campaign"}
//           </button>
//         </div>

//         <CampaignForm
//           visible={showForm}
//           initialData={editingCampaign}
//           onRefresh={fetchCampaigns}
//           onClose={() => handleFormClose(false)}
//           onSuccess={() => handleFormClose(true)}
//           onStep1Complete={() => setIsStep1Completed(true)}
//         />

//         {!showForm && (
//           <div className="flex flex-col flex-1">
//             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Total Request</p>
//                   <span className="text-[14px] font-medium text-gray-800">{stats.total}</span>
//                 </div>
//                 <Calendar size={18} className="text-gray-400" />
//               </div>
//               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Approved</p>
//                   <span className="text-[14px] font-medium text-gray-800">{stats.active}</span>
//                 </div>
//                 <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Live</span>
//               </div>
//               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Pending</p>
//                   <span className="text-[14px] font-medium text-gray-800">{stats.pending}</span>
//                 </div>
//                 <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Review</span>
//               </div>
//               <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
//                 <div>
//                   <p className="text-xs font-medium text-gray-500">Rejected</p>
//                   <span className="text-[14px] font-medium text-gray-800">{stats.rejected}</span>
//                 </div>
//                 <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">Blocked</span>
//               </div>
//             </section>

//             <div className="bg-[#FEFFFF] border border-[#F2F3F5] rounded-lg shadow-[0px_4px_8px_0px_#00000006] p-2 mb-6 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div className="relative w-[180px]">
//                   <LucideSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
//                   <input type="text" placeholder="Search..." className="pl-8 pr-3 py-[6px] w-full rounded-md text-xs font-normal text-[#64748B] border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
//                 </div>
//                 <button className="flex items-center gap-1.5 px-3 py-[6px] rounded-md text-xs font-medium text-[#8B5563] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6]">
//                   <Filter size={12} className="text-[#8B5563]" /> <span>Type</span>
//                 </button>
//                 <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Date Range</button>
//                 <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Merchant</button>
//               </div>
//               <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">{totalItems} campaigns</span>
//             </div>

//             {loading ? (
//               <div className="flex justify-center py-10"><span className="text-gray-500 text-sm">Loading campaigns...</span></div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
//                 {campaigns.length > 0 ? (
//                   campaigns.map((c) => (
//                     <CampaignCard
//                       c={c}
//                       key={c.id}
//                       onEdit={handleEdit}
//                       onDelete={handleDelete}
//                     />
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-10 text-gray-500 text-sm">No campaigns found.</div>
//                 )}
//               </div>
//             )}

//             <Pagination
//               currentPage={currentPage}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Plus,
  Percent,
  Search as LucideSearch,
  Calendar,
  Box,
  Eye,
  Edit,
  Trash2,
  Filter,
  Loader2,
  X
} from "lucide-react";

// 👇 Using ONLY campaignDiscountApi
import { campaignDiscountApi } from "../utils/metadataApi"; 

import CampaignForm from "./CampaignForm";
import Pagination from "../Components/Pagination";
import Swal from "sweetalert2"; 

function CampaignCard({ c, onEdit, onDelete }) {
  const used = c.budgetUsed || 0;
  const total = c.totalBudget || 1;
  const percentUsed = Math.round(Math.min(100, (used / total) * 100));

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-[0_6px_18px_rgba(13,38,59,0.04)] w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-100 bg-green-50 text-green-700">
            <Percent size={15} />
          </div>
          <div>
            <h3 className="campaign-inside-head text-[15px] leading-tight">{c.title}</h3>
            <div className="text-[10px] uppercase tracking-wide text-gray-700 mt-[2px]">{c.type}</div>
          </div>
        </div>
        <div>
          <span className={`inline-block px-3 py-[3px] text-[11px] font-medium rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {c.status}
          </span>
        </div>
      </div>

      <p className="mt-3 card-inside-para text-[#7C3F44]" style={{ lineHeight: "1.4", fontSize: "12px" }}>
        {c.description || "No description provided."}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-[13px] text-[#7C3F44]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Percent size={13} className="text-[#7C3F44]" />
            <div>Value: <span className="font-medium text-[#7C3F44]">{c.value}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Box size={13} className="text-[#7C3F44]" />
            <div className="font-medium">{c.meta.merchant}</div>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="flex items-center justify-end gap-2">
            <Calendar size={13} className="text-[#7C3F44]" />
            <div className="font-medium">{c.meta.ends}</div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="font-medium">{c.meta.card}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-gray-500">Budget Used</div>
        <div className="text-[13px] font-medium text-gray-600">{c.budgetDisplay}</div>
      </div>

      <div className="mt-1">
        <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${percentUsed}%`, background: "linear-gradient(90deg,#8b5cf6,#c084fc)" }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
          <div>{percentUsed}% Used</div>
          <div>{(c.transactions || 0).toLocaleString()} transactions</div>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-100" />

      <div className="mt-2 flex items-center justify-end text-gray-500 gap-3">
        <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="view"><Eye size={15} /></button>
        <button className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600" aria-label="edit" onClick={() => onEdit(c.id)}>
          <Edit size={15} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-gray-100" aria-label="pause">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          </svg>
        </button>
        <button className="p-1.5 rounded-md hover:bg-red-50 text-red-500" aria-label="delete" onClick={() => onDelete(c.id)}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, rejected: 0 });

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isStep1Completed, setIsStep1Completed] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const LOCAL_STORAGE_KEY = "campaignFormData";

  // 1. GET ALL CAMPAIGNS (Uses campaignDiscountApi.getAll)
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * itemsPerPage;

      const res = await campaignDiscountApi.getAll({
        limit: itemsPerPage,
        skip: skip,
        sort: 'id',
        direction: 'desc'
      });

      const responseData = res.data || {};
      const rows = responseData.rows || [];
      const total = responseData.total || 0;
      
      setTotalItems(total);

      // Extract stats from nested campaign object
      const active = rows.filter(r => r.campaign?.status === 1).length;
      const pending = rows.length - active; 
      const rejected = 0; 
      setStats({ total: total, active, pending, rejected });

      // Map API Response -> UI Card Data
      const mappedData = rows.map((item, index) => {
        const c = item.campaign || {};
        const d = item.discount || {};

        // Calculate Value Label
        let realValue = ""; 
        if (d.discount_amounts && d.discount_amounts.length > 0) {
            const amt = d.discount_amounts[0];
            if (amt.is_percentage) {
                realValue = `${amt.discount_percentage}%`;
            } else {
                realValue = `${amt.discount_amount}`;
            }
        }

        let realCardInfo = "";
        if (d.discount_card_types && d.discount_card_types.length > 0) {
            realCardInfo = d.discount_card_types.map(t => t.card_type_name).join(", ");
        } else if (d.discount_card_networks && d.discount_card_networks.length > 0) {
            realCardInfo = d.discount_card_networks.map(n => n.card_network_name).join(", ");
        }

        return {
          id: c.id || `temp-${index}`,
          title: c.name || "",
          type: (c.type || "").toUpperCase(),
          description: c.description || "",
          status: c.status === 1 ? "Active" : "Inactive",
          budgetDisplay: `${(c.budget_used || 0).toLocaleString()} / ${(c.total_budget || 0).toLocaleString()}`,
          budgetUsed: c.budget_used || 0,
          totalBudget: c.total_budget || 1, 
          transactions: c.transactions_count || 0,
          value: realValue, 
          meta: {
            merchant: c.company_name || c.bank_name || "", 
            card: realCardInfo, 
            ends: c.end_date ? new Date(c.end_date).toLocaleDateString() : ""
          }
        };
      });

      setCampaigns(mappedData);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage]);

  const handleFormClose = (needsRefresh = false) => {
    if (needsRefresh) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setShowForm(false);
        setEditingCampaign(null);
        setIsStep1Completed(false);

        if (currentPage === 1) fetchCampaigns();
        else setCurrentPage(1);
        return;
    }

    // ✅ CHECK: Only show warning if Step 1 is done AND we are NOT in edit mode
    // If editingCampaign is not null, we skip the warning block
    if (isStep1Completed && !editingCampaign) {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let draftId = null;
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                draftId = parsed.step1?.id;
            } catch (e) {}
        }

        Swal.fire({
            title: "Unsaved Progress",
            text: "You have an incomplete campaign. Do you want to discard it?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Discard & Close",
            cancelButtonText: "Keep Editing"
        })
        .then(async (result) => {
            if (result.isConfirmed) {
                // if (draftId && !editingCampaign) { ... delete logic ... }
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setShowForm(false);
                setEditingCampaign(null);
                setIsStep1Completed(false);
                if (currentPage === 1) fetchCampaigns();
            }
        });

    } else {
        // If not started OR if we are in Edit Mode, close immediately
        setShowForm(false);
        setEditingCampaign(null);
        setIsStep1Completed(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 2. GET SINGLE CAMPAIGN (Uses campaignDiscountApi.getById)
  const handleEdit = async (id) => {
    setIsFetchingDetails(true);
    try {
      const res = await campaignDiscountApi.getById(id);
      // The API returns { data: { campaign: ..., discount: ... } }
      // Pass res.data directly to CampaignForm
      setEditingCampaign(res.data);
      setIsStep1Completed(false);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch campaign details", err);
      alert("Could not load campaign details.");
    } finally {
      setIsFetchingDetails(false);
    }
  };

  // 3. DELETE CAMPAIGN (Uses campaignDiscountApi.delete)
  const handleDelete = async (id) => {
    // if (window.confirm("Are you sure you want to delete this campaign?")) {
    //   try {
    //     await campaignDiscountApi.delete(id);
    //     fetchCampaigns();
    //   } catch (err) {
    //     console.error("Failed to delete campaign", err);
    //     alert("Failed to delete campaign.");
    //   }
    // }
  };

  return (
    <div className="min-h-screen flex flex-col pl-5 pr-5 pt-5">
      {isFetchingDetails && (
        <div className="fixed inset-0 bg-white/50 z-[60] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
        </div>
      )}

      <div className="max-w-[1200px] mx-auto space-y-6 w-full flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="head">Campaign Management</h1>
            <p className="para mt-3" style={{ fontSize: "12px" }}>Manage discount campaigns, loyalty programs, and promotional offers</p>
          </div>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm ${showForm
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "btn-primary-violet"
              }`}
            onClick={() => {
              if (showForm) {
                handleFormClose(false);
              } else {
                setEditingCampaign(null);
                setIsStep1Completed(false);
                setShowForm(true);
              }
            }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close" : "New Campaign"}
          </button>
        </div>

        <CampaignForm
          visible={showForm}
          initialData={editingCampaign}
          onRefresh={fetchCampaigns}
          onClose={() => handleFormClose(false)}
          onSuccess={() => handleFormClose(true)}
          onStep1Complete={() => setIsStep1Completed(true)}
        />

        {!showForm && (
          <div className="flex flex-col flex-1">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Request</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.total}</span>
                </div>
                <Calendar size={18} className="text-gray-400" />
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Approved</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.active}</span>
                </div>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Pending</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.pending}</span>
                </div>
                <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Review</span>
              </div>
              <div className="bg-white py-3 px-4 rounded-md shadow-[0px_4px_8px_0px_#00000006] border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-gray-500">Rejected</p>
                  <span className="text-[14px] font-medium text-gray-800">{stats.rejected}</span>
                </div>
                <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">Blocked</span>
              </div>
            </section>

            <div className="bg-[#FEFFFF] border border-[#F2F3F5] rounded-lg shadow-[0px_4px_8px_0px_#00000006] p-2 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-[180px]">
                  <LucideSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input type="text" placeholder="Search..." className="pl-8 pr-3 py-[6px] w-full rounded-md text-xs font-normal text-[#64748B] border border-[#E5E7EB] bg-[#F9FAFB] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-[6px] rounded-md text-xs font-medium text-[#8B5563] bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-[#F3F4F6]">
                  <Filter size={12} className="text-[#8B5563]" /> <span>Type</span>
                </button>
                <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Date Range</button>
                <button className="px-3 py-[6px] rounded-md border border-[#E5E7EB] text-xs font-medium text-[#8B5563] bg-[#F9FAFB] hover:bg-[#F3F4F6]">Merchant</button>
              </div>
              <span className="text-xs font-medium text-[#64748B] whitespace-nowrap">{totalItems} campaigns</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><span className="text-gray-500 text-sm">Loading campaigns...</span></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {campaigns.length > 0 ? (
                  campaigns.map((c) => (
                    <CampaignCard
                      c={c}
                      key={c.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500 text-sm">No campaigns found.</div>
                )}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}