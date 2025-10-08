/**
 * Playlist class implements a circular doubly linked list to manage songs.
 * It provides operations to add, delete, navigate, and display songs.
 */
public class Playlist {
    private Song head = null;
    private Song current = null;

    /**
     * Add a new song to the end of the playlist
     * 
     * @param title  The title of the song
     * @param artist The artist of the song
     */
    public void addSong(String title, String artist) {
        Song newSong = new Song(title, artist);
        if (head == null) {
            // First song in the playlist
            head = newSong;
            head.next = head;
            head.prev = head;
            current = head;
        } else {
            // Add to the end of the playlist
            Song tail = head.prev;
            tail.next = newSong;
            newSong.prev = tail;
            newSong.next = head;
            head.prev = newSong;
        }
        System.out.println(title + " added to playlist.");
    }

    /**
     * Delete a song from the playlist by title
     * 
     * @param title The title of the song to delete
     */
    public void deleteSong(String title) {
        if (head == null) {
            System.out.println("Playlist is empty.");
            return;
        }

        Song temp = head;
        do {
            if (temp.title.equals(title)) {
                // If only one song in playlist
                if (temp.next == temp) {
                    head = null;
                    current = null;
                    System.out.println(title + " removed from playlist.");
                    return;
                }
                
                // If deleting head, update head
                if (temp == head) {
                    head = head.next;
                }
                
                // Update current if deleting current song
                if (current == temp) {
                    current = temp.next;
                }
                
                // Remove from the list
                temp.prev.next = temp.next;
                temp.next.prev = temp.prev;
                
                System.out.println(title + " removed from playlist.");
                return;
            }
            temp = temp.next;
        } while (temp != head);
        
        System.out.println(title + " not found in playlist.");
    }

    /**
     * Play the current song
     */
    public void playCurrent() {
        if (current != null) {
            System.out.println("Playing: " + current.title + " by " + current.artist);
        } else {
            System.out.println("Playlist is empty.");
        }
    }

    /**
     * Move to the next song in the playlist
     */
    public void nextSong() {
        if (current != null) {
            current = current.next;
            playCurrent();
        } else {
            System.out.println("Playlist is empty.");
        }
    }

    /**
     * Move to the previous song in the playlist
     */
    public void prevSong() {
        if (current != null) {
            current = current.prev;
            playCurrent();
        } else {
            System.out.println("Playlist is empty.");
        }
    }

    /**
     * Display all songs in the playlist
     */
    public void displayPlaylist() {
        if (head == null) {
            System.out.println("Playlist is empty.");
            return;
        }
        
        Song temp = head;
        System.out.println("🎵 Playlist:");
        int count = 1;
        do {
            String currentMarker = (temp == current) ? " ▶️ " : "";
            System.out.println(count + ". " + temp.title + " by " + temp.artist + currentMarker);
            temp = temp.next;
            count++;
        } while (temp != head);
    }
}