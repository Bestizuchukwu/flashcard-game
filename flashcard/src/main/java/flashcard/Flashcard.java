package flashcard;
// importing my dependency and file handler
import org.apache.commons.cli.*;
import java.io.File;



public class Flashcard 
{
    public static void main( String[] args )
    {

        FlashcardGame flashcardGame = new FlashcardGame();
        // creating an instance of the Options in the apache commons
        Options options = createOptions();
        CommandLIneParser parser = new DefaultParser();
        try {
            // checking for the help option or if there is no option giving at all and handling necessary errors
            CommandLine cmd = parser.parse(options, args);
            if (cmd.hasOption("help") || args.length == 0){
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("flashcard <card-file> [options]", options);
                System.exit(0);
            }
            // checking for the remaining arguments other than help and empty options
            String[] remainingArgs = cmd.getArgs();
            if (remainingArgs.length != 1){
                System.err.println("Invalid usage. Please profide a card file.");
                System.exit(1);
            }

            String order = cmd.getOptionValue("order", "random");
            if (!order.equals("random") && !order.equals("worst-first") && !order.equals("recent-mistakes-first")){
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
                    } catch (NumberFormatException error){
                        System.err.println("invalid value for option --repetitions. Please provide a positive integer.");
                        System.exit(1);
                    }
                }
            }

            boolean invertCards = cmd.hasOption("invertCars");

        } catch (ParseException error) {
            System.err.println("Error parsing command-line arguments: " + error.getMessage());
            System.exit(1);
        }
    }

    private static Options createOptions() {
        Options options = new options();
        options.addOption("help", false, "show this help");
        options.addOption(option.builder()
            .longOpt("order")
            .hasArg()
            .argName("order")
            .desc("the type of order to use, default \"random\" [choices: \"random\", \"worst-first\", \"recent-mistakes-first\"]")
            .build());
        options.addOption(option.builder()
            .longOpt("repetitions")
            .hasArg()
            .argName("num")
            .desc("the number of times each card should be answered successfully. If not provided, every card is presented once, regardless of the correctness of the answer.")
            .build());
        options.addOption("invertCars", false, "If set, it flips answer and question for each card. That is, it prompts with the card's answer and the user provide the corresponding question. [Default: false]");
        return options;
    }
}
