// js/i18n.js - PokéMMO Rotom-Phone Internationalization Engine

const STORAGE_LANG_KEY = 'pokemmo_lang';

export const LANGUAGES = {
    en: 'English',
    es: 'Español'
};

// Default language: check localStorage, then browser language, fallback to 'en'
export function getSavedLanguage() {
    try {
        const saved = localStorage.getItem(STORAGE_LANG_KEY);
        if (saved && (saved === 'en' || saved === 'es')) return saved;
        const navLang = navigator.language || navigator.userLanguage || '';
        if (navLang.startsWith('es')) return 'es';
    } catch(e) {}
    return 'en';
}

export let currentLang = getSavedLanguage();

export function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'es') return;
    currentLang = lang;
    try {
        localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch(e) {}
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
        updateI18nDOM();
    }
    if (typeof window !== 'undefined' && window.onLanguageChange) {
        window.onLanguageChange(lang);
    }
}

export function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
}

export const DICT = {
    en: {
        // App header & chasis
        app_title: 'ROTOM-PHONE',
        app_subtitle: 'Operations Terminal',
        // Auth Modal & Security
        auth_terminal_subtitle: 'PokéMMO Trainer Companion & Operations Panel',
        auth_security_title: 'SECURITY WARNING',
        auth_security_body: 'This is an unofficial fan-made companion tool. NEVER use your actual PokéMMO game password here. Use a unique password or continue in Guest Mode without registering.',
        auth_email_label: 'Username or Email',
        auth_email_placeholder: 'e.g. RedKanto or your@email.com',
        auth_email_hint: 'Use the same username on PC & mobile to sync your progress.',
        auth_password_label: 'Password for this tool',
        auth_password_placeholder: 'Unique password (NOT your game password)',
        auth_remember_me: 'Remember session',
        auth_btn_login: 'Log In',
        auth_btn_register: 'Register',
        auth_or_guest: 'Or without registering',
        auth_btn_guest: 'Continue as Guest (Local Save)',
        auth_err_login: 'Error logging in',
        auth_err_req_fields: 'Please enter username/email and password to register',
        auth_msg_register_success: 'Registration successful. You can now log in.',
        auth_err_register: 'Error registering',

        theme_mode: 'Theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
        server_clock: 'POKÉMMO SERVER TIME',
        server_clock_desc: '• 1h real = 4h in-game • 24h Day = 6h real',
        next_reset: 'Next 6h reset:',
        footer_disclaimer: 'Unofficial, open-source companion tool. Pokémon and PokéMMO belong to their respective creators.',
        footer_github: 'Open Source (GitHub)',
        footer_coffee: 'Buy Me a Coffee',
        footer_feedback: 'Feedback Welcome',
        lang_name: 'English',
        lang_toggle_btn: 'ES',

        // Navigation tabs
        tab_gyms: 'GYM RERUNS',
        tab_berries: 'BERRY FARMING',
        tab_market: 'GTL CALCULATOR',
        tab_extraction: 'SEED CRUSHER',
        tab_pokedex: 'POKÉDEX RADAR',
        tab_breeding: 'BREEDING LAB',

        // Time phases & seasons
        phase_morning: 'Morning',
        phase_day: 'Day',
        phase_night: 'Night',
        season_spring: 'Spring',
        season_summer: 'Summer',
        season_autumn: 'Autumn',
        season_winter: 'Winter',

        // Gyms
        gyms_title: 'Gym Rerun Terminal',
        gyms_subtitle: '18h cooldown tracking, optimal speed routes, and Amulet Coin profit booster.',
        kanto_deck_title: 'KANTO CIRCUIT // 8 GYM TARGETS',
        kanto_deck_desc: 'Recommended Route: Pewter -> Cerulean -> Vermilion -> Celadon -> Fuchsia -> Saffron -> Cinnabar -> Viridian',
        clear_status_all: 'CIRCUIT CLEARED',
        clear_status_progress: 'IN PROGRESS',
        amulet_coin_active: 'AMULET COIN (+50% BONUS)',
        amulet_coin_idle: 'AMULET COIN IDLE',
        amulet_timer_title: 'Amulet Coin Stopwatch',
        btn_start_amulet: 'Start Boost',
        btn_reset_amulet: 'Reset',
        gym_clearance: 'Total Gym Clearance',
        total_pokedollars: 'Total Earned',
        cooldown_ready: 'READY',
        cooldown_cooldown: 'Cooldown',
        btn_continue: 'CONTINUE',
        btn_view_large: 'FOCUS VIEW',
        btn_completed: 'VICTORY',

        // Berries
        berries_title: 'Berry Farming',
        berries_subtitle: 'Real-time soil moisture monitoring, harvest timers, and GTL market profitability.',
        harvest_count: 'Harvests Done',
        btn_reset_harvest: 'Reset Counter',
        seed_inventory: 'Seed Inventory',
        btn_calc_inventory: 'Calculate Seeds',
        recipe_lookup: 'Seed Recipes',
        select_berry_recipe: 'Select a berry to view required seeds...',
        plant_berry: 'Plant Berries',
        field_species: 'Species',
        field_coords: 'Coordinates / Plot Location',
        field_elapsed: 'Elapsed Hours',
        watered_at_plant: 'Watered at planting (5 full drops)',
        btn_plant_action: 'Plant Berry',

        // Berry Moisture
        moisture_protected: 'Protected',
        moisture_hydrated: 'Hydrated',
        moisture_base: '2 Base Drops',
        moisture_urgent: 'Water Urgent in',
        moisture_remaining: 'Remaining Moisture',
        moisture_dry_warn: 'WATER NOW!',
        btn_water: 'Water',
        btn_water_5: 'Water (5 Drops)',
        btn_cancel_crop: 'Cancel',

        // Profit Calculator
        calc_title: 'GTL Berry & Seed Profitability Calculator',
        calc_subtitle: 'Economic simulator for harvesting tools ($350 each), reserving 100% replanting seeds, and selling surplus on the GTL.',
        calc_economic_module: 'Economic Simulator',
        param_berry: 'Berry Species',
        param_plots: 'Plots',
        param_yield: 'Yield (Berries/Plant)',
        param_tool_cost: 'Tool Cost ($)',
        param_gtl_fee: 'GTL Fee (%)',
        gtl_prices_title: 'GTL Market Prices (Editable Values)',
        gtl_saved_tag: 'Saved to memory',
        btn_save_gtl_prices: 'Save Prices',
        btn_reset_gtl_prices: 'Reset Suggested',
        preset_loza: '156 Mistralton',
        preset_hoenn: '84 Hoenn',

        // Strategies
        strat_a_title: 'Strategy A: Crush + Replant + Sell Surplus',
        strat_b_title: 'Strategy B: Direct Raw Berry Sales',
        strat_recommended: 'Recommended',
        verdict_crush_better: 'RECOMMENDATION: CRUSH & SELL SURPLUS SEEDS',
        verdict_raw_better: 'RECOMMENDATION: SELL RAW BERRIES ON GTL',
        est_harvest: 'Estimated Harvest',
        tool_expenses: 'Tool Expenses',
        net_profit_crush: 'Net Profit (Crushing)',
        hourly_rate: 'Hourly Rate',
        per_plot: 'per plot',
        balance_table_title: 'Seed Balance (Crushing vs. 100% Self-Sufficient Replanting)',
        balance_replant_covered: '100% Replanting Covered',
        th_seed: 'Seed',
        th_crushed: 'Crushed',
        th_reserved: 'Reserved Replant',
        th_surplus: 'Sellable Surplus',
        th_price: 'GTL Price',
        th_subtotal: 'GTL Subtotal',
        surplus_tag: 'surplus',
        missing_tag: 'deficit (buy on GTL)',
        exact_zero: 'Exact (0)',
        net_profit_label: 'Net Profit:',

        // Extraction Module
        extraction_title: 'Seed Extraction & Crusher',
        extraction_subtitle: 'Harvesting tool expense tracking, real drop counts, and live GTL profitability audit.',
        ext_total_tools: 'Tools Used',
        ext_total_spent: 'Flower Shop Expense',
        ext_total_profit: 'Lifetime Net Profit',
        ext_batch_params: '1. Batch Parameters',
        ext_session_active: 'Active Session',
        ext_crushed_berry: 'Crushed Berry Species',
        ext_tools_count: 'Tools Bought / Used',
        ext_tool_unit: 'Tool Price ($)',
        ext_gtl_commission: 'GTL Fee (%)',
        ext_total_expense: 'Total Tool Expense:',
        btn_fill_theoretical: 'Load Theoretical Averages',
        btn_clear_drops: 'Reset Counts to 0',
        ext_real_drops: '2. Actual Seed Drops',
        ext_real_drops_desc: 'Enter the exact seed count dropped by the game when crushing.',
        ext_total_gathered: 'Total seeds gathered:',
        ext_gross_val: 'Gross GTL value:',
        ext_history_title: 'Crushing Batch Ledger',
        ext_history_desc: 'Permanent log of crushed batches to audit your cumulative financial performance.',
        btn_clear_history: 'Clear Ledger',
        th_date: 'Date',
        th_berry: 'Berry',
        th_tools: 'Tools',
        th_flower_spent: 'Tool Expense',
        th_seeds_received: 'Seeds Received',
        th_net_gtl: 'Net GTL Revenue',
        th_net_profit: 'Net Profit',
        th_roi: 'ROI',
        th_action: 'Action',
        btn_save_batch: 'Save to Ledger',
        batch_saved_notice: 'Batch Saved to Ledger!',
        verdict_worth_it: 'WORTH IT // PROFITABLE OPERATION',
        verdict_not_worth: 'NOT WORTH IT // LOSS DETECTED',
        verdict_break_even: 'BREAK-EVEN // ZERO PROFIT/LOSS',

        // Pokédex Radar
        pokedex_title: 'Pokédex Encounter Radar',
        pokedex_subtitle: 'Catch rates, encounter methods, hold items, and regional location filters.',
        dex_search_placeholder: 'Search Pokémon by name, dex number, or type...',
        dex_filter_region: 'All Regions',
        dex_filter_caught: 'Catch Status',
        dex_filter_type: 'All Types',
        dex_col_species: 'SPECIES',
        dex_col_types: 'TYPE / METHOD',
        dex_col_location: 'LOCATIONS & ENCOUNTER RATE',
        dex_col_status: 'STATUS',
        dex_btn_caught: 'CAUGHT',
        dex_btn_uncaught: 'NOT CAUGHT',
        method_grass: 'Grass',
        method_cave: 'Cave',
        method_surf: 'Surf',
        method_super_rod: 'Super Rod',
        method_good_rod: 'Good Rod',
        method_old_rod: 'Old Rod',
        method_rock_smash: 'Rock Smash',
        method_lure: 'Lure',
        method_headbutt: 'Headbutt',
        method_rocks: 'Rocks',

        // Breeding
        breeding_title: 'Breeding Lab & IV Chain Generator',
        breeding_subtitle: 'Optimal tree calculator for 5x31 / 6x31 builds, brace costs, and nature lock.',
        target_ivs: 'Target IVs',
        btn_generate_tree: 'Generate Breeding Tree',
        auth_id: "ID:",
        auth_logout: "Log Out",
        auth_mode: "Mode:",
        auth_guest: "Guest",
        auth_sync: "Sync",
        auth_sync_tooltip: "Sign in to sync your progress between PC and mobile",
        gym_earnings_title: "Gym Rerun Earnings",
        gym_estimated_total: "Estimated Total",
        gym_amulet_toggle: "Amulet Coin +50% active",
        gym_base_payout: "Base:",
        gym_bonus_payout: "Bonus:",
        gym_amulet_timer: "Amulet Coin Stopwatch",
        gym_1_hour: "1 HOUR",
        gym_amulet_duration: "AMULET DURATION 1H",
        gym_inactive: "INACTIVE",
        gym_active: "ACTIVE",
        gym_recharge_cycle: "RESET: 18H CYCLE",
        gym_status_ready: "STATUS: READY",
        gym_status_running: "STATUS: RUNNING",
        gym_btn_start: "Start Timer",
        gym_btn_pause: "Pause Timer",
        gym_overall_progress: "Overall Gym Rerun Progress (18h cooldown)",
        gym_ready_count_label: "Gyms ready:",
        gym_cooldown_badge_label: "on cooldown",
        gym_ready_label: "ready",
        gym_cooldown_label: "Cooldown",
        gym_recommended_route: "Recommended Route:",
        gym_reset_all_btn: "[ Reset All Gyms ]",
        gym_routes_by_region: "Gym Routes by Region",
        gym_leader_reset_info: "Leader reset: 18 hours",
        gym_circuit_cleared_stamp: "CIRCUIT CLEARED",
        gym_circuit_pending_stamp: "PENDING",
        gym_league_of: "League",
        gym_active_region: "Active Region",
        gym_clear_region: "Clear Region",
        gym_cleared: "Cleared ✓",
        gym_reset_region: "Reset",
        gym_focus_view: "Focus View",
        gym_continue: "Continue",
        gym_ready: "Ready",
        berry_header_title: "Berry Farming",
        berry_header_badge: "Watering & Harvest",
        berry_header_desc: "Real-time soil moisture monitoring, harvest timers, and GTL market profitability.",
        berry_rounds_harvested: "Harvests Done",
        berry_calc_production: "Calculate Seeds",
        berry_recipes: "Seed Recipes",
        berry_consult: "Select a berry...",
        berry_active_plots: "Active Berry Plots",
        berry_ready_harvest: "HARVEST READY",
        berry_dry_soil: "SOIL DRIED OUT",
        berry_stage_growth: "Growth Stage",
        berry_cancel_crop: "Cancel Plot",
        berry_water_now: "Water",
        berry_dry_in: "Dries in",
        berry_harvest_in: "Harvest in",
        ext_header_title: "Seed Extraction & Crusher",
        ext_audit_badge: "GTL AUDIT",
        ext_header_desc: "Harvesting tool expense tracking, real drop counts, and live GTL profitability audit.",
        ext_tools_used: "Tools Used",
        ext_spent_shop: "Flower Shop Expense",
        ext_net_profit_lifetime: "Lifetime Net Profit",
        ext_unit_tool: "u.",
        ext_worth_verdict: "WORTH IT // PROFITABLE OPERATION",
        ext_not_worth_verdict: "NOT WORTH IT // LOSS DETECTED",
        ext_breakeven_verdict: "BREAK-EVEN // ZERO PROFIT/LOSS",
        ext_save_batch: "Save Batch to Ledger",
        ext_saved_toast: "Batch saved to ledger!",
        ext_history_cleared: "History cleared",
        dex_header_title: "Pokédex Radar",
        dex_routes_badge: "Encounter Routes",
        dex_header_desc: "Sequential geographical routing and wild catch optimization by region.",
        dex_caught_btn: "Caught",
        dex_tab_all: "All",
        dex_hide_caught: "Hide Caught",
        dex_hide_preevos: "Hide Pre-evolutions",
        dex_hide_postevos: "Hide Post-evolutions",
        dex_only_with_route: "Only with Route",
        dex_progress_title: "Pokédex Progress",
        dex_registered: "(Registered Pokémon)",
        dex_search_input: "Search Pokémon by name, dex number, or type...",
        dex_order_num: "Pokédex Order (#)",
        dex_order_name: "Name (A-Z)",
        dex_order_rarity: "Common / Easy first",
        dex_time_all: "All Schedules",
        dex_time_morning: "Morning Only",
        dex_time_day: "Day Only",
        dex_time_night: "Night Only",
        breeding_title: "Breeding & Genetics",
        breeding_subtitle: "Genealogical tree generator and exact bracer budget for the GTL.",
        breeding_iv_sim: "IV Simulator",
        breeding_target: "Target Pokémon (Optional):",
        breeding_egg_groups: "Egg Groups:",
        breeding_gender_cost: "Gender Cost:",
        breeding_per_breed: "per breed",
        breeding_select_ivs: "Select Target 31 IVs",
        breeding_inherit_nature: "Inherit Nature (Everstone)",
        breeding_construction: "Breeding Module loading...",
    },
    es: {
        // App header & chasis
        app_title: 'ROTOM-PHONE',
        app_subtitle: 'Terminal de Operaciones',
        // Modal de Autenticación y Seguridad
        auth_terminal_subtitle: 'Panel de herramientas para entrenadores de PokéMMO',
        auth_security_title: 'AVISO DE SEGURIDAD',
        auth_security_body: 'Esta es una herramienta fan-made complementaria. NUNCA uses la contraseña de tu cuenta del juego PokéMMO aquí. Usa una contraseña diferente o continúa en Modo Invitado sin registrarte.',
        auth_email_label: 'Usuario o Correo',
        auth_email_placeholder: 'Ej. RedKanto o tu@correo.com',
        auth_email_hint: 'Usa el mismo usuario en tu PC y móvil para sincronizar tu progreso.',
        auth_password_label: 'Contraseña para esta web',
        auth_password_placeholder: 'Contraseña única (NO la del juego)',
        auth_remember_me: 'Recordar sesión',
        auth_btn_login: 'Iniciar Sesión',
        auth_btn_register: 'Registrarse',
        auth_or_guest: 'O sin registrarte',
        auth_btn_guest: 'Continuar como Invitado (Guardado Local)',
        auth_err_login: 'Error al iniciar sesión',
        auth_err_req_fields: 'Por favor ingrese correo y contraseña para registrarse',
        auth_msg_register_success: 'Registro exitoso. Puede iniciar sesión.',
        auth_err_register: 'Error al registrarse',

        theme_mode: 'Modo',
        theme_light: 'Claro',
        theme_dark: 'Oscuro',
        server_clock: 'HORARIO SERVIDOR POKÉMMO',
        server_clock_desc: '• 1h real = 4h en juego • Día 24h = 6h reales',
        next_reset: 'Próximo reinicio (6h):',
        footer_disclaimer: 'Herramienta complementaria no oficial y de código abierto. Pokémon y PokéMMO pertenecen a sus respectivos creadores.',
        footer_github: 'Código Abierto (GitHub)',
        footer_coffee: 'Buy Me a Coffee',
        footer_feedback: 'Feedback bienvenido',
        lang_name: 'Español',
        lang_toggle_btn: 'EN',

        // Navigation tabs
        tab_gyms: 'GIMNASIOS',
        tab_berries: 'CULTIVO DE BAYAS',
        tab_market: 'CALCULADORA GTL',
        tab_extraction: 'EXTRACCIÓN',
        tab_pokedex: 'POKÉDEX',
        tab_breeding: 'CRIANZA E IVS',

        // Time phases & seasons
        phase_morning: 'Mañana',
        phase_day: 'Día',
        phase_night: 'Noche',
        season_spring: 'Primavera',
        season_summer: 'Verano',
        season_autumn: 'Otoño',
        season_winter: 'Invierno',

        // Gyms
        gyms_title: 'Terminal de Gimnasios',
        gyms_subtitle: 'Monitoreo de enfriamiento de 18h, rutas óptimas de combate y multiplicador de Moneda Amuleto.',
        kanto_deck_title: 'CIRCUITO KANTO // 8 LÍDERES',
        kanto_deck_desc: 'Secuencia Óptima: Plateada -> Celeste -> Carmín -> Azulona -> Fucsia -> Azafrán -> Canela -> Verde',
        clear_status_all: 'CIRCUITO COMPLETADO',
        clear_status_progress: 'EN PROGRESO',
        amulet_coin_active: 'MONEDA AMULETO (+50% BONO)',
        amulet_coin_idle: 'MONEDA AMULETO INACTIVA',
        amulet_timer_title: 'Cronómetro Moneda Amuleto',
        btn_start_amulet: 'Iniciar Bono',
        btn_reset_amulet: 'Reiniciar',
        gym_clearance: 'Total Gym Clearance',
        total_pokedollars: 'Total Ganado',
        cooldown_ready: 'Listo',
        cooldown_cooldown: 'Enfriamiento',
        btn_continue: 'CONTINUAR',
        btn_view_large: 'VER EN GRANDE',
        btn_completed: 'VICTORIA',

        // Berries
        berries_title: 'Cultivo de Bayas',
        berries_subtitle: 'Monitoreo de hidratación de suelo, temporizadores de maduración y calculadora de rendimiento.',
        harvest_count: 'Rondas Cosechadas',
        btn_reset_harvest: 'Reiniciar contador',
        seed_inventory: 'Inventario de Semillas',
        btn_calc_inventory: 'Calcular Producción',
        recipe_lookup: 'Recetario de Semillas',
        select_berry_recipe: 'Consultar Baya...',
        plant_berry: 'Plantación de Bayas',
        field_species: 'Especie',
        field_coords: 'Coordenadas / Parcela',
        field_elapsed: 'Tiempo Ya Transcurrido (Hrs)',
        watered_at_plant: 'Regada al plantar (5 gotas llenas)',
        btn_plant_action: 'Plantar Baya',

        // Berry Moisture
        moisture_protected: 'Protegido',
        moisture_hydrated: 'Hidratado',
        moisture_base: '2 Gotas Base',
        moisture_urgent: 'Riego Urgente en',
        moisture_remaining: 'Humedad Restante',
        moisture_dry_warn: '¡REGAR YA!',
        btn_water: 'Regar',
        btn_water_5: 'Regar (5 Gotas)',
        btn_cancel_crop: 'Cancelar',

        // Profit Calculator
        calc_title: 'Rentabilidad de Semillas y Bayas (Calculadora GTL)',
        calc_subtitle: 'Simulador económico de trituración ($350/herramienta), reserva de semillas para replantar y venta de excedentes en el mercado.',
        calc_economic_module: 'Módulo Económico',
        param_berry: 'Especie de Baya',
        param_plots: 'Parcelas',
        param_yield: 'Rendimiento (Bayas/Planta)',
        param_tool_cost: 'Herramienta ($)',
        param_gtl_fee: 'Tasa GTL (%)',
        gtl_prices_title: 'Precios de Mercado en el GTL (Valores Editables)',
        gtl_saved_tag: 'Precios guardados en memoria',
        btn_save_gtl_prices: 'Guardar Precios',
        btn_reset_gtl_prices: 'Restablecer Precios Sugeridos',
        preset_loza: '156 Loza',
        preset_hoenn: '84 Hoenn',

        // Strategies
        strat_a_title: 'Estrategia A: Triturar + Vender Semillas',
        strat_b_title: 'Estrategia B: Venta Directa de Bayas',
        strat_recommended: 'Recomendada',
        verdict_crush_better: 'RECOMENDACIÓN: TRITURAR Y VENDER EXCEDENTES',
        verdict_raw_better: 'RECOMENDACIÓN: VENDER BAYAS CRUDAS EN EL GTL',
        est_harvest: 'Cosecha Estimada',
        tool_expenses: 'Gasto Herramientas',
        net_profit_crush: 'Ganancia Neta (Triturar)',
        hourly_rate: 'Rendimiento Temporal',
        per_plot: 'por parcela',
        balance_table_title: 'Balance de Semillas (Trituración vs Replantación Autosuficiente)',
        balance_replant_covered: 'Replantado 100% cubierto',
        th_seed: 'Semilla',
        th_crushed: 'Trituradas',
        th_reserved: 'Reservadas Replantar',
        th_surplus: 'Excedente Vendible',
        th_price: 'Precio GTL',
        th_subtotal: 'Subtotal GTL',
        surplus_tag: 'excedentes',
        missing_tag: 'comprar en GTL',
        exact_zero: 'Exacto (0)',
        net_profit_label: 'Ganancia Neta:',

        // Extraction Module
        extraction_title: 'Extracción y Triturador de Semillas',
        extraction_subtitle: 'Control de herramientas compradas, registro de drops reales obtenidos y verificación de rentabilidad en el mercado.',
        ext_total_tools: 'Herramientas Usadas',
        ext_total_spent: 'Invertido Floristería',
        ext_total_profit: 'Ganancia Neta Histórica',
        ext_batch_params: '1. Parámetros del Lote',
        ext_session_active: 'Sesión en Curso',
        ext_crushed_berry: 'Especie de Baya Triturada',
        ext_tools_count: 'Herramientas Compradas / Usadas',
        ext_tool_unit: 'Precio Tool ($)',
        ext_gtl_commission: 'Comisión GTL (%)',
        ext_total_expense: 'Gasto Total Herramientas:',
        btn_fill_theoretical: 'Cargar Estimación Teórica',
        btn_clear_drops: 'Reiniciar Conteo a 0',
        ext_real_drops: '2. Semillas Dropeadas Reales',
        ext_real_drops_desc: 'Ingresa la cantidad exacta de semillas que te arrojó el juego al triturar.',
        ext_total_gathered: 'Total semillas recolectadas:',
        ext_gross_val: 'Valor bruto GTL:',
        ext_history_title: 'Bitácora de Lotes Triturados',
        ext_history_desc: 'Historial permanente de sesiones trituradas para auditar tu rendimiento económico acumulado.',
        btn_clear_history: 'Vaciar Bitácora',
        th_date: 'Fecha',
        th_berry: 'Baya',
        th_tools: 'Herramientas',
        th_flower_spent: 'Gasto Floristería',
        th_seeds_received: 'Semillas Recibidas',
        th_net_gtl: 'Ingreso Neto GTL',
        th_net_profit: 'Ganancia Neta',
        th_roi: 'ROI',
        th_action: 'Acción',
        btn_save_batch: 'Guardar en Bitácora',
        batch_saved_notice: '¡Lote Guardado en Bitácora!',
        verdict_worth_it: 'ES A CUENTA // OPERACIÓN RENTABLE',
        verdict_not_worth: 'NO ES A CUENTA // OPERACIÓN EN PÉRDIDA',
        verdict_break_even: 'PUNTO DE EQUILIBRIO // NI GANANCIA NI PÉRDIDA',

        // Pokédex Radar
        pokedex_title: 'Radar de Encuentros Pokédex',
        pokedex_subtitle: 'Ratios de captura, métodos de encuentro, objetos equipados y filtros por región.',
        dex_search_placeholder: 'Buscar Pokémon por nombre, número o tipo...',
        dex_filter_region: 'Todas las Regiones',
        dex_filter_caught: 'Estado Captura',
        dex_filter_type: 'Todos los Tipos',
        dex_col_species: 'ESPECIE',
        dex_col_types: 'TIPO / MÉTODO',
        dex_col_location: 'UBICACIONES Y RATIO',
        dex_col_status: 'ESTADO',
        dex_btn_caught: 'CAPTURADO',
        dex_btn_uncaught: 'NO CAPTURADO',
        method_grass: 'Pasto',
        method_cave: 'Cueva',
        method_surf: 'Surf',
        method_super_rod: 'Súper Caña',
        method_good_rod: 'Buena Caña',
        method_old_rod: 'Caña Vieja',
        method_rock_smash: 'Golpe Roca',
        method_lure: 'Cebo',
        method_headbutt: 'Golpe Cabeza',
        method_rocks: 'Rocas',

        // Breeding
        breeding_title: 'Laboratorio de Crianza y Árbol de IVs',
        breeding_subtitle: 'Calculadora de rutas óptimas para 5x31 / 6x31, costos de brazales y naturaleza.',
        target_ivs: 'IVs Deseados',
        btn_generate_tree: 'Generar Árbol de Crianza',
        auth_id: "ID:",
        auth_logout: "Cerrar sesión",
        auth_mode: "Modo:",
        auth_guest: "Invitado",
        auth_sync: "Sincronizar",
        auth_sync_tooltip: "Inicia sesión para sincronizar tu progreso entre PC y móvil",
        gym_earnings_title: "Ganancias del Gym Run",
        gym_estimated_total: "Total estimado",
        gym_amulet_toggle: "Moneda Amuleto +50% activa",
        gym_base_payout: "Base:",
        gym_bonus_payout: "Bono:",
        gym_amulet_timer: "Cronómetro de Moneda Amuleto",
        gym_1_hour: "1 HORA",
        gym_amulet_duration: "DURACIÓN AMULETO 1H",
        gym_inactive: "INACTIVO",
        gym_active: "ACTIVO",
        gym_recharge_cycle: "RECARGA: CICLO 18H",
        gym_status_ready: "ESTADO: LISTO",
        gym_status_running: "ESTADO: EN CURSO",
        gym_btn_start: "Iniciar cronómetro",
        gym_btn_pause: "Pausar cronómetro",
        gym_overall_progress: "Progreso general de gimnasios (reinicio cada 18h)",
        gym_ready_count_label: "Gimnasios listos:",
        gym_cooldown_badge_label: "en enfriamiento",
        gym_ready_label: "listos",
        gym_cooldown_label: "Enfriamiento",
        gym_recommended_route: "Ruta recomendada:",
        gym_reset_all_btn: "[ Reiniciar todos los gimnasios ]",
        gym_routes_by_region: "Rutas de Gimnasios por Región",
        gym_leader_reset_info: "Reinicio de líderes: 18 horas",
        gym_circuit_cleared_stamp: "REGIÓN COMPLETADA",
        gym_circuit_pending_stamp: "PENDIENTE",
        gym_league_of: "Liga de",
        gym_active_region: "Región activa",
        gym_clear_region: "Completar región",
        gym_cleared: "Completado ✓",
        gym_reset_region: "Reiniciar",
        gym_focus_view: "Ver en grande",
        gym_continue: "Continuar",
        gym_ready: "Listo",
        berry_header_title: "Cultivo de Bayas",
        berry_header_badge: "Riego y Cosecha",
        berry_header_desc: "Monitoreo de hidratación de suelo, temporizadores de maduración y calculadora de rendimiento.",
        berry_rounds_harvested: "Rondas Cosechadas",
        berry_calc_production: "Calcular Producción",
        berry_recipes: "Recetario de Semillas",
        berry_consult: "Consultar Baya...",
        berry_active_plots: "Parcelas en Cultivo",
        berry_ready_harvest: "LISTO PARA COSECHAR",
        berry_dry_soil: "TIERRA SECA",
        berry_stage_growth: "Fase de crecimiento",
        berry_cancel_crop: "Eliminar cultivo",
        berry_water_now: "Regar",
        berry_dry_in: "Seca en",
        berry_harvest_in: "Cosecha en",
        ext_header_title: "Extracción y Triturador de Semillas",
        ext_audit_badge: "Auditoría GTL",
        ext_header_desc: "Control de herramientas compradas, registro de drops reales obtenidos y verificación de rentabilidad en el mercado.",
        ext_tools_used: "Herramientas Usadas",
        ext_spent_shop: "Invertido Floristería",
        ext_net_profit_lifetime: "Ganancia Neta Histórica",
        ext_unit_tool: "u.",
        ext_worth_verdict: "VALE LA PENA // OPERACIÓN RENTABLE",
        ext_not_worth_verdict: "NO VALE LA PENA // PÉRDIDAS DETECTADAS",
        ext_breakeven_verdict: "PUNTO DE EQUILIBRIO // SIN GANANCIAS/PÉRDIDAS",
        ext_save_batch: "Guardar Lote en Historial",
        ext_saved_toast: "Lote guardado en el historial",
        ext_history_cleared: "Historial reiniciado",
        dex_header_title: "Radar Pokédex",
        dex_routes_badge: "Rutas de Encuentro",
        dex_header_desc: "Ruteo geográfico secuencial y optimización de captura salvaje por región.",
        dex_caught_btn: "Capturados",
        dex_tab_all: "Todas",
        dex_hide_caught: "Ocultar Capturados",
        dex_hide_preevos: "Ocultar Pre-evoluciones",
        dex_hide_postevos: "Ocultar Post-evoluciones",
        dex_only_with_route: "Solo con Ruta",
        dex_progress_title: "Progreso de la Pokédex",
        dex_registered: "(Pokémon registrados)",
        dex_search_input: "Buscar Pokémon por nombre, ID o tipo...",
        dex_order_num: "Orden Pokédex (#)",
        dex_order_name: "Nombre (A-Z)",
        dex_order_rarity: "Ruta más fácil / común",
        dex_time_all: "Cualquier horario",
        dex_time_morning: "Solo Mañana",
        dex_time_day: "Solo Día",
        dex_time_night: "Solo Noche",
        breeding_title: "Crianza y Genética",
        breeding_subtitle: "Generador de árboles genealógicos y presupuesto exacto de brazales para el GTL.",
        breeding_iv_sim: "Simulador IVs",
        breeding_target: "Pokémon Objetivo (Opcional):",
        breeding_egg_groups: "Grupos Huevo:",
        breeding_gender_cost: "Costo Género:",
        breeding_per_breed: "por cruce",
        breeding_select_ivs: "Selección de IVs a 31",
        breeding_inherit_nature: "Heredar Naturaleza",
        breeding_construction: "Módulo de Crianza en construcción...",
    }
};

export function t(key, fallback = '') {
    const lang = currentLang;
    if (DICT[lang] && DICT[lang][key] !== undefined) {
        return DICT[lang][key];
    }
    if (DICT.en && DICT.en[key] !== undefined) {
        return DICT.en[key];
    }
    return fallback || key;
}

export function updateI18nDOM() {
    // 0. Título de la pestaña
    document.title = currentLang === 'en' ? 'PokéMMO Rotom-Phone — Trainer Operations Terminal' : 'PokéMMO Rotom-Phone — Terminal de Entrenador';

    // 1. Textos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (text) el.textContent = text;
    });

    // 2. Placeholders con data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = t(key);
        if (text) el.placeholder = text;
    });

    // 3. Botones de alternancia de idioma (sin emojis)
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.innerHTML = `
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5F5A4D] dark:text-[#A8A594]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path stroke-width="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span class="font-tech font-bold uppercase text-xs sm:text-[13px] text-[#1C1C17] dark:text-[#F4F1E8] tracking-wider">${currentLang.toUpperCase()}</span>
        `;
        btn.title = currentLang === 'en' ? 'Cambiar a Español' : 'Switch to English';
    });

    // 4. Actualizar textos estáticos en HTML si existen
    const opTerm = document.querySelector('#appSubtitleText');
    if (opTerm) opTerm.textContent = t('app_subtitle');

    const serverTimeTitle = document.querySelector('#serverTimeTitle');
    if (serverTimeTitle) serverTimeTitle.textContent = t('server_clock');

    const serverTimeDesc = document.querySelector('#serverTimeDesc');
    if (serverTimeDesc) serverTimeDesc.textContent = t('server_clock_desc');

    const nextResetLabel = document.querySelector('#nextResetLabel');
    if (nextResetLabel) nextResetLabel.textContent = t('next_reset');

    const footerDisclaimer = document.querySelector('#footerDisclaimer');
    if (footerDisclaimer) footerDisclaimer.textContent = t('footer_disclaimer', 'Herramienta complementaria no oficial y de código abierto. Pokémon y PokéMMO pertenecen a sus respectivos creadores.');

    const footerGithubText = document.querySelector('#footerGithubText');
    if (footerGithubText) footerGithubText.textContent = t('footer_github', 'Código Abierto (GitHub)');

    const footerCoffeeText = document.querySelector('#footerCoffeeText');
    if (footerCoffeeText) footerCoffeeText.textContent = t('footer_coffee', 'Buy Me a Coffee');

    const footerFeedbackText = document.querySelector('#footerFeedbackText');
    if (footerFeedbackText) footerFeedbackText.textContent = t('footer_feedback', 'Feedback bienvenido');

    // 5. Actualizar pestañas de navegación móvil y desktop
    updateNavTabsText();
}

export function updateNavTabsText() {
    // Mobile Select
    const mobileSelect = document.getElementById('mobileTabSelect');
    if (mobileSelect) {
        const options = mobileSelect.options;
        for (let i = 0; i < options.length; i++) {
            const val = options[i].value;
            if (val === 'gyms') options[i].textContent = t('tab_gyms');
            if (val === 'berries') options[i].textContent = t('tab_berries');
            if (val === 'market') options[i].textContent = t('tab_market');
            if (val === 'extraction') options[i].textContent = t('tab_extraction');
            if (val === 'pokedex') options[i].textContent = t('tab_pokedex');
            if (val === 'breeding') options[i].textContent = t('tab_breeding');
        }
    }

    // Desktop Tabs
    const tabGyms = document.querySelector('#nav-gyms span');
    if (tabGyms) tabGyms.textContent = t('tab_gyms');

    const tabBerries = document.querySelector('#nav-berries span');
    if (tabBerries) tabBerries.textContent = t('tab_berries');

    const tabMarket = document.querySelector('#nav-market span');
    if (tabMarket) tabMarket.textContent = t('tab_market');

    const tabExtraction = document.querySelector('#nav-extraction span');
    if (tabExtraction) tabExtraction.textContent = t('tab_extraction');

    const tabPokedex = document.querySelector('#nav-pokedex span');
    if (tabPokedex) tabPokedex.textContent = t('tab_pokedex');

    const tabBreeding = document.querySelector('#nav-breeding span');
    if (tabBreeding) tabBreeding.textContent = t('tab_breeding');
}
