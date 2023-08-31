module.exports = {
    // 숫자를 간단한 문자열로 암호화하는 함수
    encryptNumber: function (number) {
        const mapping = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const numberString = number.toString();
        let encryptedString = '';

        for (let i = 0; i < numberString.length; i++) {
            const digit = parseInt(numberString[i], 10);
            encryptedString += mapping[digit];
        }

        return encryptedString;
    },

    // 간단한 문자열을 숫자로 복호화하는 함수
    decryptString: function (encryptedString) {
        const mapping = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9 };
        let decryptedNumber = '';

        for (let i = 0; i < encryptedString.length; i++) {
            const char = encryptedString[i];
            decryptedNumber += mapping[char];
        }

        return parseInt(decryptedNumber, 10);
    }
}