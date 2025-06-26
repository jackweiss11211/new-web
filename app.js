function processSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchLoading = document.getElementById('searchLoading');
    const searchSuccess = document.getElementById('searchSuccess');
    const searchError = document.getElementById('searchError');

    if (!searchInput.value.trim()) {
        showError(searchError, 'Please enter a search query');
        return;
    }

    showLoading(searchLoading);
    hideElements(searchSuccess, searchError);

    fetch('/api/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchInput.value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'search-results.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showSuccess(searchSuccess);
    })
    .catch(error => {
        showError(searchError, 'Error processing search');
        console.error('Error:', error);
    })
    .finally(() => {
        hideLoading(searchLoading);
    });
}

function processUrl() {
    const urlInput = document.getElementById('urlInput');
    const urlLoading = document.getElementById('urlLoading');
    const urlSuccess = document.getElementById('urlSuccess');
    const urlError = document.getElementById('urlError');

    if (!urlInput.value.trim()) {
        showError(urlError, 'Please enter a URL');
        return;
    }

    showLoading(urlLoading);
    hideElements(urlSuccess, urlError);

    fetch('/api/capture-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput.value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'page-capture.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showSuccess(urlSuccess);
    })
    .catch(error => {
        showError(urlError, 'Error capturing URL');
        console.error('Error:', error);
    })
    .finally(() => {
        hideLoading(urlLoading);
    });
}

function processVideo() {
    const videoInput = document.getElementById('videoInput');
    const videoLoading = document.getElementById('videoLoading');
    const videoSuccess = document.getElementById('videoSuccess');
    const videoError = document.getElementById('videoError');

    if (!videoInput.value.trim()) {
        showError(videoError, 'Please enter a video URL');
        return;
    }

    showLoading(videoLoading);
    hideElements(videoSuccess, videoError);

    fetch('/api/download-video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoInput.value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'video.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showSuccess(videoSuccess);
    })
    .catch(error => {
        showError(videoError, 'Error downloading video');
        console.error('Error:', error);
    })
    .finally(() => {
        hideLoading(videoLoading);
    });
}

function showLoading(element) {
    element.style.display = 'block';
}

function hideLoading(element) {
    element.style.display = 'none';
}

function showSuccess(element) {
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

function showError(element, message) {
    element.style.display = 'block';
    element.textContent = message;
    setTimeout(() => element.style.display = 'none', 3000);
}

function hideElements(...elements) {
    elements.forEach(element => element.style.display = 'none');
}
