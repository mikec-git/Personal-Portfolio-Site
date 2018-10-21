// MATH UTILITY
class mathUtil {
    // Radians to degree conversion
    static get RAD_to_DEG() {
        return 180 / Math.PI; 
    } 

    // Clamps number to min <= num <= max value
    static Clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}

export default mathUtil;