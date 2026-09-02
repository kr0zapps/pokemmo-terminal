# Documentación de Módulos (JavaScript)

El proyecto PokeMMO Terminal implementa una arquitectura modular utilizando Vanilla JavaScript (ES Modules). A continuación, se detallan el propósito, las funciones expuestas y las dependencias de cada módulo fundamental.

## Módulos Principales (Core)

### `js/app.js`
- **Propósito:** Actúa como el punto de entrada (Entry point) de la aplicación. Inicializa el ciclo de vida, configuraciones globales e invoca a los demás módulos base.
- **Funciones Públicas / Exportaciones:** 
  - `initApp()`: Orquesta la inicialización de autenticación y carga el router inicial.
- **Dependencias:** `auth.js`, `router.js`, `state.js`.

### `js/auth.js`
- **Propósito:** Maneja el flujo de autenticación del usuario, centrado en el registro e inicio de sesión usando correo electrónico y contraseña exclusivamente (sin OAuth).
- **Funciones Públicas / Exportaciones:**
  - `login(email, password)`: Valida las credenciales con Supabase.
  - `register(email, password)`: Registra un nuevo jugador.
  - `logout()`: Destruye la sesión activa.
  - `getCurrentUser()`: Retorna el usuario de la sesión actual.
- **Dependencias:** `db.js` (cliente Supabase).

### `js/db.js`
- **Propósito:** Configura el cliente de Supabase e incluye funciones CRUD de base comunes para las diferentes operaciones de estado de la aplicación.
- **Funciones Públicas / Exportaciones:**
  - `supabase`: La instancia global del cliente de base de datos.
  - `fetchData(table, queryParams)`
  - `insertData(table, data)`
  - `updateData(table, data, matchQuery)`
- **Dependencias:** SDK de Supabase (importado vía CDN).

### `js/sync.js`
- **Propósito:** Gestiona la sincronización de estado de manera reactiva/tiempo real al habilitarse cambios o recuperar la conectividad (sincronización optimista o polling eventual si falla realtime).
- **Funciones Públicas / Exportaciones:**
  - `initSyncService()`
  - `queueSyncTask(task)`
- **Dependencias:** `db.js`, `state.js`.

### `js/state.js`
- **Propósito:** Contenedor de estado global (Store reactivo) para la sesión del jugador (preferencias, progreso). Emite eventos o triggers al modificar propiedades.
- **Funciones Públicas / Exportaciones:**
  - `getState(key)`
  - `setState(key, value)`
  - `subscribe(key, callback)`
- **Dependencias:** Ninguna (módulo base).

### `js/router.js`
- **Propósito:** Encargado de la navegación por pestañas en la aplicación de tipo SPA. Renderiza el módulo respectivo a la pestaña cliqueada sin recargar la página.
- **Funciones Públicas / Exportaciones:**
  - `navigateTo(tabId)`: Cambia la vista.
  - `initRouter()`: Escucha cambios y enruta el inicio.
- **Dependencias:** Todos los submódulos dentro de `js/modules/`, `dom.js`, `state.js`.

## Módulos Específicos de Funcionalidades (Tabs)

### `js/modules/gyms.js`
- **Propósito:** Gestor de Repeticiones de Gimnasios (Gym Reruns). Maneja los cooldowns y ganancias económicas mediante el estado de combate con los 40 líderes.
- **Funciones Públicas / Exportaciones:** `init()`, `render()`, `markAsDefeated(gymId)`.
- **Dependencias:** `state.js`, `db.js`, `dom.js`.

### `js/modules/berries.js`
- **Propósito:** Simulador/Calculadora del Cultivo de Bayas. Rastrea la siembra, tiempos de espera y requerimientos de regado según la etapa y la especie de baya.
- **Funciones Públicas / Exportaciones:** `init()`, `render()`, `plantBerry(location, type)`, `waterBerry(id)`.
- **Dependencias:** `state.js`, `db.js`, `dom.js`, `format.js`.

### `js/modules/pokedex.js`
- **Propósito:** Optimizador para el progreso de la Pokédex. Brinda estadísticas, listas de capturados/faltantes por región usando el PokeAPI wrapper interno.
- **Funciones Públicas / Exportaciones:** `init()`, `render()`, `toggleCaughtStatus(nationalDexId)`.
- **Dependencias:** `state.js`, `db.js`, `dom.js`, `api.js`.

### `js/modules/breeding.js`
- **Propósito:** Calculadora y planificador de Cría Pokémon para proyectar IVs y predecir los costos o probabilidades según los objetos (brazales/piedra eterna).
- **Funciones Públicas / Exportaciones:** `init()`, `render()`, `calculateBreedingCost(config)`.
- **Dependencias:** `dom.js`, `format.js`.

## Utilidades (`js/utils/`)

### `js/utils/dom.js`
- **Propósito:** Proveer helpers seguros de manipulación del Document Object Model para prevenir inyección XSS cuando se formatea código derivado de perfiles o bases de datos.
- **Funciones Públicas / Exportaciones:** `createElement(tag, attributes, ...children)`, `clearElement(element)`.
- **Dependencias:** Ninguna.

### `js/utils/format.js`
- **Propósito:** Colección de funciones puras destinadas a formatear cadenas, números, monedas dentro del juego (Pokédolares) y la presentación temporal (tiempos relativos para los gimnasios).
- **Funciones Públicas / Exportaciones:** `formatCurrency(amount)`, `formatTimeRemaining(date)`, `capitalize(string)`.
- **Dependencias:** Ninguna.

### `js/utils/api.js`
- **Propósito:** Un wrapper adaptado y simplificado en base de promesas para consumir datos de PokeAPI u orígenes externos con un control interno de caché.
- **Funciones Públicas / Exportaciones:** `fetchPokemonData(idOrName)`, `fetchItemInfo(item)`.
- **Dependencias:** `state.js` (si usa caché de sesión).
