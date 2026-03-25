package com.example.backend;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/pdf")
public class PdfController {

    private final MathExtractionService mathExtractionService;

    public PdfController(MathExtractionService mathExtractionService) {
        this.mathExtractionService = mathExtractionService;
    }

    @PostMapping("/extract-math")
    public ResponseEntity<List<String>> extractMath(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of());
        }

        List<String> expressions = mathExtractionService.extractMathExpressions(file);
        return ResponseEntity.status(HttpStatus.OK).body(expressions);
    }
}
