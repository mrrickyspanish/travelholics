import { createServerSupabase } from '@/lib/supabase-server'
import type { ContentProject, ContentTask } from '@/types/content-planner'
import ContentPlanner from './ContentPlanner'

export default async function ContentPlannerPage() {
  const supabase = await createServerSupabase()

  const [{ data: projects }, { data: tasks }] = await Promise.all([
    supabase.from('content_projects').select('*').order('created_at', { ascending: false }),
    supabase
      .from('content_tasks')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ])

  const projectRows = (projects ?? []) as Omit<ContentProject, 'tasks'>[]
  const taskRows = (tasks ?? []) as ContentTask[]
  const projectsWithTasks: ContentProject[] = projectRows.map((project) => ({
    ...project,
    tasks: taskRows.filter((task) => task.project_id === project.id),
  }))

  return <ContentPlanner initialProjects={projectsWithTasks} />
}
