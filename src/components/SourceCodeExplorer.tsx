import { useState } from "react";
import { kotlinCodeFiles, CodeFile } from "../data/kotlinCode";
import { Code, Copy, Check, Info, FileCode, ChevronRight } from "lucide-react";

export default function SourceCodeExplorer() {
  const [activeFile, setActiveFile] = useState<CodeFile>(kotlinCodeFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="source-code-explorer" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl h-[820px] flex flex-col text-slate-300 select-none">
      {/* Explorer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-lg text-white">Kotlin &amp; Jetpack Compose Code</h2>
            <p className="text-xs text-slate-500">Pure Android implementation source files</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded-lg transition-colors cursor-pointer border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* File Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {kotlinCodeFiles.map((file) => (
          <button
            key={file.filename}
            onClick={() => setActiveFile(file)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
              activeFile.filename === file.filename
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 text-slate-400"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{file.filename}</span>
          </button>
        ))}
      </div>

      {/* File Description Card */}
      <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 mb-4 flex gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Android Guide:</span> {activeFile.description}
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-2 right-3 text-[10px] uppercase font-bold text-slate-600">
          {activeFile.language}
        </div>
        <pre className="text-emerald-300 leading-normal selection:bg-emerald-500/30">
          <code>{activeFile.code}</code>
        </pre>
      </div>
    </div>
  );
}
