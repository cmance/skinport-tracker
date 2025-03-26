

// There is a 12% fee on all sales, so this must be taken into account when calculating the profit.
// If you want a 20% profit, you must sell the item for 32% more than you bought it for.
// So the target profit should never be set lower than 12%.

/**
 * Calculates if you can meet the target profit percentage
 * @param {float} itemPrice 
 * @param {float} median7day 
 * @param {float} targetProfitPercentage // 0.2 for 20% profit
 * @returns {boolean}
 */
export function calculateProfit(itemPrice, median7day, targetProfitPercentage=0.2) { //default 20% profit
    if (itemPrice + (itemPrice * targetProfitPercentage) < median7day) {
        return true;
    }
    return false;
}