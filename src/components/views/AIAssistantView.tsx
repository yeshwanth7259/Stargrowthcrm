import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Plus,
  Zap,
  FileText,
  Target,
  Search,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { addTask, logActivity, projects } = useCRM();
  const [prompt, setPrompt] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(
    'You are Star Growth Hub AI Strategist, an expert digital marketing consultant specializing in SEO, PPC, social media growth, and conversion rate optimization.'
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [taskCreatedMsg, setTaskCreatedMsg] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<string>('social');
  const [clientContext, setClientContext] = useState(projects[0]?.clientName || 'Zenith E-Commerce');

  const presetTemplates = [
    {
      id: 'social',
      title: '30-Day Social Media Content Calendar',
      icon: Calendar,
      promptText: `Generate a detailed 30-day Social Media Content Calendar for ${clientContext}. Include weekly themes, 5 post ideas per week with engagement captions, visual hooks for Instagram Reels/TikTok, and relevant hashtags.`,
    },
    {
      id: 'ads',
      title: 'High-ROAS Meta & Google Ads Copy Set',
      icon: Target,
      promptText: `Draft high-converting ad copy for ${clientContext}. Include 3 Google Search Ad Headline & Description combinations, and 2 Meta Carousel Ad Primary Text copy options targeting 4.0x+ ROAS.`,
    },
    {
      id: 'seo',
      title: 'SEO Keyword & Content Brief Strategy',
      icon: Search,
      promptText: `Create a comprehensive SEO strategy brief for ${clientContext}. Identify 10 high-intent primary & secondary keywords, search intent analysis, suggested article titles, meta descriptions, and internal linking recommendations.`,
    },
    {
      id: 'pitch',
      title: 'Client Pitch Proposal & Deliverables Draft',
      icon: FileText,
      promptText: `Draft a professional ₹1,00,000/month digital marketing proposal deck outline for ${clientContext}. Outline monthly deliverables, team responsibilities, projected ROI timeline, and key performance indicators.`,
    },
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          systemInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI response');
      }

      setResponse(data.text);
      logActivity('AI_STRATEGY_GEN', `Generated AI marketing strategy for client context: ${clientContext}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while contacting Star AI.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: typeof presetTemplates[0]) => {
    setSelectedPreset(preset.id);
    setPrompt(preset.promptText);
    handleGenerate(preset.promptText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvertToTask = () => {
    addTask({
      projectId: projects[0]?.id || 'prj_1',
      projectName: projects[0]?.name || 'Campaign Strategy',
      title: `Implement AI Strategy for ${clientContext}`,
      description: response.slice(0, 200) + '...',
      assigneeId: 'usr_e1',
      assigneeName: 'Priya Verma',
      campaignType: 'Content Marketing',
      priority: 'High',
      status: 'To Do',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      estimatedHours: 5,
      subtasks: [
        { id: 'st_ai_1', title: 'Review AI content outline with team', completed: false },
        { id: 'st_ai_2', title: 'Publish deliverables to Client Approval portal', completed: false },
      ],
      commentsCount: 0,
    });
    setTaskCreatedMsg(true);
    setTimeout(() => setTaskCreatedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <Sparkles className="w-7 h-7 fill-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Star AI Marketing Strategist
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                Gemini 3.6 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Automate campaign copy, 30-day social content calendars, SEO keyword briefs, and client proposals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400 font-semibold">Client Context:</span>
          <select
            value={clientContext}
            onChange={(e) => setClientContext(e.target.value)}
            className="text-xs font-bold bg-slate-900 text-amber-300 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
          >
            {projects.map(p => (
              <option key={p.id} value={p.clientName}>{p.clientName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Strategy Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {presetTemplates.map(preset => {
          const Icon = preset.icon;
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 border border-amber-200/60">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">{preset.title}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{preset.promptText}</p>
            </button>
          );
        })}
      </div>

      {/* Freeform Prompt Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800">Custom Campaign Query or Instruction</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write 5 high-converting Meta Ad headlines for Zenith E-Commerce Summer Flash Sale..."
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* AI Output Result Box */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Star AI is generating campaign strategy & copy...</p>
        </div>
      )}

      {response && !loading && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Generated Campaign Deliverables</h2>
            </div>

            <div className="flex items-center gap-2">
              {taskCreatedMsg && (
                <span className="text-xs font-bold text-emerald-600 animate-fade-in">✓ Converted to CRM Task!</span>
              )}
              <button
                onClick={handleConvertToTask}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Assign as Task</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Strategy'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800 shadow-inner">
            {response}
          </div>
        </div>
      )}

    </div>
  );
};
