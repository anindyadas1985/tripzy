import React, { useState } from 'react';
import { Book, Camera, Heart, Star, MapPin, Calendar, Users, Download, Share2, Plus, Edit3 } from 'lucide-react';
import { useTripContext } from '../contexts/TripContext';

interface TripMemory {
  id: string;
  type: 'photo' | 'note' | 'rating' | 'highlight';
  content: string;
  location?: string;
  date: Date;
  author: string;
  rating?: number;
}

export const TripMemoryBook: React.FC = () => {
  const { activeTrip, trips } = useTripContext();
  const [selectedTrip, setSelectedTrip] = useState(activeTrip || trips[0]);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemory, setNewMemory] = useState({
    type: 'note' as 'photo' | 'note' | 'rating' | 'highlight',
    content: '',
    location: '',
    rating: 5
  });

  // Mock memories data
  const mockMemories: TripMemory[] = [
    {
      id: '1',
      type: 'highlight',
      content: 'The sunset view from Eiffel Tower was absolutely breathtaking! One of those moments you never forget.',
      location: 'Eiffel Tower, Paris',
      date: new Date('2025-01-15T18:30:00'),
      author: 'You'
    },
    {
      id: '2',
      type: 'photo',
      content: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg',
      location: 'Louvre Museum',
      date: new Date('2025-01-16T14:20:00'),
      author: 'Priya Sharma'
    },
    {
      id: '3',
      type: 'note',
      content: 'Had the most amazing croissants at this little café near Notre Dame. The owner was so friendly and gave us tips about hidden gems in the city!',
      location: 'Café de Flore',
      date: new Date('2025-01-16T09:15:00'),
      author: 'Rahul Kumar'
    },
    {
      id: '4',
      type: 'rating',
      content: 'Hotel Le Marais exceeded all expectations. The staff was incredible and the location was perfect for exploring the city.',
      location: 'Hotel Le Marais',
      date: new Date('2025-01-17T10:00:00'),
      author: 'Anita Singh',
      rating: 5
    }
  ];

  const completedTrips = trips.filter(trip => trip.status === 'completed');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'photo': return Camera;
      case 'rating': return Star;
      case 'highlight': return Heart;
      default: return Edit3;
    }
  };

  const getMemoryColor = (type: string) => {
    switch (type) {
      case 'photo': return 'from-purple-500 to-pink-500';
      case 'rating': return 'from-yellow-500 to-orange-500';
      case 'highlight': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the database
    console.log('Adding memory:', newMemory);
    setShowAddMemory(false);
    setNewMemory({ type: 'note', content: '', location: '', rating: 5 });
  };

  if (!selectedTrip) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Completed Trips</h2>
          <p className="text-gray-600">Complete a trip to create your first memory book!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Memory Book</h1>
              <p className="text-gray-600">Capture and cherish your travel memories</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share Book</span>
            </button>
          </div>
        </div>

        {/* Trip Selector */}
        {completedTrips.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Trip</label>
            <select
              value={selectedTrip.id}
              onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value) || trips[0])}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            >
              {completedTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>{trip.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Memory Book Cover */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div 
          className="h-64 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${selectedTrip.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">{selectedTrip.title}</h2>
              <div className="flex items-center justify-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedTrip.destination}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{selectedTrip.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>{selectedTrip.travelers} travelers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Summary Stats */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">7</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Places Visited</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">₹{selectedTrip.spent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{mockMemories.length}</div>
              <div className="text-sm text-gray-600">Memories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Memory Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddMemory(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
        >
          <Plus className="w-5 h-5" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memory Timeline */}
      <div className="space-y-6">
        {mockMemories.map((memory) => {
          const Icon = getMemoryIcon(memory.type);
          const colorClass = getMemoryColor(memory.type);

          return (
            <div key={memory.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{memory.author}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {memory.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(memory.date)} • {formatTime(memory.date)}
                      </div>
                    </div>

                    {memory.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{memory.location}</span>
                      </div>
                    )}

                    {memory.type === 'photo' ? (
                      <div className="mb-3">
                        <img 
                          src={memory.content} 
                          alt="Trip memory"
                          className="w-full max-w-md h-48 object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-3 leading-relaxed">{memory.content}</p>
                    )}

                    {memory.type === 'rating' && memory.rating && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(memory.rating)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {showAddMemory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Memory</h3>
              <button
                onClick={() => setShowAddMemory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Memory Type</label>
                <select
                  value={newMemory.type}
                  onChange={(e) => setNewMemory({...newMemory, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="note">Note</option>
                  <option value="highlight">Highlight</option>
                  <option value="photo">Photo</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newMemory.location}
                  onChange={(e) => setNewMemory({...newMemory, location: e.target.value})}
                  placeholder="Where was this memory made?"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {newMemory.type === 'rating' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewMemory({...newMemory, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newMemory.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newMemory.type === 'photo' ? 'Photo URL' : 'Memory'}
                </label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({...newMemory, content: e.target.value})}
                  placeholder={
                    newMemory.type === 'photo' 
                      ? 'Enter photo URL...' 
                      : 'Share your memory...'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemory(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Add Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};