package flashcard;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class FlashcardGame {


    public void startGame(List<String> flashcardQuestionsAndAnswers, String order, int repetitions, boolean invertCards) {
         // Check if order is provided and valid, otherwise shuffle randomly
    if (!order.equals("worst-first") && !order.equals("recent-mistakes-first")) {
        Collections.shuffle(flashcardQuestionsAndAnswers);
    }
        
        for (String questionAndAnswer : flashcardQuestionsAndAnswers) {
            String[] parts = questionAndAnswer.split("Answer:");
    
            // Separate the question and the answers
            String question = parts[0].trim();
            String[] choices = parts[1].trim().split("\\r?\\n");
    
            // Extract the correct answer
            String correctAnswer = choices[0].substring(choices[0].indexOf(')') + 1).trim();
    
            // Shuffle the choices (excluding the correct answer)
            List<String> options = new ArrayList<>(Arrays.asList(choices));
            options.remove(0); // Remove the correct answer from the choices
            Collections.shuffle(options);
    
            // Present the question with shuffled choices
            presentQuestion(correctAnswer, question, options);
        }
    }

    private static void presentQuestion(String correctAnswer, String question, List<String> choices) {
        System.out.println(question);
        // Print options A, B, C, D
        char option = 'A';
        for (String choice : choices) {
            System.out.println(option + ")" + choice);
            option++;
        }

        // Get user's answer
        String userAnswer = getUserAnswer();

        // Check user's answer
        checkAnswer(userAnswer, correctAnswer);
    }

    private static String getUserAnswer() {
        System.out.print("Your answer (A, B, C, or D): ");
        Scanner scanner = new Scanner(System.in);
        return scanner.nextLine().trim().toUpperCase();
    }

    private static void checkAnswer(String userAnswer, String correctAnswer) {
        if (userAnswer.equals(correctAnswer)) {
            System.out.println("You are Correct! :) ");
        } else {
            System.out.println("You are wrong! :( ");
        }
        System.out.println();
    }

    
    
    public static List<String> readQuestionsAndAnswersFromFile(String filename) {
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

    public List<String> generateOptions(String answer) {
        List<String> options = new ArrayList<>();
        options.add(answer); // Add correct answer
        // Add incorrect answers (dummy options)
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

    public static void presentQuestion(String question, List<String> options) {
        System.out.println(question);
        // Shuffle options so correct answer doesn't always appear first
        Collections.shuffle(options);
        // Print options A, B, C, D
        char option = 'A';
        for (String opt : options) {
            System.out.println(option + ")" + opt);
            option++;
        }
    }

    
}
