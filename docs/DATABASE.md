# Base de Datos: Supabase Schema

Este documento describe la estructura y las políticas de acceso del esquema de la base de datos en Supabase para PokeMMO Terminal.

## Esquemas Completos de las Tablas

### `gym_progress`
Registra el estado y el progreso del farmeo de los líderes de gimnasio por parte del usuario.
- `id` (uuid, PK): Identificador único del registro.
- `user_id` (uuid, FK): Hace referencia a `auth.users(id)`.
- `gym_id` (varchar): Identificador lógico del gimnasio (ej., Kanto_1). Abarca los 40 líderes de gimnasio a través de las 5 regiones del juego.
- `defeated` (boolean): Marca si el líder ha sido derrotado recientemente.
- `last_defeated_at` (timestamptz): Marca de tiempo del momento en que se derrotó al líder (usado para medir los cooldowns).

### `berry_crops`
Seguimiento de la siembra y el regado de bayas cultivadas.
- `id` (uuid, PK): Identificador de la parcela de cultivo.
- `user_id` (uuid, FK): Referencia a `auth.users(id)`.
- `location` (varchar): Ubicación de la planta sembrada.
- `berry_type` (varchar): El tipo específico de baya plantada.
- `planted_at` (timestamptz): Fecha y hora en que la baya fue sembrada.
- `last_watered_at` (timestamptz): Fecha y hora de la última vez que la baya fue regada.
- `stage` (int): Etapa de crecimiento actual.

### `pokemon_caught`
Registro del progreso en la captura de Pokémon para completar la Pokédex.
- `id` (uuid, PK): Identificador del registro.
- `user_id` (uuid, FK): Referencia al usuario en `auth.users(id)`.
- `national_dex_id` (int): El ID correspondiente a la Pokédex Nacional para el Pokémon específico capturado.
- `caught_at` (timestamptz): Cuando fue marcado como capturado por el jugador.
- `notes` (text, opcional): Notas arbitrarias respecto al ejemplar.

### `user_preferences`
Guarda el estado y las opciones configuradas del usuario (UI settings/filtros).
- `user_id` (uuid, PK/FK): Identifica al usuario que posee las configuraciones (relacionado con `auth.users(id)`).
- `active_tab` (varchar): Pestaña seleccionada por última vez antes de cerrar sesión o recargar.
- `dex_region` (varchar): Región predeterminada a visualizar en la Pokédex.
- `filters` (jsonb): Objeto JSON que alberga preferencias de filtrado.
- `amulet_coin_active` (boolean): Estado del Moneda Amuleto para el cálculo de ganancias económicas (Gimnasios, etc.).
- `breeding_config` (jsonb): Preferencias guardadas respecto a cálculos en el módulo de cría.

### `pokedex_suggestions`
Recopila retroalimentación y sugerencias para correcciones sobre información en la Pokédex.
- `id` (uuid, PK): Identificador único de la sugerencia.
- `user_id` (uuid, FK): Usuario que generó la sugerencia `auth.users(id)`.
- `pokemon_id` (int): A qué Pokémon hace referencia.
- `suggestion_text` (text): Contenido de la corrección o sugerencia.
- `status` (varchar): Estado de la sugerencia (e.g., pending, approved, rejected).
- `created_at` (timestamptz): Cuando se creó el registro.

## Row Level Security (RLS)
La base de datos cuenta con políticas de Row Level Security (RLS) habilitadas para todas las tablas. El objetivo primordial de estas políticas es garantizar que cada usuario pueda acceder y modificar únicamente sus propios datos.

**Explicación general de las Políticas:**
- Para la operación `SELECT`: Un usuario solo puede leer una fila si `auth.uid() = user_id`.
- Para las operaciones `INSERT` y `UPDATE`: Un usuario solo puede insertar/actualizar registros donde la columna `user_id` coincida con su `auth.uid()`.
- Para `DELETE`: Solo el dueño del registro `(auth.uid() = user_id)` puede eliminar las filas correspondientes.
*Nota*: La tabla `pokedex_suggestions` puede tener permisos extra para administradores a la hora de actualizar el `status`, sin embargo, para un usuario normal el acceso se mantiene aislado.

## Consultas de Ejemplo (Supabase JS)

**Obtener todo el progreso de gimnasios del usuario:**
```javascript
const { data, error } = await supabase
  .from('gym_progress')
  .select('*')
  .eq('user_id', user.id);
```

**Registrar un nuevo Pokémon como capturado:**
```javascript
const { data, error } = await supabase
  .from('pokemon_caught')
  .insert([
    { user_id: user.id, national_dex_id: 1, caught_at: new Date() }
  ]);
```
