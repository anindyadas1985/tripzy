import { supabase } from '../lib/supabase';
import type {
  AIAgent,
  AITask,
  AIConversation,
  AIKnowledge,
  AIRecommendation,
  AILearningEvent,
  TaskPlan,
  TaskStep
} from '../types/ai';

export class AIAgentService {
  private agentId: string | null = null;
  private userId: string | null = null;

  async initialize(userId: string): Promise<AIAgent> {
    this.userId = userId;

    const { data: existingAgent } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'general_assistant')
      .maybeSingle();

    if (existingAgent) {
      this.agentId = existingAgent.id;
      return existingAgent;
    }

    const { data: newAgent, error } = await supabase
      .from('ai_agents')
      .insert({
        user_id: userId,
        name: 'TripAI',
        type: 'general_assistant',
        personality: 'helpful, proactive, detail-oriented',
        capabilities: {
          trip_planning: true,
          booking: true,
          recommendations: true,
          navigation: true,
          expense_tracking: true
        },
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    this.agentId = newAgent.id;
    return newAgent;
  }

  async createTask(
    taskType: string,
    description: string,
    inputData: Record<string, any>,
    priority: number = 5
  ): Promise<AITask> {
    if (!this.agentId || !this.userId) {
      throw new Error('Agent not initialized');
    }

    const { data, error } = await supabase
      .from('ai_tasks')
      .insert({
        agent_id: this.agentId,
        user_id: this.userId,
        task_type: taskType,
        description,
        input_data: inputData,
        priority,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async executeTask(taskId: string): Promise<void> {
    const { data: task, error: fetchError } = await supabase
      .from('ai_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError) throw fetchError;

    await supabase
      .from('ai_tasks')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', taskId);

    try {
      const result = await this.processTask(task);

      await supabase
        .from('ai_tasks')
        .update({
          status: 'completed',
          output_data: result,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      await this.recordLearningEvent({
        event_type: 'task_completion',
        event_data: {
          task_id: taskId,
          task_type: task.task_type,
          success: true
        },
        impact_score: 0.7
      });
    } catch (error) {
      await supabase
        .from('ai_tasks')
        .update({
          status: 'failed',
          output_data: { error: (error as Error).message }
        })
        .eq('id', taskId);

      await this.recordLearningEvent({
        event_type: 'error_occurred',
        event_data: {
          task_id: taskId,
          error: (error as Error).message
        },
        impact_score: 0.3
      });

      throw error;
    }
  }

  private async processTask(task: AITask): Promise<Record<string, any>> {
    switch (task.task_type) {
      case 'plan_trip':
        return await this.planTrip(task.input_data);
      case 'recommend_activities':
        return await this.recommendActivities(task.input_data);
      case 'optimize_itinerary':
        return await this.optimizeItinerary(task.input_data);
      case 'analyze_expenses':
        return await this.analyzeExpenses(task.input_data);
      case 'suggest_routes':
        return await this.suggestRoutes(task.input_data);
      default:
        return { message: 'Task type not implemented' };
    }
  }

  private async planTrip(input: Record<string, any>): Promise<Record<string, any>> {
    const { destination, startDate, endDate, budget, preferences } = input;

    const knowledge = await this.getKnowledge('trip_patterns');

    const plan: TaskPlan = {
      goal: `Plan trip to ${destination}`,
      steps: [
        {
          id: '1',
          action: 'research_destination',
          description: 'Research destination attractions and activities',
          status: 'completed',
          result: { attractions: ['Museum', 'Park', 'Restaurant'] }
        },
        {
          id: '2',
          action: 'create_itinerary',
          description: 'Create day-by-day itinerary',
          status: 'completed',
          result: { days: 3, activities: 9 }
        },
        {
          id: '3',
          action: 'estimate_costs',
          description: 'Estimate trip costs',
          status: 'completed',
          result: { estimated: budget * 0.85 }
        }
      ],
      estimatedDuration: 5,
      dependencies: []
    };

    await this.createRecommendation({
      recommendation_type: 'general',
      title: `Trip Plan for ${destination}`,
      description: `I've created a comprehensive plan for your trip based on your preferences.`,
      data: { plan, preferences },
      confidence_score: 0.85,
      reasoning: `Based on ${knowledge.length} similar trips and your preferences`
    });

    return { plan, success: true };
  }

  private async recommendActivities(input: Record<string, any>): Promise<Record<string, any>> {
    const { location, interests, tripId } = input;

    const activities = [
      {
        name: 'City Walking Tour',
        type: 'cultural',
        duration: '2-3 hours',
        cost: 25,
        rating: 4.8
      },
      {
        name: 'Local Food Market Visit',
        type: 'culinary',
        duration: '1-2 hours',
        cost: 15,
        rating: 4.6
      },
      {
        name: 'Museum Visit',
        type: 'educational',
        duration: '2-4 hours',
        cost: 20,
        rating: 4.7
      }
    ];

    for (const activity of activities) {
      await this.createRecommendation({
        recommendation_type: 'activity',
        title: activity.name,
        description: `${activity.type} activity, ${activity.duration}`,
        data: activity,
        confidence_score: activity.rating / 5,
        reasoning: `Matches your interest in ${interests.join(', ')}`,
        trip_id: tripId
      });
    }

    return { activities, count: activities.length };
  }

  private async optimizeItinerary(input: Record<string, any>): Promise<Record<string, any>> {
    const { tripId, preferences } = input;

    const optimizations = [
      {
        type: 'timing',
        suggestion: 'Start museum visit at 10 AM to avoid crowds',
        impact: 'high',
        timeSaved: 30
      },
      {
        type: 'route',
        suggestion: 'Reorder activities to minimize travel time',
        impact: 'medium',
        timeSaved: 20
      },
      {
        type: 'cost',
        suggestion: 'Book lunch at local eatery instead of tourist spot',
        impact: 'medium',
        moneySaved: 15
      }
    ];

    return { optimizations, totalTimeSaved: 50, totalMoneySaved: 15 };
  }

  private async analyzeExpenses(input: Record<string, any>): Promise<Record<string, any>> {
    const { tripId } = input;

    const analysis = {
      totalSpent: 1250,
      budgetRemaining: 250,
      categories: {
        food: 450,
        transport: 300,
        accommodation: 400,
        activities: 100
      },
      insights: [
        'Food expenses are 20% above average',
        'You could save by using public transport',
        'Great job staying within budget!'
      ],
      predictions: {
        projectedTotal: 1450,
        recommendations: ['Consider budget lunch options', 'Look for activity bundles']
      }
    };

    return analysis;
  }

  private async suggestRoutes(input: Record<string, any>): Promise<Record<string, any>> {
    const { from, to, mode } = input;

    const routes = [
      {
        mode: mode || 'driving',
        duration: '25 min',
        distance: '12 km',
        traffic: 'light',
        cost: 5,
        recommended: true
      },
      {
        mode: 'transit',
        duration: '35 min',
        distance: '14 km',
        traffic: 'none',
        cost: 2,
        recommended: false
      }
    ];

    return { routes, recommendedIndex: 0 };
  }

  async sendMessage(content: string, messageType: 'user_message' | 'agent_response' = 'user_message'): Promise<AIConversation> {
    if (!this.agentId || !this.userId) {
      throw new Error('Agent not initialized');
    }

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        agent_id: this.agentId,
        user_id: this.userId,
        message_type: messageType,
        content,
        sentiment: this.analyzeSentiment(content)
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getConversationHistory(limit: number = 50): Promise<AIConversation[]> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('agent_id', this.agentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async createRecommendation(recommendation: Omit<AIRecommendation, 'id' | 'agent_id' | 'user_id' | 'created_at'>): Promise<AIRecommendation> {
    if (!this.agentId || !this.userId) {
      throw new Error('Agent not initialized');
    }

    const { data, error } = await supabase
      .from('ai_recommendations')
      .insert({
        agent_id: this.agentId,
        user_id: this.userId,
        ...recommendation
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRecommendations(status?: 'pending' | 'accepted' | 'rejected'): Promise<AIRecommendation[]> {
    if (!this.userId) {
      throw new Error('Agent not initialized');
    }

    let query = supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateRecommendationStatus(
    recommendationId: string,
    status: 'accepted' | 'rejected',
    feedbackScore?: number
  ): Promise<void> {
    const updateData: any = { status };
    if (feedbackScore) {
      updateData.feedback_score = feedbackScore;
    }

    const { error } = await supabase
      .from('ai_recommendations')
      .update(updateData)
      .eq('id', recommendationId);

    if (error) throw error;

    await this.recordLearningEvent({
      event_type: 'user_feedback',
      event_data: {
        recommendation_id: recommendationId,
        status,
        feedback_score: feedbackScore
      },
      impact_score: 0.8
    });
  }

  async addKnowledge(
    category: AIKnowledge['category'],
    key: string,
    value: Record<string, any>,
    confidenceScore: number = 0.5
  ): Promise<void> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    const { error } = await supabase
      .from('ai_knowledge_base')
      .upsert({
        agent_id: this.agentId,
        category,
        key,
        value,
        confidence_score: confidenceScore,
        source: 'learned',
        last_updated: new Date().toISOString()
      });

    if (error) throw error;
  }

  async getKnowledge(category?: AIKnowledge['category']): Promise<AIKnowledge[]> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    let query = supabase
      .from('ai_knowledge_base')
      .select('*')
      .eq('agent_id', this.agentId);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async recordLearningEvent(event: Omit<AILearningEvent, 'id' | 'agent_id' | 'created_at'>): Promise<void> {
    if (!this.agentId) {
      throw new Error('Agent not initialized');
    }

    const { error } = await supabase
      .from('ai_learning_events')
      .insert({
        agent_id: this.agentId,
        ...event
      });

    if (error) throw error;
  }

  async getTasks(status?: AITask['status']): Promise<AITask[]> {
    if (!this.userId) {
      throw new Error('Agent not initialized');
    }

    let query = supabase
      .from('ai_tasks')
      .select('*')
      .eq('user_id', this.userId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'good', 'excellent', 'perfect', 'love', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'disappointed', 'horrible', 'poor'];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  async processUserInput(input: string): Promise<string> {
    await this.sendMessage(input, 'user_message');

    const lowerInput = input.toLowerCase();

    let response = '';
    let taskType = '';
    let taskData = {};

    if (lowerInput.includes('plan') && (lowerInput.includes('trip') || lowerInput.includes('travel'))) {
      taskType = 'plan_trip';
      response = "I'll help you plan your trip! Let me analyze the best options for you.";
      taskData = { request: input };
    } else if (lowerInput.includes('recommend') || lowerInput.includes('suggest')) {
      taskType = 'recommend_activities';
      response = "Let me find some great recommendations for you based on your preferences.";
      taskData = { request: input };
    } else if (lowerInput.includes('optimize') || lowerInput.includes('improve')) {
      taskType = 'optimize_itinerary';
      response = "I'll analyze your itinerary and suggest optimizations.";
      taskData = { request: input };
    } else if (lowerInput.includes('expense') || lowerInput.includes('budget') || lowerInput.includes('cost')) {
      taskType = 'analyze_expenses';
      response = "Let me analyze your expenses and provide insights.";
      taskData = { request: input };
    } else if (lowerInput.includes('route') || lowerInput.includes('direction') || lowerInput.includes('navigate')) {
      taskType = 'suggest_routes';
      response = "I'll find the best routes for you.";
      taskData = { request: input };
    } else {
      response = "I understand! I'm here to help with trip planning, recommendations, expense tracking, and navigation. What would you like assistance with?";
    }

    await this.sendMessage(response, 'agent_response');

    if (taskType) {
      await this.createTask(taskType, input, taskData, 7);
    }

    return response;
  }
}

export const aiAgentService = new AIAgentService();
