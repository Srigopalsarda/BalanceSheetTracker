import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCashFlow } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { SendIcon, MessageCircleIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { state } = useCashFlow();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Sending request to AI chat endpoint with message:', userMessage);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log('AI Chat response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI response data:', data);
      
      if (!data.response) {
        throw new Error('Invalid response format from AI service');
      }
      
      // Add the AI response to the messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
      >
        <MessageCircleIcon className="h-6 w-6" />
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-background rounded-lg shadow-xl border flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Financial AI Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                <p className="mb-2">Ask me anything about your finances!</p>
                <p className="text-sm">I can help with:</p>
                <ul className="text-sm list-disc list-inside">
                  <li>Financial advice and recommendations</li>
                  <li>Budgeting and expense management</li>
                  <li>Asset and liability analysis</li>
                  <li>Income optimization strategies</li>
                  <li>Balance sheet management</li>
                </ul>
                <p className="text-sm mt-2">I'll provide personalized advice based on your financial data.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 whitespace-pre-wrap",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your finances..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} size="icon">
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 