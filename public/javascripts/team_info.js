document.addEventListener('DOMContentLoaded', function() {
  // 승률 점수 차트
  var winRateChart = new Chart(document.getElementById('winRateChart'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [win_score, 100-win_score], // 승률 점수와 나머지 비율 (임의의 값)
        backgroundColor: ['#3B6E0E', '#CCCCCC'],
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
        data: [manner_score, 100-manner_score], // db에서 받아온 manner_score과 나머지 비율
        backgroundColor: ['#3B6E0E', '#CCCCCC'],
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