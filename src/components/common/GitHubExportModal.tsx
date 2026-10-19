import React, { useState } from 'react';
import { X, GitBranch, Copy, Check, ExternalLink, Terminal, Download, ShieldCheck } from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const repoName = 'mamafit-ai';
  const gitCommands = `# 1. Create a new empty repository named "${repoName}" on your GitHub account:
#    https://github.com/new

# 2. In your terminal inside the project directory, run:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/${repoName}.git
git branch -M main
git push -u origin main`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#231426]/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#f0dfea] bg-white p-5 shadow-2xl transition-all sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#231426] text-white">
              <GitBranch className="h-6 w-6 text-[#ffc6c0]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#231426]">
                GitHub Integration & Code Export
              </h3>
              <p className="text-xs text-[#745f78]">Repository: <span className="font-mono text-[#f075aa] font-semibold">{repoName}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#745f78] hover:bg-[#fff8fb] hover:text-[#231426]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-[#5a435f]">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Security & Privacy Guardrail Active</p>
              <p className="mt-0.5 text-emerald-800">
                Your private secrets and <code className="bg-emerald-100 px-1 py-0.5 rounded">.env</code> keys are excluded via <code className="bg-emerald-100 px-1 py-0.5 rounded">.gitignore</code>. The local git repository is prepared with clean commits and documentation.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#231426] flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-[#f075aa]" />
                Steps to Push to Your GitHub Account:
              </span>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="flex items-center gap-1 text-[11px] font-medium text-[#f075aa] hover:underline"
              >
                {copied === 'git' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied === 'git' ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-[#231426] p-3.5 font-mono text-xs text-rose-100 leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          <div className="rounded-2xl border border-[#f0dfea] bg-[#fff8fb] p-4 text-xs space-y-2">
            <p className="font-semibold text-[#231426]">Cloning & Running Locally:</p>
            <div className="space-y-1 font-mono text-[11px] text-[#745f78]">
              <p>git clone https://github.com/YOUR_USERNAME/{repoName}.git</p>
              <p>cd {repoName}</p>
              <p>npm install</p>
              <p>npm run dev</p>
            </div>
            <p className="text-[11px] text-[#745f78] pt-1 border-t border-[#f0dfea]">
              See the included <span className="font-semibold text-[#231426]">README.md</span> in the project root for full architecture and deployment guidance.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#231426] py-3 text-center text-sm font-semibold text-white shadow-soft transition-all hover:bg-[#3d2441]"
          >
            <ExternalLink className="h-4 w-4" />
            Open GitHub New Repo
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#f0dfea] py-3 text-center text-sm font-semibold text-[#745f78] hover:bg-[#fff8fb] hover:text-[#231426]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
