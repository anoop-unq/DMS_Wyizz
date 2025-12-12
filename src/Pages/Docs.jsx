import React, { useState, useEffect } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { campaignDiscountApi } from "../utils/metadataApi"; 
import RichMarkdownEditor from "./RichMarkdownEditor";

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
  const [docs, setDocs] = useState([{ doc_name: "", doc_text: "" }]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const isAnySubmitting = isUpdateSubmitting || isNextSubmitting;

  // --- 1. FETCH DATA (Edit Mode) ---
  useEffect(() => {
    const fetchDocsData = async () => {
      if (isEditMode && campaignId) {
        setFetchingDetails(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};
          
          const existingDocs = d.discount_docs || [];
          
          if (existingDocs.length > 0) {
            setDocs(existingDocs);
            onUpdate({ discount_docs: existingDocs });
          } else {
             setDocs([{ doc_name: "", doc_text: "" }]);
          }

        } catch (error) {
          console.error("Error fetching docs:", error);
        } finally {
          setFetchingDetails(false);
        }
      } 
      else if (!isEditMode && data && data.discount_docs) {
        if (data.discount_docs.length > 0) {
            setDocs(data.discount_docs);
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
    const newRow = { doc_name: "", doc_text: "" };
    const updatedDocs = [...docs, newRow];
    setDocs(updatedDocs);
    onUpdate({ discount_docs: updatedDocs });
  };

  const handleDeleteRow = (index) => {
    // Always show confirmation, even if only one row
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this document?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7747EE",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        if (docs.length === 1) {
          // If it's the last row, clear it instead of removing
          const updatedDocs = [{ doc_name: "", doc_text: "" }];
          setDocs(updatedDocs);
          onUpdate({ discount_docs: updatedDocs });
        } else {
          // Remove the row
          const updatedDocs = docs.filter((_, i) => i !== index);
          setDocs(updatedDocs);
          onUpdate({ discount_docs: updatedDocs });
        }
      }
    });
  };

  // --- 3. SUBMIT LOGIC ---
  const handleSubmit = async (action) => {
    const validDocs = docs.filter(
      (d) => d.doc_name?.trim() || d.doc_text?.trim()
    );

    if (action === "update") {
      // UPDATE button logic
      setIsUpdateSubmitting(true);
      
      const payload = {
        discount: {
          discount_docs: validDocs,
        },
      };

      try {
        await campaignDiscountApi.update(campaignId, payload);
        
        Swal.fire({
          icon: "success",
          title: "Docs Updated",
          text: "Documentation details saved successfully.",
          confirmButtonColor: "#7747EE",
          timer: 2000,
        });
        
        if (onRefresh) await onRefresh();
        
      } catch (error) {
        console.error("Error saving docs:", error);
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: error.message || "Could not save documentation details.",
        });
      } finally {
        setIsUpdateSubmitting(false);
      }
      
    } else if (action === "next") {
      // NEXT button logic
      setIsNextSubmitting(true);
      
      try {
        // If we're in edit mode OR we have no campaignId, just navigate
        if (isEditMode || !campaignId) {
          onNext();
        } else {
          // In create mode with campaignId, call API then navigate
          const payload = {
            discount: {
              discount_docs: validDocs,
            },
          };
          
          await campaignDiscountApi.update(campaignId, payload);
          onNext();
        }
        
      } catch (error) {
        console.error("Error saving docs:", error);
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: error.message || "Could not save documentation details.",
        });
      } finally {
        setIsNextSubmitting(false);
      }
    }
  };

  // --- 4. RENDER LOADING STATE ---
  if (fetchingDetails) {
    return (
      <div className="flex flex-col h-[400px] w-full bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7B3FE4] mb-3" />
        <span className="text-gray-400 text-sm">Loading documentation...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-5 pr-5 pl-5 pb-5 shadow-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6">
        <div className="flex gap-2 items-center mb-2 sm:mb-0">
          <span className="w-5 h-5 text-center bg-[#EFEFFD] text-[#7747EE] rounded-full text-xs flex items-center justify-center">
            7
          </span>
          <h3 className="text-lg font-semibold text-gray-900">Campaign Documentation</h3>
        </div>
        <div className="text-xs text-gray-500">Step 7 of 9</div>
      </div>

      <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6">
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

        <div className="space-y-6"> 
          {docs.map((doc, index) => (
            <div key={index} className="flex flex-col md:flex-row md:gap-4 items-start border-b border-gray-200 pb-6 last:border-0 last:pb-0">
              
              {/* Left Side: Doc Name */}
              <div className="w-full md:w-1/4 pt-1 mb-4 md:mb-0">
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
                
                {/* Delete Button - Always enabled */}
                <button
                    onClick={() => handleDeleteRow(index)}
                    className="mt-4 flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={14} /> Remove Doc
                </button>
              </div>

              {/* Right Side: Rich Markdown Editor */}
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

            </div>
          ))}
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