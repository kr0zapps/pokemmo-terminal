// js/modules/market.js - PokéMMO GTL Profitability & Economic Simulator Module
import { renderProfitCalculatorHTML, initProfitCalculator } from './berries.js';

export function renderMarketView() {
    return `
        <div id="view-market" class="hidden animate-fade-in space-y-6">
            ${renderProfitCalculatorHTML()}
        </div>
    `;
}

export function initMarket() {
    initProfitCalculator();
}
