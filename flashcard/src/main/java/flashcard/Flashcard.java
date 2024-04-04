package flashcard;

import org.apache.commons.cli.*;

import java.util.List;

public class Flashcard {
    public static void main(String[] args) {
        // Checking if the file path is provided
        if (args.length < 1) {
            System.out.println("Please provide the path to the flashcard questions");
            System.exit(1);
        }
    
        // Get the path of the flashcard question from the command line
        String flashcardFilePath = args[0];
    
        // Create an instance of FlashcardGame
        FlashcardGame flashcardGame = new FlashcardGame();
    
        // Read flashcard questions and answers from the file
        @SuppressWarnings("static-access")
        List<String> flashcardQuestionsAndAnswers = flashcardGame.readQuestionsAndAnswersFromFile(flashcardFilePath);
    
        // Print welcome message to the user
        System.out.println("Welcome to flashcard game, your questions are from " + flashcardFilePath);
    
        // Parse command line options
        Options options = createOptions();
        CommandLineParser parser = new DefaultParser();
        try {
            CommandLine cmd = parser.parse(options, args);
            String order = cmd.getOptionValue("order", "random");
            int repetitions = Integer.parseInt(cmd.getOptionValue("repetitions", "-1"));
            boolean invertCards = cmd.hasOption("invertCards");
    
            // Start the game with provided options
            flashcardGame.startGame(flashcardQuestionsAndAnswers, order, repetitions, invertCards);
        } catch (ParseException | NumberFormatException error) {
            System.err.println("Error: " + error.getMessage());
            System.exit(1);
        }
    }

    private static Options createOptions() {
        Options options = new Options();
        options.addOption("help", false, "show this help");
        options.addOption(Option.builder()
                .longOpt("order")
                .hasArg()
                .argName("order")
                .desc("the type of order to use, default \"random\" [choices: \"random\", \"worst-first\", \"recent-mistakes-first\"]")
                .build());
        options.addOption(Option.builder()
                .longOpt("repetitions")
                .hasArg()
                .argName("num")
                .desc("the number of times each card should be answered successfully. If not provided, every card is presented once, regardless of the correctness of the answer.")
                .build());
        options.addOption("invertCards", false, "If set, it flips answer and question for each card. That is, it prompts with the card's answer and the user provide the corresponding question. [Default: false]");
        return options;
    }
}
