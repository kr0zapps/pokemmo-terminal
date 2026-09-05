// js/utils/pokemmo-time.js - Motor de Tiempo y Estaciones Oficial de PokéMMO

/**
 * Calcula la hora exacta dentro del juego, la fase del día y la estación de PokéMMO.
 * 
 * Reglas oficiales de PokéMMO:
 * 1. 1 hora de tiempo real = 4 horas en el juego.
 * 2. 1 día completo dentro del juego (24h) = exactamente 6 horas reales.
 * 3. Los ciclos se reinician a las 00:00, 06:00, 12:00 y 18:00 UTC.
 * 4. Fases del día:
 *    - Mañana: 04:00 – 10:59
 *    - Día: 11:00 – 20:59
 *    - Noche: 21:00 – 03:59
 * 5. Estaciones (rotan cada mes natural UTC):
 *    - Enero, Mayo, Septiembre: Primavera
 *    - Febrero, Junio, Octubre: Verano
 *    - Marzo, Julio, Noviembre: Otoño
 *    - Abril, Agosto, Diciembre: Invierno
 */
import { t } from '../i18n.js';

export function getPokeMMOClock(date = new Date()) {
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const utcSeconds = date.getUTCSeconds();
    const utcMs = date.getUTCMilliseconds();

    // Segundos transcurridos en el ciclo actual de 6 horas UTC
    const elapsedRealSeconds = (utcHours % 6) * 3600 + utcMinutes * 60 + utcSeconds + utcMs / 1000;
    
    // 1 segundo real = 4 segundos en el juego
    const totalInGameSeconds = elapsedRealSeconds * 4;

    const inGameHours = Math.floor(totalInGameSeconds / 3600) % 24;
    const inGameMinutes = Math.floor((totalInGameSeconds % 3600) / 60);
    const inGameSeconds = Math.floor(totalInGameSeconds % 60);

    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(inGameHours)}:${pad(inGameMinutes)}:${pad(inGameSeconds)}`;

    // Fases del día oficiales en PokéMMO
    let phase = t('phase_night');
    let phaseBadgeClass = 'bg-[#1C2333] text-[#93C5FD] border border-[#3B82F6]/50';
    let phaseIconSvg = `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;

    if (inGameHours >= 4 && inGameHours < 11) {
        phase = t('phase_morning');
        phaseBadgeClass = 'bg-[#451A03] text-[#FDE68A] border border-[#F59E0B]/50';
        phaseIconSvg = `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
    } else if (inGameHours >= 11 && inGameHours < 21) {
        phase = t('phase_day');
        phaseBadgeClass = 'bg-[#713F12] text-[#FEF08A] border border-[#EAB308]/60';
        phaseIconSvg = `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M8.343 15.657l-1.414 1.414m11.142 0l-1.414-1.414M8.343 8.343L6.929 6.929M12 6a6 6 0 100 12 6 6 0 000-12z"></path></svg>`;
    }

    // Estaciones oficiales en PokéMMO
    const seasonIndex = date.getUTCMonth() % 4;
    const seasonData = [
        {
            name: t('season_spring'),
            badgeClass: 'bg-[#831843] text-[#FBCFE8] border border-[#EC4899]/50',
            iconSvg: `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>`,
            desc: 'Formas de Deerling y brotes de temporada'
        },
        {
            name: t('season_summer'),
            badgeClass: 'bg-[#78350F] text-[#FDE68A] border border-[#F59E0B]/50',
            iconSvg: `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
            desc: 'Climas calurosos y formas estivales'
        },
        {
            name: t('season_autumn'),
            badgeClass: 'bg-[#7C2D12] text-[#FED7AA] border border-[#EA580C]/50',
            iconSvg: `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`,
            desc: 'Hojas secas y caminos desbloqueados'
        },
        {
            name: t('season_winter'),
            badgeClass: 'bg-[#164E63] text-[#BAE6FD] border border-[#38BDF8]/50',
            iconSvg: `<svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18m9-9H3m15.364-6.364L5.636 18.364m12.728 0L5.636 5.636"></path></svg>`,
            desc: 'Nieve profunda y nuevas áreas accesibles'
        }
    ];
    const currentSeason = seasonData[seasonIndex];

    // Tiempo restante hasta el próximo reinicio de ciclo de 6 horas
    const secondsUntilReset = Math.max(0, Math.floor(6 * 3600 - elapsedRealSeconds));
    const resetH = Math.floor(secondsUntilReset / 3600);
    const resetM = Math.floor((secondsUntilReset % 3600) / 60);
    const resetS = Math.floor(secondsUntilReset % 60);
    const timeUntilResetStr = `${pad(resetH)}:${pad(resetM)}:${pad(resetS)}`;

    return {
        timeStr,
        inGameHours,
        inGameMinutes,
        inGameSeconds,
        phase,
        phaseBadgeClass,
        phaseIconSvg,
        season: currentSeason.name,
        seasonBadgeClass: currentSeason.badgeClass,
        seasonIconSvg: currentSeason.iconSvg,
        seasonDesc: currentSeason.desc,
        timeUntilResetStr
    };
}
