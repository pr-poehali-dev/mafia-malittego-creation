import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import GameTimer from '@/components/GameTimer';
import GameChat from '@/components/GameChat';
import { generateRolesForGame, getRoleInfo } from '@/config/roles';

interface Player {
  id: number;
  name: string;
  role?: string;
  status: 'ready' | 'alive' | 'eliminated';
}

const Index = () => {
  const [showLobby, setShowLobby] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('classic');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [lobbyLink] = useState(`https://malittego.com/lobby/${Math.random().toString(36).substring(7)}`);
  const [currentPhase, setCurrentPhase] = useState<'day' | 'night'>('day');
  const [round, setRound] = useState(1);

  const phaseDuration = currentPhase === 'day' ? 60 : 45;

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, {
        id: Date.now(),
        name: newPlayerName.trim(),
        status: 'ready'
      }]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    const roles = generateRolesForGame(players.length);
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      role: shuffledRoles[index] || 'Мирный житель',
      status: 'alive' as const
    }));
    setPlayers(updatedPlayers);
    setGameStarted(true);
  };

  const togglePlayerStatus = (id: number) => {
    setPlayers(players.map(p => 
      p.id === id ? { ...p, status: p.status === 'alive' ? 'eliminated' : 'alive' } as Player : p
    ));
  };

  const handlePhaseEnd = () => {
    if (currentPhase === 'night') {
      setRound(round + 1);
    }
    setCurrentPhase(currentPhase === 'day' ? 'night' : 'day');
  };

  if (!showLobby) {
    return (
      <div className="min-h-screen bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        
        <div className="relative z-10">
          <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                  <Icon name="Users" className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-gradient">Malittego</h1>
              </div>
              <Button variant="outline" className="glass">
                <Icon name="User" className="mr-2 h-4 w-4" />
                Войти
              </Button>
            </nav>
          </header>

          <main className="container mx-auto px-4 py-16">
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
              <div className="inline-block animate-pulse-glow rounded-full bg-primary/20 px-4 py-2 mb-4">
                <span className="text-primary font-semibold">🎭 Психологическая игра нового поколения</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-gradient mb-6 animate-fade-in">
                Malittego
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in">
                Современная платформа для игры в мафию. Создавай лобби, приглашай друзей и окунись в мир интриг!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 glow hover:scale-105 transition-transform"
                  onClick={() => setShowLobby(true)}
                >
                  <Icon name="Play" className="mr-2" size={24} />
                  Создать игру
                </Button>
                <Button variant="outline" size="lg" className="glass hover:bg-white/10 transition-all">
                  <Icon name="Users" className="mr-2" size={20} />
                  Присоединиться к игре
                </Button>
              </div>
            </section>

            <section className="py-20 px-4">
              <div className="container mx-auto max-w-6xl">
                <h2 className="text-4xl font-bold text-center mb-4 text-gradient animate-fade-in">
                  Как это работает?
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Создай лобби, собери команду и наслаждайся игрой с автоматическим распределением ролей
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="glass rounded-2xl p-8 animate-fade-in hover:scale-105 transition-transform">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 glow">
                      <Icon name="Link" size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Создай лобби</h3>
                    <p className="text-muted-foreground">
                      Владелец игры создаёт комнату и получает персональную ссылку для приглашения игроков
                    </p>
                  </div>

                  <div className="glass p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 glow">
                      <Icon name="UserPlus" size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Собери команду</h3>
                    <p className="text-muted-foreground">Отправь ссылку друзьям и дождись, пока все игроки подключатся к лобби</p>
                  </div>

                  <div className="glass p-8 rounded-2xl animate-fade-in hover:scale-105 transition-transform" style={{animationDelay: '0.4s'}}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 glow">
                      <Icon name="Shuffle" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Автораздача ролей</h3>
                    <p className="text-muted-foreground">Система автоматически распределит роли между игроками по выбранному режиму</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                  Режимы игры
                </h2>
                <p className="text-center text-muted-foreground text-lg mb-12">
                  Выбери подходящий формат для своей компании
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border-2 border-transparent hover:border-primary">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 mx-auto glow">
                      <Icon name="Users" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-3">Классическая</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Традиционные правила мафии с полным набором ролей
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={16} className="text-primary" />
                        <span>8-15 игроков</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={16} className="text-primary" />
                        <span>60-90 минут</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Target" size={16} className="text-primary" />
                        <span>Все классические роли</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border-2 border-transparent hover:border-secondary">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 mx-auto glow">
                      <Icon name="Zap" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-3">Быстрая игра</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Динамичный формат с упрощёнными правилами
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={16} className="text-secondary" />
                        <span>6-10 игроков</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={16} className="text-secondary" />
                        <span>30-45 минут</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Target" size={16} className="text-secondary" />
                        <span>Базовые роли</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer border-2 border-transparent hover:border-accent">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 mx-auto glow">
                      <Icon name="Settings" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-3">Кастомная</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Создай свои правила и уникальные роли
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Users" size={16} className="text-accent" />
                        <span>Любое количество</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Clock" size={16} className="text-accent" />
                        <span>По твоему выбору</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Target" size={16} className="text-accent" />
                        <span>Настраиваемые роли</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-12">
                  <Button 
                    onClick={() => setShowLobby(true)}
                    size="lg" 
                    className="text-lg px-8 py-6 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity glow"
                  >
                    Создать игру
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => setShowLobby(false)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Icon name="ArrowLeft" size={20} />
            <span className="font-semibold">Назад</span>
          </button>
          <h1 className="text-2xl font-bold text-gradient">Malittego</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {!gameStarted ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Настройка лобби</h2>
              <p className="text-muted-foreground">Выбери режим игры и пригласи участников</p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <label className="block text-sm font-medium mb-3">Режим игры</label>
              <select 
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="classic">Классическая мафия</option>
                <option value="quick">Быстрая игра</option>
                <option value="custom">Кастомная</option>
              </select>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ссылка для игроков</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(lobbyLink);
                  }}
                >
                  <Icon name="Copy" size={16} className="mr-2" />
                  Копировать
                </Button>
              </div>
              <div className="px-4 py-3 bg-muted rounded-lg font-mono text-sm break-all">
                {lobbyLink}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Участники ({players.length})</h3>
              <div className="space-y-3 mb-4">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold">
                        {player.name[0]}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      player.status === 'ready' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {player.status === 'ready' ? 'Готов' : 'Ожидает'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Имя игрока"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  className="flex-1"
                />
                <Button onClick={addPlayer} disabled={!newPlayerName.trim()}>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </div>

            <Button 
              onClick={startGame}
              disabled={players.length < 4}
              size="lg" 
              className="w-full text-lg bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 glow"
            >
              Начать игру
              <Icon name="Play" size={20} className="ml-2" />
            </Button>

            {players.length < 4 && (
              <p className="text-center text-sm text-muted-foreground">
                Минимум 4 игрока для начала игры
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Игра началась!</h2>
              <p className="text-muted-foreground">Раунд {round} · Роли распределены между игроками</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GameTimer 
                phase={currentPhase}
                duration={phaseDuration}
                onPhaseEnd={handlePhaseEnd}
              />
              
              <GameChat 
                isNight={currentPhase === 'night'}
                currentPlayerId={1}
                currentPlayerName={players[0]?.name || 'Игрок'}
              />
            </div>

            <div className="grid gap-4">
              {players.map((player) => {
                const roleInfo = getRoleInfo(player.role || '');
                return (
                  <div key={player.id} className="glass p-6 rounded-2xl animate-scale-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${roleInfo?.color || 'from-primary to-secondary'} flex items-center justify-center text-2xl shadow-lg`}>
                          {roleInfo?.icon || player.name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">{player.role}</p>
                          {roleInfo && (
                            <p className="text-xs text-muted-foreground/70 mt-1">{roleInfo.ability}</p>
                          )}
                        </div>
                      </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        player.status === 'alive' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {player.status === 'alive' ? '🟢 Жив' : '💀 Выбыл'}
                      </span>
                      {player.status === 'alive' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePlayerStatus(player.id)}
                        >
                          Исключить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Статистика игры</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{players.length}</div>
                  <div className="text-sm text-muted-foreground">Всего игроков</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {players.filter(p => p.status === 'alive').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Живых</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">
                    {players.filter(p => p.status === 'eliminated').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Выбывших</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">{gameMode === 'classic' ? 'Классика' : gameMode === 'quick' ? 'Быстрая' : 'Кастом'}</div>
                  <div className="text-sm text-muted-foreground">Режим</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setGameStarted(false);
                  setPlayers(players.map(p => ({ ...p, role: '', status: 'ready' })));
                }}
                className="flex-1"
              >
                Новая игра
              </Button>
              <Button 
                onClick={() => setShowLobby(false)}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                Завершить
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;