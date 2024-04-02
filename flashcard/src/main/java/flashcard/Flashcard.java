package flashcard;
// importing my dependency and file handler
import org.apache.commons.cli.*;
import java.io.File;


public class Flashcard {
    public static void main(String[] args) {
        System.out.println()
        FlashcardGame flashcardGame = new FlashcardGame();
        Options options = createOptions();
        CommandLineParser parser = new DefaultParser();
        try {
            CommandLine cmd = parser.parse(options, args);
            if (cmd.hasOption("help") || args.length == 0) {
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("flashcard <card-file> [options]", options);
                System.exit(0);
            }
            String[] remainingArgs = cmd.getArgs();
            if (remainingArgs.length != 1) {
                System.err.println("Invalid usage. Please provide a card file.");
                System.exit(1);
            }

            String order = cmd.getOptionValue("order", "random");
            if (!order.equals("random") && !order.equals("worst-first") && !order.equals("recent-mistakes-first")) {
                System.err.println("Invalid value for option --order. Valid choices are: random, worst-first, recent-mistakes-first");
                System.exit(1);
            }

            int repetitions = -1;
            String repetitionsValue = cmd.getOptionValue("repetitions");
            if (repetitionsValue != null) {
                try {
                    repetitions = Integer.parseInt(repetitionsValue);
                    if (repetitions <= 0) {
                        throw new NumberFormatException();
                    }
                } catch (NumberFormatException error) {
                    System.err.println("Invalid value for option --repetitions. Please provide a positive integer.");
                    System.exit(1);
                }
            }

            boolean invertCards = cmd.hasOption("invertCars");

        } catch (ParseException error) {
            System.err.println("Error parsing command-line arguments: " + error.getMessage());
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
        options.addOption("invertCars", false, "If set, it flips answer and question for each card. That is, it prompts with the card's answer and the user provide the corresponding question. [Default: false]");
        return options;
    }
}
