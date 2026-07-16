-- ============================================================
-- Travelholics content planner
-- Lightweight project/topic and task tracking for the admin area
-- ============================================================

CREATE TABLE IF NOT EXISTS public.content_projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  title       TEXT NOT NULL,
  description TEXT,
  notes       TEXT,
  category    TEXT NOT NULL DEFAULT 'video'
                CHECK (category IN ('video', 'social', 'website', 'shop', 'strategy', 'other')),
  status      TEXT NOT NULL DEFAULT 'idea'
                CHECK (status IN ('idea', 'planned', 'in_progress', 'blocked', 'complete')),
  priority    TEXT NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
  owner       TEXT NOT NULL DEFAULT 'Both'
                CHECK (owner IN ('Yolanda', 'Ricky', 'Both')),
  target_date DATE
);

CREATE TABLE IF NOT EXISTS public.content_tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.content_projects(id) ON DELETE CASCADE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  title       TEXT NOT NULL,
  details     TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in_progress', 'blocked', 'complete')),
  assignee    TEXT NOT NULL DEFAULT 'Both'
                CHECK (assignee IN ('Yolanda', 'Ricky', 'Both')),
  due_date    DATE,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

DROP TRIGGER IF EXISTS set_content_projects_updated_at ON public.content_projects;
CREATE TRIGGER set_content_projects_updated_at
  BEFORE UPDATE ON public.content_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_content_tasks_updated_at ON public.content_tasks;
CREATE TRIGGER set_content_tasks_updated_at
  BEFORE UPDATE ON public.content_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS content_projects_status_idx ON public.content_projects (status);
CREATE INDEX IF NOT EXISTS content_projects_owner_idx ON public.content_projects (owner);
CREATE INDEX IF NOT EXISTS content_projects_target_date_idx ON public.content_projects (target_date);
CREATE INDEX IF NOT EXISTS content_tasks_project_id_idx ON public.content_tasks (project_id);
CREATE INDEX IF NOT EXISTS content_tasks_status_idx ON public.content_tasks (status);
CREATE INDEX IF NOT EXISTS content_tasks_due_date_idx ON public.content_tasks (due_date);

ALTER TABLE public.content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage content projects" ON public.content_projects;
CREATE POLICY "Authenticated can manage content projects"
  ON public.content_projects FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can manage content tasks" ON public.content_tasks;
CREATE POLICY "Authenticated can manage content tasks"
  ON public.content_tasks FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
