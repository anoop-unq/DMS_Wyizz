import React, { useRef } from "react";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  Link as LinkIcon, 
  Code 
} from "lucide-react";

const MarkdownEditor = ({ value, onChange, disabled, placeholder }) => {
  const textareaRef = useRef(null);

  // Helper function to insert markdown characters
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Grab the selected text
    const selectedText = text.substring(start, end);
    
    // Create the new text string
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;

    // Update parent state
    onChange(newText);

    // Re-focus and restore selection (slightly adjusted for the inserted chars)
    // We use a timeout to let React render the new value first
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  return (
    <div className={`border border-gray-300 rounded-md overflow-hidden bg-white ${disabled ? "opacity-60" : ""}`}>
      {/* --- Toolbar --- */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton 
          icon={<Bold size={16} />} 
          label="Bold" 
          onClick={() => insertMarkdown("**", "**")} 
          disabled={disabled}
        />
        <ToolbarButton 
          icon={<Italic size={16} />} 
          label="Italic" 
          onClick={() => insertMarkdown("*", "*")} 
          disabled={disabled}
        />
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <ToolbarButton 
          icon={<Heading1 size={16} />} 
          label="H1" 
          onClick={() => insertMarkdown("# ", "")} 
          disabled={disabled}
        />
        <ToolbarButton 
          icon={<Heading2 size={16} />} 
          label="H2" 
          onClick={() => insertMarkdown("## ", "")} 
          disabled={disabled}
        />
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <ToolbarButton 
          icon={<List size={16} />} 
          label="List" 
          onClick={() => insertMarkdown("- ", "")} 
          disabled={disabled}
        />
        <ToolbarButton 
          icon={<Code size={16} />} 
          label="Code" 
          onClick={() => insertMarkdown("`", "`")} 
          disabled={disabled}
        />
      </div>

      {/* --- Text Area --- */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={4} // Increased height for better editing
        className="w-full p-3 text-sm focus:outline-none resize-y min-h-[100px] font-mono"
        style={{ fontFamily: '"Menlo", "Consolas", "Courier New", monospace' }} 
      />
    </div>
  );
};

// Small helper component for the buttons
const ToolbarButton = ({ icon, onClick, disabled, label }) => (
  <button
    type="button" // Important! prevents form submission
    onClick={onClick}
    disabled={disabled}
    title={label}
    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors disabled:cursor-not-allowed"
  >
    {icon}
  </button>
);

export default MarkdownEditor;