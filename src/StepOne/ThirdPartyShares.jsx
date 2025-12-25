// import React, { useState } from "react";
// import { Trash2, Edit, X } from "lucide-react";

// const ThirdPartyShares = ({
//   shares,
//   onUpdateShares,
//   isSubmitting,
//   calculateAmount,
// }) => {
//   // --- Local State for Modal ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newPartyName, setNewPartyName] = useState("");
//   const [newPartyShare, setNewPartyShare] = useState("");
//   const [editingShareIndex, setEditingShareIndex] = useState(null);

//   // --- Handlers ---
//   const openAddShareModal = () => {
//     setNewPartyName("");
//     setNewPartyShare("");
//     setEditingShareIndex(null);
//     setIsModalOpen(true);
//   };

//   const openEditShareModal = (index) => {
//     const itemToEdit = shares[index];
//     setNewPartyName(itemToEdit.name);
//     setNewPartyShare(itemToEdit.share);
//     setEditingShareIndex(index);
//     setIsModalOpen(true);
//   };

//   const handleDeleteShare = (index) => {
//     const updatedShares = shares.filter((_, i) => i !== index);
//     onUpdateShares(updatedShares);
//   };

//   const handleSaveShare = () => {
//     if (!newPartyName || !newPartyShare) return;

//     let updatedShares = [...shares];

//     if (editingShareIndex !== null) {
//       // UPDATE EXISTING
//       updatedShares[editingShareIndex] = {
//         name: newPartyName,
//         share: newPartyShare,
//       };
//     } else {
//       // ADD NEW
//       updatedShares.push({
//         name: newPartyName,
//         share: newPartyShare,
//       });
//     }

//     onUpdateShares(updatedShares);

//     // Reset & Close
//     setIsModalOpen(false);
//     setNewPartyName("");
//     setNewPartyShare("");
//     setEditingShareIndex(null);
//   };

//   return (
//     <div className="bg-[#F7F9FB] border border-[#E2E8F0] p-4 rounded mb-6">
//       <div className="flex items-center justify-between mb-3">
//         <h4 className="text-sm font-semibold text-gray-800">
//           Third Party Shares
//         </h4>
//         <button
//           onClick={openAddShareModal}
//           className="bg-[#7747EE] text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1 shadow-sm disabled:opacity-50"
//           disabled={isSubmitting}
//         >
//           <span>+</span> Add Share
//         </button>
//       </div>

//       {shares.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[170px] hide-scroll overflow-y-auto pr-1">
//           {shares.map((share, idx) => (
//             <div
//               key={idx}
//               className="bg-white p-3 rounded border border-[#E2E8F0] relative group"
//             >
//               <div className="flex justify-between items-center mb-1">
//                 <label className="text-xs font-medium text-gray-700">
//                   {share.name} Share (%)
//                 </label>
//                 <span className="text-[10px] text-gray-500 font-medium">
//                   Amount: {calculateAmount(share.share)}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="relative flex-1">
//                   <input
//                     type="text"
//                     value={share.share}
//                     disabled
//                     className="w-full border border-gray-100 bg-gray-50 rounded px-3 py-1.5 text-sm text-gray-500"
//                   />
//                   <span className="absolute right-3 top-1.5 text-gray-400 text-xs">
//                     %
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => openEditShareModal(idx)}
//                   disabled={isSubmitting}
//                   className="text-gray-400 hover:text-[#7747EE] transition-colors"
//                   title="Edit Share"
//                 >
//                   <Edit size={14} />
//                 </button>

//                 <button
//                   onClick={() => handleDeleteShare(idx)}
//                   disabled={isSubmitting}
//                   className="text-gray-400 hover:text-red-500 transition-colors"
//                   title="Delete Share"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* --- MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//               <h3 className="text-gray-800 font-semibold">
//                 {editingShareIndex !== null ? "Edit Share" : "Add Share"}
//               </h3>
//               <button onClick={() => setIsModalOpen(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6">
//               <input
//                 type="text"
//                 className="w-full border border-[#E2E8F0] bg-white outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] rounded-lg px-3 py-2.5 text-sm mb-4"
//                 placeholder="Party name"
//                 value={newPartyName}
//                 onChange={(e) => setNewPartyName(e.target.value)}
//               />
//               <input
//                 type="text"
//                 inputMode="decimal"
//                 className="w-full border border-[#E2E8F0] bg-white outline-none focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] rounded-lg px-3 py-2.5 text-sm"
//                 placeholder="40"
//                 value={newPartyShare}
//                 onChange={(e) => {
//                     // Allow only numbers/decimals
//                     if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
//                         setNewPartyShare(e.target.value);
//                     }
//                 }}
//               />
//             </div>
//             <div className="px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2 rounded-full border border-[#7747EE] text-[#7747EE] text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveShare}
//                 className="px-6 py-2 rounded-full bg-[#7747EE] text-white text-sm"
//               >
//                 {editingShareIndex !== null ? "Update" : "Add"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ThirdPartyShares;


import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Trash2, Edit, X } from "lucide-react";

const ThirdPartyShares = forwardRef(({
  shares,
  onUpdateShares,
  isSubmitting,
  calculateAmount,
}, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyShare, setNewPartyShare] = useState("");
  const [editingShareIndex, setEditingShareIndex] = useState(null);

  // Expose this function to CampaignDetails
  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setNewPartyName("");
      setNewPartyShare("");
      setEditingShareIndex(null);
      setIsModalOpen(true);
    }
  }));

  const openEditShareModal = (index) => {
    const itemToEdit = shares[index];
    setNewPartyName(itemToEdit.name);
    setNewPartyShare(itemToEdit.share);
    setEditingShareIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteShare = (index) => {
    const updatedShares = shares.filter((_, i) => i !== index);
    onUpdateShares(updatedShares);
  };

  const handleSaveShare = () => {
    if (!newPartyName || !newPartyShare) return;
    let updatedShares = [...shares];
    if (editingShareIndex !== null) {
      updatedShares[editingShareIndex] = { name: newPartyName, share: newPartyShare };
    } else {
      updatedShares.push({ name: newPartyName, share: newPartyShare });
    }
    onUpdateShares(updatedShares);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* List display only */}
      {shares.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[170px] hide-scroll overflow-y-auto pr-1 mt-4">
          {shares.map((share, idx) => (
            <div key={idx} className="bg-white p-3 rounded border border-[#E2E8F0] relative group">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700">{share.name} Share (%)</label>
                <span className="text-[10px] text-gray-500 font-medium">Amount: {calculateAmount(share.share)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input type="text" value={share.share} disabled className="w-full border border-gray-100 bg-gray-50 rounded px-3 py-1.5 text-sm text-gray-500" />
                  <span className="absolute right-3 top-1.5 text-gray-400 text-xs">%</span>
                </div>
                <button onClick={() => openEditShareModal(idx)} disabled={isSubmitting} className="text-gray-400 hover:text-[#7747EE] transition-colors"><Edit size={14} /></button>
                <button onClick={() => handleDeleteShare(idx)} disabled={isSubmitting} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal remains here for logic isolation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-gray-800 font-semibold">{editingShareIndex !== null ? "Edit Share" : "Add Share"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <input type="text" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm mb-4 outline-none focus:border-[#7747EE]" placeholder="Party name" value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} />
              <input type="text" inputMode="decimal" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7747EE]" placeholder="40" value={newPartyShare} onChange={(e) => { if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) setNewPartyShare(e.target.value); }} />
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-full border border-[#7747EE] text-[#7747EE] text-sm">Cancel</button>
              <button onClick={handleSaveShare} className="px-6 py-2 rounded-full bg-[#7747EE] text-white text-sm">{editingShareIndex !== null ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default ThirdPartyShares;