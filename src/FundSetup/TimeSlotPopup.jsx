import React from "react";
import { X, Clock, Calendar, Watch } from "lucide-react";

const TimeSlotPopup = ({ date, timeSlots = [], onClose }) => {
  const formatDate = (date) => {
    if (!date) return "No date selected";
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeForDisplay = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const convertTo24H = (time, period) => {
    if (!time) return "";
    let [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Time Slot Details</h3>
                <p className="text-sm text-gray-600 mt-1">{formatDate(date)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-800">Total Restrictions</p>
                <p className="text-2xl font-bold text-blue-900">{timeSlots.length}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Time Slots</p>
                <p className="text-2xl font-bold text-blue-900">{timeSlots.length}</p>
              </div>
            </div>
          </div>

          {/* Restrictions List */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Time Slots</h4>
            
            {timeSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No time restrictions for this date</p>
              </div>
            ) : (
              timeSlots.map((slot, index) => (
                <div key={slot.id || index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${
                        slot.type === "pattern" 
                          ? 'from-blue-500 to-purple-600' 
                          : 'from-green-500 to-emerald-600'
                      } text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm`}>
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-base font-semibold text-gray-900">
                          {slot.type === "pattern" ? slot.label : 'Specific Date'}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            slot.type === "pattern" 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                          }`}>
                            {slot.type === "pattern" ? "Pattern-based" : "Specific Date"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Watch className="w-3 h-3" />
                            Time Slot
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Configuration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Time Range
                    </label>
                    <div className="px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-lg text-sm font-medium border border-purple-200 flex items-center justify-between">
                      <span>
                        {formatTimeForDisplay(convertTo24H(slot.startTime, slot.startPeriod))} - {formatTimeForDisplay(convertTo24H(slot.endTime, slot.endPeriod))}
                      </span>
                      <div className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">
                        {slot.type === "pattern" ? "Pattern" : "Specific"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-[#7B3FE4] to-[#9B5DF7] text-white rounded-xl font-semibold hover:from-[#6B2FD4] hover:to-[#8B4DE7] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPopup;