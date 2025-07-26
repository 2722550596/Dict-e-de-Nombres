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

  // 开发者控制台消息
  console: {
    speechSynthesisError: string;
    webAudioNotSupported: string;
    failedToGenerateAudioTone: string;
    failedToPlayAudioBuffer: string;
    failedToLoadSoundFile: string;
    failedToSaveUserData: string;
    failedToLoadNumberStats: string;
    failedToSaveNumberStats: string;
    failedToClearNumberStats: string;
    failedToClearUserData: string;
    failedToResetAllData: string;
    userDataCleared: string;
    allDataReset: string;
  };

  restartModal: {
    title: string;
    message: string;
    retestCurrent: string;
    newPractice: string;
    returnHome: string;
  };

  confirmModal: {
    returnHomeTitle: string;
    returnHomeMessage: string;
    confirm: string;
    cancel: string;
  };

  // 奖励弹窗相关
  rewardModal: {
    title: string;
    subtitle: string;
    experiencePoints: string;
    maxStreak: string;
    levelUp: string;
    levelUpCelebration: string;
    continueButton: string;
  };

  // 智能推荐相关
  recommendation: {
    prefix: string;
    suffix: string;
    allGood: string;
  };

  // 清空统计相关
  clearStatsConfirm: string;
  clearStatsTooltip: string;
  clearStatsModal: {
    title: string;
    message: string;
  };

  // 难度选择器相关
  difficultySelector: {
    searchPlaceholder: string;
    categories: {
      basic: string;
      intermediate: string;
      difficult: string;
      comprehensive: string;
      hundreds: string;
      thousands: string;
      special: string;
    };
  };

  // HUD相关
  hud: {
    level: string;
    exp: string;
    today: string;
    total: string;
    accuracy: string;
    maxStreak: string;
  };

  congratulations: string;

  // 语音测试页面相关
  voiceTest: {
    title: string;
    browserNotSupported: string;
    noFrenchVoiceDetected: string;
    iosVoiceInstructions: string;
    voiceListUpdated: string;
    noFrenchVoiceAvailable: string;
    noVoiceFound: string;
    speechSynthesisNotSupported: string;
    noFrenchVoiceFoundUsingDefault: string;
    speechError: string;
    readingStarted: string;
    readingFinished: string;
    testingAllFrenchVoices: string;
    availableVoices: string;
    voicesDetected: string;
    currentSavedVoice: string;
    selectVoice: string;
    testSelectedVoice: string;
    testAllVoices: string;
    listAllVoices: string;
    saveVoice: string;
    clearSavedVoice: string;
    testNumbers: string;
    usingVoice: string;
  };

  // 调试工具相关
  debugTool: {
    title: string;
    currentStatus: string;
    loading: string;
    refreshStatus: string;
    testOperations: string;
    testSimpleSession: string;
    testMathSession: string;
    testMixedSession: string;
    testEmptySession: string;
    clearUserData: string;
    clearAllData: string;
    operationLog: string;
    clearLog: string;
    confirmClearUserData: string;
    confirmClearAllData: string;
    debugToolLoaded: string;
    noUserDataFound: string;
    newDayDetected: string;
    loadUserDataFailed: string;
    statusRefreshed: string;
    startTestSimple: string;
    startTestMath: string;
    startTestMixed: string;
    startTestEmpty: string;
    testCompleted: string;
    congratsLevelUp: string;
    userDataCleared: string;
    allDataCleared: string;
    experienceGained: string;
    level: string;
    experience: string;
    totalSessions: string;
    todaySessions: string;
    totalQuestions: string;
    totalCorrect: string;
    maxStreak: string;
    lastActiveDate: string;
    localStorageStatus: string;
    userDataKey: string;
    dataExists: string;
    dataSize: string;
    characters: string;
    yes: string;
    no: string;
  };
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
      "0-16": "0-16 (Nombres de base)",
      "0-20": "0-20",
      "0-30": "0-30 (Base étendue)",
      "0-50": "0-50 (Demi-centaine)",
      "0-69": "0-69",
      "20-69": "20-69 (Nombres réguliers)",
      "50-99": "50-99 (Nombres élevés)",
      "70-79": "70-79 (soixante-dix)",
      "80-89": "80-89 (quatre-vingts)",
      "90-99": "90-99 (quatre-vingt-dix)",
      "70-99": "70-99",
      "0-99": "0-99",
      "0-100": "0-100 (Avec cent)",
      "100-199": "100-199 (Centaines)",
      "100-299": "100-299 (Centaines basses)",
      "100-500": "100-500 (Centaines moyennes)",
      "200-299": "200-299 (Deux cents)",
      "200-999": "200-999 (Centaines élevées)",
      "300-999": "300-999 (Centaines élevées)",
      "100-999": "100-999 (Tous les centaines)",
      "1000-1999": "1000-1999 (Milliers)",
      "1000-9999": "1000-9999 (Tous les milliers)",
      "2000-9999": "2000-9999 (Milliers élevés)",
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

    console: {
      speechSynthesisError: "Erreur de synthèse vocale:",
      webAudioNotSupported: "Web Audio API non supporté:",
      failedToGenerateAudioTone: "Échec de génération du ton audio:",
      failedToPlayAudioBuffer: "Échec de lecture du buffer audio:",
      failedToLoadSoundFile: "Échec de chargement du fichier audio pour",
      failedToSaveUserData: "Échec de sauvegarde des données utilisateur:",
      failedToLoadNumberStats: "Échec de chargement des statistiques de nombres:",
      failedToSaveNumberStats: "Échec de sauvegarde des statistiques de nombres:",
      failedToClearNumberStats: "Échec de suppression des statistiques de nombres:",
      failedToClearUserData: "Échec de suppression des données utilisateur:",
      failedToResetAllData: "Échec de réinitialisation de toutes les données:",
      userDataCleared: "Données utilisateur effacées, expérience et niveau réinitialisés à l'état initial",
      allDataReset: "Toutes les données de jeu ont été réinitialisées"
    },

    restartModal: {
      title: "Recommencer",
      message: "Que souhaitez-vous faire ?",
      retestCurrent: "Refaire cette pratique",
      newPractice: "Nouvelle pratique",
      returnHome: "Retour à l'accueil"
    },

    confirmModal: {
      returnHomeTitle: "Retour à l'accueil",
      returnHomeMessage: "Êtes-vous sûr de vouloir retourner à l'accueil ? Votre progression actuelle sera perdue.",
      confirm: "Confirmer",
      cancel: "Annuler"
    },

    rewardModal: {
      title: "Exercice terminé !",
      subtitle: "Votre progression",
      sessionComplete: "Session terminée",
      youEarned: "Vous avez gagné",
      levelAchieved: "Niveau {level} atteint !",
      experiencePoints: "points d'expérience",
      experience: "Expérience",
      maxStreak: "Série maximale",
      accuracy: "Précision",
      streakBonus: "Bonus série",
      perfectPerformance: "Performance parfaite !",
      allCorrect: "Tout juste, excellent !",
      levelUp: "Niveau supérieur !",
      levelUpCelebration: "Félicitations pour votre progression !",
      continueButton: "Continuer",
      awesome: "Génial !"
    },

    recommendation: {
      prefix: "Basé sur votre performance dans la plage",
      suffix: "de précision, nous recommandons de pratiquer",
      allGood: "Excellente maîtrise de toutes les plages, vous pouvez essayer un défi plus difficile ou une pratique mixte"
    },

    difficultySelector: {
      searchPlaceholder: "Rechercher une difficulté...",
      categories: {
        basic: "Plages de base",
        intermediate: "Plages intermédiaires",
        difficult: "Plages difficiles",
        comprehensive: "Plages complètes",
        hundreds: "Centaines",
        thousands: "Milliers",
        special: "Modes spéciaux"
      }
    },

    hud: {
      level: "Niveau",
      exp: "EXP",
      today: "Aujourd'hui",
      total: "Total",
      accuracy: "Précision",
      maxStreak: "Série max"
    },

    clearStatsConfirm: "Êtes-vous sûr de vouloir effacer tous les enregistrements de précision ? Cela réinitialisera toutes les statistiques de pratique des nombres.",
    clearStatsTooltip: "Effacer les enregistrements de précision",
    clearStatsModal: {
      title: "Effacer les statistiques",
      message: "Êtes-vous sûr de vouloir effacer tous les enregistrements de précision ? Cela réinitialisera toutes les statistiques de pratique des nombres."
    },

    congratulations: "Félicitations ! Parfait !",

    voiceTest: {
      title: "Test de Voix Française",
      browserNotSupported: "Votre navigateur ne supporte pas Web Speech API",
      noFrenchVoiceDetected: "Aucune voix française détectée. Sur iOS, allez dans Réglages > Accessibilité > Contenu énoncé > Voix pour ajouter une voix française.",
      iosVoiceInstructions: "Sur iOS, allez dans Réglages > Accessibilité > Contenu énoncé > Voix pour ajouter une voix française.",
      voiceListUpdated: "Liste des voix mise à jour",
      noFrenchVoiceAvailable: "Aucune voix française disponible",
      noVoiceFound: "Aucune voix trouvée, veuillez réessayer plus tard",
      speechSynthesisNotSupported: "Votre navigateur ne supporte pas la synthèse vocale",
      noFrenchVoiceFoundUsingDefault: "Aucune voix française trouvée, utilisation de la voix par défaut",
      speechError: "Erreur vocale",
      readingStarted: "Lecture commencée",
      readingFinished: "Lecture terminée",
      testingAllFrenchVoices: "Test de toutes les voix françaises...",
      availableVoices: "Voix disponibles:",
      voicesDetected: "voix française(s) détectée(s)",
      currentSavedVoice: "Voix sauvegardée actuelle:",
      selectVoice: "Sélectionner une voix",
      testSelectedVoice: "Tester la voix sélectionnée",
      testAllVoices: "Tester toutes les voix françaises",
      listAllVoices: "Lister toutes les voix",
      saveVoice: "Sauvegarder la voix",
      clearSavedVoice: "Effacer la voix sauvegardée",
      testNumbers: "Tester avec des nombres",
      usingVoice: "Utilisation de la voix"
    },

    debugTool: {
      title: "Outil de Débogage de l'Expérience",
      currentStatus: "État Actuel",
      loading: "Chargement...",
      refreshStatus: "Actualiser l'État",
      testOperations: "Opérations de Test",
      testSimpleSession: "Tester Session Simple (5 questions correctes)",
      testMathSession: "Tester Session Math (3 questions correctes)",
      testMixedSession: "Tester Session Mixte (partiellement correct)",
      testEmptySession: "Tester Session Vide",
      clearUserData: "Effacer Données Utilisateur",
      clearAllData: "Effacer Toutes les Données",
      operationLog: "Journal des Opérations",
      clearLog: "Effacer le Journal",
      confirmClearUserData: "Êtes-vous sûr de vouloir effacer les données utilisateur ? Cela réinitialisera le niveau et l'expérience.",
      confirmClearAllData: "Êtes-vous sûr de vouloir effacer toutes les données ? Cela réinitialisera tous les progrès du jeu.",
      debugToolLoaded: "Outil de débogage chargé",
      noUserDataFound: "Aucune donnée utilisateur sauvegardée trouvée, utilisation des données par défaut",
      newDayDetected: "Nouveau jour détecté, réinitialisation du nombre de sessions d'aujourd'hui",
      loadUserDataFailed: "Échec du chargement des données utilisateur",
      statusRefreshed: "État actualisé",
      startTestSimple: "=== Début du test de session simple ===",
      startTestMath: "=== Début du test de session mathématique ===",
      startTestMixed: "=== Début du test de session mixte ===",
      startTestEmpty: "=== Début du test de session vide ===",
      testCompleted: "Test terminé, expérience gagnée",
      congratsLevelUp: "Félicitations pour la montée de niveau !",
      userDataCleared: "Données utilisateur effacées",
      allDataCleared: "Toutes les données effacées",
      experienceGained: "expérience gagnée",
      level: "Niveau",
      experience: "Expérience",
      totalSessions: "Sessions totales",
      todaySessions: "Sessions d'aujourd'hui",
      totalQuestions: "Questions totales",
      totalCorrect: "Réponses correctes",
      maxStreak: "Série maximale",
      lastActiveDate: "Dernière date d'activité",
      localStorageStatus: "État du LocalStorage",
      userDataKey: "Clé des données utilisateur",
      dataExists: "Données existent",
      dataSize: "Taille des données",
      characters: "caractères",
      yes: "Oui",
      no: "Non"
    }
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
      "0-16": "0-16 (Basic numbers)",
      "0-20": "0-20",
      "0-30": "0-30 (Extended basic)",
      "0-50": "0-50 (Half hundred)",
      "0-69": "0-69",
      "20-69": "20-69 (Regular numbers)",
      "50-99": "50-99 (High numbers)",
      "70-79": "70-79 (soixante-dix)",
      "80-89": "80-89 (quatre-vingts)",
      "90-99": "90-99 (quatre-vingt-dix)",
      "70-99": "70-99",
      "0-99": "0-99",
      "0-100": "0-100 (With hundred)",
      "100-199": "100-199 (Hundreds)",
      "100-299": "100-299 (Low hundreds)",
      "100-500": "100-500 (Mid hundreds)",
      "200-299": "200-299 (Two hundreds)",
      "200-999": "200-999 (High hundreds)",
      "300-999": "300-999 (High hundreds)",
      "100-999": "100-999 (All hundreds)",
      "1000-1999": "1000-1999 (Thousands)",
      "1000-9999": "1000-9999 (All thousands)",
      "2000-9999": "2000-9999 (High thousands)",
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

    console: {
      speechSynthesisError: "Speech synthesis error:",
      webAudioNotSupported: "Web Audio API not supported:",
      failedToGenerateAudioTone: "Failed to generate audio tone:",
      failedToPlayAudioBuffer: "Failed to play audio buffer:",
      failedToLoadSoundFile: "Failed to load sound file for",
      failedToSaveUserData: "Failed to save user data:",
      failedToLoadNumberStats: "Failed to load number stats:",
      failedToSaveNumberStats: "Failed to save number stats:",
      failedToClearNumberStats: "Failed to clear number stats:",
      failedToClearUserData: "Failed to clear user data:",
      failedToResetAllData: "Failed to reset all data:",
      userDataCleared: "User data cleared, experience and level reset to initial state",
      allDataReset: "All game data has been reset"
    },

    restartModal: {
      title: "Restart",
      message: "What would you like to do?",
      retestCurrent: "Retest Current",
      newPractice: "New Practice",
      returnHome: "Return Home"
    },

    confirmModal: {
      returnHomeTitle: "Return Home",
      returnHomeMessage: "Are you sure you want to return home? Your current progress will be lost.",
      confirm: "Confirm",
      cancel: "Cancel"
    },

    rewardModal: {
      title: "Exercise Complete!",
      subtitle: "Your Progress",
      sessionComplete: "Session Complete",
      youEarned: "You earned",
      levelAchieved: "Level {level} achieved!",
      experiencePoints: "experience points",
      experience: "Experience",
      maxStreak: "Max Streak",
      accuracy: "Accuracy",
      streakBonus: "Streak Bonus",
      perfectPerformance: "Perfect Performance!",
      allCorrect: "All correct, excellent!",
      levelUp: "Level Up!",
      levelUpCelebration: "Congratulations on your progress!",
      continueButton: "Continue",
      awesome: "Awesome!"
    },

    recommendation: {
      prefix: "Based on your performance in the range",
      suffix: "accuracy, we recommend practicing",
      allGood: "Excellent mastery of all ranges, you can try a more difficult challenge or mixed practice"
    },

    difficultySelector: {
      searchPlaceholder: "Search difficulty...",
      categories: {
        basic: "Basic Ranges",
        intermediate: "Intermediate Ranges",
        difficult: "Difficult Ranges",
        comprehensive: "Comprehensive Ranges",
        hundreds: "Hundreds",
        thousands: "Thousands",
        special: "Special Modes"
      }
    },

    hud: {
      level: "Level",
      exp: "EXP",
      today: "Today",
      total: "Total",
      accuracy: "Accuracy",
      maxStreak: "Max Streak"
    },

    clearStatsConfirm: "Are you sure you want to clear all accuracy records? This will reset all number practice statistics.",
    clearStatsTooltip: "Clear accuracy records",
    clearStatsModal: {
      title: "Clear Statistics",
      message: "Are you sure you want to clear all accuracy records? This will reset all number practice statistics."
    },

    congratulations: "Congratulations! Perfect!",

    voiceTest: {
      title: "French Voice Test",
      browserNotSupported: "Your browser does not support Web Speech API",
      noFrenchVoiceDetected: "No French voice detected. On iOS, go to Settings > Accessibility > Spoken Content > Voices to add a French voice.",
      iosVoiceInstructions: "On iOS, go to Settings > Accessibility > Spoken Content > Voices to add a French voice.",
      voiceListUpdated: "Voice list updated",
      noFrenchVoiceAvailable: "No French voice available",
      noVoiceFound: "No voices found, please try again later",
      speechSynthesisNotSupported: "Your browser does not support speech synthesis",
      noFrenchVoiceFoundUsingDefault: "No French voice found, using default voice",
      speechError: "Speech error",
      readingStarted: "Reading started",
      readingFinished: "Reading finished",
      testingAllFrenchVoices: "Testing all French voices...",
      availableVoices: "Available voices:",
      voicesDetected: "French voice(s) detected",
      currentSavedVoice: "Current saved voice:",
      selectVoice: "Select a voice",
      testSelectedVoice: "Test selected voice",
      testAllVoices: "Test all French voices",
      listAllVoices: "List all voices",
      saveVoice: "Save voice",
      clearSavedVoice: "Clear saved voice",
      testNumbers: "Test with numbers",
      usingVoice: "Using voice"
    },

    debugTool: {
      title: "Experience Debug Tool",
      currentStatus: "Current Status",
      loading: "Loading...",
      refreshStatus: "Refresh Status",
      testOperations: "Test Operations",
      testSimpleSession: "Test Simple Session (5 correct)",
      testMathSession: "Test Math Session (3 correct)",
      testMixedSession: "Test Mixed Session (partial correct)",
      testEmptySession: "Test Empty Session",
      clearUserData: "Clear User Data",
      clearAllData: "Clear All Data",
      operationLog: "Operation Log",
      clearLog: "Clear Log",
      confirmClearUserData: "Are you sure you want to clear user data? This will reset level and experience.",
      confirmClearAllData: "Are you sure you want to clear all data? This will reset all game progress.",
      debugToolLoaded: "Debug tool loaded",
      noUserDataFound: "No saved user data found, using default data",
      newDayDetected: "New day detected, resetting today's session count",
      loadUserDataFailed: "Failed to load user data",
      statusRefreshed: "Status refreshed",
      startTestSimple: "=== Starting simple session test ===",
      startTestMath: "=== Starting math session test ===",
      startTestMixed: "=== Starting mixed session test ===",
      startTestEmpty: "=== Starting empty session test ===",
      testCompleted: "Test completed, experience gained",
      congratsLevelUp: "Congratulations on leveling up!",
      userDataCleared: "User data cleared",
      allDataCleared: "All data cleared",
      experienceGained: "experience gained",
      level: "Level",
      experience: "Experience",
      totalSessions: "Total sessions",
      todaySessions: "Today's sessions",
      totalQuestions: "Total questions",
      totalCorrect: "Total correct",
      maxStreak: "Max streak",
      lastActiveDate: "Last active date",
      localStorageStatus: "LocalStorage status",
      userDataKey: "User data key",
      dataExists: "Data exists",
      dataSize: "Data size",
      characters: "characters",
      yes: "Yes",
      no: "No"
    }
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
      "0-16": "0-16（基础数字）",
      "0-20": "0-20",
      "0-30": "0-30（扩展基础）",
      "0-50": "0-50（半百）",
      "0-69": "0-69",
      "20-69": "20-69（规律数字）",
      "50-99": "50-99（高位数字）",
      "70-79": "70-79（soixante-dix）",
      "80-89": "80-89（quatre-vingts）",
      "90-99": "90-99（quatre-vingt-dix）",
      "70-99": "70-99",
      "0-99": "0-99",
      "0-100": "0-100（含百）",
      "100-199": "100-199（百位数）",
      "100-299": "100-299（低百位数）",
      "100-500": "100-500（中百位数）",
      "200-299": "200-299（二百）",
      "200-999": "200-999（高百位数）",
      "300-999": "300-999（高百位数）",
      "100-999": "100-999（所有百位数）",
      "1000-1999": "1000-1999（千位数）",
      "1000-9999": "1000-9999（所有千位数）",
      "2000-9999": "2000-9999（高千位数）",
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

    console: {
      speechSynthesisError: "语音合成错误：",
      webAudioNotSupported: "不支持Web Audio API：",
      failedToGenerateAudioTone: "生成音频音调失败：",
      failedToPlayAudioBuffer: "播放音频缓冲区失败：",
      failedToLoadSoundFile: "加载音效文件失败",
      failedToSaveUserData: "保存用户数据失败：",
      failedToLoadNumberStats: "加载数字统计失败：",
      failedToSaveNumberStats: "保存数字统计失败：",
      failedToClearNumberStats: "清除数字统计失败：",
      failedToClearUserData: "清除用户数据失败：",
      failedToResetAllData: "重置所有数据失败：",
      userDataCleared: "用户数据已清空，经验和等级已重置为初始状态",
      allDataReset: "所有游戏数据已重置"
    },

    restartModal: {
      title: "重新开始",
      message: "您希望做什么？",
      retestCurrent: "重测当前",
      newPractice: "新练习",
      returnHome: "返回主页"
    },

    confirmModal: {
      returnHomeTitle: "返回主页",
      returnHomeMessage: "您确定要返回主页吗？当前的练习进度将会丢失。",
      confirm: "确认",
      cancel: "取消"
    },

    rewardModal: {
      title: "练习完成！",
      subtitle: "本次收获",
      sessionComplete: "练习结束",
      youEarned: "本次获得",
      levelAchieved: "达到{level}级！",
      experiencePoints: "经验点",
      experience: "经验",
      maxStreak: "最高连击",
      accuracy: "准确率",
      streakBonus: "连击奖励",
      perfectPerformance: "完美表现！",
      allCorrect: "全部答对，太棒了！",
      levelUp: "等级提升！",
      levelUpCelebration: "恭喜升级！",
      continueButton: "继续",
      awesome: "太棒了！"
    },

    recommendation: {
      prefix: "基于你在",
      suffix: "的准确率，建议选择",
      allGood: "各范围掌握良好，可以尝试更高难度或混合练习"
    },

    difficultySelector: {
      searchPlaceholder: "搜索难度...",
      categories: {
        basic: "基础范围",
        intermediate: "中级范围",
        difficult: "困难范围",
        comprehensive: "综合范围",
        hundreds: "百位数",
        thousands: "千位数",
        special: "特殊模式"
      }
    },

    hud: {
      level: "等级",
      exp: "经验",
      today: "今日",
      total: "总计",
      accuracy: "准确率",
      maxStreak: "最高连击"
    },

    clearStatsConfirm: "确定要清空所有准确率记录吗？这将重置所有数字的练习统计。",
    clearStatsTooltip: "清空准确率记录",
    clearStatsModal: {
      title: "清空统计数据",
      message: "确定要清空所有准确率记录吗？这将重置所有数字的练习统计。"
    },

    congratulations: "恭喜！完美！",

    voiceTest: {
      title: "法语语音测试",
      browserNotSupported: "您的浏览器不支持Web Speech API",
      noFrenchVoiceDetected: "未检测到法语语音。在iOS上，请前往设置 > 辅助功能 > 朗读内容 > 语音来添加法语语音。",
      iosVoiceInstructions: "在iOS上，请前往设置 > 辅助功能 > 朗读内容 > 语音来添加法语语音。",
      voiceListUpdated: "语音列表已更新",
      noFrenchVoiceAvailable: "没有可用的法语语音",
      noVoiceFound: "未找到语音，请稍后重试",
      speechSynthesisNotSupported: "您的浏览器不支持语音合成",
      noFrenchVoiceFoundUsingDefault: "未找到法语语音，使用默认语音",
      speechError: "语音错误",
      readingStarted: "开始朗读",
      readingFinished: "朗读完成",
      testingAllFrenchVoices: "测试所有法语语音...",
      availableVoices: "可用语音：",
      voicesDetected: "检测到法语语音",
      currentSavedVoice: "当前保存的语音：",
      selectVoice: "选择语音",
      testSelectedVoice: "测试选中的语音",
      testAllVoices: "测试所有法语语音",
      listAllVoices: "列出所有语音",
      saveVoice: "保存语音",
      clearSavedVoice: "清除保存的语音",
      testNumbers: "用数字测试",
      usingVoice: "使用语音"
    },

    debugTool: {
      title: "经验增长调试工具",
      currentStatus: "当前状态",
      loading: "加载中...",
      refreshStatus: "刷新状态",
      testOperations: "测试操作",
      testSimpleSession: "测试简单练习（5题全对）",
      testMathSession: "测试数学练习（3题全对）",
      testMixedSession: "测试混合练习（部分对错）",
      testEmptySession: "测试空答案练习",
      clearUserData: "清空用户数据",
      clearAllData: "清空所有数据",
      operationLog: "操作日志",
      clearLog: "清空日志",
      confirmClearUserData: "确定要清空用户数据吗？这将重置等级和经验。",
      confirmClearAllData: "确定要清空所有数据吗？这将重置所有游戏进度。",
      debugToolLoaded: "调试工具已加载",
      noUserDataFound: "没有找到保存的用户数据，使用默认数据",
      newDayDetected: "检测到新的一天，重置今日练习次数",
      loadUserDataFailed: "加载用户数据失败",
      statusRefreshed: "状态已刷新",
      startTestSimple: "=== 开始测试简单练习 ===",
      startTestMath: "=== 开始测试数学练习 ===",
      startTestMixed: "=== 开始测试混合练习 ===",
      startTestEmpty: "=== 开始测试空答案练习 ===",
      testCompleted: "测试完成，获得经验",
      congratsLevelUp: "恭喜升级！",
      userDataCleared: "用户数据已清空",
      allDataCleared: "所有数据已清空",
      experienceGained: "获得经验",
      level: "等级",
      experience: "经验值",
      totalSessions: "总练习次数",
      todaySessions: "今日练习次数",
      totalQuestions: "总题目数",
      totalCorrect: "总正确数",
      maxStreak: "最长连击",
      lastActiveDate: "最后活跃日期",
      localStorageStatus: "LocalStorage状态",
      userDataKey: "用户数据键",
      dataExists: "数据存在",
      dataSize: "数据大小",
      characters: "字符",
      yes: "是",
      no: "否"
    }
  }
};