export interface Role {
  id: string;
  name: string;
  team: 'mafia' | 'citizen' | 'neutral';
  description: string;
  ability: string;
  icon: string;
  color: string;
}

export const ROLES: Role[] = [
  {
    id: 'don',
    name: 'Дон',
    team: 'mafia',
    description: 'Глава мафии',
    ability: 'Руководит мафией, выбирает жертву ночью',
    icon: '👑',
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'mafia',
    name: 'Мафия',
    team: 'mafia',
    description: 'Подчиненные дона',
    ability: 'Помогают дону выбирать жертву ночью',
    icon: '🔫',
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'commissar',
    name: 'Комиссар Каттани',
    team: 'citizen',
    description: 'Главный детектив города',
    ability: 'Проверяет игроков ночью на причастность к мафии',
    icon: '🕵️',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'sergeant',
    name: 'Сержант',
    team: 'citizen',
    description: 'Помощник комиссара Каттани',
    ability: 'Заменяет комиссара на случай его смерти',
    icon: '👮',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'maniac',
    name: 'Маньяк',
    team: 'neutral',
    description: 'Хладнокровный убийца',
    ability: 'Играет сам за себя, убивает игроков ночью',
    icon: '🔪',
    color: 'from-purple-600 to-purple-900'
  },
  {
    id: 'lawyer',
    name: 'Адвокат',
    team: 'mafia',
    description: 'Защитник мафии',
    ability: 'Защищает мафию от проверок комиссара',
    icon: '⚖️',
    color: 'from-amber-600 to-amber-800'
  },
  {
    id: 'lucky',
    name: 'Счастливчик',
    team: 'citizen',
    description: 'Везунчик',
    ability: 'Выживает при первой попытке убийства',
    icon: '🍀',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'kamikaze',
    name: 'Камикадзе',
    team: 'citizen',
    description: 'Самоубийца',
    ability: 'Забирает убийцу с собой в могилу',
    icon: '💣',
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'homeless',
    name: 'Бомж',
    team: 'citizen',
    description: 'Бродяга',
    ability: 'Ходит к игрокам за бутылкой, видит всех посетителей',
    icon: '🍷',
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'doctor',
    name: 'Доктор',
    team: 'citizen',
    description: 'Врач города',
    ability: 'Лечит одного игрока за ночь',
    icon: '💉',
    color: 'from-teal-500 to-teal-700'
  },
  {
    id: 'lover',
    name: 'Любовница',
    team: 'citizen',
    description: 'Соблазнительница',
    ability: 'Обезоруживает игрока на сутки',
    icon: '💋',
    color: 'from-pink-500 to-pink-700'
  },
  {
    id: 'santa',
    name: 'Санта',
    team: 'citizen',
    description: 'Дед Мороз',
    ability: 'Дарит монетки, за которые можно купить префикс или выбор роли',
    icon: '🎅',
    color: 'from-red-400 to-green-600'
  },
  {
    id: 'citizen',
    name: 'Мирный житель',
    team: 'citizen',
    description: 'Обычный горожанин',
    ability: 'Участвует в голосованиях днём',
    icon: '👤',
    color: 'from-slate-500 to-slate-700'
  }
];

export const generateRolesForGame = (playerCount: number): string[] => {
  const roles: string[] = [];
  
  if (playerCount >= 20) {
    roles.push('Дон');
    roles.push('Мафия', 'Мафия', 'Мафия');
    roles.push('Адвокат');
    roles.push('Комиссар Каттани');
    roles.push('Сержант');
    roles.push('Маньяк');
    roles.push('Счастливчик');
    roles.push('Камикадзе');
    roles.push('Бомж');
    roles.push('Доктор');
    roles.push('Любовница');
    roles.push('Санта');
    
    const citizensNeeded = playerCount - roles.length;
    for (let i = 0; i < citizensNeeded; i++) {
      roles.push('Мирный житель');
    }
  } else if (playerCount >= 10) {
    roles.push('Дон');
    roles.push('Мафия', 'Мафия');
    roles.push('Комиссар Каттани');
    roles.push('Доктор');
    roles.push('Маньяк');
    roles.push('Счастливчик');
    
    const citizensNeeded = playerCount - roles.length;
    for (let i = 0; i < citizensNeeded; i++) {
      roles.push('Мирный житель');
    }
  } else {
    roles.push('Дон');
    roles.push('Мафия');
    roles.push('Комиссар Каттани');
    
    const citizensNeeded = playerCount - roles.length;
    for (let i = 0; i < citizensNeeded; i++) {
      roles.push('Мирный житель');
    }
  }
  
  return roles;
};

export const getRoleInfo = (roleName: string): Role | undefined => {
  return ROLES.find(role => role.name === roleName);
};