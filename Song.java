/**
 * Song class represents a node in the circular linked list.
 * Each song contains title, artist, and references to next and previous songs.
 */
public class Song {
    String title;
    String artist;
    Song next;
    Song prev;

    /**
     * Constructor to create a new Song
     * 
     * @param title  The title of the song
     * @param artist The artist of the song
     */
    public Song(String title, String artist) {
        this.title = title;
        this.artist = artist;
        this.next = null;
        this.prev = null;
    }
}