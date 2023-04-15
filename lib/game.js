

export function generateRandomNumber() {
    
    let result = "";
    let numbers = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
    
    for (let i = 0; i < 3; ++i) {
        
        let randomIndex = Math.floor(Math.random() * numbers.length);
        result += numbers.splice(randomIndex, 1)[0];
    }

    return result;
}