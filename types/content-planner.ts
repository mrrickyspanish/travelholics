export type PlannerOwner = 'Yolanda' | 'Ricky' | 'Both'
export type ProjectCategory = 'video' | 'social' | 'website' | 'shop' | 'strategy' | 'other'
export type ProjectStatus = 'idea' | 'planned' | 'in_progress' | 'blocked' | 'complete'
export type ProjectPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'complete'

export interface ContentTask {
  id: string
  project_id: string
  created_at: string
  updated_at: string
  title: string
  details: string | null
  status: TaskStatus
  assignee: PlannerOwner
  due_date: string | null
  sort_order: number
}

export interface ContentProject {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string | null
  notes: string | null
  category: ProjectCategory
  status: ProjectStatus
  priority: ProjectPriority
  owner: PlannerOwner
  target_date: string | null
  tasks: ContentTask[]
}
