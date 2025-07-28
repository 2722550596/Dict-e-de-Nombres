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
    directionDictation: string;
    timeDictation: string;
    lengthDictation: string;
  };

  // 运算听写相关
  operationTypes: string;
  maxResult: string;
  selectAtLeastOneOperation: string;
  answerFor: string;
  typeHere: string;

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

  // 听写语言相关
  dictationLanguage: {
    label: string;
    tooltip: string;
  };

  // 动态标题模板
  dynamicTitle: {
    template: string; // 包含 {language} 占位符的模板
  };

  // 听写语言在当前界面语言下的显示名称
  dictationLanguageNames: {
    [key: string]: string;
  };

  // 新模式相关翻译
  timeTypes: {
    year: string;
    month: string;
    day: string;
    weekday: string;
    fullDate: string;
  };

  directionTypes: {
    cardinal: string;
    relative: string;
    spatial: string;
  };

  lengthUnits: {
    meter: string;
    centimeter: string;
    millimeter: string;
    kilometer: string;
    inch: string;
    foot: string;
    yard: string;
  };

  // 新模式难度翻译
  newModeDifficulties: {
    // 时间模式难度
    'years-only': string;
    'months-only': string;
    'days-only': string;
    'weekdays-only': string;
    'full-dates': string;
    'mixed-time': string;

    // 方位模式难度
    'cardinal-only': string;
    'relative-only': string;
    'spatial-only': string;
    'mixed-directions': string;

    // 长度模式难度
    'metric-basic': string;
    'metric-advanced': string;
    'imperial-basic': string;
    'imperial-advanced': string;
    'mixed-units': string;
  };

  // 新模式界面文本
  newModeTexts: {
    selectTimeTypes: string;
    selectDirectionTypes: string;
    selectLengthUnits: string;
    timeTypeDescription: string;
    directionTypeDescription: string;
    lengthUnitDescription: string;
    selectedTypes: string;
    playCurrentQuestion: string;
    replayQuestion: string;
    answerPlaceholder: string;
    selectDirection: string;
    question: string;
    completed: string;
    score: string;
  };

  // 音量控制翻译
  volumeControl: {
    mute: string;
    unmute: string;
    volumeLevel: string;
  };

  // 调试工具翻译
  debug: {
    voiceTest: string;
    openDebugTools: string;
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
    sessionComplete: string;
    youEarned: string;
    levelAchieved: string;
    experiencePoints: string;
    experience: string;
    maxStreak: string;
    accuracy: string;
    streakBonus: string;
    perfectPerformance: string;
    allCorrect: string;
    levelUp: string;
    levelUpCelebration: string;
    continueButton: string;
    awesome: string;
  };

  // 智能推荐相关
  recommendation: {
    prefix: string;
    suffix: string;
    allGood: string;
  };

  // 增强推荐系统相关 (8.2新增)
  enhancedRecommendation: {
    // 跨模式分析
    crossModeAnalysis: {
      title: string;
      strongestMode: string;
      weakestMode: string;
      overallProgress: {
        excellent: string;
        good: string;
        average: string;
        needs_improvement: string;
      };
      balanceScore: string;
      diversityScore: string;
      focusRecommendation: string;
    };

    // 模式表现
    modePerformance: {
      accuracy: string;
      sessions: string;
      questions: string;
      trend: {
        improving: string;
        stable: string;
        declining: string;
      };
      lastPlayed: string;
      experience: string;
    };

    // 难度推荐
    difficultyRecommendation: {
      title: string;
      currentLevel: {
        beginner: string;
        intermediate: string;
        advanced: string;
        expert: string;
      };
      recommended: string;
      confidence: string;
      nextMilestone: string;
      timeToMastery: string;
    };

    // 练习分析
    practiceAnalysis: {
      title: string;
      dailyAverage: string;
      weeklyFrequency: string;
      bestTime: {
        morning: string;
        afternoon: string;
        evening: string;
        night: string;
      };
      consistency: string;
      effectiveness: string;
      recommendedFrequency: string;
      recommendedDuration: string;
      optimalTime: string;
    };

    // 建议类型
    suggestions: {
      immediate: string;
      shortTerm: string;
      longTerm: string;
    };

    // 数据质量
    dataQuality: {
      excellent: string;
      good: string;
      limited: string;
      insufficient: string;
    };

    // 通用文本
    common: {
      minutes: string;
      days: string;
      weeks: string;
      sessions: string;
      accuracy: string;
      score: string;
      recommended: string;
      current: string;
      target: string;
      progress: string;
    };
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
    noTargetVoiceDetected: string;
    iosVoiceInstructions: string;
    voiceListUpdated: string;
    noTargetVoiceAvailable: string;
    noVoiceFound: string;
    speechSynthesisNotSupported: string;
    noTargetVoiceFoundUsingDefault: string;
    speechError: string;
    readingStarted: string;
    readingFinished: string;
    testingAllTargetVoices: string;
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
    interfaceLanguage: string;
    testLanguage: string;
    selectTestLanguage: string;
    testCompleted: string;
    voiceRestored: string;
    voiceSavedNotAvailable: string;
    voiceSelectedAndSaved: string;
    usingDefaultVoice: string;
    voiceSavedCleared: string;
    testSample: string;
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
    flag: 'french'
  },
  {
    code: 'en',
    name: 'English',
    flag: 'american'
  },
  {
    code: 'zh',
    name: '中文',
    flag: 'chinese'
  }
];

// 听写语言配置接口
export interface DictationLanguage {
  code: string;
  name: string;
  flag: string;
  speechLang: string; // TTS语言代码
}

// 支持的14种听写语言
export const SUPPORTED_DICTATION_LANGUAGES: DictationLanguage[] = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    speechLang: 'fr-FR'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    speechLang: 'en-US'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    speechLang: 'de-DE'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    speechLang: 'es-ES'
  },
  {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    speechLang: 'it-IT'
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹',
    speechLang: 'pt-PT'
  },
  {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    speechLang: 'zh-CN'
  },
  {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    speechLang: 'ja-JP'
  },
  {
    code: 'ko',
    name: '한국어',
    flag: '🇰🇷',
    speechLang: 'ko-KR'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    speechLang: 'ar-SA'
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺',
    speechLang: 'ru-RU'
  },
  {
    code: 'nl',
    name: 'Nederlands',
    flag: '🇳🇱',
    speechLang: 'nl-NL'
  },
  {
    code: 'sv',
    name: 'Svenska',
    flag: '🇸🇪',
    speechLang: 'sv-SE'
  },
  {
    code: 'no',
    name: 'Norsk',
    flag: '🇳🇴',
    speechLang: 'no-NO'
  }
];

export const TRANSLATIONS: Record<string, Translations> = {
  fr: {
    appTitle: "Dictée de Nombres",
    appSubtitle: "Améliorez votre compréhension des nombres",

    difficulty: "Difficulté (Plage de nombres)",
    customRange: "Plage personnalisée",
    quantity: "Quantité",
    startExercise: "Commencer l'exercice",

    modes: {
      numberDictation: "Dictée de nombres",
      mathDictation: "Dictée d'opérations",
      directionDictation: "Dictée de directions",
      timeDictation: "Dictée de temps",
      lengthDictation: "Dictée de longueurs"
    },

    operationTypes: "Types d'opérations",
    maxResult: "Résultat maximum",
    selectAtLeastOneOperation: "Veuillez sélectionner au moins une opération",
    answerFor: "Réponse pour le numéro",
    typeHere: "Tapez ici...",

    operations: {
      addition: "Addition (+)",
      subtraction: "Soustraction (-)",
      multiplication: "Multiplication (×)",
      division: "Division (÷)"
    },

    difficulties: {
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile",
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

    dictationLanguage: {
      label: "Langue de dictée",
      tooltip: "Choisir la langue pour la synthèse vocale"
    },

    dynamicTitle: {
      template: "Dictée de Nombres en {language}"
    },

    dictationLanguageNames: {
      'fr': 'Français',
      'en': 'Anglais',
      'de': 'Allemand',
      'es': 'Espagnol',
      'it': 'Italien',
      'pt': 'Portugais',
      'zh': 'Chinois',
      'ja': 'Japonais',
      'ko': 'Coréen',
      'ar': 'Arabe',
      'ru': 'Russe',
      'nl': 'Néerlandais',
      'sv': 'Suédois',
      'no': 'Norvégien'
    },

    timeTypes: {
      year: "Année",
      month: "Mois",
      day: "Jour",
      weekday: "Jour de la semaine",
      fullDate: "Date complète"
    },

    directionTypes: {
      cardinal: "Directions cardinales",
      relative: "Directions relatives",
      spatial: "Directions spatiales"
    },

    lengthUnits: {
      meter: "Mètre",
      centimeter: "Centimètre",
      millimeter: "Millimètre",
      kilometer: "Kilomètre",
      inch: "Pouce",
      foot: "Pied",
      yard: "Yard"
    },

    newModeDifficulties: {
      'years-only': "Années seulement",
      'months-only': "Mois seulement",
      'days-only': "Jours seulement",
      'weekdays-only': "Jours de la semaine seulement",
      'full-dates': "Dates complètes",
      'mixed-time': "Temps mixte",
      'cardinal-only': "Directions cardinales seulement",
      'relative-only': "Directions relatives seulement",
      'spatial-only': "Directions spatiales seulement",
      'mixed-directions': "Directions mixtes",
      'metric-basic': "Unités métriques de base",
      'metric-advanced': "Unités métriques avancées",
      'imperial-basic': "Unités impériales de base",
      'imperial-advanced': "Unités impériales avancées",
      'mixed-units': "Unités mixtes"
    },

    newModeTexts: {
      selectTimeTypes: "Sélectionnez les types de temps",
      selectDirectionTypes: "Sélectionnez les types de directions",
      selectLengthUnits: "Sélectionnez les unités de longueur",
      timeTypeDescription: "Choisissez quels types de temps inclure dans l'exercice",
      directionTypeDescription: "Choisissez quels types de directions inclure dans l'exercice",
      lengthUnitDescription: "Choisissez quelles unités de longueur inclure dans l'exercice",
      selectedTypes: "Types sélectionnés",
      playCurrentQuestion: "Lire la question actuelle",
      replayQuestion: "Répéter la question",
      answerPlaceholder: "Tapez votre réponse ici...",
      selectDirection: "Sélectionner la direction",
      question: "Question",
      completed: "Terminé",
      score: "Score"
    },

    volumeControl: {
      mute: "Couper le son",
      unmute: "Rétablir le son",
      volumeLevel: "Volume"
    },

    debug: {
      voiceTest: "Test de voix",
      openDebugTools: "Ouvrir les outils de débogage"
    },

    warnings: {
      noSpeechSupport: "Votre navigateur ne supporte pas la synthèse vocale",
      noVoiceFound: "Aucune voix appropriée trouvée, utilisation de la voix par défaut",
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

    enhancedRecommendation: {
      crossModeAnalysis: {
        title: "Analyse inter-modes",
        strongestMode: "Mode le plus fort",
        weakestMode: "Mode le plus faible",
        overallProgress: {
          excellent: "Excellent",
          good: "Bon",
          average: "Moyen",
          needs_improvement: "À améliorer"
        },
        balanceScore: "Score d'équilibre",
        diversityScore: "Score de diversité",
        focusRecommendation: "Mode recommandé à pratiquer"
      },

      modePerformance: {
        accuracy: "Précision",
        sessions: "Sessions",
        questions: "Questions",
        trend: {
          improving: "En amélioration",
          stable: "Stable",
          declining: "En déclin"
        },
        lastPlayed: "Dernière pratique",
        experience: "Expérience"
      },

      difficultyRecommendation: {
        title: "Recommandation de difficulté",
        currentLevel: {
          beginner: "Débutant",
          intermediate: "Intermédiaire",
          advanced: "Avancé",
          expert: "Expert"
        },
        recommended: "Recommandé",
        confidence: "Confiance",
        nextMilestone: "Prochain objectif",
        timeToMastery: "Temps pour maîtriser"
      },

      practiceAnalysis: {
        title: "Analyse de pratique",
        dailyAverage: "Moyenne quotidienne",
        weeklyFrequency: "Fréquence hebdomadaire",
        bestTime: {
          morning: "Matin",
          afternoon: "Après-midi",
          evening: "Soir",
          night: "Nuit"
        },
        consistency: "Régularité",
        effectiveness: "Efficacité",
        recommendedFrequency: "Fréquence recommandée",
        recommendedDuration: "Durée recommandée",
        optimalTime: "Moment optimal"
      },

      suggestions: {
        immediate: "Actions immédiates",
        shortTerm: "Objectifs à court terme",
        longTerm: "Objectifs à long terme"
      },

      dataQuality: {
        excellent: "Excellente",
        good: "Bonne",
        limited: "Limitée",
        insufficient: "Insuffisante"
      },

      common: {
        minutes: "minutes",
        days: "jours",
        weeks: "semaines",
        sessions: "sessions",
        accuracy: "précision",
        score: "score",
        recommended: "recommandé",
        current: "actuel",
        target: "objectif",
        progress: "progrès"
      }
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
      title: "Test de Voix",
      browserNotSupported: "Votre navigateur ne supporte pas Web Speech API",
      noTargetVoiceDetected: "Aucune voix détectée pour la langue sélectionnée. Sur iOS, allez dans Réglages > Accessibilité > Contenu énoncé > Voix pour ajouter des voix.",
      iosVoiceInstructions: "Sur iOS, allez dans Réglages > Accessibilité > Contenu énoncé > Voix pour ajouter des voix.",
      voiceListUpdated: "Liste des voix mise à jour",
      noTargetVoiceAvailable: "Aucune voix disponible pour la langue sélectionnée",
      noVoiceFound: "Aucune voix trouvée, veuillez réessayer plus tard",
      speechSynthesisNotSupported: "Votre navigateur ne supporte pas la synthèse vocale",
      noTargetVoiceFoundUsingDefault: "Aucune voix trouvée pour la langue sélectionnée, utilisation de la voix par défaut",
      speechError: "Erreur vocale",
      readingStarted: "Lecture commencée",
      readingFinished: "Lecture terminée",
      testingAllTargetVoices: "Test de toutes les voix disponibles...",
      availableVoices: "Voix disponibles:",
      voicesDetected: "voix détectée(s)",
      currentSavedVoice: "Voix sauvegardée actuelle:",
      selectVoice: "Sélectionner une voix",
      testSelectedVoice: "Tester la voix sélectionnée",
      testAllVoices: "Tester toutes les voix disponibles",
      listAllVoices: "Lister toutes les voix",
      saveVoice: "Sauvegarder la voix",
      clearSavedVoice: "Effacer la voix sauvegardée",
      testNumbers: "Tester avec des nombres",
      usingVoice: "Utilisation de la voix",
      interfaceLanguage: "Langue de l'interface",
      testLanguage: "Langue de test",
      selectTestLanguage: "Sélectionner la langue de test",
      testCompleted: "Test terminé",
      voiceRestored: "Voix restaurée",
      voiceSavedNotAvailable: "La voix sauvegardée n'est plus disponible",
      voiceSelectedAndSaved: "Voix sélectionnée et sauvegardée",
      usingDefaultVoice: "Utilisation de la voix par défaut",
      voiceSavedCleared: "Voix sauvegardée effacée. Utilisation de la voix par défaut.",
      testSample: "Bonjour, test de la voix"
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
    appSubtitle: "Improve your number comprehension skills",

    difficulty: "Difficulty (Number Range)",
    customRange: "Custom Range",
    quantity: "Quantity",
    startExercise: "Start Exercise",

    modes: {
      numberDictation: "Number Dictation",
      mathDictation: "Math Dictation",
      directionDictation: "Direction Dictation",
      timeDictation: "Time Dictation",
      lengthDictation: "Length Dictation"
    },

    operationTypes: "Operation Types",
    maxResult: "Maximum Result",
    selectAtLeastOneOperation: "Please select at least one operation",
    answerFor: "Answer for number",
    typeHere: "Type here...",

    operations: {
      addition: "Addition (+)",
      subtraction: "Subtraction (-)",
      multiplication: "Multiplication (×)",
      division: "Division (÷)"
    },

    difficulties: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
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

    dictationLanguage: {
      label: "Dictation Language",
      tooltip: "Choose language for speech synthesis"
    },

    dynamicTitle: {
      template: "Number Dictation in {language}"
    },

    dictationLanguageNames: {
      'fr': 'French',
      'en': 'English',
      'de': 'German',
      'es': 'Spanish',
      'it': 'Italian',
      'pt': 'Portuguese',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'ru': 'Russian',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'no': 'Norwegian'
    },

    timeTypes: {
      year: "Year",
      month: "Month",
      day: "Day",
      weekday: "Weekday",
      fullDate: "Full Date"
    },

    directionTypes: {
      cardinal: "Cardinal Directions",
      relative: "Relative Directions",
      spatial: "Spatial Directions"
    },

    lengthUnits: {
      meter: "Meter",
      centimeter: "Centimeter",
      millimeter: "Millimeter",
      kilometer: "Kilometer",
      inch: "Inch",
      foot: "Foot",
      yard: "Yard"
    },

    newModeDifficulties: {
      'years-only': "Years Only",
      'months-only': "Months Only",
      'days-only': "Days Only",
      'weekdays-only': "Weekdays Only",
      'full-dates': "Full Dates",
      'mixed-time': "Mixed Time",
      'cardinal-only': "Cardinal Directions Only",
      'relative-only': "Relative Directions Only",
      'spatial-only': "Spatial Directions Only",
      'mixed-directions': "Mixed Directions",
      'metric-basic': "Basic Metric Units",
      'metric-advanced': "Advanced Metric Units",
      'imperial-basic': "Basic Imperial Units",
      'imperial-advanced': "Advanced Imperial Units",
      'mixed-units': "Mixed Units"
    },

    newModeTexts: {
      selectTimeTypes: "Select Time Types",
      selectDirectionTypes: "Select Direction Types",
      selectLengthUnits: "Select Length Units",
      timeTypeDescription: "Choose which time types to include in the exercise",
      directionTypeDescription: "Choose which direction types to include in the exercise",
      lengthUnitDescription: "Choose which length units to include in the exercise",
      selectedTypes: "Selected Types",
      playCurrentQuestion: "Play Current Question",
      replayQuestion: "Replay Question",
      answerPlaceholder: "Type your answer here...",
      selectDirection: "Select direction",
      question: "Question",
      completed: "Completed",
      score: "Score"
    },

    volumeControl: {
      mute: "Mute",
      unmute: "Unmute",
      volumeLevel: "Volume"
    },

    debug: {
      voiceTest: "Voice Test",
      openDebugTools: "Open Debug Tools"
    },

    warnings: {
      noSpeechSupport: "Your browser does not support speech synthesis",
      noVoiceFound: "No appropriate voice found, using default voice",
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

    enhancedRecommendation: {
      crossModeAnalysis: {
        title: "Cross-Mode Analysis",
        strongestMode: "Strongest Mode",
        weakestMode: "Weakest Mode",
        overallProgress: {
          excellent: "Excellent",
          good: "Good",
          average: "Average",
          needs_improvement: "Needs Improvement"
        },
        balanceScore: "Balance Score",
        diversityScore: "Diversity Score",
        focusRecommendation: "Recommended Focus Mode"
      },

      modePerformance: {
        accuracy: "Accuracy",
        sessions: "Sessions",
        questions: "Questions",
        trend: {
          improving: "Improving",
          stable: "Stable",
          declining: "Declining"
        },
        lastPlayed: "Last Played",
        experience: "Experience"
      },

      difficultyRecommendation: {
        title: "Difficulty Recommendation",
        currentLevel: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced",
          expert: "Expert"
        },
        recommended: "Recommended",
        confidence: "Confidence",
        nextMilestone: "Next Milestone",
        timeToMastery: "Time to Mastery"
      },

      practiceAnalysis: {
        title: "Practice Analysis",
        dailyAverage: "Daily Average",
        weeklyFrequency: "Weekly Frequency",
        bestTime: {
          morning: "Morning",
          afternoon: "Afternoon",
          evening: "Evening",
          night: "Night"
        },
        consistency: "Consistency",
        effectiveness: "Effectiveness",
        recommendedFrequency: "Recommended Frequency",
        recommendedDuration: "Recommended Duration",
        optimalTime: "Optimal Time"
      },

      suggestions: {
        immediate: "Immediate Actions",
        shortTerm: "Short-term Goals",
        longTerm: "Long-term Goals"
      },

      dataQuality: {
        excellent: "Excellent",
        good: "Good",
        limited: "Limited",
        insufficient: "Insufficient"
      },

      common: {
        minutes: "minutes",
        days: "days",
        weeks: "weeks",
        sessions: "sessions",
        accuracy: "accuracy",
        score: "score",
        recommended: "recommended",
        current: "current",
        target: "target",
        progress: "progress"
      }
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
      title: "Voice Test",
      browserNotSupported: "Your browser does not support Web Speech API",
      noTargetVoiceDetected: "No voice detected for the selected language. On iOS, go to Settings > Accessibility > Spoken Content > Voices to add voices.",
      iosVoiceInstructions: "On iOS, go to Settings > Accessibility > Spoken Content > Voices to add voices.",
      voiceListUpdated: "Voice list updated",
      noTargetVoiceAvailable: "No voice available for the selected language",
      noVoiceFound: "No voices found, please try again later",
      speechSynthesisNotSupported: "Your browser does not support speech synthesis",
      noTargetVoiceFoundUsingDefault: "No voice found for the selected language, using default voice",
      speechError: "Speech error",
      readingStarted: "Reading started",
      readingFinished: "Reading finished",
      testingAllTargetVoices: "Testing all available voices...",
      availableVoices: "Available voices:",
      voicesDetected: "voice(s) detected",
      currentSavedVoice: "Current saved voice:",
      selectVoice: "Select a voice",
      testSelectedVoice: "Test selected voice",
      testAllVoices: "Test all available voices",
      listAllVoices: "List all voices",
      saveVoice: "Save voice",
      clearSavedVoice: "Clear saved voice",
      testNumbers: "Test with numbers",
      usingVoice: "Using voice",
      interfaceLanguage: "Interface Language",
      testLanguage: "Test Language",
      selectTestLanguage: "Select test language",
      testCompleted: "Test completed",
      voiceRestored: "Voice restored",
      voiceSavedNotAvailable: "The saved voice is no longer available",
      voiceSelectedAndSaved: "Voice selected and saved",
      usingDefaultVoice: "Using default voice",
      voiceSavedCleared: "Saved voice cleared. Using default voice.",
      testSample: "Hello, voice test"
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
    appTitle: "数字听写",
    appSubtitle: "提高您的数字理解能力",

    difficulty: "难度（数字范围）",
    customRange: "自定义范围",
    quantity: "数量",
    startExercise: "开始练习",

    modes: {
      numberDictation: "数字听写",
      mathDictation: "运算听写",
      directionDictation: "方位听写",
      timeDictation: "时间听写",
      lengthDictation: "长度听写"
    },

    operationTypes: "运算类型",
    maxResult: "答案最大值",
    selectAtLeastOneOperation: "请至少选择一种运算类型",
    answerFor: "答案",
    typeHere: "请输入...",

    operations: {
      addition: "加法 (+)",
      subtraction: "减法 (-)",
      multiplication: "乘法 (×)",
      division: "除法 (÷)"
    },

    difficulties: {
      easy: "简单",
      medium: "中等",
      hard: "困难",
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

    dictationLanguage: {
      label: "听写语言",
      tooltip: "选择语音合成的语言"
    },

    dynamicTitle: {
      template: "{language}数字听写"
    },

    dictationLanguageNames: {
      'fr': '法语',
      'en': '英语',
      'de': '德语',
      'es': '西班牙语',
      'it': '意大利语',
      'pt': '葡萄牙语',
      'zh': '中文',
      'ja': '日语',
      'ko': '韩语',
      'ar': '阿拉伯语',
      'ru': '俄语',
      'nl': '荷兰语',
      'sv': '瑞典语',
      'no': '挪威语'
    },

    timeTypes: {
      year: "年份",
      month: "月份",
      day: "日期",
      weekday: "星期",
      fullDate: "完整日期"
    },

    directionTypes: {
      cardinal: "基本方位",
      relative: "相对方位",
      spatial: "空间方位"
    },

    lengthUnits: {
      meter: "米",
      centimeter: "厘米",
      millimeter: "毫米",
      kilometer: "公里",
      inch: "英寸",
      foot: "英尺",
      yard: "码"
    },

    newModeDifficulties: {
      'years-only': "仅年份",
      'months-only': "仅月份",
      'days-only': "仅日期",
      'weekdays-only': "仅星期",
      'full-dates': "完整日期",
      'mixed-time': "混合时间",
      'cardinal-only': "仅基本方位",
      'relative-only': "仅相对方位",
      'spatial-only': "仅空间方位",
      'mixed-directions': "混合方位",
      'metric-basic': "基础公制单位",
      'metric-advanced': "高级公制单位",
      'imperial-basic': "基础英制单位",
      'imperial-advanced': "高级英制单位",
      'mixed-units': "混合单位"
    },

    newModeTexts: {
      selectTimeTypes: "选择时间类型",
      selectDirectionTypes: "选择方位类型",
      selectLengthUnits: "选择长度单位",
      timeTypeDescription: "选择练习中包含的时间类型",
      directionTypeDescription: "选择练习中包含的方位类型",
      lengthUnitDescription: "选择练习中包含的长度单位",
      selectedTypes: "已选类型",
      playCurrentQuestion: "播放当前题目",
      replayQuestion: "重播题目",
      answerPlaceholder: "请在此输入答案...",
      selectDirection: "选择方位",
      question: "题目",
      completed: "完成",
      score: "得分"
    },

    volumeControl: {
      mute: "静音",
      unmute: "取消静音",
      volumeLevel: "音量"
    },

    debug: {
      voiceTest: "语音测试",
      openDebugTools: "打开调试工具"
    },

    warnings: {
      noSpeechSupport: "您的浏览器不支持语音合成",
      noVoiceFound: "未找到合适的语音，使用默认语音",
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

    enhancedRecommendation: {
      crossModeAnalysis: {
        title: "跨模式分析",
        strongestMode: "最强模式",
        weakestMode: "最弱模式",
        overallProgress: {
          excellent: "优秀",
          good: "良好",
          average: "一般",
          needs_improvement: "需要改进"
        },
        balanceScore: "平衡分数",
        diversityScore: "多样性分数",
        focusRecommendation: "建议重点练习模式"
      },

      modePerformance: {
        accuracy: "准确率",
        sessions: "会话数",
        questions: "题目数",
        trend: {
          improving: "进步中",
          stable: "稳定",
          declining: "下降中"
        },
        lastPlayed: "最后练习",
        experience: "经验值"
      },

      difficultyRecommendation: {
        title: "难度推荐",
        currentLevel: {
          beginner: "初学者",
          intermediate: "中级",
          advanced: "高级",
          expert: "专家"
        },
        recommended: "推荐",
        confidence: "置信度",
        nextMilestone: "下一个里程碑",
        timeToMastery: "掌握时间"
      },

      practiceAnalysis: {
        title: "练习分析",
        dailyAverage: "日均时长",
        weeklyFrequency: "周练习频率",
        bestTime: {
          morning: "上午",
          afternoon: "下午",
          evening: "晚上",
          night: "深夜"
        },
        consistency: "一致性",
        effectiveness: "有效性",
        recommendedFrequency: "建议频率",
        recommendedDuration: "建议时长",
        optimalTime: "最佳时间"
      },

      suggestions: {
        immediate: "立即行动",
        shortTerm: "短期目标",
        longTerm: "长期目标"
      },

      dataQuality: {
        excellent: "优秀",
        good: "良好",
        limited: "有限",
        insufficient: "不足"
      },

      common: {
        minutes: "分钟",
        days: "天",
        weeks: "周",
        sessions: "次会话",
        accuracy: "准确率",
        score: "分数",
        recommended: "推荐",
        current: "当前",
        target: "目标",
        progress: "进度"
      }
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
      title: "语音测试",
      browserNotSupported: "您的浏览器不支持Web Speech API",
      noTargetVoiceDetected: "未检测到所选语言的语音。在iOS上，请前往设置 > 辅助功能 > 朗读内容 > 语音来添加语音。",
      iosVoiceInstructions: "在iOS上，请前往设置 > 辅助功能 > 朗读内容 > 语音来添加语音。",
      voiceListUpdated: "语音列表已更新",
      noTargetVoiceAvailable: "所选语言没有可用的语音",
      noVoiceFound: "未找到语音，请稍后重试",
      speechSynthesisNotSupported: "您的浏览器不支持语音合成",
      noTargetVoiceFoundUsingDefault: "未找到所选语言的语音，使用默认语音",
      speechError: "语音错误",
      readingStarted: "开始朗读",
      readingFinished: "朗读完成",
      testingAllTargetVoices: "测试所有可用语音...",
      availableVoices: "可用语音：",
      voicesDetected: "检测到语音",
      currentSavedVoice: "当前保存的语音：",
      selectVoice: "选择语音",
      testSelectedVoice: "测试选中的语音",
      testAllVoices: "测试所有可用语音",
      listAllVoices: "列出所有语音",
      saveVoice: "保存语音",
      clearSavedVoice: "清除保存的语音",
      testNumbers: "用数字测试",
      usingVoice: "使用语音",
      interfaceLanguage: "界面语言",
      testLanguage: "测试语言",
      selectTestLanguage: "选择测试语言",
      testCompleted: "测试完成",
      voiceRestored: "语音已恢复",
      voiceSavedNotAvailable: "保存的语音不再可用",
      voiceSelectedAndSaved: "语音已选择并保存",
      usingDefaultVoice: "使用默认语音",
      voiceSavedCleared: "已清除保存的语音。使用默认语音。",
      testSample: "你好，语音测试"
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