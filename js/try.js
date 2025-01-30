document.addEventListener("DOMContentLoaded", () => {
    fetch('http://127.0.0.1:8000/api/media/')
        .then(response => response.json())
        .then(data => {
            displayMediaCards(data);
        })
        .catch(error => console.error("Error fetching media:", error));

    function displayMediaCards(mediaData) {
        const container = document.getElementById("media-cards-container");

        mediaData.forEach(media => {
            const card = document.createElement("div");
            card.classList.add("media-card");

            card.innerHTML = `
                <img src="${media.thumbnail}" alt="${media.title}">
                <p>${media.title}</p>
            `;

            card.addEventListener("click", () => {
                fetchPlaylistVideos(media.playlist_id);
            });

            container.appendChild(card);
        });
    }

    function fetchPlaylistVideos(playlistId) {
        fetch(`http://127.0.0.1:8000/api/media/${playlistId}/`)
            .then(response => response.json())
            .then(data => {
                showModal(data);
            })
            .catch(error => console.error("Error fetching playlist videos:", error));
    }

    function showModal(media) {
        const modal = document.getElementById("video-modal");
        const playlistTitle = document.getElementById("playlist-title");
        const playlistVideosContainer = document.getElementById("playlist-videos");

        playlistTitle.textContent = media.title;
        playlistVideosContainer.innerHTML = '';

        media.videos.forEach(video => {
            const videoDiv = document.createElement("div");
            videoDiv.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <p>${video.title}</p>
            `;
            videoDiv.addEventListener("click", () => playVideo(video));
            playlistVideosContainer.appendChild(videoDiv);
        });

        modal.style.display = "flex";
    }

    function playVideo(video) {
        const audioPlayer = document.getElementById("audio-player");
        const audioSource = document.getElementById("audio-source");

        audioSource.src = video.url; // YouTube video URL
        audioPlayer.load();
        audioPlayer.play();
    }

    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("video-modal").style.display = "none";
    });
});
