import java.util.Scanner;

/**
 * MusicPlaylistManager is the main class that provides a user interface
 * for interacting with the music playlist.
 */
public class MusicPlaylistManager {
    private static Scanner scanner = new Scanner(System.in);
    private static Playlist playlist = new Playlist();

    public static void main(String[] args) {
        System.out.println("🎵 Welcome to Loopify - Music Playlist Manager 🎵");
        
        // Add some demo songs
        playlist.addSong("Shape of You", "Ed Sheeran");
        playlist.addSong("Blinding Lights", "The Weeknd");
        playlist.addSong("Perfect", "Ed Sheeran");
        
        boolean running = true;
        while (running) {
            displayMenu();
            int choice = getUserChoice();
            
            switch (choice) {
                case 1:
                    addSong();
                    break;
                case 2:
                    deleteSong();
                    break;
                case 3:
                    playlist.nextSong();
                    break;
                case 4:
                    playlist.prevSong();
                    break;
                case 5:
                    playlist.displayPlaylist();
                    break;
                case 6:
                    playlist.playCurrent();
                    break;
                case 7:
                    running = false;
                    System.out.println("Thank you for using Loopify! Goodbye!");
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
        scanner.close();
    }
    
    /**
     * Display the menu options
     */
    private static void displayMenu() {
        System.out.println("\n===== LOOPIFY MENU =====");
        System.out.println("1. Add Song");
        System.out.println("2. Delete Song");
        System.out.println("3. Next Song");
        System.out.println("4. Previous Song");
        System.out.println("5. Display Playlist");
        System.out.println("6. Play Current Song");
        System.out.println("7. Exit");
        System.out.print("Enter your choice (1-7): ");
    }
    
    /**
     * Get user choice from input
     * 
     * @return The user's menu choice
     */
    private static int getUserChoice() {
        try {
            return Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            return -1; // Invalid input
        }
    }
    
    /**
     * Add a new song to the playlist
     */
    private static void addSong() {
        System.out.print("Enter song title: ");
        String title = scanner.nextLine();
        System.out.print("Enter artist name: ");
        String artist = scanner.nextLine();
        
        playlist.addSong(title, artist);
    }
    
    /**
     * Delete a song from the playlist
     */
    private static void deleteSong() {
        System.out.print("Enter song title to delete: ");
        String title = scanner.nextLine();
        
        playlist.deleteSong(title);
    }
}