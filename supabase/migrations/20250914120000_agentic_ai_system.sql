/*
  # Agentic AI System

  1. New Tables
    - `ai_agents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text) - Agent name
      - `type` (text) - Agent type: trip_planner, booking_assistant, expense_manager, navigation_guide
      - `personality` (text) - Agent personality traits
      - `capabilities` (jsonb) - Agent capabilities and skills
      - `learning_model` (jsonb) - Learning preferences and history
      - `status` (text) - active, paused, training
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_tasks`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references ai_agents)
      - `user_id` (uuid, references users)
      - `task_type` (text) - plan_trip, book_flight, recommend_activity, etc.
      - `description` (text)
      - `input_data` (jsonb)
      - `output_data` (jsonb)
      - `status` (text) - pending, in_progress, completed, failed
      - `priority` (integer)
      - `dependencies` (jsonb) - Task dependencies
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)

    - `ai_conversations`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references ai_agents)
      - `user_id` (uuid, references users)
      - `message_type` (text) - user_message, agent_response, system_notification
      - `content` (text)
      - `metadata` (jsonb) - Context and additional data
      - `sentiment` (text) - positive, neutral, negative
      - `created_at` (timestamptz)

    - `ai_knowledge_base`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references ai_agents)
      - `category` (text) - user_preferences, trip_patterns, booking_history, location_insights
      - `key` (text)
      - `value` (jsonb)
      - `confidence_score` (numeric) - 0 to 1
      - `source` (text) - learned, manual, imported
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)

    - `ai_recommendations`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references ai_agents)
      - `user_id` (uuid, references users)
      - `trip_id` (uuid, references trips, nullable)
      - `recommendation_type` (text) - destination, activity, restaurant, timing, budget
      - `title` (text)
      - `description` (text)
      - `data` (jsonb)
      - `confidence_score` (numeric)
      - `reasoning` (text) - Why this recommendation
      - `status` (text) - pending, accepted, rejected, expired
      - `feedback_score` (integer) - User feedback
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)

    - `ai_learning_events`
      - `id` (uuid, primary key)
      - `agent_id` (uuid, references ai_agents)
      - `event_type` (text) - user_feedback, task_completion, pattern_detected, error_occurred
      - `event_data` (jsonb)
      - `impact_score` (numeric) - How much this affects learning
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create ai_agents table
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'AI Assistant',
  type text NOT NULL CHECK (type IN ('trip_planner', 'booking_assistant', 'expense_manager', 'navigation_guide', 'general_assistant')),
  personality text DEFAULT 'helpful, friendly, proactive',
  capabilities jsonb DEFAULT '{"trip_planning": true, "booking": true, "recommendations": true, "navigation": true, "expense_tracking": true}'::jsonb,
  learning_model jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'training')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_tasks table
CREATE TABLE IF NOT EXISTS ai_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  description text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  priority integer DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  dependencies jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message_type text NOT NULL CHECK (message_type IN ('user_message', 'agent_response', 'system_notification')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  created_at timestamptz DEFAULT now()
);

-- Create ai_knowledge_base table
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('user_preferences', 'trip_patterns', 'booking_history', 'location_insights', 'behavior_patterns', 'optimization_rules')),
  key text NOT NULL,
  value jsonb NOT NULL,
  confidence_score numeric DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  source text DEFAULT 'learned' CHECK (source IN ('learned', 'manual', 'imported', 'system')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, category, key)
);

-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('destination', 'activity', 'restaurant', 'timing', 'budget', 'route', 'accommodation', 'general')),
  title text NOT NULL,
  description text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  confidence_score numeric DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  reasoning text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  feedback_score integer CHECK (feedback_score >= 1 AND feedback_score <= 5),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create ai_learning_events table
CREATE TABLE IF NOT EXISTS ai_learning_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('user_feedback', 'task_completion', 'pattern_detected', 'error_occurred', 'preference_updated', 'goal_achieved')),
  event_data jsonb NOT NULL,
  impact_score numeric DEFAULT 0.5 CHECK (impact_score >= 0 AND impact_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_events ENABLE ROW LEVEL SECURITY;

-- Policies for ai_agents
CREATE POLICY "Users can view own agents"
  ON ai_agents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own agents"
  ON ai_agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents"
  ON ai_agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents"
  ON ai_agents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for ai_tasks
CREATE POLICY "Users can view own tasks"
  ON ai_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON ai_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON ai_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON ai_tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for ai_conversations
CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON ai_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON ai_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for ai_knowledge_base
CREATE POLICY "Users can view knowledge for their agents"
  ON ai_knowledge_base FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_knowledge_base.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create knowledge for their agents"
  ON ai_knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_knowledge_base.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update knowledge for their agents"
  ON ai_knowledge_base FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_knowledge_base.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_knowledge_base.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

-- Policies for ai_recommendations
CREATE POLICY "Users can view own recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recommendations"
  ON ai_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON ai_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON ai_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for ai_learning_events
CREATE POLICY "Users can view events for their agents"
  ON ai_learning_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_learning_events.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events for their agents"
  ON ai_learning_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_agents
      WHERE ai_agents.id = ai_learning_events.agent_id
      AND ai_agents.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_agents_user_id ON ai_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agents_status ON ai_agents(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_agent_id ON ai_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_user_id ON ai_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent_id ON ai_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_agent_id ON ai_knowledge_base(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_knowledge_base_category ON ai_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_trip_id ON ai_recommendations(trip_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_learning_events_agent_id ON ai_learning_events(agent_id);
