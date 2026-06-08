package talan.fournisnet.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String reference;
    private String description;
    private Double prix;
    private LocalDate dateAjout;

    @Column(name = "parent_id_col")
    private Long parentId;

    // Original catalog ID from the imported TSV — used for deduplication on re-import
    @Column(unique = true)
    private Long externalId;

    // True for catalog group/category nodes, false for manually added products
    private boolean groupNode = false;

    private String imageUrl;

    // Stock management
    private Integer quantite = 0;
    private Integer quantiteMin = 5;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;

    @ManyToOne
    @JoinColumn(name = "constructeur_id")
    private Constructeur constructeur;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "parent_id")
    private Produit parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Produit> children = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.dateAjout = LocalDate.now();
    }
}
