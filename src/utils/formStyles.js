
export const getBorderClass = (hasError) => {
  return hasError
    ? "border-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 relative z-10"
    : "border-[#B0B2F7] focus:ring-1 focus:ring-[#7747EE] focus:border-[#7747EE] relative focus:z-10";
};