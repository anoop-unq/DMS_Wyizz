import React, { useState, useEffect } from "react";
import BINConfig from "./BINConfig";
import DiscountConfiguration from "./DiscountConfiguration";
import Restrictions from "./Restrictions";
import Summary from "./Summary";
import FundSetup from "../FundSetup/FundSetUp";
import MccSelection from "./MCCSelection";
import CardNetworkType from "./CardNetworkType";
import Docs from "./Docs"; // ✅ Import New Component
import CampaignDetails from "../StepOne/CampaignDetails";


export default function CampaignForm({
  visible = true,
  onClose = () => {},
  initialData = null,
  onSuccess = () => {},
  onStep1Complete = () => {},
  onRefresh = () => {},
}) {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const LOCAL_STORAGE_KEY = "campaignFormData";

  // ✅ Updated Default State with Step 7 (Docs), Step 8 (Cards), Step 9 (Summary)
  const defaultState = {
    step1: {
      id: null,
      acquirer_campaign_id: null,
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      campaignType: "Discount Campaign",
      currency: "",
      fundAmount: "",
      bankShare: "",
      merchantShare: "",
      extraShares: [],
      convertToBase: false,
      targetCurrencies: [],
    },
    step2: {
      selectedSegments: [],
      selectedSegmentIds: [],
      segmentRanges: {},
      segmentTokens: {}, // ✅ Added this to track segment-specific tokens
    finalSegmentsData: [],
      // tokens: [],
    },
    step3: { ranges: [] },
    step4: {
      selectedCompanies: [],
      selectedMIDs: [],
      merchantBasedEnabled: false,
      perMerchantTerminals: {},
    },
    step5: {
      configurationType: "pattern",
      patternConfigs: [],
      specificDateConfigs: [],
    },
    step6: {
      discount_mccs: [],
    },
    step7: { // ✅ New Step 7: Docs
      discount_docs: [{ doc_name: "", doc_text: "" }] 
    },
    step8: { // ✅ Moved Cards to Step 8
      discount_card_networks: [],
      discount_card_types: [],
    },
    step9: {}, // ✅ Moved Summary to Step 9
  };

  const [formData, setFormData] = useState(defaultState);

  // ✅ Updated Steps Array with 9 Steps
  const steps = [
    "Campaign Details",
    "BIN Config",
    "Discounts/Rewards",
    "Mids/Tids Restrictions",
    "Time Restrictions",
    "MCC Config",
    "Docs",          // ✅ Step 7
    "Card Config",   // ✅ Step 8
    "Summary",       // ✅ Step 9
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  useEffect(() => {
    if (!visible) {
      setIsLoaded(false);
      setFormData(defaultState);
      setStep(1);
      return;
    }

    if (initialData) {
      const c = initialData.campaign || {};
      const d = initialData.discount || {};

      console.log("📝 CampaignForm: Parsing Initial Data:", c, d);

      const sponsors = d.discount_sponsors || [];
      const bankS = sponsors.find((s) => s.name === "Bank");
      const merchS = sponsors.find((s) => s.name === "Merchant");
      const extraS = sponsors.filter(
        (s) => s.name !== "Bank" && s.name !== "Merchant"
      );

      let targetIds = [];
      if (c.currencies && Array.isArray(c.currencies)) {
        targetIds = c.currencies
          .map((item) => (typeof item === "object" ? item.currency_id : item))
          .filter((id) => id !== c.base_currency_id);
      }

      const companyData = c.company_id
        ? [{ id: c.company_id, label: c.company_name || "Selected Merchant" }]
        : [];

      const segmentNames = (d.discount_segments || []).map(
        (s) => s.segment_name || s.name
      );
      const segmentIds = (d.discount_segments || []).map((s) => s.id);

      const existingMccs = d.discount_mccs || [];

      // Extract Card Data
      const existingNetworks = (d.discount_card_networks || []).map(
        (n) => n.id || n.card_network_id
      );
      const existingTypes = (d.discount_card_types || []).map(
        (t) => t.id || t.card_type_id
      );

      // ✅ Extract Docs Data
      const existingDocs = d.discount_docs || [];

      const newFormData = {
        step1: {
          id: c.id,
          acquirer_campaign_id: c.id,
          name: c.name || "",
          description: c.description || "",
          startDate: formatDate(c.start_date),
          endDate: formatDate(c.end_date),
          campaignType: c.type === "discount" ? "Discount Campaign" : c.type,
          currency: c.base_currency_id || "",
          fundAmount: c.total_budget || "",
          bankShare: bankS ? String(bankS.fund_percentage) : "0",
          merchantShare: merchS ? String(merchS.fund_percentage) : "0",
          extraShares: extraS.map((s) => ({
            name: s.name,
            share: String(s.fund_percentage),
          })),
          convertToBase: c.is_multi_currency === true,
          targetCurrencies: targetIds,
        },
        step2: {
          selectedSegments: segmentNames,
          selectedSegmentIds: segmentIds,
          segmentRanges: {},
          segmentTokens: {}, // No global tokens needed here anymore
    finalSegmentsData: (d.discount_segments || [])
          // tokens: [],
        },
        step3: { ranges: [] },
        step4: {
          selectedCompanies: companyData,
          selectedMIDs: [],
          merchantBasedEnabled: companyData.length > 0,
          perMerchantTerminals: {},
        },
        step5: {
          configurationType: "pattern",
          patternConfigs: [],
          specificDateConfigs: [],
        },
        step6: {
          discount_mccs: existingMccs,
        },
        step7: { // ✅ Populate Docs
            discount_docs: existingDocs.length > 0 ? existingDocs : [{ doc_name: "", doc_text: "" }]
        },
        step8: { // ✅ Populate Cards (Moved to 8)
          discount_card_networks: existingNetworks,
          discount_card_types: existingTypes,
        },
        step9: {}, // ✅ Summary (Moved to 9)
      };

      setFormData(newFormData);
      setTimeout(() => setIsLoaded(true), 100);
    } else {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData({ ...defaultState, ...parsedData });
        } catch (error) {
          setFormData(defaultState);
        }
      }
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [visible, initialData]);

  useEffect(() => {
    if (visible && isLoaded && !initialData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isLoaded, initialData, visible]);

  // const updateFormData = (stepKey, data) => {
  //   if (data === null || data === undefined) return;
  //   if (typeof data !== "object") data = {};

  //   const cleanData = Object.keys(data)
  //     .filter((key) => isNaN(parseInt(key)))
  //     .reduce((obj, key) => {
  //       obj[key] = data[key];
  //       return obj;
  //     }, {});

  //   setFormData((prev) => ({
  //     ...prev,
  //     [stepKey]: { ...prev[stepKey], ...cleanData },
  //   }));
  // };

  const updateFormData = (stepKey, data) => {
  if (!data) return;

  setFormData((prev) => ({
    ...prev,
    [stepKey]: { 
      ...prev[stepKey], // Keep existing fields like selectedSegments
      ...data           // Overwrite with incoming updates (new segment list)
    },
  }));
};

  const handleNext = () => {
    if (step === 1) {
      onStep1Complete();
    }

    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // ✅ Final Step Submitted
      if (!initialData) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      onSuccess();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!visible) return null;
  return (
    <div className="w-full p-0">
      <Stepper steps={steps} currentStep={step} onStepClick={setStep} />
      <div className="mb-6">
        {step === 1 && (
          <CampaignDetails
            key={`step1`}
            data={formData.step1}
            onUpdate={(data) => updateFormData("step1", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRefresh={onRefresh}
            isEditMode={!!initialData}
          />
        )}
        {step === 2 && (
          <BINConfig
            key={`step2`}
            data={formData.step2}
            onUpdate={(data) => updateFormData("step2", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRefresh={onRefresh}
            campaignId={formData.step1.id}
            isEditMode={!!initialData}
          />
        )}
        {step === 3 && (
          <DiscountConfiguration
            key={`step3`}
            data={formData.step3}
            onUpdate={(data) => updateFormData("step3", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onRefresh={onRefresh}
            campaignId={formData.step1.id}
            isEditMode={!!initialData}
          />
        )}
        {step === 4 && (
          <Restrictions
            key={`step4`}
            data={formData.step4}
            onUpdate={(data) => updateFormData("step4", data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            allCompanies={[]}
            campaignId={formData.step1.id}
            onRefresh={onRefresh}
            isEditMode={!!initialData}
          />
        )}
        {step === 5 && (
          <FundSetup
            key={`step5`}
            data={formData.step5}
            onUpdate={(data) => updateFormData("step5", data)}
            onNext={handleNext}
            onMainDateUpdate={(dateData) => updateFormData("step1", dateData)}
            onPrevious={handlePrevious}
            campaignDatesFromProps={formData.step1}
            campaignId={formData.step1.id}
            onRefresh={onRefresh}
            isEditMode={!!initialData}
          />
        )}
        {step === 6 && (
          <MccSelection
            key={`step6`}
            data={formData.step6}
            onUpdate={(data) => updateFormData("step6", data)}
            onNext={handleNext}
            campaignId={formData.step1.id}
            onPrevious={handlePrevious}
            onRefresh={onRefresh}
            isEditMode={!!initialData}
          />
        )}
        {/* ✅ New Step 7: Docs */}
        {step === 7 && (
            <Docs
                key={`step7`}
                data={formData.step7}
                onUpdate={(data) => updateFormData("step7", data)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onRefresh={onRefresh}
                campaignId={formData.step1.id}
                isEditMode={!!initialData}
            />
        )}
        {/* ✅ Moved to Step 8: Card Network/Type */}
        {step === 8 && (
          <CardNetworkType
            key={`step8`}
            data={formData.step8}
            onUpdate={(data) => updateFormData("step8", data)}
            onNext={handleNext}
            campaignId={formData.step1.id}
            onPrevious={handlePrevious}
            onRefresh={onRefresh}
            isEditMode={!!initialData}
          />
        )}
        {/* ✅ Moved to Step 9: Summary */}
        {step === 9 && (
          <Summary
            data={formData}
            onPrevious={handlePrevious}
            onSubmit={handleNext}
            isEditMode={!!initialData}
            onRefresh={onRefresh}
            campaignId={formData.step1.id}
            onUpdate={(data) => updateFormData("step1", data)}
          />
        )}
      </div>
    </div>
  );
}


const Stepper = ({ steps, currentStep, onStepClick }) => (
  <div className="bg-white border border-gray-200 rounded-md p-3 mb-6 shadow-sm overflow-x-scroll hide-scroll">
    <div className="flex items-center justify-between px-2 min-w-max">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        return (
          <React.Fragment key={label}>
            <div
              className="flex flex-col items-center relative z-10 mx-1"
              style={{ width: 64 }}
            >
              <div
                onClick={() => onStepClick(stepNumber)}
                className="flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                style={{
                  width: isActive ? 40 : 36,
                  height: isActive ? 40 : 36,
                  background: isActive ? "#EFE7FF" : "transparent",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-full text-sm font-medium"
                  style={{
                    width: 26,
                    height: 26,
                    background: isActive
                      ? "linear-gradient(90deg,#7B3FE4,#9B5DF7)"
                      : "#F3F4F6",
                    color: isActive ? "#fff" : "#6B7280",
                    boxShadow: isActive
                      ? "0 2px 6px rgba(123,63,228,0.18)"
                      : "none",
                  }}
                >
                  {stepNumber}
                </div>
              </div>
              <div
                className={`mt-2 text-center font-medium leading-tight ${
                  isActive ? "text-[#7B3FE4]" : "text-gray-500"
                }`}
                style={{ fontSize: "10px" }}
              >
                {label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center justify-center px-1">
                <div
                  className="h-[1.5px] w-full bg-gray-200"
                  style={{ minWidth: 20, maxWidth: 60 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);


