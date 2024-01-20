let glucoseChart;
let isGlucoseReading = true;
let glucoseReadings = [];

let crustrolChart;
let isCrustrolReading = true;
let crustrolReadings = [];

document.addEventListener('DOMContentLoaded', () => {
  startMonitoring('glucose', 'glucoseChart', 'glucoseDiagnosis', 130, 110);
  startMonitoring('crustrol', 'crustrolChart', 'crustrolDiagnosis', 160, 140);
});

function startMonitoring(type, chartId, diagnosisId, highThreshold, lowThreshold) {
  setTimeout(() => {
    simulateMonitoring(type, chartId, diagnosisId, highThreshold, lowThreshold);
  }, 5000);
}

function simulateMonitoring(type, chartId, diagnosisId, highThreshold, lowThreshold) {
  const isReadingVar = `is${type.charAt(0).toUpperCase() + type.slice(1)}Reading`;
  const readingsArray = `${type}Readings`;

  window[isReadingVar] = true;
  let counter = 0;

  const intervalId = setInterval(() => {
    if (window[isReadingVar] && counter < 10) {
      simulateReading(type, chartId, highThreshold, lowThreshold);
      counter++;
    } else {
      clearInterval(intervalId);
      stopReading(type);
      displayDiagnosis(type);
    }
  }, 3000);
}

async function simulateReading(type, chartId, highThreshold, lowThreshold) {
  const newReading = type === 'glucose' ? generateRandomHumanReading() : generateRandomCrustrolSeverity();
  const updateChartFunc = type === 'glucose' ? updateGlucoseChart : updateCrustrolChart;
  const readingsArray = type === 'glucose' ? glucoseReadings : crustrolReadings;

  updateChartFunc(newReading);

  readingsArray.push(newReading); // Always add the reading to the array

  if (newReading.value > highThreshold || newReading.value < lowThreshold) {
    // Additional logic if needed
  }

  // Simulate a delay between readings (adjust the delay time as needed)
  await sleep(1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stopReading(type) {
  window[`is${type.charAt(0).toUpperCase() + type.slice(1)}Reading`] = false;
}

function generateRandomHumanReading() {
  const baseValue = (Math.random() * 5) + 120;
  const fluctuation = baseValue * 0.05; // 5% fluctuation
  const result = baseValue - fluctuation;
  return { value: result.toFixed(2), unit: 'mg/dL' };
}

function generateRandomCrustrolSeverity() {
  const baseValue = (Math.random() * 5) + 150;
  const fluctuation = baseValue * 0.05; // 5% fluctuation
  const result = baseValue - fluctuation;
  return { value: result.toFixed(2), unit: 'mg/dL' };
}

function updateGlucoseChart(newReading) {
  if (!glucoseChart) {
    const ctx = document.getElementById('glucoseChart').getContext('2d');
    glucoseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [{
          label: 'Glucose Levels (mg/dL)',
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          data: Array(10).fill(null),
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 1,
            max: 10,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            suggestedMin: 110,
            suggestedMax: 124,
            maxTicksLimit: 10,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
  }

  const currentData = glucoseChart.data.datasets[0].data;

  if (currentData.length >= 10) {
    currentData.shift();
  }

  currentData.push(parseFloat(newReading.value));

  glucoseChart.update();
}

function updateCrustrolChart(newReading) {
  if (!crustrolChart) {
    const ctx = document.getElementById('crustrolChart').getContext('2d');
    crustrolChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [{
          label: 'Crustrol Severity (mg/dL)',
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(255, 99, 132)',
          data: Array(10).fill(null),
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 1,
            max: 10,
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: false,
            suggestedMin: 140,
            suggestedMax: 154,
            maxTicksLimit: 10,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
  }

  const currentData = crustrolChart.data.datasets[0].data;

  if (currentData.length >= 10) {
    currentData.shift();
  }

  currentData.push(parseFloat(newReading.value));

  crustrolChart.update();
}

function displayDiagnosis(type) {
  const diagnosisElement = document.getElementById(`${type}Diagnosis`);
  diagnosisElement.style.display = 'block';

  const readingsArray = type === 'glucose' ? glucoseReadings : crustrolReadings;

  if (readingsArray.length === 0) {
    diagnosisElement.innerHTML = '<p>No readings available for diagnosis.</p>';
    return;
  }

  const averageReading = parseFloat((readingsArray.reduce((sum, value) => sum + parseFloat(value.value), 0) / readingsArray.length).toFixed(2));

  let totalDiagnosis = `Diagnosis for all ${type} readings: `;

  if (averageReading > (type === 'glucose' ? 124 : 154)) {
    totalDiagnosis += `High ${type} levels detected. `;
  }
  if (averageReading < (type === 'glucose' ? 120 : 150)) {
    totalDiagnosis += `Low ${type} levels detected. `;
  }
  if (averageReading >= (type === 'glucose' ? 120 : 150) && averageReading <= (type === 'glucose' ? 124 : 154)) {
    totalDiagnosis += `All readings are within the specified range. `;
  }

  diagnosisElement.innerHTML = ''; // Clear previous content
  diagnosisElement.innerHTML += `<p>Average ${type} Reading: ${averageReading} mg/dL</p>`;
  diagnosisElement.innerHTML += `<p>${totalDiagnosis}</p>`;
}
