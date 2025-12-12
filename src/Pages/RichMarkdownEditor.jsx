import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Minus, Code,
  Eye, PenLine, Link
} from "lucide-react";

const RichMarkdownEditor = ({ value, onChange, disabled, placeholder, height = 75 }) => {
  const [activeTab, setActiveTab] = useState("write");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && activeTab === "write") {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(height, textarea.scrollHeight)}px`;
    }
  }, [value, activeTab, height]);

  // --- 1. INLINE STYLES ---
  const toggleInlineStyle = (wrapper) => {
    if (activeTab === "preview") return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    // Check if already wrapped
    const isWrapped = before.endsWith(wrapper) && after.startsWith(wrapper);

    let newText;
    let newCursorStart, newCursorEnd;

    if (isWrapped) {
      // Remove wrapper
      newText = before.slice(0, -wrapper.length) + selectedText + after.slice(wrapper.length);
      newCursorStart = start - wrapper.length;
      newCursorEnd = end - wrapper.length;
    } else {
      // Add wrapper
      newText = before + wrapper + selectedText + wrapper + after;
      newCursorStart = start + wrapper.length;
      newCursorEnd = end + wrapper.length;
    }

    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  // --- 2. BLOCK STYLES ---
  const toggleBlockStyle = (prefix) => {
    if (activeTab === "preview") return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;

    // Get current line
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = text.indexOf("\n", start);
    if (lineEnd === -1) lineEnd = text.length;

    const currentLine = text.substring(lineStart, lineEnd);
    const beforeLine = text.substring(0, lineStart);
    const afterLine = text.substring(lineEnd);

    // Check for existing block styles
    const existingPrefixes = ["# ", "## ", "### ", "- ", "1. ", "> "];
    let existingPrefix = "";
    
    for (const p of existingPrefixes) {
      if (currentLine.startsWith(p)) {
        existingPrefix = p;
        break;
      }
    }

    let newLine;
    if (existingPrefix) {
      if (existingPrefix === prefix) {
        // Remove if same
        newLine = currentLine.substring(existingPrefix.length);
      } else {
        // Replace
        newLine = prefix + currentLine.substring(existingPrefix.length);
      }
    } else {
      // Add new
      newLine = prefix + currentLine;
    }

    const newText = beforeLine + newLine + afterLine;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const diff = newLine.length - currentLine.length;
      textarea.setSelectionRange(start + diff, start + diff);
    }, 0);
  };

  // --- 3. INSERT LINK ---
  const insertLink = () => {
    if (activeTab === "preview") return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const linkText = selectedText || "link text";
    const newText = before + `[${linkText}](https://example.com)` + after;
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newStart = start + 1;
      const newEnd = start + 1 + linkText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  // --- 4. INSERT CODE BLOCK (Light version) ---
  const insertCodeBlock = () => {
    if (activeTab === "preview") return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    let newText;
    let newCursorStart;
    
    if (selectedText) {
      newText = before + "```\n" + selectedText + "\n```" + after;
      newCursorStart = start + 4;
    } else {
      newText = before + "```\n\n```" + after;
      newCursorStart = start + 4;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorStart);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center gap-1 flex-wrap">
          {activeTab === "write" ? (
            <>
              {/* Text Formatting */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton 
                  icon={<Bold size={16} />} 
                  label="Bold" 
                  onClick={() => toggleInlineStyle("**")} 
                />
                <ToolbarButton 
                  icon={<Italic size={16} />} 
                  label="Italic" 
                  onClick={() => toggleInlineStyle("*")} 
                />
                <ToolbarButton 
                  icon={<Code size={16} />} 
                  label="Inline Code" 
                  onClick={() => toggleInlineStyle("`")} 
                />
              </div>
              
              {/* Headings */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton 
                  icon={<Heading1 size={16} />} 
                  label="Heading 1" 
                  onClick={() => toggleBlockStyle("# ")} 
                />
                <ToolbarButton 
                  icon={<Heading2 size={16} />} 
                  label="Heading 2" 
                  onClick={() => toggleBlockStyle("## ")} 
                />
                <ToolbarButton 
                  icon={<Heading3 size={16} />} 
                  label="Heading 3" 
                  onClick={() => toggleBlockStyle("### ")} 
                />
              </div>
              
              {/* Lists */}
              <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton 
                  icon={<List size={16} />} 
                  label="Bullet List" 
                  onClick={() => toggleBlockStyle("- ")} 
                />
                <ToolbarButton 
                  icon={<ListOrdered size={16} />} 
                  label="Numbered List" 
                  onClick={() => toggleBlockStyle("1. ")} 
                />
              </div>
              
              {/* Other */}
              <div className="flex items-center gap-1">
                <ToolbarButton 
                  icon={<Link size={16} />} 
                  label="Link" 
                  onClick={insertLink} 
                />
                <ToolbarButton 
                  icon={<Quote size={16} />} 
                  label="Quote" 
                  onClick={() => toggleBlockStyle("> ")} 
                />
                <ToolbarButton 
                  icon={<Minus size={16} />} 
                  label="Divider" 
                  onClick={() => {
                    const textarea = textareaRef.current;
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const newText = text.substring(0, start) + "\n---\n" + text.substring(start);
                    onChange(newText);
                  }} 
                />
              </div>
            </>
          ) : (
            <span className="text-xs font-medium text-gray-600 px-2">
              Preview Mode
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center">
          <div className="flex bg-gray-100 rounded-md overflow-hidden border border-gray-300">
            <button 
              type="button" 
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "write" 
                  ? "bg-white text-gray-800" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <PenLine size={12} /> 
                <span>Write</span>
              </div>
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "preview" 
                  ? "bg-white text-[#7747EE]" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Eye size={12} /> 
                <span>Preview</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="relative">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start writing here... Use toolbar for formatting."}
            disabled={disabled}
            className="w-full p-4 text-sm text-gray-800 font-mono outline-none resize-none bg-white"
            style={{ 
              lineHeight: "1.6",
              minHeight: `${height}px`
            }}
          />
        ) : (
          <div 
            className="w-full p-4 text-gray-800 bg-white overflow-y-auto"
            style={{ minHeight: `${height}px` }}
          >
            {value ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Clean, minimal styling
                  h1: ({node, ...props}) => (
                    <h1 className="text-2xl font-bold mt-2 mb-3 text-gray-900" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-xl font-bold mt-3 mb-2 text-gray-800" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-lg font-bold mt-3 mb-2 text-gray-700" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="mb-3 text-gray-700" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-disc pl-5 mb-3 text-gray-700" {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol className="list-decimal pl-5 mb-3 text-gray-700" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="mb-1 text-gray-700" {...props} />
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-3 border-gray-300 pl-3 my-2 text-gray-600 italic" {...props} />
                  ),
                  code: ({node, inline, ...props}) => {
                    return !inline ? (
                      // LIGHT code block - no dark background
                      <div className="my-3 border border-gray-200 rounded bg-gray-50 p-3">
                        <code className="font-mono text-sm text-gray-800 whitespace-pre-wrap" {...props} />
                      </div>
                    ) : (
                      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                    );
                  },
                  a: ({node, ...props}) => (
                    <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-bold text-gray-900" {...props} />
                  ),
                  em: ({node, ...props}) => (
                    <em className="italic text-gray-800" {...props} />
                  ),
                  hr: ({node, ...props}) => (
                    <hr className="my-4 border-t border-gray-300" {...props} />
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[140px]">
                <p className="text-gray-400 italic text-sm">Nothing to preview...</p>
              </div>
            )}
          </div>
        )}
        
        {/* Character Count */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {value?.length || 0} chars
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon, onClick, label }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={label}
    className="p-2 text-gray-600 hover:bg-gray-200 hover:text-[#7747EE] rounded transition-colors"
  >
    {icon}
  </button>
);

export default RichMarkdownEditor;