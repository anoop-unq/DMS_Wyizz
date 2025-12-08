import { HiOutlineMenu } from "react-icons/hi";

export default function HamburgerMenu({ setSidebarToggle, isMobile }) {
  return (
    <button
      className="text-gray-600 p-2 hover:text-gray-800 transition-colors md:hidden"
      onClick={() => setSidebarToggle((prev) => !prev)}
    >
      <HiOutlineMenu size={20} />
    </button>
  );
}