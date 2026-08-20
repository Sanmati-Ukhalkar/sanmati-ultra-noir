import React, { useState, useEffect } from 'react';
import { fetchRepoMeta, FetchedRepoData } from '@/lib/fetchRepoMeta';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, Copy, RefreshCw, Plus, Trash2, Edit3, 
  Check, Save, Github, Sparkles, Layers, Layers2, ExternalLink 
} from 'lucide-react';

interface ArchNode {
  label: string;
  detail: string;
}

interface ProjectRecord {
  id: string;
  repoUrl: string;
  name: string;
  category: string;
  blurb: string;
  stack: string[];
  featured: boolean;
  /** Screenshot or preview image URL shown on the project card */
  imageUrl?: string;
  architecture: {
    blueprintAvailable: boolean;
    nodes: ArchNode[];
  };
  githubMeta: {
    stars: number;
    language: string;
    pushedAt: string;
    fetchedAt: string;
  };
  manualOverride: boolean;
  order: number;
}

interface MetaRecord {
  lastShipped: {
    text: string;
    date: string;
  };
  siteUpdatedAt: string;
}

const AdminPage: React.FC = () => {
  const [repoInput, setRepoInput] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formRepoUrl, setFormRepoUrl] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formBlurb, setFormBlurb] = useState('');
  const [formStackText, setFormStackText] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formOrder, setFormOrder] = useState(1);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formNodes, setFormNodes] = useState<ArchNode[]>([]);
  const [formGithubMeta, setFormGithubMeta] = useState({
    stars: 0,
    language: 'Python',
    pushedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString()
  });

  // Projects & Meta state
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>([]);
  const [lastShippedText, setLastShippedText] = useState('Shipped OpenFlow v0.9 & ML Churn Model');
  const [lastShippedDate, setLastShippedDate] = useState('2026-08-14');

  // Load existing data from public/data/projects.json or localStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedProjects = localStorage.getItem('curated_projects_json');
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects);
          setProjectsList(parsed);
          setFormOrder(parsed.length + 1);
        } else {
          const res = await fetch('/data/projects.json');
          if (res.ok) {
            const data = await res.json();
            setProjectsList(data.projects || []);
            setFormOrder((data.projects?.length || 0) + 1);
          }
        }

        const resMeta = await fetch('/data/meta.json');
        if (resMeta.ok) {
          const metaData: MetaRecord = await resMeta.json();
          if (metaData.lastShipped) {
            setLastShippedText(metaData.lastShipped.text || '');
            setLastShippedDate(metaData.lastShipped.date || '');
          }
        }
      } catch (err) {
        console.error('Failed to load initial portfolio data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Fetch Metadata from GitHub API
  const handleFetchFromGithub = async () => {
    if (!repoInput.trim()) {
      setFetchError('Please enter a valid GitHub URL or owner/repo format');
      return;
    }
    setLoadingFetch(true);
    setFetchError(null);

    try {
      const fetched = await fetchRepoMeta(repoInput);
      setFormName(fetched.name);
      setFormRepoUrl(fetched.repoUrl);
      setFormCategory(fetched.category);
      if (!formBlurb) setFormBlurb(fetched.description);
      setFormStackText(fetched.stack.join(', '));
      setFormGithubMeta(fetched.githubMeta);
      if (formNodes.length === 0) {
        setFormNodes([
          { label: 'Client Interface', detail: 'React / Web Layer' },
          { label: 'Core Engine', detail: `${fetched.githubMeta.language} Service` }
        ]);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setFetchError(error.message || 'Failed to fetch GitHub repository details');
    } finally {
      setLoadingFetch(false);
    }
  };

  // Node array management
  const handleAddNode = () => {
    setFormNodes(prev => [...prev, { label: '', detail: '' }]);
  };

  const handleUpdateNode = (index: number, field: 'label' | 'detail', value: string) => {
    setFormNodes(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleRemoveNode = (index: number) => {
    setFormNodes(prev => prev.filter((_, i) => i !== index));
  };

  // Clear Form
  const handleResetForm = () => {
    setEditId(null);
    setRepoInput('');
    setFormName('');
    setFormRepoUrl('');
    setFormCategory('');
    setFormBlurb('');
    setFormStackText('');
    setFormFeatured(true);
    setFormOrder(projectsList.length + 1);
    setFormImageUrl('');
    setFormNodes([]);
  };

  // Save/Update Project Entry
  const handleSaveProject = () => {
    if (!formName.trim() || !formBlurb.trim()) {
      alert('Project Name and Blurb are required before saving.');
      return;
    }

    const cleanStack = formStackText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const targetId = editId || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newRecord: ProjectRecord = {
      id: targetId,
      repoUrl: formRepoUrl || `https://github.com/Sanmati-Ukhalkar/${targetId}`,
      name: formName,
      category: formCategory || 'Software Project',
      blurb: formBlurb,
      stack: cleanStack.length > 0 ? cleanStack : ['Python'],
      featured: formFeatured,
      imageUrl: formImageUrl.trim() || undefined,
      architecture: {
        blueprintAvailable: formNodes.length > 0,
        nodes: formNodes.filter(n => n.label.trim())
      },
      githubMeta: formGithubMeta,
      manualOverride: true,
      order: formOrder
    };

    let updatedList: ProjectRecord[];
    if (editId) {
      updatedList = projectsList.map(p => (p.id === editId ? newRecord : p));
    } else {
      updatedList = [...projectsList.filter(p => p.id !== targetId), newRecord];
    }

    updatedList.sort((a, b) => a.order - b.order);
    setProjectsList(updatedList);
    localStorage.setItem('curated_projects_json', JSON.stringify(updatedList));

    alert(`Project "${formName}" saved successfully!`);
    handleResetForm();
  };

  // Edit existing project
  const handleEditProject = (project: ProjectRecord) => {
    setEditId(project.id);
    setFormName(project.name);
    setFormRepoUrl(project.repoUrl);
    setFormCategory(project.category);
    setFormBlurb(project.blurb);
    setFormStackText(project.stack.join(', '));
    setFormFeatured(project.featured);
    setFormOrder(project.order);
    setFormImageUrl(project.imageUrl || '');
    setFormNodes(project.architecture?.nodes || []);
    setFormGithubMeta(project.githubMeta || { stars: 0, language: 'Python', pushedAt: '', fetchedAt: '' });
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this project from the showcase?')) {
      const filtered = projectsList.filter(p => p.id !== id);
      setProjectsList(filtered);
      localStorage.setItem('curated_projects_json', JSON.stringify(filtered));
    }
  };

  // Re-fetch Metadata Only (Preserves manual blurb/stack)
  const handleRefetchMetadataOnly = async (project: ProjectRecord) => {
    try {
      const fetched = await fetchRepoMeta(project.repoUrl);
      const updatedRecord: ProjectRecord = {
        ...project,
        githubMeta: fetched.githubMeta
      };
      const updatedList = projectsList.map(p => (p.id === project.id ? updatedRecord : p));
      setProjectsList(updatedList);
      localStorage.setItem('curated_projects_json', JSON.stringify(updatedList));
      alert(`Refreshed GitHub metadata for "${project.name}" without modifying your hand-written blurb.`);
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Failed to refresh metadata: ${error.message}`);
    }
  };

  // Export JSON (Clipboard + Download)
  const handleExportJSON = () => {
    const fullData = { projects: projectsList };
    const jsonString = JSON.stringify(fullData, null, 2);

    navigator.clipboard.writeText(jsonString).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    });

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save Meta Ticker
  const handleSaveMetaTicker = () => {
    const metaData = {
      lastShipped: {
        text: lastShippedText,
        date: lastShippedDate
      },
      siteUpdatedAt: new Date().toISOString()
    };
    localStorage.setItem('curated_meta_json', JSON.stringify(metaData));
    alert('Activity Ticker updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-primary hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio Site
          </Link>
          <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
            Portfolio Project Curator <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Local Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curate projects, update architecture blueprints, and manage the live activity ticker.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-all shadow-sm"
        >
          {copiedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copiedSuccess ? 'Copied & Downloaded!' : 'Export & Download projects.json'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Curation Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* GitHub Fetch Box */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-foreground mb-3 flex items-center gap-2">
              <Github className="w-4 h-4 text-primary" /> 1. Fetch GitHub Repository Metadata
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://github.com/Sanmati-Ukhalkar/repo-name"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs font-mono bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              />
              <button
                onClick={handleFetchFromGithub}
                disabled={loadingFetch}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-xs hover:bg-secondary/90 transition-colors flex items-center gap-2"
              >
                {loadingFetch ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {loadingFetch ? 'Fetching...' : 'Fetch Repo'}
              </button>
            </div>

            {fetchError && (
              <p className="text-xs text-destructive mt-2 font-mono">{fetchError}</p>
            )}
          </div>

          {/* Details Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-foreground flex items-center justify-between">
              <span>2. {editId ? `Editing Project: ${formName}` : 'Add / Edit Showcase Item'}</span>
              {editId && (
                <button onClick={handleResetForm} className="text-xs text-muted-foreground hover:underline">
                  Cancel Edit
                </button>
              )}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Category Tag</label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Automation Platform, ML"
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Project Blurb (Description) *</label>
              <textarea
                rows={3}
                value={formBlurb}
                onChange={(e) => setFormBlurb(e.target.value)}
                placeholder="High-level engineering problem and solution description..."
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Preview / Screenshot Image URL (optional)</label>
              <input
                type="url"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="https://i.imgur.com/your-screenshot.png or /images/project.png"
                className="w-full px-3 py-2 text-xs font-mono bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              />
              {formImageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border" style={{ maxHeight: 120 }}>
                  <img src={formImageUrl} alt="Preview" className="w-full object-cover" style={{ maxHeight: 120 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Tech Stack Pills (comma-separated)</label>
              <input
                type="text"
                value={formStackText}
                onChange={(e) => setFormStackText(e.target.value)}
                placeholder="FastAPI, Next.js, PostgreSQL, PyTorch"
                className="w-full px-3 py-2 text-xs font-mono bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Display Order Position</label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs font-mono bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-mono text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Featured in Showcase Grid</span>
                </label>
              </div>
            </div>

            {/* Architecture Node Pairs Editor */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" /> System Architecture Nodes
                </label>
                <button
                  type="button"
                  onClick={handleAddNode}
                  className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Node
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formNodes.map((node, index) => (
                  <div key={index} className="flex gap-2 items-center bg-background border border-border p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Label (e.g. Scraper)"
                      value={node.label}
                      onChange={(e) => handleUpdateNode(index, 'label', e.target.value)}
                      className="w-1/3 px-2 py-1 text-xs font-mono bg-card border border-border rounded text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Detail (e.g. Greenhouse/Lever API)"
                      value={node.detail}
                      onChange={(e) => handleUpdateNode(index, 'detail', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-card border border-border rounded text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNode(index)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {formNodes.length === 0 && (
                  <p className="text-xs font-mono text-muted-foreground/60 italic py-2 text-center">
                    No architecture nodes defined yet. Click "Add Node" to build the visual blueprint.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={handleSaveProject}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                {editId ? 'Update Project' : 'Save New Project'}
              </button>
              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-medium hover:bg-muted"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Activity Ticker Metadata Editor */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-foreground" /> Activity Ticker Config (meta.json)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Latest Shipped Work Text</label>
                <input
                  type="text"
                  value={lastShippedText}
                  onChange={(e) => setLastShippedText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg text-foreground"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">Date</label>
                <input
                  type="date"
                  value={lastShippedDate}
                  onChange={(e) => setLastShippedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-background border border-border rounded-lg text-foreground"
                />
              </div>
            </div>

            <button
              onClick={handleSaveMetaTicker}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/90 transition-colors"
            >
              Save Activity Ticker
            </button>
          </div>
        </div>

        {/* Right Column — Existing Curated List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                <Layers2 className="w-4 h-4 text-secondary" /> Active Portfolio Showcase ({projectsList.length})
              </h2>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {projectsList.map((project) => (
                <div
                  key={project.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    editId === project.id ? 'border-primary bg-primary/5' : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-foreground">#{project.order} {project.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-muted text-muted-foreground">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRefetchMetadataOnly(project)}
                        className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        title="Re-fetch GitHub metadata only"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                    {project.blurb}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/60">
                    <span>Stack: {project.stack.slice(0, 3).join(', ')}</span>
                    <span className="text-primary font-bold">
                      {project.architecture?.nodes?.length || 0} Nodes
                    </span>
                  </div>
                </div>
              ))}

              {projectsList.length === 0 && (
                <p className="text-xs font-mono text-muted-foreground text-center py-6">
                  No projects in the showcase. Fetch a GitHub repository on the left to get started!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
