'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Search, MoreVertical, Phone, Video, User, ArrowLeft, Menu, X } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: number
  text: string
  sender: 'user' | 'other'
  timestamp: string
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/images/celebrity1.jpg",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2m ago",
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: "Emma Wilson",
    avatar: "/images/celebrity2.jpg",
    lastMessage: "That sounds great! Let's meet up soon.",
    timestamp: "1h ago",
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: "Jessica Lee",
    avatar: "/images/celebrity3.jpg",
    lastMessage: "Thanks for the recommendation!",
    timestamp: "3h ago",
    unread: 1,
    online: true
  },
  {
    id: 4,
    name: "Mia Chen",
    avatar: "/images/celebrity4.jpg",
    lastMessage: "I had a great time yesterday!",
    timestamp: "1d ago",
    unread: 0,
    online: false
  },
  {
    id: 5,
    name: "Sophie Brown",
    avatar: "/images/celebrity5.jpg",
    lastMessage: "Can't wait to see you again!",
    timestamp: "2d ago",
    unread: 0,
    online: true
  }
]

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Hey! How are you doing?",
    sender: 'other',
    timestamp: '2:30 PM'
  },
  {
    id: 2,
    text: "I'm doing great! How about you?",
    sender: 'user',
    timestamp: '2:32 PM'
  },
  {
    id: 3,
    text: "Pretty good! I was thinking we could grab coffee sometime this week.",
    sender: 'other',
    timestamp: '2:33 PM'
  },
  {
    id: 4,
    text: "That sounds perfect! When works for you?",
    sender: 'user',
    timestamp: '2:35 PM'
  },
  {
    id: 5,
    text: "How about Friday afternoon?",
    sender: 'other',
    timestamp: '2:36 PM'
  }
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send this to your backend
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-[#ffe0ec]">
      {/* Static Left Sidebar */}
      <div className="w-20 bg-white shadow-lg fixed left-0 top-0 h-full z-40">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            KScan
          </h1>
          
          {/* Navigation Menu */}
          <nav className="space-y-4">
            <a href="/analysis" className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </a>
            <a href="/swipe" className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
            </a>
            <a href="/messages" className="flex items-center justify-center p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </a>
            <a href="/leaderboard" className="flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-20 flex">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: '#f8f9fa' }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={conversation.avatar}
                      alt={conversation.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative">
                    <Image
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedConversation.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 