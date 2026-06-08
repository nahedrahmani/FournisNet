package talan.fournisnet.Services;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import talan.fournisnet.Repositories.CategorieRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OllamaService {

    private final RestTemplate restTemplate;
    private final CategorieRepository categorieRepository;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2}")
    private String model;

    public OllamaService(CategorieRepository categorieRepository) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5_000);   // 5s to connect
        factory.setReadTimeout(30_000);      // 30s for model to respond
        this.restTemplate = new RestTemplate(factory);
        this.categorieRepository = categorieRepository;
    }

    /**
     * Asks Ollama to suggest the best category for a given product description.
     * Returns null if Ollama is unavailable (graceful degradation).
     */
    public String suggestCategory(String productDescription, String productName) {
        List<String> categories = categorieRepository.findAll()
                .stream().map(c -> c.getNom()).collect(Collectors.toList());

        if (categories.isEmpty()) return null;

        String prompt = String.format(
            "Tu es un expert en pièces automobiles. " +
            "Voici les catégories disponibles: [%s]. " +
            "Quel est le nom EXACT de la catégorie qui correspond le mieux à ce produit: \"%s - %s\" ? " +
            "Réponds avec UNIQUEMENT le nom de la catégorie, rien d'autre.",
            String.join(", ", categories),
            productName,
            productDescription
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            OllamaResponse response = restTemplate.postForObject(
                ollamaBaseUrl + "/api/generate",
                request,
                OllamaResponse.class
            );

            if (response == null || response.response == null) return null;

            // Clean up response — model might add punctuation or newlines
            String suggested = response.response.trim().replaceAll("[\"'.]", "");

            // Validate it's actually one of our categories (case-insensitive)
            return categories.stream()
                .filter(c -> c.equalsIgnoreCase(suggested))
                .findFirst()
                .orElse(suggested); // return as-is if no exact match; frontend shows it

        } catch (Exception e) {
            // Ollama not running or error — fail silently
            return null;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class OllamaResponse {
        public String response;
    }
}
