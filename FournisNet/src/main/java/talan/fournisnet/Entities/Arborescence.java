package talan.fournisnet.Entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Arborescence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "arborescence")
    private List<Categorie> categories;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}
