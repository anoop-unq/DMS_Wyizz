import React, { useEffect, useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import Swal from "sweetalert2";
import api from "../utils/api";

const SegmentForm = ({ editingId, onCancel, onSuccess, storedUid }) => {
  const [loading, setLoading] = useState(false);

  // Form State
  const [segmentName, setSegmentName] = useState("");
  const [description, setDescription] = useState("");
  const [binRanges, setBinRanges] = useState([
    { id: Date.now(), fromBin: "", toBin: "" },
  ]);
  const [tokens, setTokens] = useState([]);
  const [tokenInput, setTokenInput] = useState("");

  // Validation State
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingId) {
      fetchSegmentById(editingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  const fetchSegmentById = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/dmsapi/segments/${id}`);
      const data = res.data;

      setSegmentName(data.segment_name || "");
      setDescription(data.description || "");

      if (data.bin_ranges && data.bin_ranges.length > 0) {
        setBinRanges(
          data.bin_ranges.map((br) => ({
            id: br.id || Date.now() + Math.random(),
            fromBin: br.start_bin,
            toBin: br.end_bin,
          }))
        );
      }

      if (data.apple_tokens && data.apple_tokens.length > 0) {
        setTokens(
          data.apple_tokens.map((t) => ({
            value: t.token_value,
            checked: true,
          }))
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load segment details", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATED Helper for Styles ---
  // Logic: 
  // 1. If Error: Start with Red Border.
  // 2. On Focus (Click): ALWAYS switch to Purple (#7B3FE4), removing the Red.
  const getBorderClass = (errorKey) => {
    return errors[errorKey]
      ? "border-red-500 focus:border-[#7B3FE4] focus:ring-1 focus:ring-[#7B3FE4]" 
      : "border-gray-300 focus:border-[#7B3FE4] focus:ring-1 focus:ring-[#7B3FE4]";
  };

  // --- Handlers ---
  const handleAddBinRange = () => {
    setBinRanges([
      ...binRanges,
      { id: Date.now(), fromBin: "", toBin: "" },
    ]);
    
    // Clear the "Bin List Empty" error if it exists
    if(errors.binRanges) {
        setErrors(prev => ({...prev, binRanges: false}));
    }
  };

  const handleRemoveBinRange = (id) => {
    const newRanges = binRanges.filter((b) => b.id !== id);
    setBinRanges(newRanges);

    // Clean up individual bin errors
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.includes(id)) delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleChangeBin = (e, id, type) => {
    const val = e.target.value;
    
    // 1. Update State
    setBinRanges(
      binRanges.map((bin) =>
        bin.id === id ? { ...bin, [type]: val } : bin
      )
    );

    // 2. Clear error for this specific field immediately
    if (errors[`bin_${id}_${type}`]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[`bin_${id}_${type}`];
        return newErr;
      });
    }
  };

  const handleNameChange = (e) => {
    setSegmentName(e.target.value);
    // Clear segment error immediately
    if (errors.segmentName) {
      setErrors((prev) => ({ ...prev, segmentName: null }));
    }
  };

  // ... Token Logic ...
  const handleAddTokens = () => {
    if (!tokenInput.trim()) return;
    const raw = tokenInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    setTokens((prev) => {
      const existing = prev.map((p) => p.value);
      const additions = [];
      raw.forEach((val) => {
        if (!existing.includes(val)) additions.push({ value: val, checked: true });
      });
      return [...prev, ...additions];
    });
    setTokenInput("");
  };

  const handleTokenKeyDown = (e) => {
    if (e.key === "Enter" || (e.key === "," && tokenInput.trim())) {
      e.preventDefault();
      handleAddTokens();
    }
  };

  const toggleTokenChecked = (value) => {
    setTokens((prev) => prev.filter((t) => t.value !== value));
  };

  // --- Validation & Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let isValid = true;
    let errorMessage = "Please fill all required fields correctly.";

    // 1. Validate Segment Name
    if (!segmentName.trim()) {
      newErrors.segmentName = true;
      isValid = false;
    }

    const sixDigitRegex = /^\d{6}$/;

    // 2. Validate Ranges List (Must have at least one valid range)
    const filledRanges = binRanges.filter(
      (r) => r.fromBin.trim() || r.toBin.trim()
    );

    // NEW: Highlight the Container Box if empty
    if (filledRanges.length === 0) {
      newErrors.binRanges = true; 
      isValid = false;
      errorMessage = "Please add at least one BIN range.";
    }

    // 3. Validate Individual Inputs
    binRanges.forEach((row) => {
      // From BIN
      if (!row.fromBin.trim()) {
        newErrors[`bin_${row.id}_fromBin`] = true;
        isValid = false;
      } else if (!sixDigitRegex.test(row.fromBin)) {
        newErrors[`bin_${row.id}_fromBin`] = true;
        errorMessage = "BINs must be exactly 6 digits.";
        isValid = false;
      }

      // To BIN
      if (!row.toBin.trim()) {
        newErrors[`bin_${row.id}_toBin`] = true;
        isValid = false;
      } else if (!sixDigitRegex.test(row.toBin)) {
        newErrors[`bin_${row.id}_toBin`] = true;
        errorMessage = "BINs must be exactly 6 digits.";
        isValid = false;
      }

      // Logic: Start > End
      if (
        row.fromBin &&
        row.toBin &&
        parseInt(row.fromBin) > parseInt(row.toBin)
      ) {
        newErrors[`bin_${row.id}_fromBin`] = true;
        newErrors[`bin_${row.id}_toBin`] = true;
        errorMessage = "Start BIN cannot be greater than End BIN.";
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: errorMessage,
        background: "#F7F9FB",
        confirmButtonColor: "#7747EE",
      });
      return;
    }

    // 4. Check Overlaps
    const validRanges = binRanges.filter(
      (r) => r.fromBin.trim() && r.toBin.trim()
    );
    const sortedRanges = [...validRanges].sort(
      (a, b) => parseInt(a.fromBin) - parseInt(b.fromBin)
    );

    for (let i = 0; i < sortedRanges.length - 1; i++) {
      if (
        parseInt(sortedRanges[i].toBin) >= parseInt(sortedRanges[i + 1].fromBin)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Overlap Detected",
          text: `Range ${sortedRanges[i].fromBin}-${sortedRanges[i].toBin} overlaps with the next range.`,
          confirmButtonColor: "#7747EE",
        });
        return;
      }
    }

    // 5. API Submission
    const finalBankId = storedUid > 0 ? storedUid : 1;
    const payload = {
      bank_id: finalBankId,
      segment_name: segmentName,
      description: description,
      is_active: true,
      bin_ranges: validRanges.map((r) => ({
        start_bin: r.fromBin,
        end_bin: r.toBin,
        is_active: true,
      })),
      apple_tokens: tokens.map((t) => ({
        token_value: t.value,
        is_active: true,
      })),
    };

    try {
      setLoading(true);
      if (!editingId) {
        await api.post("/dmsapi/segments", payload);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Segment created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await api.put(`/dmsapi/segments/${editingId}`, payload);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Segment updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      onSuccess();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err?.response?.data?.message || "Failed to save segment.";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 -mt-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-0 rounded-lg shadow-md space-y-0 mt-4 border border-[#E2E8F0]"
      >
        <div className="p-6">
          <h1 className="inside-head mb-4">BIN Configuration</h1>
          <div className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-md p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Segment Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={segmentName}
                onChange={handleNameChange}
                // Updated Class Logic applied here
                className={`w-full px-3 py-2 border rounded-md focus:outline-none bg-[#ffffff] transition-colors ${getBorderClass("segmentName")}`}
              />
           
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#ffffff] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7B3FE4] focus:border-[#7B3FE4]"
              />
            </div>
          </div>

          {/* Bin Ranges Section */}
        <div className="mt-4 bg-[#F7F9FB] border border-[#E2E8F0] rounded-md p-4 space-y-6">
  <div
    className="bg-white p-6 rounded-md border overflow-y-auto hide-scroll transition-colors border-[#E2E8F0]"
    style={{ maxHeight: 280 }}
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="card-inside-head">BIN Ranges</h2>
      <button
        type="button"
        onClick={handleAddBinRange}
        className="btn-primary-violet flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="text-sm">Add</span>
      </button>
    </div>

    {binRanges.map((bin, index) => (
      <div
        key={bin.id}
        className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-6 border-b border-gray-200 pb-4"
      >
        <span className="bg-[#7747EE] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shrink-0">
          {index + 1}
        </span>

        {/* From BIN */}
        <div className="w-full md:flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From BIN
          </label>
          <input
            type="text"
            maxLength={6}
            value={bin.fromBin}
            onChange={(e) => handleChangeBin(e, bin.id, "fromBin")}
            className={`w-full px-3 bg-[#ffffff] py-2 border rounded focus:outline-none transition-colors ${getBorderClass(
              `bin_${bin.id}_fromBin`
            )}`}
          />
        </div>

        {/* To BIN */}
        <div className="w-full md:flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To BIN
          </label>
          <input
            type="text"
            maxLength={6}
            value={bin.toBin}
            onChange={(e) => handleChangeBin(e, bin.id, "toBin")}
            className={`w-full px-3 py-2 bg-[#ffffff] border rounded focus:outline-none transition-colors ${getBorderClass(
              `bin_${bin.id}_toBin`
            )}`}
          />
        </div>

        <button
          type="button"
          onClick={() => handleRemoveBinRange(bin.id)}
          className="text-red-600 hover:text-red-800 p-1 rounded-full self-end md:self-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}

    {/* Show error text inside container if empty */}
  </div>
</div>

          <div className="mt-4 bg-[#F7F9FB] border border-[#E2E8F0] rounded-md p-4 space-y-6">
            {/* Apple Tokens Section (No changes needed here) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div className="p-3">
                <label className="block text-sm text-gray-700 mb-2">
                  Apple Tokens
                </label>
                <textarea
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={handleTokenKeyDown}
                  className="w-full h-28 resize-none border border-[#B0B2F7] rounded p-2 text-sm focus:outline-none focus:border-[#7B3FE4] focus:ring-1 focus:ring-[#7B3FE4]"
                />
                <button
                  type="button"
                  onClick={handleAddTokens}
                  className="mt-3 px-8 h-9 bg-[#7747EE] text-white rounded-full text-sm"
                >
                  ADD
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-4 min-h-[160px]">
                <div className="max-h-[120px] overflow-auto hide-scroll">
                  <ul className="space-y-2">
                    {tokens.map((t) => (
                      <li
                        key={t.value}
                        className="flex items-center justify-between"
                      >
                        <label className="relative flex items-center gap-3 py-1 cursor-pointer select-none text-sm">
                          <input
                            type="checkbox"
                            checked={t.checked}
                            onChange={() => toggleTokenChecked(t.value)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 w-4 h-4"
                          />
                          <span
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                              t.checked
                                ? "border-[#7747EE]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <svg
                              className={`${
                                t.checked ? "opacity-100" : "opacity-0"
                              } w-3 h-3 text-[#7747EE] transition-opacity`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-xs text-gray-700 pl-1">
                            {t.value}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white rounded-b-lg flex items-center justify-between">
          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6F57F2] text-white text-sm"
            >
              <Check className="w-4 h-4" />{" "}
              <span className="text-sm">Active</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md bg-[#F8F9FC] text-[#000000] border border-[#E2E8F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#6F57F2] text-white flex items-center gap-2"
            >
              <span>{editingId ? "Update" : "Save"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SegmentForm;