let glucoseChart;
let isGlucoseReading = true;
let glucoseReadings = [];

let crustrolChart;
let isCrustrolReading = true;
let crustrolReadings = [];

document.addEventListener('DOMContentLoaded', () => {
  startMonitoring('glucose', 'glucoseChart', 'glucoseDiagnosis', 150, 70);
  startMonitoring('crustrol', 'crustrolChart', 'crustrolDiagnosis', 7, 3);
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

function simulateReading(type, chartId, highThreshold, lowThreshold) {
  const newReading = type === 'glucose' ? generateRandomHumanReading() : generateRandomCrustrolSeverity();
  const updateChartFunc = type === 'glucose' ? updateGlucoseChart : updateCrustrolChart;
  const readingsArray = type === 'glucose' ? glucoseReadings : crustrolReadings;

  updateChartFunc(newReading);

  if (newReading > highThreshold || newReading < lowThreshold) {
    readingsArray.push(newReading);
  }
}

function stopReading(type) {
  window[`is${type.charAt(0).toUpperCase() + type.slice(1)}Reading`] = false;
}

function generateRandomHumanReading() {
  const baseValue = 85;
  const fluctuation = Math.random() * 10 - 5;
  return Math.round(baseValue + fluctuation);
}

function generateRandomCrustrolSeverity() {
  return Math.round(Math.random() * 9 + 1);
}

function updateGlucoseChart(newReading) {
  if (!glucoseChart) {
    const ctx = document.getElementById('glucoseChart').getContext('2d');
    glucoseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [{
          label: 'Glucose Levels',
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
            suggestedMin: 0,
            suggestedMax: 150,
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

  currentData.push(newReading);

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
          label: 'Crustrol Severity',
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
            suggestedMin: 1,
            suggestedMax: 10,
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

  currentData.push(newReading);

  crustrolChart.update();
}

function displayDiagnosis(type) {
  const diagnosisElement = document.getElementById(`${type}Diagnosis`);
  diagnosisElement.style.display = 'block';

  const readingsArray = type === 'glucose' ? glucoseReadings : crustrolReadings;
  const minReading = Math.min(...readingsArray);
  const maxReading = Math.max(...readingsArray);

  const normalRange = type === 'glucose' ? 'Normal Range: 70 - 150' : 'Normal Range: 3 - 7';
  let totalDiagnosis = `Diagnosis for all ${type} readings: `;

  if (maxReading > (type === 'glucose' ? 150 : 7)) {
    totalDiagnosis += `High ${type} levels detected. `;
  }
  if (minReading < (type === 'glucose' ? 70 : 3)) {
    totalDiagnosis += `Low ${type} levels detected. `;
  }
  if (minReading >= (type === 'glucose' ? 70 : 3) && maxReading <= (type === 'glucose' ? 150 : 7)) {
    totalDiagnosis += `All readings are within the normal range. `;
  }

  diagnosisElement.innerHTML = ''; // Clear previous content
  diagnosisElement.innerHTML += `<p>${normalRange}</p>`;
  diagnosisElement.innerHTML += `<p>Lowest ${type} Reading: ${minReading}</p>`;
  diagnosisElement.innerHTML += `<p>Highest ${type} Reading: ${maxReading}</p>`;
  diagnosisElement.innerHTML += `<p>${totalDiagnosis}</p>`;
}