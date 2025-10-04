export interface AIAgent {
  id: string;
  user_id: string;
  name: string;
  type: 'trip_planner' | 'booking_assistant' | 'expense_manager' | 'navigation_guide' | 'general_assistant';
  personality: string;
  capabilities: {
    trip_planning?: boolean;
    booking?: boolean;
    recommendations?: boolean;
    navigation?: boolean;
    expense_tracking?: boolean;
  };
  learning_model: Record<string, unknown>;
  status: 'active' | 'paused' | 'training';
  created_at: Date;
  updated_at: Date;
}

export interface AITask {
  id: string;
  agent_id: string;
  user_id: string;
  task_type: string;
  description: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: number;
  dependencies: string[];
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
}

export interface AIConversation {
  id: string;
  agent_id: string;
  user_id: string;
  message_type: 'user_message' | 'agent_response' | 'system_notification';
  content: string;
  metadata: Record<string, unknown>;
  sentiment?: 'positive' | 'neutral' | 'negative';
  created_at: Date;
}

export interface AIKnowledge {
  id: string;
  agent_id: string;
  category: 'user_preferences' | 'trip_patterns' | 'booking_history' | 'location_insights' | 'behavior_patterns' | 'optimization_rules';
  key: string;
  value: Record<string, unknown>;
  confidence_score: number;
  source: 'learned' | 'manual' | 'imported' | 'system';
  last_updated: Date;
  created_at: Date;
}

export interface AIRecommendation {
  id: string;
  agent_id: string;
  user_id: string;
  trip_id?: string;
  recommendation_type: 'destination' | 'activity' | 'restaurant' | 'timing' | 'budget' | 'route' | 'accommodation' | 'general';
  title: string;
  description: string;
  data: Record<string, unknown>;
  confidence_score: number;
  reasoning?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  feedback_score?: number;
  created_at: Date;
  expires_at?: Date;
}

export interface AILearningEvent {
  id: string;
  agent_id: string;
  event_type: 'user_feedback' | 'task_completion' | 'pattern_detected' | 'error_occurred' | 'preference_updated' | 'goal_achieved';
  event_data: Record<string, unknown>;
  impact_score: number;
  created_at: Date;
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
  proficiency: number;
}

export interface TaskPlan {
  goal: string;
  steps: TaskStep[];
  estimatedDuration: number;
  dependencies: string[];
}

export interface TaskStep {
  id: string;
  action: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: unknown;
}

export interface AgentState {
  currentTask?: AITask;
  activeTasks: AITask[];
  pendingTasks: AITask[];
  conversationHistory: AIConversation[];
  knowledgeBase: AIKnowledge[];
  recommendations: AIRecommendation[];
}
