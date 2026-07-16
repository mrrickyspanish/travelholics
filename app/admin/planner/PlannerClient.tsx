'use client'

import { useMemo, useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type {
  ContentProject,
  ContentTask,
  PlannerOwner,
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
  TaskStatus,
} from '@/types/content-planner'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

const OWNERS: PlannerOwner[] = ['Yolanda', 'Ricky', 'Both']
const CATEGORIES: ProjectCategory[] = ['video', 'social', 'website', 'shop', 'strategy', 'other']
const PROJECT_STATUSES: ProjectStatus[] = ['idea', 'planned', 'in_progress', 'blocked', 'complete']
const PRIORITIES: ProjectPriority[] = ['low', 'medium', 'high']
const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'complete']

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  video: 'Video',
  social: 'Social',
  website: 'Website',
  shop: 'Shop',
  strategy: 'Strategy',
  other: 'Other',
}

const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Idea',
  planned: 'Planned',
  in_progress: 'In progress',
  blocked: 'Blocked',
  complete: 'Complete',
}

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  complete: 'Complete',
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  idea: 'bg-violet-50 text-violet-700',
  planned: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-amber-50 text-amber-700',
  blocked: 'bg-red-50 text-red-700',
  complete: 'bg-emerald-50 text-emerald-700',
}

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-sky-50 text-sky-700',
  high: 'bg-orange-50 text-orange-700',
}

type ProjectDraft = {
  title: string
  description: string
  notes: string
  category: ProjectCategory
  status: ProjectStatus
  priority: ProjectPriority
  owner: PlannerOwner
  target_date: string
}

type TaskDraft = { title: string; assignee: PlannerOwner; due_date: string }

const EMPTY_PROJECT: ProjectDraft = {
  title: '',
  description: '',
  notes: '',
  category: 'video',
  status: 'idea',
  priority: 'medium',
  owner: 'Both',
  target_date: '',
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00`)
}

function formatDate(value: string | null) {
  if (!value) return 'No date'
  return parseDate(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(value: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = parseDate(value)
  date.setHours(0, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000)
}

function isTaskOverdue(task: ContentTask) {
  return Boolean(task.due_date && task.status !== 'complete' && daysUntil(task.due_date) < 0)
}

export default function PlannerClient({ initialProjects }: { initialProjects: ContentProject[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'active' | 'all'>('active')
  const [ownerFilter, setOwnerFilter] = useState<PlannerOwner | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | 'all'>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set(initialProjects.slice(0, 3).map((p) => p.id)))
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(EMPTY_PROJECT)
  const [taskDrafts, setTaskDrafts] = useState<Record<string, TaskDraft>>({})
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const allTasks = useMemo(() => projects.flatMap((project) => project.tasks), [projects])
  const openTasks = allTasks.filter((task) => task.status !== 'complete')
  const overdueTasks = openTasks.filter(isTaskOverdue)
  const dueSoonTasks = openTasks.filter((task) => {
    if (!task.due_date) return false
    const days = daysUntil(task.due_date)
    return days >= 0 && days <= 7
  })

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return projects
      .filter((project) => {
        if (statusFilter === 'active' && project.status === 'complete') return false
        if (statusFilter !== 'active' && statusFilter !== 'all' && project.status !== statusFilter) return false
        if (ownerFilter !== 'all' && project.owner !== ownerFilter) return false
        if (categoryFilter !== 'all' && project.category !== categoryFilter) return false
        if (!query) return true
        return [project.title, project.description ?? '', project.notes ?? '', ...project.tasks.map((task) => task.title)]
          .join(' ')
          .toLowerCase()
          .includes(query)
      })
      .sort((a, b) => {
        if (a.status === 'complete' && b.status !== 'complete') return 1
        if (a.status !== 'complete' && b.status === 'complete') return -1
        if (a.target_date && b.target_date) return a.target_date.localeCompare(b.target_date)
        if (a.target_date) return -1
        if (b.target_date) return 1
        return b.created_at.localeCompare(a.created_at)
      })
  }, [projects, search, statusFilter, ownerFilter, categoryFilter])

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setProjectDraft(EMPTY_PROJECT)
    setError('')
  }

  function openNewProject() {
    setEditingId(null)
    setProjectDraft(EMPTY_PROJECT)
    setError('')
    setFormOpen(true)
  }

  function openEditProject(project: ContentProject) {
    setEditingId(project.id)
    setProjectDraft({
      title: project.title,
      description: project.description ?? '',
      notes: project.notes ?? '',
      category: project.category,
      status: project.status,
      priority: project.priority,
      owner: project.owner,
      target_date: project.target_date ?? '',
    })
    setError('')
    setFormOpen(true)
  }

  async function saveProject() {
    if (!projectDraft.title.trim()) {
      setError('Add a project or topic title.')
      return
    }

    setSaving(true)
    setError('')
    const supabase = createBrowserSupabase()
    const payload = {
      title: projectDraft.title.trim(),
      description: projectDraft.description.trim() || null,
      notes: projectDraft.notes.trim() || null,
      category: projectDraft.category,
      status: projectDraft.status,
      priority: projectDraft.priority,
      owner: projectDraft.owner,
      target_date: projectDraft.target_date || null,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      const { data, error: updateError } = await supabase
        .from('content_projects')
        .update(payload)
        .eq('id', editingId)
        .select('*')
        .single()

      if (updateError || !data) {
        setError(updateError?.message ?? 'Could not update this project.')
        setSaving(false)
        return
      }

      setProjects((current) =>
        current.map((project) =>
          project.id === editingId ? { ...(data as Omit<ContentProject, 'tasks'>), tasks: project.tasks } : project
        )
      )
    } else {
      const { data, error: insertError } = await supabase
        .from('content_projects')
        .insert(payload)
        .select('*')
        .single()

      if (insertError || !data) {
        setError(insertError?.message ?? 'Could not create this project.')
        setSaving(false)
        return
      }

      const created = { ...(data as Omit<ContentProject, 'tasks'>), tasks: [] }
      setProjects((current) => [created, ...current])
      setExpanded((current) => new Set(current).add(created.id))
    }

    setSaving(false)
    closeForm()
  }

  async function deleteProject(projectId: string) {
    if (!window.confirm('Delete this project and every task inside it?')) return
    setBusyId(projectId)
    const supabase = createBrowserSupabase()
    const { error: deleteError } = await supabase.from('content_projects').delete().eq('id', projectId)
    if (deleteError) setError(deleteError.message)
    else {
      setProjects((current) => current.filter((project) => project.id !== projectId))
      closeForm()
    }
    setBusyId(null)
  }

  async function updateProject(
    projectId: string,
    patch: Partial<Pick<ContentProject, 'status' | 'owner' | 'priority' | 'target_date'>>
  ) {
    const previous = projects
    setProjects((current) => current.map((project) => (project.id === projectId ? { ...project, ...patch } : project)))
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase
      .from('content_projects')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', projectId)
    if (updateError) {
      setProjects(previous)
      setError(updateError.message)
    }
  }

  function taskDraft(projectId: string): TaskDraft {
    return taskDrafts[projectId] ?? { title: '', assignee: 'Both', due_date: '' }
  }

  function patchTaskDraft(projectId: string, patch: Partial<TaskDraft>) {
    setTaskDrafts((current) => ({
      ...current,
      [projectId]: { ...(current[projectId] ?? { title: '', assignee: 'Both', due_date: '' }), ...patch },
    }))
  }

  async function addTask(project: ContentProject) {
    const draft = taskDraft(project.id)
    if (!draft.title.trim()) return
    setBusyId(`new-${project.id}`)
    const supabase = createBrowserSupabase()
    const { data, error: insertError } = await supabase
      .from('content_tasks')
      .insert({
        project_id: project.id,
        title: draft.title.trim(),
        assignee: draft.assignee,
        due_date: draft.due_date || null,
        status: 'todo',
        sort_order: project.tasks.length,
      })
      .select('*')
      .single()

    if (insertError || !data) setError(insertError?.message ?? 'Could not add this task.')
    else {
      setProjects((current) =>
        current.map((item) => (item.id === project.id ? { ...item, tasks: [...item.tasks, data as ContentTask] } : item))
      )
      patchTaskDraft(project.id, { title: '', due_date: '' })
    }
    setBusyId(null)
  }

  async function updateTask(
    projectId: string,
    taskId: string,
    patch: Partial<Pick<ContentTask, 'status' | 'assignee' | 'due_date'>>
  ) {
    const previous = projects
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, tasks: project.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)) }
          : project
      )
    )
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase
      .from('content_tasks')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', taskId)
    if (updateError) {
      setProjects(previous)
      setError(updateError.message)
    }
  }

  async function deleteTask(projectId: string, taskId: string) {
    setBusyId(taskId)
    const supabase = createBrowserSupabase()
    const { error: deleteError } = await supabase.from('content_tasks').delete().eq('id', taskId)
    if (deleteError) setError(deleteError.message)
    else {
      setProjects((current) =>
        current.map((project) =>
          project.id === projectId ? { ...project, tasks: project.tasks.filter((task) => task.id !== taskId) } : project
        )
      )
    }
    setBusyId(null)
  }

  function toggleExpanded(projectId: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(projectId)) next.delete(projectId)
      else next.add(projectId)
      return next
    })
  }

  return (
    <div className="p-5 md:p-8 max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Planner</h1>
          <p className="mt-1 text-sm text-gray-500">Capture ideas, organize production work, assign ownership, and keep due dates visible.</p>
        </div>
        <button onClick={openNewProject} className="flex items-center justify-center gap-2 rounded-lg bg-[#10755A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d6a51]">
          <Plus size={16} /> New project or topic
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active projects" value={projects.filter((p) => p.status !== 'complete').length} />
        <Stat label="Open tasks" value={openTasks.length} />
        <Stat label="Due in 7 days" value={dueSoonTasks.length} />
        <Stat label="Overdue" value={overdueTasks.length} alert={overdueTasks.length > 0} />
      </div>

      <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-3">
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(130px,auto))]">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, topics, or tasks" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" />
          </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">
            <option value="active">Active work</option><option value="all">All statuses</option>
            {PROJECT_STATUSES.map((status) => <option key={status} value={status}>{PROJECT_STATUS_LABELS[status]}</option>)}
          </select>
          <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value as typeof ownerFilter)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">
            <option value="all">All owners</option>{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">
            <option value="all">All categories</option>{CATEGORIES.map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-6 py-14 text-center">
          <p className="text-sm font-medium text-gray-600">No projects match this view.</p>
          <p className="mt-1 text-xs text-gray-400">Clear the filters or add a new project or topic.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const isOpen = expanded.has(project.id)
            const completed = project.tasks.filter((task) => task.status === 'complete').length
            const progress = project.tasks.length ? Math.round((completed / project.tasks.length) * 100) : 0
            const targetOverdue = Boolean(project.target_date && project.status !== 'complete' && daysUntil(project.target_date) < 0)

            return (
              <section key={project.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">{CATEGORY_LABELS[project.category]}</span>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[project.priority]}`}>{project.priority} priority</span>
                        {targetOverdue && <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700"><AlertTriangle size={12} /> Target overdue</span>}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
                      {project.description && <p className="mt-1 max-w-3xl text-sm text-gray-500">{project.description}</p>}
                    </div>
                    <button onClick={() => openEditProject(project)} className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-800" aria-label={`Edit ${project.title}`}><Pencil size={15} /></button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Quick label="Status"><select value={project.status} onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })} className={`w-full rounded-lg border-0 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#10755A] ${STATUS_STYLES[project.status]}`}>{PROJECT_STATUSES.map((status) => <option key={status} value={status}>{PROJECT_STATUS_LABELS[status]}</option>)}</select></Quick>
                    <Quick label="Owner"><select value={project.owner} onChange={(e) => updateProject(project.id, { owner: e.target.value as PlannerOwner })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select></Quick>
                    <Quick label="Priority"><select value={project.priority} onChange={(e) => updateProject(project.id, { priority: e.target.value as ProjectPriority })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></Quick>
                    <Quick label="Target date"><input type="date" value={project.target_date ?? ''} onChange={(e) => updateProject(project.id, { target_date: e.target.value || null })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" /></Quick>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#10755A]" style={{ width: `${progress}%` }} /></div>
                    <span className="shrink-0 text-xs font-medium text-gray-500">{completed}/{project.tasks.length} tasks</span>
                    <button onClick={() => toggleExpanded(project.id)} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#10755A]">{isOpen ? 'Hide details' : 'Show details'}{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/60 p-5">
                    {project.notes && <div className="mb-5 rounded-lg border border-gray-100 bg-white px-4 py-3"><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</p><p className="whitespace-pre-wrap text-sm text-gray-600">{project.notes}</p></div>}
                    <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-gray-800">Production tasks</h3>{project.target_date && <span className={`flex items-center gap-1 text-xs ${targetOverdue ? 'text-red-600' : 'text-gray-400'}`}><CalendarDays size={13} /> Project target {formatDate(project.target_date)}</span>}</div>

                    <div className="mb-4 space-y-2">
                      {project.tasks.length === 0 && <div className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-5 text-center text-xs text-gray-400">No tasks yet. Add the first production step below.</div>}
                      {project.tasks.map((task) => <TaskRow key={task.id} task={task} busy={busyId === task.id} onUpdate={(patch) => updateTask(project.id, task.id, patch)} onDelete={() => deleteTask(project.id, task.id)} />)}
                    </div>

                    <div className="grid gap-2 rounded-lg border border-gray-100 bg-white p-3 md:grid-cols-[minmax(220px,1fr)_150px_155px_auto]">
                      <input value={taskDraft(project.id).title} onChange={(e) => patchTaskDraft(project.id, { title: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') addTask(project) }} placeholder="Add a task, footage need, or next step" className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" />
                      <select value={taskDraft(project.id).assignee} onChange={(e) => patchTaskDraft(project.id, { assignee: e.target.value as PlannerOwner })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]">{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select>
                      <input type="date" value={taskDraft(project.id).due_date} onChange={(e) => patchTaskDraft(project.id, { due_date: e.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" />
                      <button onClick={() => addTask(project)} disabled={!taskDraft(project.id).title.trim() || busyId === `new-${project.id}`} className="flex items-center justify-center gap-1.5 rounded-lg bg-[#10755A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-40"><Plus size={15} /> Add</button>
                    </div>
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={() => { if (!saving) closeForm() }}>
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4"><div><h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit project or topic' : 'New project or topic'}</h2><p className="mt-0.5 text-xs text-gray-400">Use Idea status for topics that are not ready for production.</p></div><button onClick={closeForm} disabled={saving} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={18} /></button></div>
            <div className="space-y-4 p-6">
              <Field label="Title"><input autoFocus value={projectDraft.title} onChange={(e) => setProjectDraft((draft) => ({ ...draft, title: e.target.value }))} placeholder="Example: Ranking Carnival ships for first-time cruisers" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" /></Field>
              <Field label="Description"><textarea rows={3} value={projectDraft.description} onChange={(e) => setProjectDraft((draft) => ({ ...draft, description: e.target.value }))} placeholder="What is the idea, audience, or desired outcome?" className="w-full resize-y rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" /></Field>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Category"><select value={projectDraft.category} onChange={(e) => setProjectDraft((draft) => ({ ...draft, category: e.target.value as ProjectCategory }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm">{CATEGORIES.map((category) => <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>)}</select></Field>
                <Field label="Status"><select value={projectDraft.status} onChange={(e) => setProjectDraft((draft) => ({ ...draft, status: e.target.value as ProjectStatus }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm">{PROJECT_STATUSES.map((status) => <option key={status} value={status}>{PROJECT_STATUS_LABELS[status]}</option>)}</select></Field>
                <Field label="Owner"><select value={projectDraft.owner} onChange={(e) => setProjectDraft((draft) => ({ ...draft, owner: e.target.value as PlannerOwner }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm">{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select></Field>
                <Field label="Priority"><select value={projectDraft.priority} onChange={(e) => setProjectDraft((draft) => ({ ...draft, priority: e.target.value as ProjectPriority }))} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm">{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></Field>
              </div>
              <Field label="Target date"><input type="date" value={projectDraft.target_date} onChange={(e) => setProjectDraft((draft) => ({ ...draft, target_date: e.target.value }))} className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm sm:max-w-xs" /></Field>
              <Field label="Notes"><textarea rows={5} value={projectDraft.notes} onChange={(e) => setProjectDraft((draft) => ({ ...draft, notes: e.target.value }))} placeholder="Talking points, footage already captured, links, strategic decisions, or anything you do not want to lose." className="w-full resize-y rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10755A]" /></Field>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4"><div>{editingId && <button onClick={() => deleteProject(editingId)} disabled={busyId === editingId} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"><Trash2 size={15} /> Delete project</button>}</div><div className="flex items-center gap-2"><button onClick={closeForm} disabled={saving} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50">Cancel</button><button onClick={saveProject} disabled={saving} className="rounded-lg bg-[#10755A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d6a51] disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create project'}</button></div></div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return <div className={`rounded-xl border p-4 ${alert ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'}`}><p className={`text-xs font-medium ${alert ? 'text-red-600' : 'text-gray-500'}`}>{label}</p><p className={`mt-1 text-2xl font-bold ${alert ? 'text-red-700' : 'text-gray-900'}`}>{value}</p></div>
}

function Quick({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-gray-500">{label}</span>{children}</label>
}

function TaskRow({ task, busy, onUpdate, onDelete }: { task: ContentTask; busy: boolean; onUpdate: (patch: Partial<Pick<ContentTask, 'status' | 'assignee' | 'due_date'>>) => void; onDelete: () => void }) {
  const overdue = isTaskOverdue(task)
  return (
    <div className={`grid items-center gap-2 rounded-lg border bg-white p-3 md:grid-cols-[auto_minmax(220px,1fr)_135px_150px_155px_auto] ${overdue ? 'border-red-200' : 'border-gray-100'}`}>
      <button onClick={() => onUpdate({ status: task.status === 'complete' ? 'todo' : 'complete' })} className={task.status === 'complete' ? 'text-[#10755A]' : 'text-gray-300 hover:text-[#10755A]'} aria-label={task.status === 'complete' ? 'Mark task incomplete' : 'Mark task complete'}>{task.status === 'complete' ? <CheckCircle2 size={20} /> : <Circle size={20} />}</button>
      <div className="min-w-0"><p className={`text-sm font-medium ${task.status === 'complete' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</p>{overdue && <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-red-600"><AlertTriangle size={11} /> Due {formatDate(task.due_date)}</p>}</div>
      <select value={task.status} onChange={(e) => onUpdate({ status: e.target.value as TaskStatus })} className="rounded-md border border-gray-200 px-2 py-1.5 text-xs">{TASK_STATUSES.map((status) => <option key={status} value={status}>{TASK_STATUS_LABELS[status]}</option>)}</select>
      <select value={task.assignee} onChange={(e) => onUpdate({ assignee: e.target.value as PlannerOwner })} className="rounded-md border border-gray-200 px-2 py-1.5 text-xs">{OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select>
      <input type="date" value={task.due_date ?? ''} onChange={(e) => onUpdate({ due_date: e.target.value || null })} className={`rounded-md border px-2 py-1.5 text-xs ${overdue ? 'border-red-200 text-red-700' : 'border-gray-200'}`} />
      <button onClick={onDelete} disabled={busy} className="rounded-md p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-40" aria-label={`Delete ${task.title}`}><Trash2 size={14} /></button>
    </div>
  )
}
