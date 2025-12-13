import React, { useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { campaignDiscountApi, campaignApi } from "../utils/metadataApi";
import StepHeader from "../StepReusable/Stepheader";

const DiscountConfiguration = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
  campaignId,
  isEditMode,
  onRefresh,
}) => {
  // --- STATE MANAGEMENT ---

  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [isNextSubmitting, setIsNextSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Track validation errors: { "rangeId_fieldName": true }
  const [errors, setErrors] = useState({});

  const isAnySubmitting =
    isUpdateSubmitting || isNextSubmitting || isLoadingData;

  const defaultRange = (idSuffix = "") => ({
    id: `range_${Date.now()}_${idSuffix}`,
    minTxn: "",
    maxTxn: "",
    value: "",
    valueType: "%",
    txnCap: "",
    taxPercent: "",
    limitDaily: "",
    limitWeekly: "",
    limitMonthly: "",
  });

  const [ranges, setRanges] = useState([]);

  // --- HELPER: Format Data for API Payload ---
  const prepareFinalData = (currentRanges) => {
    return currentRanges.map((r) => ({
      min_txn_amount: r.minTxn ? parseFloat(r.minTxn) : 0,
      max_txn_amount: r.maxTxn ? parseFloat(r.maxTxn) : null,
      is_percentage: r.valueType === "%",
      discount_percentage:
        r.valueType === "%" && r.value ? parseFloat(r.value) : null,
      discount_amount:
        r.valueType === "$" && r.value ? parseFloat(r.value) : null,
      max_discount_cap: r.txnCap ? parseFloat(r.txnCap) : null,
      tax_percentage: r.taxPercent ? parseFloat(r.taxPercent) : null,
      daily: r.limitDaily ? parseInt(r.limitDaily, 10) : null,
      weekly: r.limitWeekly ? parseInt(r.limitWeekly, 10) : null,
      monthly: r.limitMonthly ? parseInt(r.limitMonthly, 10) : null,
    }));
  };

  // --- HELPER: Map API Data to Local State ---
  const mapApiDataToState = (discountData) => {
    const discountAmounts = discountData.discount_amounts || [];
    if (discountAmounts.length > 0) {
      const newRanges = discountAmounts.map((r, idx) => ({
        id: `range_${Date.now()}_${idx}`,
        minTxn: r.min_txn_amount || "",
        maxTxn: r.max_txn_amount || "",
        value: r.is_percentage ? r.discount_percentage : r.discount_amount,
        valueType: r.is_percentage ? "%" : "$",
        txnCap: r.max_discount_cap || "",
        taxPercent: r.tax_percentage || "",
        limitDaily: r.daily || "",
        limitWeekly: r.weekly || "",
        limitMonthly: r.monthly || "",
      }));
      setRanges(newRanges);
      updateParent(newRanges);
    } else {
      if (ranges.length === 0) setRanges([defaultRange("1")]);
    }
  };

  // --- 1. Fetch Existing Discount Data ---
  useEffect(() => {
    if (campaignId) {
      const fetchDiscountData = async () => {
        setIsLoadingData(true);
        try {
          const res = await campaignDiscountApi.getById(campaignId);
          const d = res.data?.discount || {};
          if (d && d.discount_amounts) {
            mapApiDataToState(d);
          } else {
            setRanges([defaultRange("1")]);
          }
        } catch (err) {
          console.error("Failed to load discount details for step 3", err);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchDiscountData();
    }
  }, [campaignId]);

  // --- 2. Initialize from Props (Backup) ---
  useEffect(() => {
    if (data && data.ranges && ranges.length === 0 && !isLoadingData) {
      setRanges(data.ranges);
    } else if (ranges.length === 0 && !isLoadingData) {
      setRanges([defaultRange("init")]);
    }
  }, [data]);

  // --- CRUD Handlers ---
  const updateParent = (newRanges) => {
    onUpdate({
      ranges: newRanges,
      finalDiscountAmounts: prepareFinalData(newRanges),
    });
  };

  const addRange = () => {
    const newRanges = [...ranges, defaultRange(String(ranges.length + 1))];
    setRanges(newRanges);
    updateParent(newRanges);
  };

  const removeRange = (id) => {
    const newRanges = ranges.filter((r) => r.id !== id);
    setRanges(newRanges);
    updateParent(newRanges);

    // Cleanup errors for removed ID
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(id)) delete newErrors[key];
    });
    setErrors(newErrors);
  };

  // ✅ Handle Input Change (Only Numbers)
  const handleInputChange = (id, field, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const newRanges = ranges.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      );
      setRanges(newRanges);
      updateParent(newRanges);

      // Clear error on change
      if (value !== "") {
        setErrors((prev) => {
          const newErrs = { ...prev };
          delete newErrs[`${id}_${field}`];
          return newErrs;
        });
      }
    }
  };

  // ✅ Handle Focus (Remove border on click)
  const handleInputFocus = (id, field) => {
    if (errors[`${id}_${field}`]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[`${id}_${field}`];
        return newErrs;
      });
    }
  };

  const updateRangeType = (id, val) => {
    const newRanges = ranges.map((r) =>
      r.id === id ? { ...r, valueType: val } : r
    );
    setRanges(newRanges);
    updateParent(newRanges);
  };

  // --- 🚀 SUBMIT LOGIC ---
  const handleSubmit = async (action) => {
    let isValid = true;
    let errorMessage = "Please fill all required fields correctly.";
    const newErrors = {};

    const requiredFields = [
      "minTxn",
      "maxTxn",
      "value",
      "txnCap",
      "taxPercent",
      "limitDaily",
      "limitWeekly",
      "limitMonthly",
    ];

    ranges.forEach((r) => {
      // 1. Empty Check
      requiredFields.forEach((field) => {
        if (!r[field] && r[field] !== 0) {
          newErrors[`${r.id}_${field}`] = true;
          isValid = false;
        }
      });

      // 2. Min > Max Validation (Float comparison)
      if (r.minTxn && r.maxTxn) {
        const min = parseFloat(r.minTxn);
        const max = parseFloat(r.maxTxn);
        if (min > max) {
          newErrors[`${r.id}_minTxn`] = true;
          newErrors[`${r.id}_maxTxn`] = true;
          isValid = false;
          errorMessage = "Min Txn cannot be greater than Max Txn.";
        }
      }

      // 3. Percentage Validation (0 - 100)
      if (r.valueType === "%" && r.value) {
        const val = parseFloat(r.value);
        if (val < 0 || val > 100) {
          newErrors[`${r.id}_value`] = true;
          isValid = false;
          errorMessage = "Discount Percentage must be between 0 to 100.";
        }
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        confirmButtonText: "Okay, I'll fix it",
        text: errorMessage,
        background: "#F7F9FB",
        border: "1px solid #E2E8F0",
        color: "#404041ff",
        confirmButtonColor: "#7747EE",
      });
      return;
    }

    let shouldCallApi = true;
    if (isEditMode && action === "next") shouldCallApi = false;

    if (shouldCallApi) {
      if (action === "update") setIsUpdateSubmitting(true);
      else setIsNextSubmitting(true);
    }

    try {
      const formattedAmounts = prepareFinalData(ranges);
      updateParent(ranges);

      if (shouldCallApi) {
        if (!campaignId) throw new Error("Missing Campaign ID.");
        const payload = { discount: { discount_amounts: formattedAmounts } };
        await campaignDiscountApi.update(campaignId, payload);

        if (action === "update") {
          if (onRefresh) await onRefresh();

          // ✅ Success Swal for Update
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Discount configuration updated successfully.",
            background: "#00201E",
            color: "#f1f5f9",
            confirmButtonColor: "#F3C27F",
            timer: 2000,
          });
        }
      }
      if (action === "next") onNext();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Unknown error";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to save: ${errorMsg}`,
        background: "#00201E",
        color: "#f1f5f9",
        confirmButtonColor: "#F3C27F",
      });
    } finally {
      setIsUpdateSubmitting(false);
      setIsNextSubmitting(false);
    }
  };

  const fmt = (v) => (v === "" || v == null ? "—" : String(v));
  const isFormDisabled = isAnySubmitting;

  // Helper to get border class based on error state
  // ✅ Uses orange border for errors
  const getBorderClass = (id, field) => {
    return errors[`${id}_${field}`]
      ? "border-orange-500 focus:ring-orange-500 focus:border-orange-500"
      : "border-gray-300 focus:ring-[#7747EE] focus:border-[#7747EE]";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      {/* Header */}
            <StepHeader step={3} totalSteps={9} title="Discount Configuration" />

      {/* Main Content Area */}
      <div className="bg-[#F7F9FB] border border-gray-100 rounded p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Amount Ranges</div>
          <div className="flex items-center gap-2">
            <button
              onClick={addRange}
              className="px-3 py-1 text-sm rounded bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isFormDisabled}
            >
              + Add Range
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto hide-scroll pr-1 custom-scrollbar">
          {ranges.map((r, idx) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {/* 1. Number */}
                <div className="flex-shrink-0 self-center">
                  <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#7747EE] text-[#FFFFFF] font-medium text-xs shadow-sm">
                    {idx + 1}
                  </span>
                </div>

                {/* 2. Inputs Grid */}
                <div className="flex-grow grid grid-cols-12 gap-3 items-center">
                  {/* Min Txn */}
                  <div className="col-span-6 lg:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Min Txn *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.minTxn}
                      placeholder="1000"
                      onChange={(e) =>
                        handleInputChange(r.id, "minTxn", e.target.value)
                      }
                      onFocus={() => handleInputFocus(r.id, "minTxn")}
                      className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 ${getBorderClass(
                        r.id,
                        "minTxn"
                      )}`}
                      disabled={isFormDisabled}
                    />
                  </div>

                  {/* Max Txn */}
                  <div className="col-span-6 lg:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Max Txn *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.maxTxn}
                      placeholder="50000"
                      onChange={(e) =>
                        handleInputChange(r.id, "maxTxn", e.target.value)
                      }
                      onFocus={() => handleInputFocus(r.id, "maxTxn")}
                      className={`w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 ${getBorderClass(
                        r.id,
                        "maxTxn"
                      )}`}
                      disabled={isFormDisabled}
                    />
                  </div>

                  {/* Value */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Value *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={r.value}
                        placeholder="10"
                        onChange={(e) =>
                          handleInputChange(r.id, "value", e.target.value)
                        }
                        onFocus={() => handleInputFocus(r.id, "value")}
                        className={`w-full border rounded-l px-2 py-1.5 text-sm focus:outline-none focus:ring-1 border-r-0 disabled:bg-gray-50 ${getBorderClass(
                          r.id,
                          "value"
                        )}`}
                        disabled={isFormDisabled}
                      />
                      <div className="inline-flex shrink-0">
                        <button
                          onClick={() => updateRangeType(r.id, "%")}
                          className={`px-2 py-1.5 text-xs border rounded-l-none border-gray-300 border-l-0 transition-colors disabled:opacity-50 ${
                            r.valueType === "%"
                              ? "bg-[#7747EE] text-white border-[#7747EE]"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                          disabled={isFormDisabled}
                        >
                          %
                        </button>
                        <button
                          onClick={() => updateRangeType(r.id, "$")}
                          className={`px-2 py-1.5 text-xs border border-gray-300 border-l-0 rounded-r transition-colors disabled:opacity-50 ${
                            r.valueType === "$"
                              ? "bg-[#7747EE] text-white border-[#7747EE]"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                          disabled={isFormDisabled}
                        >
                          $
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Usage Limits */}
                  <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Limits (D/W/M) *
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={r.limitDaily}
                        placeholder="D"
                        onChange={(e) =>
                          handleInputChange(r.id, "limitDaily", e.target.value)
                        }
                        onFocus={() => handleInputFocus(r.id, "limitDaily")}
                        className={`w-full border rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 text-center disabled:bg-gray-50 ${getBorderClass(
                          r.id,
                          "limitDaily"
                        )}`}
                        disabled={isFormDisabled}
                        title="Daily"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={r.limitWeekly}
                        placeholder="W"
                        onChange={(e) =>
                          handleInputChange(r.id, "limitWeekly", e.target.value)
                        }
                        onFocus={() => handleInputFocus(r.id, "limitWeekly")}
                        className={`w-full border rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 text-center disabled:bg-gray-50 ${getBorderClass(
                          r.id,
                          "limitWeekly"
                        )}`}
                        disabled={isFormDisabled}
                        title="Weekly"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={r.limitMonthly}
                        placeholder="M"
                        onChange={(e) =>
                          handleInputChange(
                            r.id,
                            "limitMonthly",
                            e.target.value
                          )
                        }
                        onFocus={() => handleInputFocus(r.id, "limitMonthly")}
                        className={`w-full border rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 text-center disabled:bg-gray-50 ${getBorderClass(
                          r.id,
                          "limitMonthly"
                        )}`}
                        disabled={isFormDisabled}
                        title="Monthly"
                      />
                    </div>
                  </div>

                  {/* Cap */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Cap *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.txnCap}
                      placeholder="0"
                      onChange={(e) =>
                        handleInputChange(r.id, "txnCap", e.target.value)
                      }
                      onFocus={() => handleInputFocus(r.id, "txnCap")}
                      className={`w-full border rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 ${getBorderClass(
                        r.id,
                        "txnCap"
                      )}`}
                      disabled={isFormDisabled}
                    />
                  </div>

                  {/* Tax */}
                  <div className="col-span-6 sm:col-span-3 lg:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Tax% *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.taxPercent}
                      placeholder="0"
                      onChange={(e) =>
                        handleInputChange(r.id, "taxPercent", e.target.value)
                      }
                      onFocus={() => handleInputFocus(r.id, "taxPercent")}
                      className={`w-full border rounded px-1 py-1.5 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 ${getBorderClass(
                        r.id,
                        "taxPercent"
                      )}`}
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>

                {/* 3. Delete Button */}
                <div className="flex-shrink-0 self-center">
                  <button
                    onClick={() => removeRange(r.id)}
                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                    title="Remove Range"
                    disabled={isFormDisabled}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div
        className="bg-[#F7F9FB] overflow-y-auto hide-scroll border border-gray-100 rounded p-4 mb-4"
        style={{ maxHeight: "150px" }}
      >
        <div className="text-sm font-medium mb-3">Amount Ranges Preview</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          {ranges.length === 0 || (ranges.length === 1 && !ranges[0].minTxn) ? (
            <div className="text-gray-400 text-xs italic col-span-full">
              Add ranges above to see preview.
            </div>
          ) : (
            ranges.map((r, idx) => {
              if (!r.minTxn && !r.value) return null;
              const left = `${fmt(r.minTxn)} - ${fmt(r.maxTxn)}`;
              const valueLabel = r.value
                ? `${fmt(r.value)}${r.valueType === "%" ? "%" : " Fixed"}`
                : "";
              return (
                <div
                  key={`preview-${r.id}`}
                  className="flex gap-3 items-start bg-white p-2 rounded border border-gray-100"
                >
                  <div className="font-medium text-[#7747EE] text-xs pt-0.5">
                    {idx + 1}.
                  </div>
                  <div className="text-gray-700 w-full">
                    <div className="flex justify-between font-medium">
                      <span>Spend: {left}</span>
                      <span className="text-green-600">{valueLabel} OFF</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex gap-2 flex-wrap">
                      {r.txnCap && (
                        <span className="bg-gray-100 px-1 rounded">
                          Cap: {fmt(r.txnCap)}
                        </span>
                      )}
                      {r.taxPercent && (
                        <span className="bg-gray-100 px-1 rounded">
                          Tax: {fmt(r.taxPercent)}%
                        </span>
                      )}
                      {r.limitDaily && (
                        <span className="bg-gray-100 px-1 rounded">
                          D: {r.limitDaily}
                        </span>
                      )}
                      {r.limitWeekly && (
                        <span className="bg-gray-100 px-1 rounded">
                          W: {r.limitWeekly}
                        </span>
                      )}
                      {r.limitMonthly && (
                        <span className="bg-gray-100 px-1 rounded">
                          M: {r.limitMonthly}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
 <div className="mt-6 border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
  
  {/* PREVIOUS BUTTON */}
  <button
    onClick={onPrevious}
    disabled={isFormDisabled}
    className="bg-white border border-[#E2E8F0] rounded-[5px] px-6 py-[5px] text-[#000000] text-[14px] font-normal tracking-[-0.03em] disabled:opacity-50"
  >
    <span className="flex justify-center items-center gap-2">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Previous
    </span>
  </button>

  <div className="flex gap-3">
    
    {/* UPDATE BUTTON (Edit Mode Only) */}
    {isEditMode && (
      <button
        onClick={() => handleSubmit("update")}
        disabled={isFormDisabled}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center gap-2 disabled:opacity-70 transition-colors"
      >
        {isUpdateSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : null}
        {isUpdateSubmitting ? "Updating..." : "Update"}
      </button>
    )}

    {/* NEXT BUTTON */}
    <button
      onClick={() => handleSubmit("next")}
      disabled={isFormDisabled || isLoadingData}
      className="bg-[#6366F1] border border-[#E2E8F0] rounded-[5px] px-8 py-[5px] text-[#ffffff] text-[14px] font-normal tracking-[-0.03em] flex items-center justify-center disabled:opacity-70"
    >
      {isNextSubmitting ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      {isNextSubmitting ? "Saving..." : "Next →"}
    </button>
  </div>
</div>

      {/* {isAnySubmitting && (
                <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7747EE]" />
                </div>
            )} */}
    </div>
  );
};

export default DiscountConfiguration;
