import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCashFlow } from '@/lib/context';
import { useToast } from '@/hooks/use-toast';
import { SendIcon } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AIAssistant() {
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
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          query: userMessage,
          userData: {
            incomes: state.incomes,
            expenses: state.expenses,
            assets: state.assets,
            liabilities: state.liabilities,
            goals: state.goals,
            summary: {
              totalIncome: state.incomes.reduce((sum, income) => sum + income.amount, 0),
              totalExpenses: state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
              totalAssets: state.assets.reduce((sum, asset) => sum + parseFloat(asset.value.toString()), 0),
              totalLiabilities: state.liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount.toString()), 0),
              netWorth: state.assets.reduce((sum, asset) => sum + parseFloat(asset.value.toString()), 0) -
                      state.liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount.toString()), 0),
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.advice }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Financial Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                <p className="mb-2">Ask me anything about your finances!</p>
                <p className="text-sm">Examples:</p>
                <ul className="text-sm list-disc list-inside">
                  <li>How can I reduce my expenses?</li>
                  <li>What's the best way to increase my assets?</li>
                  <li>How can I pay off my liabilities faster?</li>
                  <li>What should I do to achieve my financial goals?</li>
                </ul>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your finances..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 