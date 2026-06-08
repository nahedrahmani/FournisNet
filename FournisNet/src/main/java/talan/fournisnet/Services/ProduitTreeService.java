package talan.fournisnet.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import talan.fournisnet.Entities.Categorie;
import talan.fournisnet.Entities.Produit;
import talan.fournisnet.Repositories.CategorieRepository;
import talan.fournisnet.Repositories.ProduitRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProduitTreeService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public ProduitTreeService(ProduitRepository produitRepository, CategorieRepository categorieRepository) {
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
    }

    /** Returns only root products; children are nested via @JsonManagedReference */
    public List<Produit> getArborescence() {
        return produitRepository.findByParentIsNull();
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  CATALOG TSV IMPORT  (4-level group hierarchy + leaf product)
    //
    //  File format (tab-separated, 14 columns):
    //    idG1  nameG1  picG1  idG2  nameG2  picG2  idG3  nameG3  picG3
    //    idG4  nameG4  picG4  productId  productName
    //
    //  Algorithm:
    //  1. Pre-load all existing Produits that have an externalId from the DB
    //     into a map (externalId → Produit) so we can reuse them and avoid
    //     duplicates on re-import.
    //  2. For each row, walk the 4 group levels and the leaf product:
    //       - If the node already exists in the map → reuse it (no duplicates)
    //       - If not → create it, set its parent, add to parent.children
    //  3. Collect all ROOT nodes (parent == null) and call saveAll(roots).
    //     Spring/JPA cascades the save down through all children recursively
    //     because of CascadeType.ALL on the children field.
    // ──────────────────────────────────────────────────────────────────────────
    public List<Produit> saveFromCatalogTsv(MultipartFile file) throws IOException {

        // Step 1 — Load existing catalog nodes from DB to enable dedup on re-import
        Map<Long, Produit> nodeMap = new HashMap<>();
        produitRepository.findAll().stream()
                .filter(p -> p.getExternalId() != null)
                .forEach(p -> nodeMap.put(p.getExternalId(), p));

        // Step 2 — Parse the TSV and build/reuse nodes
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                if (firstLine) { firstLine = false; continue; } // skip header row

                // Split by TAB; -1 keeps trailing empty strings so indices stay fixed
                String[] cols = line.split("\t", -1);
                if (cols.length < 14) continue;

                Long id1 = parseLong(cols[0]);  String name1 = cols[1].trim();
                Long id2 = parseLong(cols[3]);  String name2 = cols[4].trim();
                Long id3 = parseLong(cols[6]);  String name3 = cols[7].trim();
                Long id4 = parseLong(cols[9]);  String name4 = cols[10].trim();
                Long pid = parseLong(cols[12]); String pName = cols[13].trim();

                // Build the chain: g1 → g2 → g3 → (g4 if present) → product
                Produit g1 = getOrCreate(nodeMap, id1, name1, null,  true);
                Produit g2 = getOrCreate(nodeMap, id2, name2, g1,    true);
                Produit g3 = getOrCreate(nodeMap, id3, name3, g2,    true);

                Produit deepest;
                if (id4 != null && !name4.isEmpty()) {
                    deepest = getOrCreate(nodeMap, id4, name4, g3, true);
                } else {
                    deepest = g3;
                }

                if (pid != null && !pName.isEmpty()) {
                    getOrCreate(nodeMap, pid, pName, deepest, false);
                }
            }
        }

        // Step 3 — Save only root nodes; JPA cascades to all descendants
        List<Produit> roots = nodeMap.values().stream()
                .filter(p -> p.getParent() == null)
                .collect(Collectors.toList());

        return produitRepository.saveAll(roots);
    }

    /**
     * Returns an existing Produit for the given externalId (from the map)
     * or creates a new one, links it to its parent, and adds it to the map.
     */
    private Produit getOrCreate(Map<Long, Produit> map, Long externalId,
                                 String nom, Produit parent, boolean isGroup) {
        if (externalId == null) return parent;

        // Reuse if already seen (dedup within file or from DB pre-load)
        if (map.containsKey(externalId)) {
            return map.get(externalId);
        }

        Produit node = new Produit();
        node.setExternalId(externalId);
        node.setNom(nom);
        node.setGroupNode(isGroup);
        node.setParent(parent);

        // Add to parent's children list so the cascade saves this node automatically
        if (parent != null) {
            parent.getChildren().add(node);
        }

        map.put(externalId, node);
        return node;
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  LEGACY CSV IMPORT  (simple: id, nom, categoryName, parentId)
    // ──────────────────────────────────────────────────────────────────────────
    public List<Produit> saveArborescenceFromFile(MultipartFile file) throws IOException {
        List<Produit> produits = buildArborescenceFromFile(file);
        return produitRepository.saveAll(produits);
    }

    public List<Produit> buildArborescenceFromFile(MultipartFile file) throws IOException {
        List<Produit> produits = new ArrayList<>();
        Map<Long, Produit> tempMap = new HashMap<>();

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                if (firstLine) { firstLine = false; continue; }

                String[] values = line.split(",");
                Long csvId     = Long.parseLong(values[0].trim());
                String nom     = values[1].trim();
                String catName = values[2].trim();
                Long parentCsvId = values.length > 3 && !values[3].isBlank()
                        ? Long.parseLong(values[3].trim()) : null;

                Categorie categorie = categorieRepository.findByNom(catName);
                if (categorie == null) {
                    categorie = new Categorie();
                    categorie.setNom(catName);
                    categorie = categorieRepository.save(categorie);
                }

                Produit produit = new Produit();
                produit.setNom(nom);
                produit.setCategorie(categorie);
                if (parentCsvId != null) produit.setParentId(parentCsvId);

                produits.add(produit);
                tempMap.put(csvId, produit);
            }
        }

        for (Produit produit : produits) {
            if (produit.getParentId() != null) {
                Produit parent = tempMap.get(produit.getParentId());
                if (parent != null) produit.setParent(parent);
            }
        }

        return produits;
    }

    private Long parseLong(String s) {
        if (s == null || s.isBlank()) return null;
        try { return Long.parseLong(s.trim()); }
        catch (NumberFormatException e) { return null; }
    }
}
