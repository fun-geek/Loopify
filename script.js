// Music Playlist Manager - JavaScript Implementation
class MusicPlaylistManager {
    constructor() {
        this.playlist = [];
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.originalPlaylist = [];
        
        // Initialize with demo songs
        this.initializeDemoSongs();
        this.initializeEventListeners();
        this.updateCurrentSong();
        this.renderPlaylist();
        this.startBackgroundAnimations();
    }

    // Initialize demo songs
    initializeDemoSongs() {
        const demoSongs = [
            { title: "Shape of You", artist: "Ed Sheeran" },
            { title: "Blinding Lights", artist: "The Weeknd" },
            { title: "Perfect", artist: "Ed Sheeran" },
            { title: "Watermelon Sugar", artist: "Harry Styles" },
            { title: "Levitating", artist: "Dua Lipa" }
        ];
        
        demoSongs.forEach(song => this.addSong(song.title, song.artist, false));
        this.originalPlaylist = [...this.playlist];
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Control buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSong());
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSong());
        document.getElementById('shuffleBtn').addEventListener('click', () => this.toggleShuffle());

        // Add song functionality
        document.getElementById('addSongBtn').addEventListener('click', () => this.showAddSongModal());
        document.getElementById('closeModal').addEventListener('click', () => this.hideAddSongModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideAddSongModal());
        document.getElementById('addBtn').addEventListener('click', () => this.handleAddSong());

        // Modal background click to close
        document.getElementById('addSongModal').addEventListener('click', (e) => {
            if (e.target.id === 'addSongModal') {
                this.hideAddSongModal();
            }
        });

        // Form submission
        document.getElementById('addSongForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSong();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return; // Don't trigger when typing in inputs
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSong();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSong();
                    break;
                case 'KeyS':
                    e.preventDefault();
                    this.toggleShuffle();
                    break;
            }
        });
    }

    // Add a new song to the playlist
    addSong(title, artist, shouldRender = true) {
        if (!title || !artist) {
            this.showNotification('Please enter both song title and artist', 'error');
            return false;
        }

        const song = {
            id: Date.now() + Math.random(),
            title: title.trim(),
            artist: artist.trim()
        };

        this.playlist.push(song);
        
        if (shouldRender) {
            this.renderPlaylist();
            this.showNotification(`Added "${title}" by ${artist}`, 'success');
        }
        
        return true;
    }

    // Remove a song from the playlist
    removeSong(songId) {
        const songIndex = this.playlist.findIndex(song => song.id === songId);
        if (songIndex === -1) return;

        const removedSong = this.playlist[songIndex];
        this.playlist.splice(songIndex, 1);

        // Adjust current song index if necessary
        if (songIndex < this.currentSongIndex) {
            this.currentSongIndex--;
        } else if (songIndex === this.currentSongIndex) {
            if (this.currentSongIndex >= this.playlist.length) {
                this.currentSongIndex = 0;
            }
            this.updateCurrentSong();
        }

        this.renderPlaylist();
        this.showNotification(`Removed "${removedSong.title}"`, 'info');
    }

    // Play a specific song
    playSong(songId) {
        const songIndex = this.playlist.findIndex(song => song.id === songId);
        if (songIndex !== -1) {
            this.currentSongIndex = songIndex;
            this.isPlaying = true;
            this.updateCurrentSong();
            this.renderPlaylist();
            this.updatePlayButton();
        }
    }

    // Toggle play/pause
    togglePlay() {
        if (this.playlist.length === 0) {
            this.showNotification('No songs in playlist', 'error');
            return;
        }

        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
        this.updateVinylAnimation();
        
        const action = this.isPlaying ? 'Playing' : 'Paused';
        const currentSong = this.playlist[this.currentSongIndex];
        this.showNotification(`${action}: ${currentSong.title}`, 'info');
    }

    // Next song
    nextSong() {
        if (this.playlist.length === 0) return;

        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.updateCurrentSong();
        this.renderPlaylist();
        
        if (this.isPlaying) {
            const currentSong = this.playlist[this.currentSongIndex];
            this.showNotification(`Now playing: ${currentSong.title}`, 'info');
        }
    }

    // Previous song
    previousSong() {
        if (this.playlist.length === 0) return;

        this.currentSongIndex = this.currentSongIndex === 0 ? 
            this.playlist.length - 1 : this.currentSongIndex - 1;
        this.updateCurrentSong();
        this.renderPlaylist();
        
        if (this.isPlaying) {
            const currentSong = this.playlist[this.currentSongIndex];
            this.showNotification(`Now playing: ${currentSong.title}`, 'info');
        }
    }

    // Toggle shuffle mode
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('shuffleBtn');
        
        if (this.isShuffled) {
            shuffleBtn.style.color = '#ec4899';
            shuffleBtn.style.background = 'rgba(236, 72, 153, 0.2)';
            this.shufflePlaylist();
            this.showNotification('Shuffle enabled', 'info');
        } else {
            shuffleBtn.style.color = '';
            shuffleBtn.style.background = '';
            this.restoreOriginalOrder();
            this.showNotification('Shuffle disabled', 'info');
        }
    }

    // Shuffle the playlist
    shufflePlaylist() {
        const currentSong = this.playlist[this.currentSongIndex];
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        
        // Find the new index of the current song
        this.currentSongIndex = this.playlist.findIndex(song => song.id === currentSong.id);
        this.renderPlaylist();
    }

    // Restore original playlist order
    restoreOriginalOrder() {
        const currentSong = this.playlist[this.currentSongIndex];
        this.playlist = [...this.originalPlaylist];
        this.currentSongIndex = this.playlist.findIndex(song => song.id === currentSong.id);
        this.renderPlaylist();
    }

    // Update current song display
    updateCurrentSong() {
        if (this.playlist.length === 0) {
            document.getElementById('currentTitle').textContent = 'No Song Selected';
            document.getElementById('currentArtist').textContent = 'Add songs to your playlist';
            return;
        }

        const currentSong = this.playlist[this.currentSongIndex];
        document.getElementById('currentTitle').textContent = currentSong.title;
        document.getElementById('currentArtist').textContent = currentSong.artist;
    }

    // Update play button appearance
    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    // Update vinyl record animation
    updateVinylAnimation() {
        const record = document.querySelector('.record');
        if (this.isPlaying) {
            record.style.animationPlayState = 'running';
        } else {
            record.style.animationPlayState = 'paused';
        }
    }

    // Render the playlist
    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist');
        playlistContainer.innerHTML = '';

        if (this.playlist.length === 0) {
            playlistContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-music" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <p>Your playlist is empty</p>
                    <p>Add some songs to get started!</p>
                </div>
            `;
            return;
        }

        this.playlist.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = `song-item ${index === this.currentSongIndex ? 'active' : ''}`;
            songElement.style.animationDelay = `${index * 0.1}s`;
            
            songElement.innerHTML = `
                <div class="song-details">
                    <div class="song-title">${this.escapeHtml(song.title)}</div>
                    <div class="song-artist">${this.escapeHtml(song.artist)}</div>
                </div>
                <div class="song-actions">
                    <button class="action-btn" onclick="musicPlayer.playSong('${song.id}')" title="Play">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="action-btn" onclick="musicPlayer.removeSong('${song.id}')" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            playlistContainer.appendChild(songElement);
        });
    }

    // Show add song modal
    showAddSongModal() {
        const modal = document.getElementById('addSongModal');
        modal.classList.add('show');
        document.getElementById('songTitle').focus();
    }

    // Hide add song modal
    hideAddSongModal() {
        const modal = document.getElementById('addSongModal');
        modal.classList.remove('show');
        document.getElementById('addSongForm').reset();
    }

    // Handle adding a new song
    handleAddSong() {
        const title = document.getElementById('songTitle').value;
        const artist = document.getElementById('songArtist').value;
        
        if (this.addSong(title, artist)) {
            this.hideAddSongModal();
            // Update original playlist if not shuffled
            if (!this.isShuffled) {
                this.originalPlaylist = [...this.playlist];
            }
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 15px 20px;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            box-shadow: var(--shadow-glow);
        `;

        // Add type-specific styling
        if (type === 'success') {
            notification.style.borderColor = '#10b981';
        } else if (type === 'error') {
            notification.style.borderColor = '#ef4444';
        } else if (type === 'info') {
            notification.style.borderColor = 'var(--primary-color)';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Start background animations
    startBackgroundAnimations() {
        // Create animated background waves
        const backgroundAnimation = document.createElement('div');
        backgroundAnimation.className = 'background-animation';
        backgroundAnimation.innerHTML = `
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
        `;
        document.body.appendChild(backgroundAnimation);

        // Simulate progress bar animation
        this.animateProgressBar();
    }

    // Animate progress bar
    animateProgressBar() {
        const progressBar = document.querySelector('.progress');
        let progress = 0;
        
        setInterval(() => {
            if (this.isPlaying) {
                progress += 0.5;
                if (progress > 100) progress = 0;
                progressBar.style.width = `${progress}%`;
            }
        }, 100);
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the music player when the page loads
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlaylistManager();
    
    // Add some visual feedback for loading
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard shortcut information
document.addEventListener('DOMContentLoaded', () => {
    const shortcutInfo = document.createElement('div');
    shortcutInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        padding: 15px;
        color: var(--text-secondary);
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    `;
    
    shortcutInfo.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">Keyboard Shortcuts:</div>
        <div>Space - Play/Pause</div>
        <div>← → - Previous/Next</div>
        <div>S - Shuffle</div>
    `;
    
    shortcutInfo.addEventListener('mouseenter', () => {
        shortcutInfo.style.opacity = '1';
    });
    
    shortcutInfo.addEventListener('mouseleave', () => {
        shortcutInfo.style.opacity = '0.7';
    });
    
    document.body.appendChild(shortcutInfo);
});
