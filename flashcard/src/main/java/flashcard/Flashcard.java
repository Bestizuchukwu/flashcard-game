package flashcard;
import org.apache.commons.cli.*;
import java.io.File;



public class Flashcard 
{
    public static void main( String[] args )
    {
        Options options = createOptions();
        CommandLIneParser parser = new DefaultParser();
        try {

            CommandLine cmd = parser.parse(options, args);
            if (cmd.hasOption("help") || args.length == 0){
                HelpFormatter formatter = new HelpFormatter();
                formatter.printHelp("flashcard <card-file> [options]", options);
                system.exit(0);
            }
            
        }
    }
}
