import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class FlashcardGame {

    public void startGame(List<String> questionsAndAnswers, String order, int repetitions, boolean invertCards) {
        // Handle order option
        if (order.equals("worst-first")) {
            Collections.shuffle(questionsAndAnswers);
        } else if (order.equals("recent-mistakes-first")) {
            Collections.shuffle(questionsAndAnswers);
        } else {
            // Default: Randomly shuffle the questions
            Collections.shuffle(questionsAndAnswers);
        }

        // Repeat questions based on the provided repetitions value
        for (int i = 0; i < repetitions; i++) {
            for (String questionAndAnswer : questionsAndAnswers) {
                // Handle invertCards option
                if (invertCards) {
                    // Invert the question and answer
                    String[] parts = questionAndAnswer.split("Answer:");
                    String question = parts[1].trim();
                    String answer = parts[0].trim();
                    // Present inverted question
                    presentQuestion(question, answer);
                } else {
                    // Present question as it is
                    String[] parts = questionAndAnswer.split("Answer:");
                    String question = parts[0].trim();
                    String answer = parts[1].trim();
                    presentQuestion(question, answer);
                }
            }
        }
    }
    
    
    private static List<String> readQuestionsAndAnswersFromFile(String filename) {
        List<String> questionsAndAnswers = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            StringBuilder sb = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    questionsAndAnswers.add(sb.toString());
                    sb.setLength(0);
                } else {
                    sb.append(line).append("\n");
                }
            }
            // Add the last question
            if (sb.length() > 0) {
                questionsAndAnswers.add(sb.toString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return questionsAndAnswers;
    }

    private static List<String> generateOptions(String answer) {
        List<String> options = new ArrayList<>();
        options.add(answer); // Add correct answer
        // Add incorrect answers (dummy options)
        // For simplicity, let's just shuffle the characters of the correct answer
        List<Character> chars = new ArrayList<>();
        for (char c : answer.toCharArray()) {
            chars.add(c);
        }
        Collections.shuffle(chars);
        StringBuilder dummyAnswer = new StringBuilder();
        for (char c : chars) {
            dummyAnswer.append(c);
        }
        options.add(dummyAnswer.toString());
        // Add more incorrect options here...
        return options;
    }

    private static void presentQuestion(String question, List<String> options) {
        System.out.println(question);
        // Shuffle options so correct answer doesn't always appear first
        Collections.shuffle(options);
        // Print options A, B, C, D
        char option = 'A';
        for (String opt : options) {
            System.out.println(option + ") " + opt);
            option++;
        }
    }

    private static String getUserAnswer() {
        System.out.print("Your answer (A, B, C, or D): ");
        Scanner scanner = new Scanner(System.in);
        return scanner.nextLine().trim().toUpperCase();
    }

    private static void checkAnswer(String userAnswer, String correctAnswer) {
        if (userAnswer.equals(correctAnswer)) {
            System.out.println("You are Correct! :)");
        } else {
            System.out.println("You are wrong! :(");
        }
        System.out.println();
    }
}
