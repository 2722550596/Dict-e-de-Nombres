export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  appTitle: string;
  appSubtitle: string;

  difficulty: string;
  customRange: string;
  quantity: string;
  startExercise: string;

  // 模式相关
  modes: {
    numberDictation: string;
    mathDictation: string;
  };

  // 运算听写相关
  operationTypes: string;
  maxResult: string;
  selectAtLeastOneOperation: string;
  answerFor: string;

  operations: {
    addition: string;
    subtraction: string;
    multiplication: string;
    division: string;
  };

  difficulties: {
    [key: string]: string;
  };

  play: string;
  pause: string;
  replay: string;
  speed: string;
  interval: string;
  progress: string;
  submit: string;
  restart: string;
  previous: string;
  next: string;
  page: string;

  speeds: {
    slow: string;
    normal: string;
    fast: string;
  };

  warnings: {
    noSpeechSupport: string;
    noVoiceFound: string;
    voiceError: string;
  };

  restartModal: {
    title: string;
    message: string;
    retestCurrent: string;
    newPractice: string;
    returnHome: string;
  };

  congratulations: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳'
  }
];

export const TRANSLATIONS: Record<string, Translations> = {
  fr: {
    appTitle: "Dictée de Nombres",
    appSubtitle: "Améliorez votre compréhension des nombres en français",
    
    difficulty: "Difficulté (Plage de nombres)",
    customRange: "Plage personnalisée",
    quantity: "Quantité",
    startExercise: "Commencer l'exercice",

    modes: {
      numberDictation: "Dictée de nombres",
      mathDictation: "Dictée d'opérations"
    },

    operationTypes: "Types d'opérations",
    maxResult: "Résultat maximum",
    selectAtLeastOneOperation: "Veuillez sélectionner au moins une opération",
    answerFor: "Réponse pour le numéro",

    operations: {
      addition: "Addition (+)",
      subtraction: "Soustraction (-)",
      multiplication: "Multiplication (×)",
      division: "Division (÷)"
    },

    difficulties: {
      "0-9": "0-9",
      "0-20": "0-20",
      "0-69": "0-69",
      "70-99": "70-99",
      "0-99": "0-99",
      "100-199": "100-199 (Centaines)",
      "100-999": "100-999 (Tous les centaines)",
      "1700-2050": "1700-2050 (Années)",
      "tens": "Nombres ronds (10, 20...90)",
      "custom": "Personnalisée..."
    },
    
    play: "Lecture",
    pause: "Pause",
    replay: "Répéter",
    speed: "Vitesse:",
    interval: "Intervalle:",
    progress: "Progression:",
    submit: "Soumettre",
    restart: "Recommencer",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    
    speeds: {
      slow: "Lente",
      normal: "Normale", 
      fast: "Rapide"
    },
    
    warnings: {
      noSpeechSupport: "Votre navigateur ne supporte pas la synthèse vocale",
      noVoiceFound: "Aucune voix française trouvée, utilisation de la voix par défaut",
      voiceError: "Erreur vocale"
    },

    restartModal: {
      title: "Recommencer",
      message: "Que souhaitez-vous faire ?",
      retestCurrent: "Refaire cette pratique",
      newPractice: "Nouvelle pratique",
      returnHome: "Retour à l'accueil"
    },

    congratulations: "Félicitations ! Parfait !"
  },
  
  en: {
    appTitle: "Number Dictation",
    appSubtitle: "Improve your number comprehension in French",
    
    difficulty: "Difficulty (Number Range)",
    customRange: "Custom Range",
    quantity: "Quantity", 
    startExercise: "Start Exercise",

    modes: {
      numberDictation: "Number Dictation",
      mathDictation: "Math Dictation"
    },

    operationTypes: "Operation Types",
    maxResult: "Maximum Result",
    selectAtLeastOneOperation: "Please select at least one operation",
    answerFor: "Answer for number",

    operations: {
      addition: "Addition (+)",
      subtraction: "Subtraction (-)",
      multiplication: "Multiplication (×)",
      division: "Division (÷)"
    },

    difficulties: {
      "0-9": "0-9",
      "0-20": "0-20",
      "0-69": "0-69",
      "70-99": "70-99",
      "0-99": "0-99",
      "100-199": "100-199 (Hundreds)",
      "100-999": "100-999 (All hundreds)",
      "1700-2050": "1700-2050 (Years)",
      "tens": "Round numbers (10, 20...90)",
      "custom": "Custom..."
    },
    
    play: "Play",
    pause: "Pause", 
    replay: "Replay",
    speed: "Speed:",
    interval: "Interval:",
    progress: "Progress:",
    submit: "Submit",
    restart: "Restart",
    previous: "Previous",
    next: "Next", 
    page: "Page",
    
    speeds: {
      slow: "Slow",
      normal: "Normal",
      fast: "Fast"
    },
    
    warnings: {
      noSpeechSupport: "Your browser does not support speech synthesis",
      noVoiceFound: "No French voice found, using default voice",
      voiceError: "Speech error"
    },

    restartModal: {
      title: "Restart",
      message: "What would you like to do?",
      retestCurrent: "Retest Current",
      newPractice: "New Practice",
      returnHome: "Return Home"
    },

    congratulations: "Congratulations! Perfect!"
  },

  zh: {
    appTitle: "法语数字听写",
    appSubtitle: "提高您的法语数字理解能力",
    
    difficulty: "难度（数字范围）",
    customRange: "自定义范围",
    quantity: "数量",
    startExercise: "开始练习",

    modes: {
      numberDictation: "数字听写",
      mathDictation: "运算听写"
    },

    operationTypes: "运算类型",
    maxResult: "答案最大值",
    selectAtLeastOneOperation: "请至少选择一种运算类型",
    answerFor: "答案",

    operations: {
      addition: "加法 (+)",
      subtraction: "减法 (-)",
      multiplication: "乘法 (×)",
      division: "除法 (÷)"
    },

    difficulties: {
      "0-9": "0-9",
      "0-20": "0-20",
      "0-69": "0-69",
      "70-99": "70-99",
      "0-99": "0-99",
      "100-199": "100-199（百位数）",
      "100-999": "100-999（所有百位数）",
      "1700-2050": "1700-2050（年份）",
      "tens": "整十数（10, 20...90）",
      "custom": "自定义..."
    },
    
    play: "播放",
    pause: "暂停",
    replay: "重播",
    speed: "速度：",
    interval: "间隔：",
    progress: "进度：",
    submit: "提交",
    restart: "重新开始",
    previous: "上一页",
    next: "下一页",
    page: "页",
    
    speeds: {
      slow: "慢速",
      normal: "正常",
      fast: "快速"
    },
    
    warnings: {
      noSpeechSupport: "您的浏览器不支持语音合成",
      noVoiceFound: "未找到法语语音，使用默认语音",
      voiceError: "语音错误"
    },

    restartModal: {
      title: "重新开始",
      message: "您希望做什么？",
      retestCurrent: "重测当前",
      newPractice: "新练习",
      returnHome: "返回主页"
    },

    congratulations: "恭喜！完美！"
  }
};