document.addEventListener('DOMContentLoaded', function () {
  const modalButtons = document.querySelectorAll('[data-modal-id]');
  const modalCloses = document.querySelectorAll('[id^="modal_close_"]');
  const blackBgs = document.querySelectorAll('[id^="black_bg_"]');
  modalButtons.forEach(button => {
    const modalId = button.getAttribute('data-modal-id');
    button.addEventListener('click', () => {
      document.getElementById(`modal_${modalId}`).style.display = 'block';
      document.getElementById(`black_bg_${modalId}`).style.display = 'block';
    });
  });
  modalCloses.forEach(close => {
    const modalId = close.id.split('_')[2];
    close.addEventListener('click', () => {
      document.getElementById(`modal_${modalId}`).style.display = 'none';
      document.getElementById(`black_bg_${modalId}`).style.display = 'none';
    });
  });
});