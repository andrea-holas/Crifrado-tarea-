// ===== CIFRADO CÉSAR =====
function caesarCipher(text, shift, decrypt = false) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    shift = parseInt(shift) || 0; // evita NaN
    shift = decrypt ? (26 - shift) % 26 : shift;

    return text.toUpperCase().split("").map(char => {
        let i = alphabet.indexOf(char);
        if (i === -1) return char; // deja espacios o signos igual
        return alphabet[(i + shift) % 26];
    }).join("");
}

// ===== CIFRADO VIGENÈRE =====
function vigenereCipher(text, key, decrypt = false) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    key = key.toUpperCase();
    let output = "";
    let keyIndex = 0;

    for (let char of text.toUpperCase()) {
        if (!alphabet.includes(char)) {
            output += char;
            continue; // no avanza la clave si no es letra
        }

        let shift = alphabet.indexOf(key[keyIndex % key.length]);
        if (decrypt) shift = 26 - shift;

        let newIndex = (alphabet.indexOf(char) + shift) % 26;
        output += alphabet[newIndex];
        keyIndex++;
    }
    return output;
}

// ===== CIFRADO TRANSPOSICIÓN COLUMNAR =====
function transpositionCipher(text, key, decrypt = false) {
    key = key.toUpperCase();
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);

    // crea orden estable incluso si hay letras repetidas
    const keyOrder = key.split('')
        .map((char, index) => ({ char, index }))
        .sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index);

    // crea la matriz
    let grid = Array.from({ length: numRows }, (_, i) =>
        text.slice(i * numCols, (i + 1) * numCols).padEnd(numCols, '_')
    );

    if (!decrypt) {
        let result = '';
        for (let { index } of keyOrder) {
            for (let row of grid) result += row[index];
        }
        return result;
    } else {
        let result = Array(numRows).fill('').map(() => Array(numCols).fill(''));
        let index = 0;
        for (let { index: col } of keyOrder) {
            for (let i = 0; i < numRows; i++) {
                result[i][col] = text[index++];
            }
        }
        return result.flat().join('').replace(/_+$/, '');
    }
}

// ===== CIFRADO ATBASH =====
function atbashCipher(text) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const reversed = alphabet.split('').reverse().join('');
    return text.toUpperCase().split('').map(c => {
        const i = alphabet.indexOf(c);
        return i !== -1 ? reversed[i] : c;
    }).join('');
}

// ===== FUNCIONES PRINCIPALES =====
function encrypt() {
    const text = document.getElementById('inputText').value;
    const key = document.getElementById('keyInput').value;
    const algo = document.getElementById('algorithm').value;
    let result = '';

    switch (algo) {
        case 'cesar':
            result = caesarCipher(text, parseInt(key) || 0);
            break;
        case 'vigenere':
            result = vigenereCipher(text, key);
            break;
        case 'transposicion':
            result = transpositionCipher(text, key);
            break;
        case 'atbash':
            result = atbashCipher(text);
            break;
    }

    document.getElementById('outputText').value = result;
}

function decrypt() {
    const text = document.getElementById('inputText').value;
    const key = document.getElementById('keyInput').value;
    const algo = document.getElementById('algorithm').value;
    let result = '';

    switch (algo) {
        case 'cesar':
            result = caesarCipher(text, parseInt(key) || 0, true);
            break;
        case 'vigenere':
            result = vigenereCipher(text, key, true);
            break;
        case 'transposicion':
            result = transpositionCipher(text, key, true);
            break;
        case 'atbash':
            result = atbashCipher(text);
            break;
    }

    document.getElementById('outputText').value = result;
}
