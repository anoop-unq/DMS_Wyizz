
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Bold, Italic, List, ListOrdered, Eye, Layout, Pencil, 
//   Link as LinkIcon, Image as ImageIcon, Code, Terminal, 
//   Quote, Strikethrough, RotateCcw, RotateCw, X, Maximize2, Minimize2
// } from 'lucide-react';

// /**
//  * IMPROVED PARSER
//  */
// const markdownToHtml = (markdown) => {
//   if (!markdown) return '';
//   let html = markdown;

//   // 1. Headers
//   html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-gray-900">$1</h3>');
//   html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-gray-900">$1</h2>');
//   html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');

//   // 2. Formatting
//   html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
//   html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
//   html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

//   // 3. Links & Images
//   html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" />');
//   html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
//     '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 transition-colors font-medium cursor-pointer">$1</a>'
//   );

//   // 4. Lists
//   html = html.replace(/^\s*[\-\*\+] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
//   html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside my-4 space-y-1 text-gray-800">${match}</ul>`);

//   html = html.replace(/^\s*\d+\. (.*$)/gim, '<li class="ol-item ml-4 mb-1">$1</li>');
//   html = html.replace(/(<li class="ol-item ml-4">.*?<\/li>\n?)+/g, (match) => {
//     const cleanedMatch = match.replaceAll('ol-item ', '');
//     return `<ol class="list-decimal list-inside my-4 space-y-1 text-gray-800">${cleanedMatch}</ol>`;
//   });

//   // 5. Code & Blockquotes
//   // Inline code: clean gray text without heavy backgrounds
//   html = html.replace(/`([^`]+)`/g, '<span class="font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">$1</span>');
//   html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-50 p-4 rounded-lg my-6 font-mono text-sm overflow-x-auto text-gray-800 border border-gray-200 shadow-sm leading-relaxed"><code>$1</code></pre>');
//   html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-600 my-6 bg-gray-50/30 rounded-r">$1</blockquote>');
  
//   // 6. Spacing Logic
//   html = html.replace(/\n{3,}/g, '<div class="py-6"></div>');
//   html = html.replace(/\n\n/g, '<div class="mb-5"></div>');
//   html = html.replace(/\n(?!(?:<\/?[^>]+>))/g, '<br />');

//   return `<div class="leading-7">${html}</div>`;
// };

// const NvdMarkdownEditor = ({ value = '', onChange, placeholder, disabled, height = "350px" }) => {
//   const [markdownContent, setMarkdownContent] = useState('');
//   const [viewMode, setViewMode] = useState('split');
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   // const [isFullScreen, setIsFullScreen] = useState(false);
  
//   const [showLinkModal, setShowLinkModal] = useState(false);
//   const [linkInput, setLinkInput] = useState('');
  
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     if (value) {
//       try {
//         const isBase64 = value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(value);
//         const decodedValue = isBase64 ? decodeURIComponent(escape(atob(value))) : value;
//         if (decodedValue !== markdownContent) {
//           setMarkdownContent(decodedValue);
//           addToHistory(decodedValue);
//         }
//       } catch (e) { 
//         setMarkdownContent(value); 
//         addToHistory(value);
//       }
//     }
//   }, [value]);

//   const addToHistory = (content) => {
//     setHistory(prev => {
//       const newHistory = prev.slice(0, historyIndex + 1);
//       return [...newHistory, content].slice(-50);
//     });
//     setHistoryIndex(prev => prev + 1);
//   };

//   const handleContentChange = (newText, skipHistory = false) => {
//     setMarkdownContent(newText);
//     if (!skipHistory) addToHistory(newText);
//     try { 
//       const encoded = btoa(unescape(encodeURIComponent(newText)));
//       onChange && onChange(encoded); 
//     } catch (e) { onChange && onChange(newText); }
//   };

//   const undo = () => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       const content = history[newIndex];
//       setHistoryIndex(newIndex);
//       setMarkdownContent(content);
//     }
//   };

//   const redo = () => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       const content = history[newIndex];
//       setHistoryIndex(newIndex);
//       setMarkdownContent(content);
//     }
//   };

//   const insertFormatting = (before, after = "", placeholderText = "text") => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const scrollPos = textarea.scrollTop;
    
//     let selected = markdownContent.substring(start, end);
//     const leadingSpace = selected.match(/^\s*/)[0];
//     const trailingSpace = selected.match(/\s*$/)[0];
//     const trimmedText = selected.trim() || placeholderText;

//     const newContent = markdownContent.substring(0, start) + leadingSpace + before + trimmedText + after + trailingSpace + markdownContent.substring(end);
//     handleContentChange(newContent);
    
//     setTimeout(() => {
//       textarea.focus();
//       const newPos = start + leadingSpace.length + before.length + trimmedText.length + after.length;
//       textarea.setSelectionRange(newPos, newPos);
//       textarea.scrollTop = scrollPos;
//     }, 0);
//   };

//   const insertList = (prefix) => {
//     const textarea = textareaRef.current;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const scrollPos = textarea.scrollTop;
//     const selectedText = markdownContent.substring(start, end);

//     let transformed = selectedText.length > 0 
//       ? selectedText.split('\n').map((line, i) => {
//           const p = prefix === '1. ' ? `${i + 1}. ` : prefix;
//           return line.trim().startsWith(p.trim()) ? line : `${p}${line}`;
//         }).join('\n')
//       : `\n${prefix}`;

//     const newContent = markdownContent.substring(0, start) + transformed + markdownContent.substring(end);
//     handleContentChange(newContent);
//     setTimeout(() => { textarea.focus(); textarea.scrollTop = scrollPos; }, 0);
//   };

//   const handleConfirmLink = () => {
//     if (linkInput.trim()) {
//       const finalUrl = `https://${linkInput.replace(/^https?:\/\//, '')}`;
//       insertFormatting("[", `](${finalUrl})`, "link text");
//       setLinkInput('');
//       setShowLinkModal(false);
//     }
//   };

//   return (
//     <div className={`relative border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm transition-all ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
//       {/* TOOLBAR */}
//       <div className="flex items-center justify-between border-b bg-white p-1.5 gap-1">
//         <div className="flex items-center flex-wrap gap-0.5">
//           <button type="button" onClick={undo} disabled={historyIndex <= 0} className={`p-2 hover:bg-gray-100 rounded transition-colors ${historyIndex <= 0 ? 'text-gray-300' : 'text-gray-600'}`}><RotateCcw size={16} /></button>
//           <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} className={`p-2 hover:bg-gray-100 rounded transition-colors ${historyIndex >= history.length - 1 ? 'text-gray-300' : 'text-gray-600'}`}><RotateCw size={16} /></button>
//           <div className="w-px h-4 bg-gray-200 mx-1" />
//           <button type="button" onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Bold size={16} /></button>
//           <button type="button" onClick={() => insertFormatting('*', '*')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Italic size={16} /></button>
//           <button type="button" onClick={() => insertFormatting('~~', '~~')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Strikethrough size={16} /></button>
//           <div className="w-px h-4 bg-gray-200 mx-1" />
//           <button type="button" onClick={() => insertList('- ')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><List size={16} /></button>
//           <button type="button" onClick={() => insertList('1. ')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><ListOrdered size={16} /></button>
//           <button type="button" onClick={() => insertFormatting('"', '"')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Quote size={16} /></button>
//           <div className="w-px h-4 bg-gray-200 mx-1" />
//           <button type="button" onClick={() => setShowLinkModal(true)} className="p-2 hover:bg-gray-100 rounded text-gray-600"><LinkIcon size={16} /></button>
//           <button type="button" onClick={() => insertFormatting('`', '`')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Code size={16} /></button>
//           <button type="button" onClick={() => insertFormatting('\n```\n', '\n```\n', 'code here')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Terminal size={16} /></button>
//           {/* <button type="button" onClick={() => setIsFullScreen(true)} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="Full Screen Preview"><Maximize2 size={16} /></button> */}
//         </div>

//         <div className="flex bg-gray-100 p-0.5 rounded-md gap-0.5 border border-gray-200">
//           {['edit', 'split', 'preview'].map((m) => (
//             <button key={m} type="button" onClick={() => setViewMode(m)} className={`px-2.5 py-1 text-[10px] uppercase rounded transition-all font-medium ${viewMode === m ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>{m}</button>
//           ))}
//         </div>
//       </div>

//       {/* WORKSPACE */}
//       <div className="flex bg-white" style={{ height }}>
//         {(viewMode === 'edit' || viewMode === 'split') && (
//           <textarea ref={textareaRef} value={markdownContent} onChange={(e) => handleContentChange(e.target.value)} disabled={disabled}
//             className="flex-1 p-5 outline-none resize-none font-mono text-[13px] leading-relaxed text-gray-800 border-r border-gray-100 bg-white placeholder-gray-400" placeholder={placeholder} />
//         )}
//         {(viewMode === 'preview' || viewMode === 'split') && (
//           <div className="flex-1 p-6 overflow-y-auto bg-white">
//             <div className="max-w-none text-gray-800 whitespace-normal"
//               dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) || '<p class="text-gray-400 italic">No content found</p>' }} />
//           </div>
//         )}
//       </div>

//       {/* LINK MODAL (Transparent & Minimal) */}
//       {showLinkModal && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
//           <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xs overflow-hidden transform scale-100 transition-all duration-300">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h3 className="text-sm font-bold text-gray-800">Insert Link</h3>
//               <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-gray-700 p-1"><X size={16} /></button>
//             </div>
//             <div className="p-5">
//                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white mb-2 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-400 transition-all">
//                 <span className="pl-3 pr-1 text-gray-400 font-mono text-sm select-none border-r border-gray-100 py-2.5 bg-gray-50/50">https://</span>
//                 <input autoFocus type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirmLink()}
//                   placeholder="google.com" className="flex-1 py-2.5 px-3 bg-transparent outline-none text-sm text-gray-700 font-mono" />
//               </div>
//               <p className="text-[10px] text-gray-400 mb-6 italic pl-1">Examples: domain.com, wyizz.com</p>
//               <div className="flex gap-3">
//                 {/* Button Transparent style as requested */}
//                 <button onClick={() => setShowLinkModal(false)} className="flex-1 px-3 py-2 text-xs font-semibold text-gray-600 bg-transparent border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
//                 <button onClick={handleConfirmLink} className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Add Link</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* FULL SCREEN PREVIEW OVERLAY */}
//       {/* {isFullScreen && (
//         <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
//           <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
//             <div className="flex items-center gap-2 font-bold text-gray-800 px-2">
//               <Eye size={18} className="text-indigo-600" /> Full Preview
//             </div>
//             <button onClick={() => setIsFullScreen(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all text-sm font-semibold mr-2 shadow-lg">
//               <Minimize2 size={16} /> Exit Preview
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-20 bg-gray-50/50">
//             <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[40px] shadow-sm border border-gray-200 min-h-full">
//                <div className="max-w-none text-gray-800 whitespace-normal text-lg"
//                 dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) || '<p class="text-gray-400 italic text-center">No documentation content added yet...</p>' }} />
//             </div>
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default NvdMarkdownEditor;

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, List, ListOrdered, Eye, Layout, Pencil, 
  Link as LinkIcon, Image as ImageIcon, Code, Terminal, 
  Quote, Strikethrough, RotateCcw, RotateCw, X, Maximize2, Minimize2
} from 'lucide-react';

/**
 * IMPROVED PARSER - Logic preserved
 */
const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  let html = markdown;

  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-slate-900">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3 text-slate-900">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-slate-900">$1</h1>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-4" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline hover:text-indigo-800 transition-colors font-medium cursor-pointer">$1</a>'
  );

  html = html.replace(/^\s*[\-\*\+] (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside my-4 space-y-1 text-slate-700">${match}</ul>`);

  html = html.replace(/^\s*\d+\. (.*$)/gim, '<li class="ol-item ml-4 mb-1">$1</li>');
  html = html.replace(/(<li class="ol-item ml-4">.*?<\/li>\n?)+/g, (match) => {
    const cleanedMatch = match.replaceAll('ol-item ', '');
    return `<ol class="list-decimal list-inside my-4 space-y-1 text-slate-700">${cleanedMatch}</ol>`;
  });

  html = html.replace(/`([^`]+)`/g, '<span class="font-mono text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200/50">$1</span>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-50 p-4 rounded-lg my-6 font-mono text-sm overflow-x-auto text-slate-800 border border-slate-200/60 shadow-sm leading-relaxed"><code>$1</code></pre>');
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-slate-200 pl-4 py-2 italic text-slate-500 my-6 bg-slate-50/50 rounded-r">$1</blockquote>');
  
  html = html.replace(/\n{3,}/g, '<div class="py-6"></div>');
  html = html.replace(/\n\n/g, '<div class="mb-5"></div>');
  html = html.replace(/\n(?!(?:<\/?[^>]+>))/g, '<br />');

  return `<div class="leading-7">${html}</div>`;
};

const NvdMarkdownEditor = ({ value = '', onChange, placeholder, disabled, height = "400px" }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (value) {
      try {
        const isBase64 = value.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(value);
        const decodedValue = isBase64 ? decodeURIComponent(escape(atob(value))) : value;
        if (decodedValue !== markdownContent) {
          setMarkdownContent(decodedValue);
          addToHistory(decodedValue);
        }
      } catch (e) { 
        setMarkdownContent(value); 
        addToHistory(value);
      }
    }
  }, [value]);

  const addToHistory = (content) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, content].slice(-50);
    });
    setHistoryIndex(prev => prev + 1);
  };

  const handleContentChange = (newText, skipHistory = false) => {
    setMarkdownContent(newText);
    if (!skipHistory) addToHistory(newText);
    try { 
      const encoded = btoa(unescape(encodeURIComponent(newText)));
      onChange && onChange(encoded); 
    } catch (e) { onChange && onChange(newText); }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      setMarkdownContent(content);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      setMarkdownContent(content);
    }
  };

  const insertFormatting = (before, after = "", placeholderText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const scrollPos = textarea.scrollTop;
    
    let selected = markdownContent.substring(start, end);
    const leadingSpace = selected.match(/^\s*/)[0];
    const trailingSpace = selected.match(/\s*$/)[0];
    const trimmedText = selected.trim() || placeholderText;

    const newContent = markdownContent.substring(0, start) + leadingSpace + before + trimmedText + after + trailingSpace + markdownContent.substring(end);
    handleContentChange(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + leadingSpace.length + before.length + trimmedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
      textarea.scrollTop = scrollPos;
    }, 0);
  };

  const insertList = (prefix) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const scrollPos = textarea.scrollTop;
    const selectedText = markdownContent.substring(start, end);

    let transformed = selectedText.length > 0 
      ? selectedText.split('\n').map((line, i) => {
          const p = prefix === '1. ' ? `${i + 1}. ` : prefix;
          return line.trim().startsWith(p.trim()) ? line : `${p}${line}`;
        }).join('\n')
      : `\n${prefix}`;

    const newContent = markdownContent.substring(0, start) + transformed + markdownContent.substring(end);
    handleContentChange(newContent);
    setTimeout(() => { textarea.focus(); textarea.scrollTop = scrollPos; }, 0);
  };

  const handleConfirmLink = () => {
    if (linkInput.trim()) {
      const finalUrl = `https://${linkInput.replace(/^https?:\/\//, '')}`;
      insertFormatting("[", `](${finalUrl})`, "link text");
      setLinkInput('');
      setShowLinkModal(false);
    }
  };

  return (
    <div className={`relative border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* TOOLBAR - Subtle Slate Background */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
        <div className="flex items-center flex-wrap gap-1">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button type="button" onClick={undo} disabled={historyIndex <= 0} className={`p-1.5 hover:bg-slate-50 rounded transition-colors ${historyIndex <= 0 ? 'text-slate-200' : 'text-slate-500'}`}><RotateCcw size={15} /></button>
            <button type="button" onClick={redo} disabled={historyIndex >= history.length - 1} className={`p-1.5 hover:bg-slate-50 rounded transition-colors ${historyIndex >= history.length - 1 ? 'text-slate-200' : 'text-slate-500'}`}><RotateCw size={15} /></button>
          </div>
          
          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />
          
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Bold size={16} /></button>
            <button type="button" onClick={() => insertFormatting('*', '*')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Italic size={16} /></button>
            <button type="button" onClick={() => insertFormatting('~~', '~~')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Strikethrough size={16} /></button>
          </div>

          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => insertList('- ')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><List size={16} /></button>
            <button type="button" onClick={() => insertList('1. ')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><ListOrdered size={16} /></button>
            <button type="button" onClick={() => insertFormatting('"', '"')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Quote size={16} /></button>
          </div>

          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setShowLinkModal(true)} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><LinkIcon size={16} /></button>
            <button type="button" onClick={() => insertFormatting('`', '`')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Code size={16} /></button>
            <button type="button" onClick={() => insertFormatting('\n```\n', '\n```\n', 'code here')} className="p-2 hover:bg-white hover:shadow-sm hover:text-indigo-600 rounded-lg text-slate-500 transition-all"><Terminal size={16} /></button>
          </div>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1 border border-slate-200/40">
          {['edit', 'split', 'preview'].map((m) => (
            <button key={m} type="button" onClick={() => setViewMode(m)} 
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-lg transition-all font-bold ${viewMode === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* WORKSPACE - Responsive Flex */}
      <div className={`flex flex-col md:flex-row bg-white transition-all duration-300 ${showLinkModal ? 'blur-[2px] pointer-events-none' : ''}`} style={{ height }}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <textarea 
            ref={textareaRef} 
            value={markdownContent} 
            onChange={(e) => handleContentChange(e.target.value)} 
            disabled={disabled}
            className={`flex-1 p-6 outline-none resize-none font-mono text-[13px] leading-relaxed text-slate-700 bg-white placeholder-slate-300 transition-all ${viewMode === 'split' ? 'md:border-r border-slate-100' : ''}`} 
            placeholder={placeholder} 
          />
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
            <div className="max-w-none text-slate-800 whitespace-normal prose prose-slate"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) || '<p class="text-slate-400 italic font-light"> Content...</p>' }} />
          </div>
        )}
      </div>

      {/* LINK MODAL */}
      {showLinkModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Insert Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-slate-400 hover:text-slate-600 p-1 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-5">
               <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 mb-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
                <span className="pl-3 pr-1 text-slate-400 font-mono text-xs select-none border-r border-slate-200/50 py-3 bg-slate-100/50">https://</span>
                <input autoFocus type="text" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirmLink()}
                  placeholder="google.com" className="flex-1 py-3 px-3 bg-transparent outline-none text-sm text-slate-700 font-mono" />
              </div>
              <p className="text-[10px] text-slate-400 mb-6 italic pl-1">e.g. documentation.com</p>
              <div className="flex gap-2">
                <button onClick={() => setShowLinkModal(false)} className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                <button onClick={handleConfirmLink} className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all">Add Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NvdMarkdownEditor;