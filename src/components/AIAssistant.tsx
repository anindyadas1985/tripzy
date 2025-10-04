import React, { useState, useRef, useEffect } from 'react';
import { useAIAgent } from '../contexts/AIAgentContext';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  Minimize2
} from 'lucide-react';
import type { AIRecommendation, AITask } from '../types/ai';

export const AIAssistant: React.FC = () => {
  const {
    agent,
    agentState,
    isInitialized,
    isProcessing,
    sendMessage,
    getRecommendations,
    acceptRecommendation,
    rejectRecommendation,
    getTasks,
    executeTask
  } = useAIAgent();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'tasks'>('chat');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInitialized) {
      loadRecommendations();
      loadTasks();
    }
  }, [isInitialized]);

  useEffect(() => {
    scrollToBottom();
  }, [agentState.conversationHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRecommendations = async () => {
    try {
      const recs = await getRecommendations('pending');
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const message = input.trim();
    setInput('');

    try {
      await sendMessage(message);
      await loadTasks();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAcceptRecommendation = async (recId: string, score: number) => {
    try {
      await acceptRecommendation(recId, score);
      await loadRecommendations();
    } catch (error) {
      console.error('Failed to accept recommendation:', error);
    }
  };

  const handleRejectRecommendation = async (recId: string) => {
    try {
      await rejectRecommendation(recId);
      await loadRecommendations();
    } catch (error) {
      console.error('Failed to reject recommendation:', error);
    }
  };

  const handleExecuteTask = async (taskId: string) => {
    try {
      await executeTask(taskId);
      await loadTasks();
      await loadRecommendations();
    } catch (error) {
      console.error('Failed to execute task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isInitialized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-full p-4 shadow-lg">
        <Bot className="w-6 h-6 text-gray-400 animate-pulse" />
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <Bot className="w-6 h-6" />
        {agentState.recommendations.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {agentState.recommendations.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">{agent?.name || 'AI Assistant'}</h3>
            <p className="text-xs text-blue-100">
              {isProcessing ? 'Thinking...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
            activeTab === 'recommendations'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Suggestions
          {recommendations.length > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {recommendations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tasks
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {agentState.conversationHistory.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Hello! I'm your AI travel assistant
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    I can help you with:
                  </p>
                  <div className="text-left max-w-xs mx-auto space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span>Trip planning and recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Itinerary optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span>Expense analysis</span>
                    </div>
                  </div>
                </div>
              )}
              {[...agentState.conversationHistory].reverse().map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.message_type === 'user_message' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.message_type === 'user_message'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.message_type === 'user_message'
                          ? 'text-blue-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                  className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-600">No recommendations yet</p>
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {rec.title}
                      </h4>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {Math.round(rec.confidence_score * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                  {rec.reasoning && (
                    <p className="text-xs text-gray-600 mb-3 italic">
                      {rec.reasoning}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRecommendation(rec.id, 5)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRecommendation(rec.id)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-full overflow-y-auto p-4 space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-600">No active tasks</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm flex-1">
                      {task.description}
                    </h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Type: {task.task_type.replace('_', ' ')}
                  </p>
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleExecuteTask(task.id)}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Execute Task
                    </button>
                  )}
                  {task.status === 'completed' && task.output_data && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-800">Task completed successfully</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
