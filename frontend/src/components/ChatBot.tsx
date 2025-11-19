'use client'

import { useState, useRef, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import axiosInstance from '@/lib/axios-instance'

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  suggestedProducts?: any[]
  timestamp: Date
}

export function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hi! I'm your shopping assistant. I can help you find products, answer questions, or add items to your cart. What are you looking for?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user } = useAuth()
  const cartStore = useCartStore()
  const wishlistStore = useWishlistStore()
  const toast = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessageText = input.trim()
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call chatbot API
      const { data } = await axiosInstance.post('chatbot/message', {
        message: userMessageText,
        userId: user?.id,
        chatHistory: messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
      })

      if (!data.success) {
        throw new Error(data.message || 'Failed to get response')
      }

      // Add bot response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.data.response,
        suggestedProducts: data.data.suggestedProducts || [],
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])

      // Handle actions (add to cart, etc.)
      if (data.data.actions && Array.isArray(data.data.actions)) {
        for (const action of data.data.actions) {
          if (action.type === 'addToCart' && action.productId) {
            try {
              await cartStore.add(action.productId, action.qty || 1)
              toast.success('Added to cart!')
            } catch (err) {
              console.error('Failed to add to cart:', err)
            }
          } else if (action.type === 'addToWishlist' && action.productId) {
            try {
              await wishlistStore.add(action.productId)
              toast.success('Added to wishlist!')
            } catch (err) {
              console.error('Failed to add to wishlist:', err)
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Chatbot error:', err)
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'bot',
        content: `Sorry, I encountered an error. Please try again.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
      toast.error('Failed to get response from chatbot')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await cartStore.add(productId, 1)
      toast.success('Added to cart!')
    } catch (err) {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <div>
      {/* Floating widget button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center z-40"
          aria-label="Open chat"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl flex flex-col z-50 border border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Shopping Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-xl hover:opacity-80 transition"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Show product cards if suggested */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.suggestedProducts.map(product => (
                        <div
                          key={product._id}
                          className="bg-white dark:bg-zinc-700 rounded p-2 text-xs text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-600"
                        >
                          <p className="font-semibold truncate">{product.name}</p>
                          <p className="text-zinc-600 dark:text-zinc-400">₹{product.price.toLocaleString('en-IN')}</p>
                          <button
                            onClick={() => handleAddToCart(product._id)}
                            className="mt-1 w-full bg-emerald-600 text-white py-1 rounded text-xs hover:bg-emerald-700 transition"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-zinc-200 dark:border-zinc-700 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
