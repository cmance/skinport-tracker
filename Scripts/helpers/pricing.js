/**
 * Determines if buying an item at the given price is profitable.
 * @param {number} itemPrice - The price you are paying for the item
 * @param {number} medianPrice - The median price of the item
 * @param {number} desiredPercentProfit - The desired profit margin (e.g., 0.1 for 10%)
 * @returns {boolean} - True if the item is profitable, False otherwise
 */
export function calcProfit(itemPrice, medianPrice, desiredPercentProfit = 0.08) {
    if (medianPrice === null || medianPrice === undefined || itemPrice >= medianPrice) {
        console.log("Invalid median price or item price is greater than median price. Item Price: ", itemPrice, " Median Price: ", medianPrice);
        return false;
    }

    const saleAfterFee = medianPrice * 0.88
    const actualProfit = saleAfterFee - itemPrice
    const actualProfitMargin = actualProfit / itemPrice
    const maxBuyPrice = saleAfterFee * (1 - desiredPercentProfit)
    
    console.log(`Item Price: $${itemPrice}, Median Price: $${medianPrice}, Sale After Fee: $${saleAfterFee}, Actual Profit: ${round(actualProfit, 2)}, Actual Profit Margin: ${round(actualProfitMargin*100, 2)}%, Max Buy Price: $${round(maxBuyPrice, 2)}`);

    if (actualProfitMargin >= desiredPercentProfit) {
        console.log("\x1b[32mProfit met!\x1b[0m");
        return true;
    } else {
        console.log("\x1b[31mProfit not met.\x1b[0m");
        return false;
    }
}

/**
 * Rounds a number to the specified number of decimal places.
 * @param {number} value - The number to round
 * @param {number} decimals - The number of decimal places
 * @returns {number} - The rounded number
 */
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}