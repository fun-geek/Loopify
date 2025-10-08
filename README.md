# Loopify - Music Playlist Manager

A Java application that demonstrates the use of a Circular Doubly Linked List data structure to manage a music playlist.

## Features

- **Add Song**: Insert a new song at the end of the playlist
- **Delete Song**: Remove a song by title
- **Next Song**: Move to the next song in the playlist
- **Previous Song**: Move to the previous song in the playlist
- **Display Playlist**: Show all songs currently in the playlist
- **Play Current Song**: Show the song where the pointer is currently at
- **Repeat Mode**: Since it's a circular linked list, the playlist loops forever

## Data Structure

This project uses a **Circular Doubly Linked List** where:
- Each song is a node containing title, artist, and references to next and previous songs
- The playlist maintains a head pointer to the first song and a current pointer to the song being played

## How to Run

1. Compile the Java files:
   ```
   javac Song.java Playlist.java MusicPlaylistManager.java
   ```

2. Run the application:
   ```
   java MusicPlaylistManager
   ```

3. Follow the on-screen menu to interact with the playlist

## Implementation Details

- **Song.java**: Defines the node structure for the circular linked list
- **Playlist.java**: Implements the circular linked list operations
- **MusicPlaylistManager.java**: Provides the user interface and demo functionality

## Sample Usage

The application comes pre-loaded with three songs:
- "Shape of You" by Ed Sheeran
- "Blinding Lights" by The Weeknd
- "Perfect" by Ed Sheeran

You can add your own songs, navigate through the playlist, and manage your music collection using the interactive menu.