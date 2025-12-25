// // // import React, { useState, useEffect } from "react";
// // // import { Trash2, Plus, Loader2 } from "lucide-react";
// // // import Swal from "sweetalert2";
// // // import { campaignDiscountApi } from "../utils/metadataApi"; 
// // // import NvdMarkdownEditor from "./NvdMarkdownEditor"; 
// // // import StepHeader from "../StepReusable/Stepheader";

// // // const Docs = ({ 
// // //   data, 
// // //   onUpdate, 
// // //   onNext, 
// // //   onPrevious, 
// // //   isEditMode, 
// // //   onRefresh, 
// // //   campaignId 
// // // }) => {
// // //   // --- State Management ---
// // //   const [docs, setDocs] = useState([]); 
// // //   const [fetchingDetails, setFetchingDetails] = useState(false);
// // //   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
// // //   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
// // //   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

// // //   const generateId = () => Math.random().toString(36).substring(2, 9);

// // //   // --- 1. Fetch Data Logic ---
// // //   useEffect(() => {
// // //     const fetchDocsData = async () => {
// // //       if (isEditMode && campaignId) {
// // //         setFetchingDetails(true);
// // //         try {
// // //           const res = await campaignDiscountApi.getById(campaignId);
// // //           const existingDocs = res.data?.discount || res.data?.discount_docs || [];
// // //           const actualDocs = Array.isArray(existingDocs) ? existingDocs : res.data?.discount?.discount_docs || [];

// // //           if (actualDocs.length > 0) {
// // //             const docsWithIds = actualDocs.map(item => ({ 
// // //               ...item, 
// // //               uniqueId: item.id || generateId() 
// // //             }));
// // //             setDocs(docsWithIds);
// // //           } else {
// // //             setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
// // //           }
// // //         } catch (error) { 
// // //           console.error("Error fetching docs:", error); 
// // //         } finally { 
// // //           setFetchingDetails(false); 
// // //         }
// // //       } else if (data?.discount_docs?.length > 0) {
// // //         setDocs(data.discount_docs.map(d => ({ ...d, uniqueId: d.uniqueId || generateId() })));
// // //       } else {
// // //         if(docs.length === 0) setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
// // //       }
// // //     };
// // //     fetchDocsData();
// // //   }, [isEditMode, campaignId]);

// // //   // --- 2. Handlers ---
// // //   const handleDocChange = (index, field, value) => {
// // //     const updatedDocs = [...docs];
    
// // //     // Ensure raw text (**bold**) is stored in state
// // //     let finalValue = value;
// // //     if (field === "doc_text") {
// // //       try {
// // //         // Decode Base64 from Editor to Raw Markdown
// // //         finalValue = atob(value);
// // //       } catch (e) {
// // //         finalValue = value;
// // //       }
// // //     }

// // //     updatedDocs[index][field] = finalValue;
// // //     setDocs(updatedDocs);
// // //     onUpdate({ discount_docs: updatedDocs });
// // //   };

// // //   const handleAddRow = () => {
// // //     setDocs([...docs, { doc_name: "", doc_text: "", uniqueId: generateId() }]);
// // //   };

// // //   const handleDeleteRow = (index) => {
// // //     Swal.fire({
// // //       title: "Remove Document?",
// // //       text: "This action cannot be undone.",
// // //       icon: "warning",
// // //       showCancelButton: true,
// // //       confirmButtonColor: "#EF4444",
// // //       confirmButtonText: "Yes, Remove",
// // //       cancelButtonColor: "#6B7280",
// // //     }).then((result) => {
// // //       if (result.isConfirmed) {
// // //         const updatedDocs = docs.filter((_, i) => i !== index);
// // //         setDocs(updatedDocs);
// // //         onUpdate({ discount_docs: updatedDocs });
// // //       }
// // //     });
// // //   };

// // //   // --- 3. Submit Logic ---
// // //   const handleSubmit = async (action) => {
// // //     const validDocs = docs
// // //       .filter(d => d.doc_name?.trim() || d.doc_text?.trim())
// // //       .map(({ uniqueId, ...rest }) => rest);

// // //     const payload = { 
// // //       discount: { 
// // //         discount_docs: validDocs 
// // //       } 
// // //     };

// // //     action === "update" ? setIsUpdateSubmitting(true) : setIsNextSubmitting(true);

// // //     try {
// // //       if (isEditMode || campaignId) {
// // //         await campaignDiscountApi.update(campaignId, payload);
// // //       }
      
// // //       if (action === "update") {
// // //         Swal.fire({ icon: "success", title: "Saved", text: "Docs Updated successfully.", timer: 1500, confirmButtonColor: "#7747EE" });
// // //         if (onRefresh) await onRefresh();
// // //       } else { 
// // //         onNext(); 
// // //       }
// // //     } catch (error) {
// // //       Swal.fire({ icon: "error", title: "Failed", text: error.message });
// // //     } finally {
// // //       setIsUpdateSubmitting(false);
// // //       setIsNextSubmitting(false);
// // //     }
// // //   };

// // //   if (fetchingDetails) return (
// // //     <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
// // //       <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
// // //       <span className="text-gray-400 text-sm">Loading documentation...</span>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
// // //       <StepHeader step={7} totalSteps={9} title="Campaign Documentation" />

// // //       {/* Container Area */}
// // //       <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6 overflow-y-auto hide-scroll" style={{ maxHeight: "450px" }}>
// // //         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
// // //             <h4 className="text-sm font-medium text-gray-700">Documents</h4>
// // //             <button
// // //                 onClick={handleAddRow}
// // //                 disabled={isAnySubmitting}
// // //                 className="text-xs bg-[#7747EE] text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#663bc9] transition-colors w-fit shadow-sm"
// // //             >
// // //                 <Plus size={14} /> Add Document
// // //             </button>
// // //         </div>

// // //         <div className="space-y-4"> 
// // //           {docs.map((doc, index) => (
// // //             <div key={doc.uniqueId} className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
              
// // //               {/* Document Name */}
// // //               <div className="w-full md:w-1/4 pt-1">
// // //                 <label className="block text-xs font-medium text-gray-500 mb-1">
// // //                     Document Name {index + 1}
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={doc.doc_name}
// // //                   onChange={(e) => handleDocChange(index, "doc_name", e.target.value)}
// // //                   placeholder="e.g. Terms & Conditions"
// // //                   disabled={isAnySubmitting}
// // //                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] outline-none bg-white transition-all"
// // //                 />
// // //               </div>

// // //               {/* Content Editor */}
// // //               <div className="w-full md:flex-1">
// // //                 <label className="block text-xs font-medium text-gray-500 mb-1">
// // //                     Content <span className="text-gray-400 font-normal ml-1">(Markdown Supported)</span>
// // //                 </label>
// // //                 <NvdMarkdownEditor 
// // //                    // Encode raw state text to Base64 for the component
// // //                    value={btoa(doc.doc_text || "")} 
// // //                    onChange={(newValue) => handleDocChange(index, "doc_text", newValue)}
// // //                    disabled={isAnySubmitting}
// // //                    placeholder="# Start typing terms...\nUse the toolbar to add style."
// // //                    height="220px"
// // //                 />
// // //               </div>

// // //               {/* Delete Button */}
// // //               <div className="pt-[26px]">
// // //                 <button
// // //                     onClick={() => handleDeleteRow(index)}
// // //                     disabled={isAnySubmitting}
// // //                     className="flex items-center justify-center w-9 h-9 rounded bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
// // //                     title="Remove Document"
// // //                 >
// // //                     <Trash2 size={16} />
// // //                 </button>
// // //               </div>

// // //             </div>
// // //           ))}

// // //           {docs.length === 0 && (
// // //             <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-white">
// // //                 <p>No documents added yet.</p>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Footer Navigation */}
// // //       <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
// // //         <button
// // //           onClick={onPrevious}
// // //           disabled={isAnySubmitting}
// // //           className="w-full sm:w-auto bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
// // //         >
// // //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// // //             <path d="M15 18l-6-6 6-6" />
// // //           </svg>
// // //           Previous
// // //         </button>

// // //         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
// // //           {isEditMode && (
// // //             <button
// // //               onClick={() => handleSubmit("update")}
// // //               disabled={isAnySubmitting}
// // //               className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
// // //             >
// // //               {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
// // //               {isUpdateSubmitting ? "Updating..." : "Update Details"}
// // //             </button>
// // //           )}

// // //           <button
// // //             onClick={() => handleSubmit("next")}
// // //             disabled={isAnySubmitting}
// // //             className="w-full sm:w-auto bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-all disabled:opacity-70"
// // //           >
// // //             {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
// // //             {isNextSubmitting ? "Saving..." : "Save & Next →"}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Docs;


// // import React, { useState, useEffect } from "react";
// // import { Trash2, Plus, Loader2 } from "lucide-react";
// // import Swal from "sweetalert2";
// // import { campaignDiscountApi } from "../utils/metadataApi"; 
// // import NvdMarkdownEditor from "./NvdMarkdownEditor"; 
// // import StepHeader from "../StepReusable/Stepheader";

// // const Docs = ({ 
// //   data, 
// //   onUpdate, 
// //   onNext, 
// //   onPrevious, 
// //   isEditMode, 
// //   onRefresh, 
// //   campaignId 
// // }) => {
// //   const [docs, setDocs] = useState([]); 
// //   const [fetchingDetails, setFetchingDetails] = useState(false);
// //   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
// //   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
// //   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

// //   const generateId = () => Math.random().toString(36).substring(2, 9);

// //   useEffect(() => {
// //     const fetchDocsData = async () => {
// //       if (isEditMode && campaignId) {
// //         setFetchingDetails(true);
// //         try {
// //           const res = await campaignDiscountApi.getById(campaignId);
// //           const existingDocs = res.data?.discount?.discount_docs || [];
// //           if (existingDocs.length > 0) {
// //             const docsWithIds = existingDocs.map(item => ({ 
// //               ...item, 
// //               uniqueId: item.id || generateId() 
// //             }));
// //             setDocs(docsWithIds);
// //           } else {
// //             setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
// //           }
// //         } catch (error) { 
// //           console.error("Error fetching docs:", error); 
// //         } finally { 
// //           setFetchingDetails(false); 
// //         }
// //       } else if (data?.discount_docs?.length > 0) {
// //         setDocs(data.discount_docs.map(d => ({ ...d, uniqueId: d.uniqueId || generateId() })));
// //       } else {
// //         if(docs.length === 0) setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
// //       }
// //     };
// //     fetchDocsData();
// //   }, [isEditMode, campaignId]);

// //   const handleDocChange = (index, field, value) => {
// //     const updatedDocs = [...docs];
// //     let finalValue = value;
// //     if (field === "doc_text") {
// //       try {
// //         finalValue = atob(value);
// //       } catch (e) {
// //         finalValue = value;
// //       }
// //     }
// //     updatedDocs[index][field] = finalValue;
// //     setDocs(updatedDocs);
// //     onUpdate({ discount_docs: updatedDocs });
// //   };

// //   const handleAddRow = () => {
// //     setDocs([...docs, { doc_name: "", doc_text: "", uniqueId: generateId() }]);
// //   };

// //   const handleDeleteRow = (index) => {
// //     Swal.fire({
// //       title: "Remove Document?",
// //       text: "This action cannot be undone.",
// //       icon: "warning",
// //       showCancelButton: true,
// //       confirmButtonColor: "#EF4444",
// //       confirmButtonText: "Yes, Remove",
// //       cancelButtonColor: "#6B7280",
// //     }).then((result) => {
// //       if (result.isConfirmed) {
// //         const updatedDocs = docs.filter((_, i) => i !== index);
// //         setDocs(updatedDocs);
// //         onUpdate({ discount_docs: updatedDocs });
// //       }
// //     });
// //   };

// //   // --- REFINED SUBMIT LOGIC ---
// //   const handleSubmit = async (action) => {
// //     const validDocs = docs
// //       .filter(d => d.doc_name?.trim() || d.doc_text?.trim())
// //       .map(({ uniqueId, ...rest }) => rest);

// //     const payload = { 
// //       discount: { 
// //         discount_docs: validDocs 
// //       } 
// //     };

// //     // Determine if we should save to API
// //     // Save IF: Explicitly updating OR (moving to next AND NOT in edit mode)
// //     const shouldCallApi = action === "update" || (action === "next" && !isEditMode);

// //     if (action === "update") setIsUpdateSubmitting(true);
// //     else setIsNextSubmitting(true);

// //     try {
// //       if (shouldCallApi && campaignId) {
// //         await campaignDiscountApi.update(campaignId, payload);
// //       }
      
// //       if (action === "update") {
// //         Swal.fire({ icon: "success", title: "Saved", text: "Docs Updated successfully.", timer: 1500, confirmButtonColor: "#7747EE" });
// //         if (onRefresh) await onRefresh();
// //       } else { 
// //         // Simply navigate to next step
// //         onNext(); 
// //       }
// //     } catch (error) {
// //       Swal.fire({ icon: "error", title: "Failed", text: error.message });
// //     } finally {
// //       setIsUpdateSubmitting(false);
// //       setIsNextSubmitting(false);
// //     }
// //   };

// //   if (fetchingDetails) return (
// //     <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
// //       <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
// //       <span className="text-gray-400 text-sm">Loading documentation...</span>
// //     </div>
// //   );

// //   return (
// //     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
// //       <StepHeader step={7} totalSteps={9} title="Campaign Documentation" />

// //       <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6 overflow-y-auto hide-scroll" style={{ maxHeight: "450px" }}>
// //         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
// //             <h4 className="text-sm font-medium text-gray-700">Documents</h4>
// //             <button
// //                 onClick={handleAddRow}
// //                 disabled={isAnySubmitting}
// //                 className="text-xs bg-[#7747EE] text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#663bc9] transition-colors w-fit shadow-sm"
// //             >
// //                 <Plus size={14} /> Add Document
// //             </button>
// //         </div>

// //         <div className="space-y-4"> 
// //           {docs.map((doc, index) => (
// //             <div key={doc.uniqueId} className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
// //               <div className="w-full md:w-1/4 pt-1">
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">
// //                     Document Name {index + 1}
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={doc.doc_name}
// //                   onChange={(e) => handleDocChange(index, "doc_name", e.target.value)}
// //                   placeholder="e.g. Terms & Conditions"
// //                   disabled={isAnySubmitting}
// //                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] outline-none bg-white transition-all"
// //                 />
// //               </div>

// //               <div className="w-full md:flex-1">
// //                 <label className="block text-xs font-medium text-gray-500 mb-1">
// //                     Content <span className="text-gray-400 font-normal ml-1">(Markdown Supported)</span>
// //                 </label>
// //                 <NvdMarkdownEditor 
// //                    value={btoa(doc.doc_text || "")} 
// //                    onChange={(newValue) => handleDocChange(index, "doc_text", newValue)}
// //                    disabled={isAnySubmitting}
// //                    placeholder="# Start typing terms...\nUse the toolbar to add style."
// //                    height="220px"
// //                 />
// //               </div>

// //               <div className="pt-[26px]">
// //                 <button
// //                     onClick={() => handleDeleteRow(index)}
// //                     disabled={isAnySubmitting}
// //                     className="flex items-center justify-center w-9 h-9 rounded bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
// //                     title="Remove Document"
// //                 >
// //                     <Trash2 size={16} />
// //                 </button>
// //               </div>
// //             </div>
// //           ))}

// //           {docs.length === 0 && (
// //             <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-white">
// //                 <p>No documents added yet.</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
// //         <button
// //           onClick={onPrevious}
// //           disabled={isAnySubmitting}
// //           className="w-full sm:w-auto bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
// //         >
// //           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //             <path d="M15 18l-6-6 6-6" />
// //           </svg>
// //           Previous
// //         </button>

// //         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
// //           {isEditMode && (
// //             <button
// //               onClick={() => handleSubmit("update")}
// //               disabled={isAnySubmitting}
// //               className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
// //             >
// //               {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
// //               {isUpdateSubmitting ? "Updating..." : "Update "}
// //             </button>
// //           )}

// //           <button
// //             onClick={() => handleSubmit("next")}
// //             disabled={isAnySubmitting}
// //             className="w-full sm:w-auto bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center hover:bg-[#5558dd] transition-all disabled:opacity-70"
// //           >
// //             {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
// //             {isNextSubmitting ? "Saving..." : " Next →"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Docs;


// import React, { useState, useEffect } from "react";
// import { Trash2, Plus, Loader2 } from "lucide-react";
// import Swal from "sweetalert2";
// import { campaignDiscountApi } from "../utils/metadataApi"; 
// import NvdMarkdownEditor from "./NvdMarkdownEditor"; 
// import StepHeader from "../StepReusable/Stepheader";
// import { getBorderClass } from "../utils/formStyles";

// const Docs = ({ 
//   data, 
//   onUpdate, 
//   onNext, 
//   onPrevious, 
//   isEditMode, 
//   onRefresh, 
//   campaignId 
// }) => {
//   const [docs, setDocs] = useState([]); 
//   const [fetchingDetails, setFetchingDetails] = useState(false);
//   const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
//   const [isNextSubmitting, setIsNextSubmitting] = useState(false);
//   const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

//   const generateId = () => Math.random().toString(36).substring(2, 9);

//   useEffect(() => {
//     const fetchDocsData = async () => {
//       if (isEditMode && campaignId) {
//         setFetchingDetails(true);
//         try {
//           const res = await campaignDiscountApi.getById(campaignId);
//           const existingDocs = res.data?.discount?.discount_docs || [];
//           if (existingDocs.length > 0) {
//             const docsWithIds = existingDocs.map(item => ({ 
//               ...item, 
//               uniqueId: item.id || generateId() 
//             }));
//             setDocs(docsWithIds);
//           } else {
//             setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
//           }
//         } catch (error) { 
//           console.error("Error fetching docs:", error); 
//         } finally { 
//           setFetchingDetails(false); 
//         }
//       } else if (data?.discount_docs?.length > 0) {
//         setDocs(data.discount_docs.map(d => ({ ...d, uniqueId: d.uniqueId || generateId() })));
//       } else {
//         if(docs.length === 0) setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
//       }
//     };
//     fetchDocsData();
//   }, [isEditMode, campaignId]);

//   const handleDocChange = (index, field, value) => {
//     const updatedDocs = [...docs];
//     let finalValue = value;
//     if (field === "doc_text") {
//       try {
//         finalValue = atob(value);
//       } catch (e) {
//         finalValue = value;
//       }
//     }
//     updatedDocs[index][field] = finalValue;
//     setDocs(updatedDocs);
//     onUpdate({ discount_docs: updatedDocs });
//   };

//   const handleAddRow = () => {
//     setDocs([...docs, { doc_name: "", doc_text: "", uniqueId: generateId() }]);
//   };

//   const handleDeleteRow = (index) => {
//     Swal.fire({
//       title: "Remove Document?",
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#EF4444",
//       confirmButtonText: "Yes, Remove",
//       cancelButtonColor: "#6B7280",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const updatedDocs = docs.filter((_, i) => i !== index);
//         setDocs(updatedDocs);
//         onUpdate({ discount_docs: updatedDocs });
//       }
//     });
//   };

// const handleSubmit = async (action) => {
//     // 1. VALIDATION: Check if any documents exist and if all fields are filled
//     if (docs.length === 0) {
//       return Swal.fire({
//         icon: "warning",
//         title: "Document Required",
//         text: "Please add at least one document to proceed.",
//         background: "#FFFFFF",
//         confirmButtonColor: "#7747EE",
//       });
//     }

//     const firstInvalidIndex = docs.findIndex(
//       (d) => !d.doc_name?.trim() || !d.doc_text?.trim()
//     );

//     if (firstInvalidIndex !== -1) {
//       return Swal.fire({
//         icon: "warning",
//         title: "Missing Information",
//         text: `Please provide both a Name and Content for Document #${firstInvalidIndex + 1}.`,
//         background: "#FFFFFF",
//         confirmButtonColor: "#7747EE",
//       });
//     }

//     // 2. Prepare Payload
//     const validDocs = docs.map(({ uniqueId, ...rest }) => rest);
//     const payload = { 
//       discount: { 
//         discount_docs: validDocs 
//       } 
//     };

//     // 3. Logic: Determine if API should be called
//     const shouldCallApi = action === "update" || (action === "next" && !isEditMode);

//     if (shouldCallApi) {
//       if (action === "update") setIsUpdateSubmitting(true);
//       else setIsNextSubmitting(true);
//     }

//     try {
//       if (shouldCallApi && campaignId) {
//         await campaignDiscountApi.update(campaignId, payload);

//         // ✅ SUCCESS ALERT: Context-aware text
//         await Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: action === "update" 
//             ? "Documents have been updated successfully." 
//             : "Documents have been saved successfully.",
//           background: "#FFFFFF",
//           color: "#1e293b",
//           confirmButtonColor: "#10B981",
//           timer: 2000,
//           showConfirmButton: false,
//         });

//         if (onRefresh) await onRefresh();
//       }

//       // 4. Update Parent (Local State)
//       onUpdate({ discount_docs: validDocs });

//       // 5. Handle Navigation
//       if (action === "next") {
//         onNext();
//       }
//     } catch (error) {
//       console.error("❌ Error saving documents:", error);
//       Swal.fire({ 
//         icon: "error", 
//         title: "Failed", 
//         text: error.response?.data?.detail || "An error occurred while saving documents.",
//         background: "#FFFFFF" 
//       });
//     } finally {
//       setIsUpdateSubmitting(false);
//       setIsNextSubmitting(false);
//     }
//   };

//   if (fetchingDetails) return (
//     <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
//       <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
//       <span className="text-gray-400 text-sm">Loading documentation...</span>
//     </div>
//   );

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
//       <StepHeader step={7} totalSteps={9} title="Campaign Documentation" />

//       <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6 overflow-y-auto hide-scroll" style={{ maxHeight: "500px" }}>
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
//             <h4 className="text-sm font-semibold text-gray-700 tracking-tight">Documents List</h4>
//             <button
//                 onClick={handleAddRow}
//                 disabled={isAnySubmitting}
//                 className="text-xs bg-[#7747EE] text-white px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-[#663bc9] transition-all w-fit shadow-md active:scale-95"
//             >
//                 <Plus size={14} /> Add Document
//             </button>
//         </div>

//         <div className="space-y-10"> 
//           {docs.map((doc, index) => (
//             <div key={doc.uniqueId} className="flex flex-col border-b border-gray-200 pb-10 last:border-0 last:pb-0">
              
//               {/* Top Row: Title Input and Delete Button */}
//               <div className="flex items-end justify-between gap-4 mb-4">
//                 <div className="flex-1">
//                   <label className="block text-[12px] font-medium text-gray-400 mb-1.5">
//                       Document Name {index + 1}
//                   </label>
//                   <input
//                     type="text"
//                     value={doc.doc_name}
//                     onChange={(e) => handleDocChange(index, "doc_name", e.target.value)}
//                     placeholder="e.g. Terms & Conditions"
//                     disabled={isAnySubmitting}
//                     className="w-full max-w-md border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-[#7747EE] outline-none bg-white transition-all shadow-sm"
//                   />
//                 </div>
                
//                 <button
//                     onClick={() => handleDeleteRow(index)}
//                     disabled={isAnySubmitting}
//                     className="flex items-center justify-center w-10 h-10 rounded-md bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
//                     title="Remove Document"
//                 >
//                     <Trash2 size={18} />
//                 </button>
//               </div>

//               {/* Bottom Row: Markdown Editor (Now full width) */}
//               <div className="w-full">
//                 <label className="block text-[12px] font-medium text-gray-400 mb-1.5">
//                     Content <span className="text-gray-300 font-normal lowercase tracking-normal ml-1">(Markdown Supported)</span>
//                 </label>
//                 <div className="shadow-sm rounded-lg overflow-hidden border border-gray-100">
//                     <NvdMarkdownEditor 
//                         value={btoa(doc.doc_text || "")} 
//                         onChange={(newValue) => handleDocChange(index, "doc_text", newValue)}
//                         disabled={isAnySubmitting}
//                         placeholder="Enter Content"
//                         height="280px" // Slightly taller since it has more width
//                     />
//                 </div>
//               </div>
//             </div>
//           ))}

//           {docs.length === 0 && (
//             <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-white mx-4">
//                 <p>No documents added yet. Click "Add Document" to begin.</p>
//             </div>
//           )}
//         </div>
//       </div>

//    <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
//         {/* PREVIOUS BUTTON */}
//         <button
//           onClick={onPrevious}
//           disabled={isAnySubmitting}
//           className="w-full sm:w-auto bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[6px] text-[#000000] text-[14px] font-medium tracking-tight flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
//         >
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M15 18l-6-6 6-6" />
//           </svg>
//           Previous
//         </button>

//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           {/* UPDATE BUTTON WITH SPIN */}
//           {isEditMode && (
//             <button
//               onClick={() => handleSubmit("update")}
//               disabled={isAnySubmitting}
//               className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
//             >
//               {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
//               {isUpdateSubmitting ? "Updating..." : "Update"}
//             </button>
//           )}

//           {/* NEXT BUTTON WITH SPIN */}
//           <button
//             onClick={() => handleSubmit("next")}
//             disabled={isAnySubmitting}
//             className="w-full sm:w-auto bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[6px] text-[#ffffff] text-[14px] font-medium flex items-center justify-center hover:bg-[#5558dd] transition-all shadow-md active:scale-95 disabled:opacity-70"
//           >
//             {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
//             {isNextSubmitting ? "Saving..." : " Next →"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Docs;
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { campaignDiscountApi } from "../utils/metadataApi";
import NvdMarkdownEditor from "./NvdMarkdownEditor";
import StepHeader from "../StepReusable/Stepheader";
import { getBorderClass } from "../utils/formStyles";

const Docs = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isEditMode,
  onRefresh,
  campaignId,
}) => {
  const [docs, setDocs] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  // State to track validation errors: { "uniqueId_fieldName": true }
  const [errors, setErrors] = useState({});

  const generateId = () => Math.random().toString(36).substring(2, 9);

  useEffect(() => {
    const fetchDocsData = async () => {
      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const existingDocs = res.data?.discount?.discount_docs || [];
          if (existingDocs.length > 0) {
            const docsWithIds = existingDocs.map((item) => ({
              ...item,
              uniqueId: item.id || generateId(),
            }));
            setDocs(docsWithIds);
          } else {
            setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
          }
        } catch (error) {
          console.error("Error fetching docs:", error);
        } finally {
          setFetchingDetails(false);
        }
      } else if (data?.discount_docs?.length > 0) {
        setDocs(
          data.discount_docs.map((d) => ({
            ...d,
            uniqueId: d.uniqueId || generateId(),
          }))
        );
      } else {
        if (docs.length === 0)
          setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
      }
    };
    fetchDocsData();
  }, [isEditMode, campaignId]);

  // ✅ New Focus Handler: Removes the orange border when user clicks/focuses
  const handleInputFocus = (id, field) => {
    if (errors[`${id}_${field}`]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[`${id}_${field}`];
        return newErrs;
      });
    }
  };

  const handleDocChange = (index, field, value) => {
    const updatedDocs = [...docs];
    let finalValue = value;
    if (field === "doc_text") {
      try {
        finalValue = atob(value);
      } catch (e) {
        finalValue = value;
      }
    }
    updatedDocs[index][field] = finalValue;
    setDocs(updatedDocs);

    // Also clear error on change if it exists
    const rowId = updatedDocs[index].uniqueId;
    if (errors[`${rowId}_${field}`]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[`${rowId}_${field}`];
        return newErrs;
      });
    }

    onUpdate({ discount_docs: updatedDocs });
  };

  const handleAddRow = () => {
    setDocs([...docs, { doc_name: "", doc_text: "", uniqueId: generateId() }]);
  };

  const handleDeleteRow = (index) => {
    Swal.fire({
      title: "Remove Document?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Yes, Remove",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDocs = docs.filter((_, i) => i !== index);
        setDocs(updatedDocs);
        onUpdate({ discount_docs: updatedDocs });
      }
    });
  };

  const handleSubmit = async (action) => {
    const newErrors = {};
    let hasValidationError = false;

    // 1. VALIDATION: Check if fields are filled
    if (docs.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Document Required",
        text: "Please add at least one document to proceed.",
        background: "#FFFFFF",
        confirmButtonColor: "#7747EE",
      });
    }

    docs.forEach((doc) => {
      if (!doc.doc_name?.trim()) {
        newErrors[`${doc.uniqueId}_doc_name`] = true;
        hasValidationError = true;
      }
      if (!doc.doc_text?.trim()) {
        newErrors[`${doc.uniqueId}_doc_text`] = true;
        hasValidationError = true;
      }
    });

    if (hasValidationError) {
      setErrors(newErrors);
      return Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill in all highlighted document fields.",
        confirmButtonColor: "#7747EE",
        background: "#FFFFFF",
      });
    }

    const validDocs = docs.map(({ uniqueId, ...rest }) => rest);
    const payload = {
      discount: {
        discount_docs: validDocs,
      },
    };

    const shouldCallApi =
      action === "update" || (action === "next" && !isEditMode);

    if (shouldCallApi) {
      if (action === "update") setIsUpdateSubmitting(true);
      else setIsNextSubmitting(true);
    }

    try {
      if (shouldCallApi && campaignId) {
        await campaignDiscountApi.update(campaignId, payload);

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text:
            action === "update"
              ? "Documents have been updated successfully."
              : "Documents have been saved successfully.",
          background: "#FFFFFF",
          color: "#1e293b",
          confirmButtonColor: "#10B981",
          timer: 2000,
          showConfirmButton: false,
        });

        if (onRefresh) await onRefresh();
      }

      onUpdate({ discount_docs: validDocs });

      if (action === "next") {
        onNext();
      }
    } catch (error) {
      console.error("❌ Error saving documents:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.detail ||
          "An error occurred while saving documents.",
        background: "#FFFFFF",
      });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  if (fetchingDetails)
    return (
      <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">Loading documentation...</span>
      </div>
    );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
      <StepHeader step={7} totalSteps={9} title="Campaign Documentation" />

      <div
        className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6 overflow-y-auto hide-scroll"
        style={{ maxHeight: "500px" }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
          <h4 className="text-sm font-semibold text-gray-700 tracking-tight">
            Documents List
          </h4>
          <button
            onClick={handleAddRow}
            disabled={isAnySubmitting}
            className="text-xs bg-[#7747EE] text-white px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-[#663bc9] transition-all w-fit shadow-md active:scale-95 disabled:opacity-50"
          >
            <Plus size={14} /> Add Document
          </button>
        </div>

        <div className="space-y-10">
          {docs.map((doc, index) => (
            <div
              key={doc.uniqueId}
              className="flex flex-col border-b border-gray-200 pb-10 last:border-0 last:pb-0"
            >
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                    Document Name {index + 1}
                  </label>
                  <input
                    type="text"
                    value={doc.doc_name}
                    onChange={(e) =>
                      handleDocChange(index, "doc_name", e.target.value)
                    }
                    onFocus={() => handleInputFocus(doc.uniqueId, "doc_name")} // ✅ Clear error border on focus
                    placeholder="e.g. Terms & Conditions"
                    disabled={isAnySubmitting}
                    className={`w-full max-w-md border rounded-md px-3 py-2 text-sm outline-none transition-all ${getBorderClass(
                      errors[`${doc.uniqueId}_doc_name`]
                    )}`}
                  />
                </div>

                <button
                  onClick={() => handleDeleteRow(index)}
                  disabled={isAnySubmitting}
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                >
                  <Trash2 size={18} />
                </button>
              </div>

           <div className="w-full">
  <label className="block text-[12px] font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
    Document Content
  </label>
  <div
    onFocus={() => handleInputFocus(doc.uniqueId, "doc_text")}
    /* We add 'focus-within' here. 
       This ensures that when you click inside the NvdMarkdownEditor, 
        the parent div border turns blue.
    */
    className={`shadow-sm rounded-lg overflow-hidden border transition-all focus-within:ring-1 focus-within:ring-[#7747EE] focus-within:border-[#7747EE] ${getBorderClass(
      errors[`${doc.uniqueId}_doc_text`]
    )}`}
  >
    <NvdMarkdownEditor
      value={btoa(doc.doc_text || "")}
      onChange={(newValue) => handleDocChange(index, "doc_text", newValue)}
      disabled={isAnySubmitting}
      placeholder="Enter Markdown Content here..."
      height="280px"
    />
  </div>
</div>
            </div>
          ))}

          {docs.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-white mx-4">
              <p>No documents added yet. Click "Add Document" to begin.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onPrevious}
          disabled={isAnySubmitting}
          className="w-full sm:w-auto bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[6px] text-[#000000] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Previous
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isEditMode && (
            <button
              onClick={() => handleSubmit("update")}
              disabled={isAnySubmitting}
              className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded-[5px] text-[14px] font-normal tracking-[-0.03em] flex items-center gap-2 disabled:opacity-70 transition-colors shadow-sm"
            >
              {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdateSubmitting ? "Updating..." : "Update"}
            </button>
          )}

          <button
            onClick={() => handleSubmit("next")}
            disabled={isAnySubmitting}
            className="w-full sm:w-auto bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[6px] text-[#ffffff] text-[14px] font-medium flex items-center justify-center hover:bg-[#5558dd] transition-all shadow-md disabled:opacity-70"
          >
            {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isNextSubmitting ? "Saving..." : " Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Docs;