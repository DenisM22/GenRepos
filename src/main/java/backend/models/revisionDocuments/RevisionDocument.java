package backend.models.revisionDocuments;

import backend.models.references.Place;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "revision_documents")
@Getter
@Setter
public class RevisionDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "created_at")
    private Short createdAt;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonFromRevisionDocument> people;

}
