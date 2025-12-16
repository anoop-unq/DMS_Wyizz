import React, { useState, useEffect } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { campaignDiscountApi } from "../utils/metadataApi"; 
import RichMarkdownEditor from "./RichMarkdownEditor";
import StepHeader from "../StepReusable/Stepheader";

const Docs = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isEditMode,
  onRefresh,
  campaignId,
}) => {
  // --- State Management ---
  const [docs, setDocs] = useState([]); 
  const [fetchingDetails, setFetchingDetails] = useState(false);
  
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  // --- 1. FETCH DATA (Edit Mode) ---
  useEffect(() => {
    const fetchDocsData = async () => {
      // Helper: Generate safe unique IDs
      const generateId = () => 
        typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : Date.now().toString() + Math.random().toString(36).substring(2);

      const addUniqueIds = (items) => items.map(item => ({
        ...item,
        uniqueId: item.id || generateId()
      }));

      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};
          const existingDocs = d.discount_docs || [];
          
          if (existingDocs.length > 0) {
            const docsWithIds = addUniqueIds(existingDocs);
            setDocs(docsWithIds);
            onUpdate({ discount_docs: docsWithIds });
          } else {
            setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
          }
        } catch (error) {
          console.error("Error fetching docs:", error);
        } finally {
          setFetchingDetails(false);
        }
      } 
      else if (!isEditMode && data && data.discount_docs) {
        if (data.discount_docs.length > 0) {
            const docsWithIds = data.discount_docs.map(d => ({
                ...d,
                uniqueId: d.uniqueId || generateId()
            }));
            setDocs(docsWithIds);
        } else {
            setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
        }
      } else {
         if(docs.length === 0) {
             setDocs([{ doc_name: "", doc_text: "", uniqueId: generateId() }]);
         }
      }
    };

    fetchDocsData();
  }, [isEditMode, campaignId]); 

  // --- 2. HANDLERS ---
  const handleDocChange = (index, field, value) => {
    const updatedDocs = [...docs];
    updatedDocs[index][field] = value;
    setDocs(updatedDocs);
    onUpdate({ discount_docs: updatedDocs });
  };

  const handleAddRow = () => {
    const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);
    const newRow = { doc_name: "", doc_text: "", uniqueId: generateId() };
    const updatedDocs = [...docs, newRow];
    setDocs(updatedDocs);
    onUpdate({ discount_docs: updatedDocs });
  };

  const handleDeleteRow = (index) => {
    Swal.fire({
      title: "Remove Document?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red for delete
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDocs = docs.filter((_, i) => i !== index);
        setDocs(updatedDocs);
        onUpdate({ discount_docs: updatedDocs });
      }
    });
  };

  // --- 3. SUBMIT LOGIC ---
  const handleSubmit = async (action) => {
    const validDocs = docs
        .filter((d) => d.doc_name?.trim() || d.doc_text?.trim())
        .map(({ uniqueId, ...rest }) => rest);

    const payload = {
      discount: {
        discount_docs: validDocs,
      },
    };

    if (action === "update") setIsUpdateSubmitting(true);
    else setIsNextSubmitting(true);

    try {
        if (isEditMode || (campaignId && (action === "update" || action === "next"))) {
             await campaignDiscountApi.update(campaignId, payload);
        }
        
        if (action === "update") {
            Swal.fire({ icon: "success", title: "Docs Updated", text: "Saved successfully.", confirmButtonColor: "#7747EE", timer: 1500 });
            if (onRefresh) await onRefresh();
        } else {
            onNext();
        }
    } catch (error) {
        console.error("Error saving docs:", error);
        Swal.fire({ icon: "error", title: "Save Failed", text: error.message });
    } finally {
        setIsUpdateSubmitting(false);
        setIsNextSubmitting(false);
    }
  };

  if (fetchingDetails) {
    return (
      <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">Loading documentation...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm relative">
      <StepHeader step={7} totalSteps={9} title="Campaign Documentation" />

      <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6 overflow-y-scroll hide-scroll" style={{maxHeight:"450px"}}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h4 className="text-sm font-medium text-gray-700">Documents</h4>
            <button
                onClick={handleAddRow}
                disabled={isAnySubmitting}
                className="text-xs bg-[#7747EE] text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#663bc9] transition-colors w-fit"
            >
                <Plus size={14} /> Add Document
            </button>
        </div>

        <div className="space-y-4"> 
          {docs.map((doc, index) => (
            // ✅ KEY FIX: Using doc.uniqueId prevents deletion bugs
            <div 
                key={doc.uniqueId} 
                className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0"
            >
              
              {/* 1. Left Side: Document Name */}
              <div className="w-full md:w-1/4 pt-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    Document Name {index + 1}
                </label>
                <input
                  type="text"
                  value={doc.doc_name}
                  onChange={(e) => handleDocChange(index, "doc_name", e.target.value)}
                  placeholder="e.g. Terms & Conditions"
                  disabled={isAnySubmitting}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] outline-none bg-white"
                />
              </div>

              {/* 2. Middle: Rich Markdown Editor */}
              <div className="w-full md:flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    Content <span className="text-gray-400 font-normal ml-1">(Markdown Supported)</span>
                </label>
                
                <RichMarkdownEditor 
                   value={doc.doc_text}
                   onChange={(newValue) => handleDocChange(index, "doc_text", newValue)}
                   disabled={isAnySubmitting}
                   placeholder="# Start typing...\nUse the toolbar to add style."
                />
              </div>

              {/* 3. Right Side: Delete Button (Aligned with Inputs) */}
              <div className="pt-[26px]"> {/* Matches label height + padding to align with input box */}
                <button
                    onClick={() => handleDeleteRow(index)}
                    disabled={isAnySubmitting}
                    className="flex items-center justify-center w-9 h-9 rounded bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                    title="Remove Document"
                >
                    <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
          
          {docs.length === 0 && (
             <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-white">
                <p>No documents added yet.</p>
          
             </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={onPrevious}
          disabled={isAnySubmitting}
          className="w-full sm:w-auto bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Previous
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isEditMode && (
            <button
              onClick={() => handleSubmit("update")}
              disabled={isAnySubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
            >
              {isUpdateSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUpdateSubmitting ? "Updating..." : "Update"}
            </button>
          )}

          <button
            onClick={() => handleSubmit("next")}
            disabled={isAnySubmitting}
            className="w-full sm:w-auto bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center disabled:opacity-70 hover:bg-[#5558dd] transition-colors"
          >
            {isNextSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isNextSubmitting ? "Saving..." : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Docs;