document.addEventListener('DOMContentLoaded', function() {
  // 승률 점수 차트
  var winRateChart = new Chart(document.getElementById('winRateChart'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [60, 40], // 승률 점수와 나머지 비율 (임의의 값)
        backgroundColor: ['#3f51b5', '#f2f2f2'],
        borderWidth: 0
      }]
    },
    options: {
      cutoutPercentage: 80,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        title: {
          display: true,
          text: '승률',
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#000',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      }
    }
  });

  // 매너 점수 차트
  var mannerChart = new Chart(document.getElementById('mannerChart'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100], // 매너 점수와 나머지 비율 (임의의 값)
        backgroundColor: ['#3f51b5', '#f2f2f2'],
        borderWidth: 0
      }]
    },
    options: {
      cutoutPercentage: 80,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        title: {
          display: true,
          text: '매너 점수',
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#000',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      }
    }
  });
});