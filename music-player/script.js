        // Global variables
        let currentAudio = document.getElementById('audioPlayer');
        let currentSongIndex = 0;
        let playlist = [];
        let isPlaying = false;
        let autoplay = false;
        let searchTimeout;

        // Initialize player
        function init() {
            currentAudio.addEventListener('timeupdate', updateProgress);
            currentAudio.addEventListener('loadedmetadata', updateDuration);
            currentAudio.addEventListener('ended', onSongEnd);
            
            // Auto-search on input
            document.getElementById('searchInput').addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (this.value.length > 2) {
                        searchMusic();
                    }
                }, 500);
            });

            // Enter key search
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchMusic();
                }
            });
        }

        // Search music using iTunes API
        async function searchMusic() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) return;

            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '<div class="loading">Searching...</div>';

            try {
                const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=20`);
                const data = await response.json();

                displaySearchResults(data.results.filter(item => item.kind === 'song'));
            } catch (error) {
                searchResults.innerHTML = '<div class="loading">Error searching. Please try again.</div>';
                console.error('Search error:', error);
            }
        }

        // Display search results
        function displaySearchResults(results) {
            const searchResults = document.getElementById('searchResults');
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="loading">No results found</div>';
                return;
            }

            searchResults.innerHTML = results.map(song => `
                <div class="search-item" onclick="addToPlaylist('${song.trackId}', '${escapeHtml(song.trackName)}', '${escapeHtml(song.artistName)}', '${song.artworkUrl100}', '${song.previewUrl}', ${song.trackTimeMillis})">
                    <img src="${song.artworkUrl60}" alt="Album Art" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ddd%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22>♪</text></svg>'">
                    <div class="search-item-info">
                        <div class="search-item-title">${song.trackName}</div>
                        <div class="search-item-artist">${song.artistName}</div>
                    </div>
                </div>
            `).join('');
        }

        // Add song to playlist
        function addToPlaylist(trackId, title, artist, artwork, previewUrl, duration) {
            if (!previewUrl) {
                alert('Preview not available for this song');
                return;
            }

            const song = {
                id: trackId,
                title: title,
                artist: artist,
                artwork: artwork,
                url: previewUrl,
                duration: duration
            };

            // Check if song already exists in playlist
            if (!playlist.find(s => s.id === trackId)) {
                playlist.push(song);
                updatePlaylistDisplay();
                
                // If this is the first song, load it
                if (playlist.length === 1) {
                    currentSongIndex = 0;
                    loadSong(0);
                }
            }

            // Clear search results
            document.getElementById('searchResults').innerHTML = '';
            document.getElementById('searchInput').value = '';
        }

        // Update playlist display
        function updatePlaylistDisplay() {
            const container = document.getElementById('playlistContainer');
            
            if (playlist.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">Search and add songs to build your playlist</div>';
                return;
            }

            container.innerHTML = playlist.map((song, index) => `
                <div class="playlist-item ${index === currentSongIndex ? 'active' : ''}" onclick="loadSong(${index})">
                    <img src="${song.artwork}" alt="Album Art" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ddd%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23999%22>♪</text></svg>'">
                    <div class="playlist-item-info">
                        <div class="playlist-item-title">${song.title}</div>
                        <div class="playlist-item-artist">${song.artist}</div>
                    </div>
                </div>
            `).join('');
        }

        // Load song
        function loadSong(index) {
            if (index < 0 || index >= playlist.length) return;
            
            currentSongIndex = index;
            const song = playlist[index];
            
            currentAudio.src = song.url;
            document.getElementById('songTitle').textContent = song.title;
            document.getElementById('songArtist').textContent = song.artist;
            
            const albumArt = document.getElementById('albumArt');
            albumArt.innerHTML = `<img src="${song.artwork}" alt="Album Art" onerror="this.innerHTML='🎵'">`;
            
            updatePlaylistDisplay();
            
            if (isPlaying) {
                playAudio();
            }
        }

        // Toggle play/pause
        function togglePlay() {
            if (playlist.length === 0) {
                alert('Please add songs to your playlist first');
                return;
            }

            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        }

        // Play audio
        function playAudio() {
            currentAudio.play().then(() => {
                isPlaying = true;
                document.getElementById('playBtn').innerHTML = '⏸';
            }).catch(error => {
                console.error('Play failed:', error);
                alert('Failed to play audio. This might be due to browser restrictions.');
            });
        }

        // Pause audio
        function pauseAudio() {
            currentAudio.pause();
            isPlaying = false;
            document.getElementById('playBtn').innerHTML = '▶';
        }

        // Previous song
        function previousSong() {
            if (playlist.length === 0) return;
            
            const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : playlist.length - 1;
            loadSong(newIndex);
            
            if (isPlaying) {
                playAudio();
            }
        }

        // Next song
        function nextSong() {
            if (playlist.length === 0) return;
            
            const newIndex = currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0;
            loadSong(newIndex);
            
            if (isPlaying) {
                playAudio();
            }
        }

        // Update progress
        function updateProgress() {
            if (currentAudio.duration) {
                const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
                document.getElementById('progress').style.width = progressPercent + '%';
                document.getElementById('currentTime').textContent = formatTime(currentAudio.currentTime);
            }
        }

        // Update duration
        function updateDuration() {
            document.getElementById('duration').textContent = formatTime(currentAudio.duration);
        }

        // Set progress
        function setProgress(e) {
            const progressBar = document.getElementById('progressBar');
            const clickX = e.offsetX;
            const width = progressBar.offsetWidth;
            const newTime = (clickX / width) * currentAudio.duration;
            
            if (isFinite(newTime)) {
                currentAudio.currentTime = newTime;
            }
        }

        // Set volume
        function setVolume(volume) {
            currentAudio.volume = volume / 100;
            document.getElementById('volumeValue').textContent = volume + '%';
        }

        // Toggle autoplay
        function toggleAutoplay() {
            autoplay = !autoplay;
            const toggle = document.getElementById('autoplayToggle');
            toggle.classList.toggle('active', autoplay);
        }

        // On song end
        function onSongEnd() {
            if (autoplay && playlist.length > 1) {
                nextSong();
            } else {
                isPlaying = false;
                document.getElementById('playBtn').innerHTML = '▶';
            }
        }

        // Format time
        function formatTime(seconds) {
            if (!isFinite(seconds)) return '0:00';
            
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', init);
