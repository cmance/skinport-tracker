def calcProfit(itemPrice, medianPrice, desiredPercentProfit=0.1):
    """
    Determines if buying an item at the given price is profitable.
    
    :param itemPrice: float - The price you are paying for the item
    :param medianPrice: float - The median price of the item
    :param desiredPercentProfit: float - The desired profit margin (e.g., 0.1 for 10%)
    :return: bool - True if the item is profitable, False otherwise
    """
    if medianPrice is None:
        print("Median price is null. Cannot calculate profit.")
        return False

    # Calculate the revenue after the 12% selling fee
    revenueAfterFee = medianPrice * 0.88

    # Calculate the maximum item price to achieve the desired profit margin
    maxItemPrice = revenueAfterFee / (1 + desiredPercentProfit)

    print(f"Item Price: {itemPrice}, Median Price: {medianPrice}, Revenue After Fee: {revenueAfterFee}, Max Item Price: {maxItemPrice}")

    # Check if the item price is less than or equal to the maximum item price
    return itemPrice <= maxItemPrice

# Example usage
print(calcProfit(100, 150, 0.1))  # True
print(calcProfit(136, 150, 0.1))  # False