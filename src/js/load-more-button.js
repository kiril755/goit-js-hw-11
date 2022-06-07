function showLoader(ref) {
  ref.classList.remove('hidden');
}

function hideLoader(ref) {
  ref.classList.add('hidden');
}

export { showLoader, hideLoader };
