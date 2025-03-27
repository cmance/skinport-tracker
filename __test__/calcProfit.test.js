// import { calcProfit } from "../Scripts/helpers/pricing";

test("calcProfit should return true for profitable items", () => {
  const itemPrice = 100;
  const medianPrice = 150;
  const desiredPercentProfit = 0.1; // 10%

  const result = calcProfit(itemPrice, medianPrice, desiredPercentProfit);
  expect(result).toBe(true);
});