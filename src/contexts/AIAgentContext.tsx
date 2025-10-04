import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { aiAgentService } from '../services/aiAgentService';
import type {
  AIAgent,
  AITask,
  AIConversation,
  AIRecommendation,
  AgentState
} from '../types/ai';

interface AIAgentContextType {
  agent: AIAgent | null;
  agentState: AgentState;
  isInitialized: boolean;
  isProcessing: boolean;
  sendMessage: (message: string) => Promise<string>;
  createTask: (taskType: string, description: string, inputData: Record<string, any>) => Promise<AITask>;
  getTasks: (status?: AITask['status']) => Promise<AITask[]>;
  executeTask: (taskId: string) => Promise<void>;
  getRecommendations: (status?: 'pending' | 'accepted' | 'rejected') => Promise<AIRecommendation[]>;
  acceptRecommendation: (recommendationId: string, feedbackScore?: number) => Promise<void>;
  rejectRecommendation: (recommendationId: string) => Promise<void>;
  refreshState: () => Promise<void>;
}

const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined);

export const useAIAgent = () => {
  const context = useContext(AIAgentContext);
  if (!context) {
    throw new Error('useAIAgent must be used within AIAgentProvider');
  }
  return context;
};

interface AIAgentProviderProps {
  children: ReactNode;
}

export const AIAgentProvider: React.FC<AIAgentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [agentState, setAgentState] = useState<AgentState>({
    activeTasks: [],
    pendingTasks: [],
    conversationHistory: [],
    knowledgeBase: [],
    recommendations: []
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      initializeAgent();
    }
  }, [user]);

  const initializeAgent = async () => {
    if (!user?.id) return;

    try {
      const initializedAgent = await aiAgentService.initialize(user.id);
      setAgent(initializedAgent);
      setIsInitialized(true);
      await refreshState();
    } catch (error) {
      console.error('Failed to initialize AI agent:', error);
    }
  };

  const refreshState = async () => {
    if (!user?.id) return;

    try {
      const [
        activeTasks,
        pendingTasks,
        conversationHistory,
        knowledgeBase,
        recommendations
      ] = await Promise.all([
        aiAgentService.getTasks('in_progress'),
        aiAgentService.getTasks('pending'),
        aiAgentService.getConversationHistory(20),
        aiAgentService.getKnowledge(),
        aiAgentService.getRecommendations('pending')
      ]);

      setAgentState({
        currentTask: activeTasks[0],
        activeTasks,
        pendingTasks,
        conversationHistory,
        knowledgeBase,
        recommendations
      });
    } catch (error) {
      console.error('Failed to refresh agent state:', error);
    }
  };

  const sendMessage = async (message: string): Promise<string> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    setIsProcessing(true);
    try {
      const response = await aiAgentService.processUserInput(message);
      await refreshState();
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const createTask = async (
    taskType: string,
    description: string,
    inputData: Record<string, any>
  ): Promise<AITask> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    try {
      const task = await aiAgentService.createTask(taskType, description, inputData);
      await refreshState();
      return task;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const getTasks = async (status?: AITask['status']): Promise<AITask[]> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    try {
      return await aiAgentService.getTasks(status);
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  };

  const executeTask = async (taskId: string): Promise<void> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    setIsProcessing(true);
    try {
      await aiAgentService.executeTask(taskId);
      await refreshState();
    } catch (error) {
      console.error('Failed to execute task:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const getRecommendations = async (
    status?: 'pending' | 'accepted' | 'rejected'
  ): Promise<AIRecommendation[]> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    try {
      return await aiAgentService.getRecommendations(status);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  };

  const acceptRecommendation = async (
    recommendationId: string,
    feedbackScore?: number
  ): Promise<void> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    try {
      await aiAgentService.updateRecommendationStatus(
        recommendationId,
        'accepted',
        feedbackScore
      );
      await refreshState();
    } catch (error) {
      console.error('Failed to accept recommendation:', error);
      throw error;
    }
  };

  const rejectRecommendation = async (recommendationId: string): Promise<void> => {
    if (!isInitialized) {
      throw new Error('Agent not initialized');
    }

    try {
      await aiAgentService.updateRecommendationStatus(recommendationId, 'rejected');
      await refreshState();
    } catch (error) {
      console.error('Failed to reject recommendation:', error);
      throw error;
    }
  };

  const value: AIAgentContextType = {
    agent,
    agentState,
    isInitialized,
    isProcessing,
    sendMessage,
    createTask,
    getTasks,
    executeTask,
    getRecommendations,
    acceptRecommendation,
    rejectRecommendation,
    refreshState
  };

  return (
    <AIAgentContext.Provider value={value}>
      {children}
    </AIAgentContext.Provider>
  );
};
