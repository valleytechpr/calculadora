// Formatear el ingreso mientras se escribe
function formatIncomeInput(input) {
    let value = input.value.replace(/,/g, '');
    if (isNaN(value) || value === '') {
        input.value = '';
        return;
    }
    let formattedValue = parseFloat(value).toLocaleString('en-US', {
        maximumFractionDigits: 0
    });
    input.value = formattedValue;
}

// Calcular créditos fiscales
function calculateTaxCredits() {
    let filingStatus = document.getElementById('filingStatus').value;
    let numChildren = parseInt(document.getElementById('numChildren').value) || 0;
    let incomeValue = document.getElementById('income').value.replace(/,/g, '');
    let income = parseFloat(incomeValue) || 0;

    let eitc = 0, ctc = 0;

    // Límites de ingresos y montos máximos del EITC para 2025
    const eitcLimits = {
        single: [18591, 49084, 55768, 59899],
        married: [25511, 56004, 62688, 66819]
    };
    const eitcMaxCredits = [649, 4328, 7152, 8046];

    // Determinar el índice basado en el número de hijos (máximo 3)
    let childIndex = Math.min(numChildren, 3);

    // Determinar el límite de ingresos según el estado civil y número de hijos
    let maxIncome = filingStatus === "single" ? eitcLimits.single[childIndex] : eitcLimits.married[childIndex];

    // Calcular el EITC si el ingreso está dentro del límite
    if (income <= maxIncome) {
        let creditRate = numChildren > 0 ? 0.4 : 0.1;
        eitc = income * creditRate;
        if (eitc > eitcMaxCredits[childIndex]) eitc = eitcMaxCredits[childIndex];
    }

    // Límites de ingresos para la eliminación gradual del CTC
    const ctcPhaseOutLimits = {
        single: 200000,
        married: 400000
    };

    // Calcular la eliminación gradual del CTC
    let phaseOutThreshold = filingStatus === "single" ? ctcPhaseOutLimits.single : ctcPhaseOutLimits.married;
    let phaseOut = Math.max(0, Math.ceil((income - phaseOutThreshold) / 1000) * 50);

    // Calcular el CTC
    ctc = Math.max(0, numChildren * 2000 - phaseOut);

    // Formatear los números con comas y dos decimales
    const formatNumber = (num) => {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Mostrar los resultados
    document.getElementById('result').innerHTML = `
        <p><strong>Crédito por Ingreso del Trabajo (EITC):</strong> $${formatNumber(eitc)}</p>
        <p><strong>Crédito Tributario por Hijos (CTC):</strong> $${formatNumber(ctc)}</p>
    `;
}
