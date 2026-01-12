import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  playerName: string;
  text: string;
  timestamp: Date;
  playerId: number;
}

interface GameChatProps {
  isNight: boolean;
  currentPlayerId?: number;
  currentPlayerName?: string;
}

const GameChat = ({ isNight, currentPlayerId = 1, currentPlayerName = "Игрок 1" }: GameChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && !isNight) {
      const message: Message = {
        id: Date.now(),
        playerName: currentPlayerName,
        text: newMessage.trim(),
        timestamp: new Date(),
        playerId: currentPlayerId
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`glass rounded-3xl overflow-hidden transition-all duration-1000 border-2 ${
      isNight 
        ? 'bg-blue-900/10 border-blue-500/20 opacity-60' 
        : 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30'
    }`}>
      <div className={`p-4 border-b transition-all duration-1000 ${
        isNight ? 'border-blue-500/20 bg-blue-900/20' : 'border-primary/20 bg-primary/10'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-1000 ${
              isNight 
                ? 'bg-blue-600/30' 
                : 'bg-gradient-to-br from-primary to-secondary glow'
            }`}>
              <Icon name="MessageCircle" size={20} className={isNight ? 'text-blue-400' : 'text-white'} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Чат обсуждений</h3>
              <p className="text-xs text-muted-foreground">
                {isNight ? '🌙 Чат заблокирован на ночь' : `💬 ${messages.length} сообщений`}
              </p>
            </div>
          </div>
          {isNight && (
            <div className="flex items-center gap-2 text-sm text-blue-400 animate-pulse">
              <Icon name="Lock" size={16} />
              <span>Ночь</span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {isNight ? 'Чат заблокирован до утра' : 'Начните обсуждение'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`animate-fade-in ${
                  message.playerId === currentPlayerId ? 'ml-auto' : ''
                }`}
              >
                <div className={`flex gap-3 ${
                  message.playerId === currentPlayerId ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold flex-shrink-0">
                    {message.playerName[0]}
                  </div>
                  <div className={`flex-1 ${
                    message.playerId === currentPlayerId ? 'text-right' : 'text-left'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.playerId === currentPlayerId && (
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      )}
                      <span className="font-semibold text-sm">{message.playerName}</span>
                      {message.playerId !== currentPlayerId && (
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      )}
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
                      message.playerId === currentPlayerId
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm break-words">{message.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className={`p-4 border-t transition-all duration-1000 ${
        isNight ? 'border-blue-500/20 bg-blue-900/20' : 'border-primary/20'
      }`}>
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isNight ? 'Чат заблокирован на ночь...' : 'Напишите сообщение...'}
            disabled={isNight}
            className={`flex-1 transition-all duration-300 ${
              isNight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isNight}
            className={`transition-all duration-300 ${
              isNight ? 'opacity-50' : 'bg-gradient-to-r from-primary to-secondary glow'
            }`}
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
        {isNight && (
          <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
            <Icon name="Moon" size={12} />
            Дождитесь утра, чтобы продолжить обсуждение
          </p>
        )}
      </div>
    </div>
  );
};

export default GameChat;