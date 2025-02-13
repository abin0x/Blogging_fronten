const API_BASE = 'http://127.0.0.1:8000/api/media';
        let player = null;
        let isPlaying = false;
        let isMuted = false;
        let updateInterval;
        let currentVideoIndex = 0;
        let videoList = [];

        // Extract YouTube video ID from URL
        function extractVideoId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        // Load the YouTube player
        function onYouTubeIframeAPIReady() {
            player = new YT.Player('audioContainer', {
                height: '0',
                width: '0',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady(event) {
            // Check if there's a video to play from localStorage
            const savedVideoId = localStorage.getItem('currentVideoId');
            const savedPlayingState = localStorage.getItem('isPlaying');

            if (savedVideoId && savedPlayingState === 'true') {
                playAudio(savedVideoId);
            }
        }

        function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
                isPlaying = true;
                updateInterval = setInterval(updateProgress, 1000);
                localStorage.setItem('isPlaying', 'true'); // Save playing state
            } else if (event.data === YT.PlayerState.ENDED) {
                playNextVideo(); // Automatically play next video
            } else {
                isPlaying = false;
                clearInterval(updateInterval);
                localStorage.setItem('isPlaying', 'false'); // Save playing state
            }
            updatePlayerControls();
        }

        function updateProgress() {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            const progress = (currentTime / duration) * 100;

            document.getElementById('progress').style.width = `${progress}%`;
            document.getElementById('currentTime').textContent = formatTime(currentTime);
            document.getElementById('duration').textContent = formatTime(duration);
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        function updatePlayerControls() {
            const playPauseIcon = document.getElementById('playPauseIcon');
            playPauseIcon.src = isPlaying ? 'https://img.icons8.com/ios-filled/50/000000/pause--v1.png' : 'https://img.icons8.com/ios-filled/50/000000/play--v1.png';
        }

        document.getElementById('playPauseBtn').addEventListener('click', () => {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        });

        document.getElementById('muteBtn').addEventListener('click', () => {
            isMuted = !isMuted;
            player.setVolume(isMuted ? 0 : 100);
            document.getElementById('volumeIcon').src = isMuted ? 'https://img.icons8.com/ios-filled/50/000000/no-audio.png' : 'https://img.icons8.com/ios-filled/50/000000/medium-volume.png';
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            const volume = e.target.value;
            player.setVolume(volume * 100);
            isMuted = volume === 0;
            document.getElementById('volumeIcon').src = isMuted ? 'https://img.icons8.com/ios-filled/50/000000/no-audio.png' : 'https://img.icons8.com/ios-filled/50/000000/medium-volume.png';
        });

        document.getElementById('progressBar').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const width = rect.width;
            const seekTime = (offsetX / width) * player.getDuration();
            player.seekTo(seekTime, true);
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentVideoIndex > 0) {
                currentVideoIndex--;
                playAudio(videoList[currentVideoIndex].url);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            playNextVideo();
        });

        function playNextVideo() {
            if (currentVideoIndex < videoList.length - 1) {
                currentVideoIndex++;
                playAudio(videoList[currentVideoIndex].url);
            }
        }

        function playAudio(url) {
            const videoId = extractVideoId(url);
            if (!videoId) return alert('Invalid YouTube URL');

            if (player) {
                player.loadVideoById(videoId);
                player.playVideo();
                localStorage.setItem('currentVideoId', videoId); // Save current video ID
                document.getElementById('audioControls').style.display = 'flex'; // Show controls when audio is played
            } else {
                player = new YT.Player('audioContainer', {
                    height: '0',
                    width: '0',
                    videoId: videoId,
                    events: {
                        'onReady': (event) => event.target.playVideo(),
                        'onStateChange': onPlayerStateChange
                    },
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0
                    }
                });
                localStorage.setItem('currentVideoId', videoId); // Save current video ID
                document.getElementById('audioControls').style.display = 'flex'; // Show controls when audio is played
            }
        }

        async function fetchPlaylists() {
            try {
                const response = await fetch(`${API_BASE}/`);
                const playlists = await response.json();
                renderPlaylists(playlists);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        }

        function renderPlaylists(playlists) {
            const container = document.getElementById('playlistContainer');
            container.innerHTML = playlists.map(playlist => 
                `<div class="card" onclick="fetchVideos('${playlist.playlist_id}')">
                    <img src="${playlist.thumbnail}" class="thumbnail" alt="${playlist.title}">
                    <div class="title">${playlist.title}</div>
                </div>`
            ).join('');
        }

        async function fetchVideos(playlistId) {
            try {
                const response = await fetch(`${API_BASE}/${playlistId}/`);
                const data = await response.json();
                videoList = data.videos;
                currentVideoIndex = 0;
                showVideos(videoList);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        }

        function showVideos(videos) {
            document.getElementById('playlistContainer').style.display = 'none';
            document.getElementById('videoContainer').style.display = 'block';

            const container = document.getElementById('videosList');
            container.innerHTML = videos.map(video => 
                `<div class="card">
                    <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}">
                    <div class="title">${video.title}</div>
                    <button class="play-btn" onclick="playAudio('${video.url}')">▶ Play Audio</button>
                </div>`
            ).join('');
        }

        function showPlaylists() {
            document.getElementById('playlistContainer').style.display = 'grid';
            document.getElementById('videoContainer').style.display = 'none';
            // Do not destroy the player, keep it alive
        }

        // Fetch playlists on page load
        fetchPlaylists();