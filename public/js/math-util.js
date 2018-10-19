// MATH UTILITY
function mathProto() {
    this.RAD_to_DEG =  180 / Math.PI; // Radians to degree conversion
};    
mathProto.prototype.clamp = function(num, min, max) { // Clamps number to min or max value
    return Math.min(Math.max(num, min), max);
};