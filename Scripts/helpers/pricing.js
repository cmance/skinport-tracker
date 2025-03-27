/**
 * Determines if buying an item at the given price is profitable.
 * 
 * @param {number} itemPrice - The price you are paying for the item
 * @param {number} medianPrice - The median price of the item
 * @param {number} desiredPercentProfit - The desired profit margin (e.g., 0.1 for 10%)
 * @returns {boolean} - True if the item is profitable, False otherwise
 */
export function calcProfit(itemPrice, medianPrice, desiredPercentProfit = 0.1) {
    if (medianPrice === null || medianPrice === undefined) {
        console.log("Median price is null. Cannot calculate profit.");
        return false;
    }

    // Calculate the revenue after the 12% selling fee
    const revenueAfterFee = medianPrice * 0.88;

    // Calculate the maximum item price to achieve the desired profit margin
    const maxItemPrice = revenueAfterFee / (1 + desiredPercentProfit);

    console.log(`Item Price: ${itemPrice}, Median Price: ${medianPrice}, Revenue After Fee: ${revenueAfterFee}, Max Item Price: ${maxItemPrice}`);

    // Check if the item price is less than or equal to the maximum item price
    return itemPrice <= maxItemPrice;
}

// itemPrice 100, medianPrice 150, desiredPercentProfit 0.1
// revenueAfterFee = 150 * 0.88 = 132
// maxItemPrice = 132 / (1 + 0.1) = 120
// itemPrice 100 <= maxItemPrice 120 => true
