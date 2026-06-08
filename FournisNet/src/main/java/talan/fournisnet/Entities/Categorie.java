package talan.fournisnet.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne
    @JoinColumn(name = "arborescence_id")
    private Arborescence arborescence;

    @OneToMany(mappedBy = "categorie")
    @JsonIgnore
    private List<Produit> produits;
}
