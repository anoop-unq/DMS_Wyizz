import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const BudgetSection = ({
  currency,
  setCurrency,
  fundAmount,
  setFundAmount,
  currencyList,
  loadingCurrencies,
  convertToBase,
  setConvertToBase,
  targetCurrencies,
  setTargetCurrencies,
  isSubmitting,
  errors,
  handleInputFocus, // Passed from parent to clear errors
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper for border logic
  const getBorderClass = (field) => {
    return errors[field]
      ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 relative z-10"
      : "border-gray-300 focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10";
  };

  const handleTargetSelect = (id) => {
    const numId = Number(id);
    if (targetCurrencies.includes(numId)) {
      setTargetCurrencies(targetCurrencies.filter((c) => c !== numId));
    } else {
      setTargetCurrencies([...targetCurrencies, numId]);
    }
  };

  return (
    <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Campaign Budget
      </h4>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        Base Currency & Campaign Fund <span className="text-red-500">*</span>
      </label>

      {/* --- CURRENCY + AMOUNT INPUT GROUP --- */}
      <div className="flex items-center mb-4 h-[42px] relative z-20">
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) {
                setIsDropdownOpen(!isDropdownOpen);
                // ✅ FIX: Clear the orange border immediately when clicked
                handleInputFocus("currency"); 
              }
            }}
            disabled={isSubmitting}
            className={`
              h-full flex items-center justify-between px-3
              min-w-[130px] border border-r-0 rounded-l-md outline-none
              transition-colors duration-200
              ${
                currency
                  ? "bg-[#7747EE] text-white border-transparent relative z-10" // Selected
                  : `bg-white text-gray-900 ${getBorderClass("currency")}`     // Unselected (shows Error if any)
              }
            `}
            style={{ borderRight: "none" }}
          >
            <span className="text-xs font-medium truncate mr-2">
              {(() => {
                if (loadingCurrencies) return "Loading...";
                if (!currency) return "Select";
                const selectedItem = currencyList.find((c) => c.id === Number(currency));
                return selectedItem
                  ? `${selectedItem.code} (${selectedItem.symbol})`
                  : "Select";
              })()}
            </span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition-transform ${
                isDropdownOpen ? "rotate-0" : ""
              } ${currency ? "text-white" : "text-gray-500"}`}
            />
          </button>

          {isDropdownOpen && !loadingCurrencies && (
            <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden text-xs max-h-60 overflow-y-auto">
              <div
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-500"
                onClick={() => {
                  setCurrency("");
                  setIsDropdownOpen(false);
                }}
              >
                Select
              </div>
              {currencyList.map((c) => (
                <div
                  key={c.id}
                  className="px-3 py-2 hover:bg-[#eef2ff] hover:text-[#7747EE] cursor-pointer text-gray-700 border-b border-gray-50 last:border-0"
                  onClick={() => {
                    setCurrency(c.id);
                    handleInputFocus("currency"); // Clear error on select too
                    setIsDropdownOpen(false);
                  }}
                >
                  {c.code} ({c.symbol})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 h-full relative z-0">
          <input
            type="text"
            inputMode="decimal"
            value={fundAmount}
            onChange={(e) => {
                 // Check valid number input
                 if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                    setFundAmount(e.target.value);
                 }
            }}
            onFocus={() => handleInputFocus("fundAmount")}
            className={`
              w-full h-full bg-[#ffffff] border rounded-r-md px-3 text-sm outline-none 
              ${getBorderClass("fundAmount")}
            `}
            placeholder="5000000"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* --- CONVERT TOGGLE --- */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-700">Convert To Base Currency</span>
        <div
          onClick={() => {
             if(!isSubmitting) {
                const newVal = !convertToBase;
                setConvertToBase(newVal);
                if(!newVal) setTargetCurrencies([]); // Clear targets if disabled
             }
          }}
          className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
            convertToBase ? "bg-[#7747EE]" : "bg-gray-300"
          } ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div
            className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${
              convertToBase ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      </div>

      {/* --- TARGET CURRENCIES --- */}
      {convertToBase && (
        <div
          className={`border border-blue-200 border-dashed rounded p-3 bg-blue-50/50 ${
            isSubmitting ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            {currencyList
              .filter((c) => c.id !== Number(currency))
              .map((c) => (
                <label
                  key={c.id}
                  onClick={() => !isSubmitting && handleTargetSelect(c.id)}
                  className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                      targetCurrencies.includes(c.id)
                        ? "bg-[#7747EE] border-[#7747EE]"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {targetCurrencies.includes(c.id) && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>
                  <span>{c.code}</span>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetSection;