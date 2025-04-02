/**
 * Takes in the family data string and checks if it should be ignored.
 * @param {String} family 
 * @returns {Boolean}
 */
export function shouldIgnoreFamily(family) {
    const ignoredFamilies = ['Fade', 'Case Hardened', 'Doppler', 'Gamma Doppler', 'Emerald', 'Sapphire', 'Ruby', 'Black Pearl'];
  
    if (typeof family !== 'string') {
      console.log("Invalid family value:", family);
      return false;
    }
  
    const isIgnored = ignoredFamilies.some(ignored => family.toLowerCase().includes(ignored.toLowerCase()));
  
    if (isIgnored) {
      console.log(`Ignoring family: ${family}`);
    }
  
    return isIgnored;
  }