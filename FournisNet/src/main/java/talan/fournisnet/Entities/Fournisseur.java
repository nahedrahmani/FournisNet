package talan.fournisnet.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String email;
    @Enumerated(EnumType.STRING)
    private FournisseurType type;
    private String adresse;
    private String telephone;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Fournisseur parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnore
    private List<Fournisseur> sousFournisseurs;

    @OneToMany(mappedBy = "fournisseur")
    @JsonIgnore
    private List<Produit> produits;
}
