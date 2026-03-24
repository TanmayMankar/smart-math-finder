package com.example.backend;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MathExtractionService {

    private static final Pattern MATH_EXPRESSION_PATTERN = Pattern.compile(
            "([a-zA-Z0-9]+(?:\\^\\d+)?\\s*[+\\-*/=]\\s*)+[a-zA-Z0-9]+(?:\\^\\d+)?");

    public List<String> extractMathExpressions(MultipartFile pdfFile) throws IOException {
        String pdfText;

        try (PDDocument document = Loader.loadPDF(pdfFile.getBytes())) {
            PDFTextStripper textStripper = new PDFTextStripper();
            pdfText = textStripper.getText(document);
        }

        List<String> expressions = new ArrayList<>();
        Matcher matcher = MATH_EXPRESSION_PATTERN.matcher(pdfText);
        while (matcher.find()) {
            expressions.add(matcher.group().trim());
        }

        return expressions;
    }
}
