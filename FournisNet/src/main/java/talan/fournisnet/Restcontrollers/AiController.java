package talan.fournisnet.Restcontrollers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import talan.fournisnet.Services.OllamaService;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final OllamaService ollamaService;

    public AiController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    /**
     * POST /api/ai/suggest-category
     * Body: { "nom": "Disque de frein", "description": "Disque ventilé 280mm" }
     * Returns: { "suggestion": "Freinage" } or { "suggestion": null } if Ollama unavailable
     */
    @PostMapping("/suggest-category")
    public ResponseEntity<Map<String, String>> suggestCategory(@RequestBody Map<String, String> body) {
        String nom = body.getOrDefault("nom", "");
        String description = body.getOrDefault("description", "");
        String suggestion = ollamaService.suggestCategory(description, nom);
        return ResponseEntity.ok(Map.of("suggestion", suggestion != null ? suggestion : ""));
    }
}
