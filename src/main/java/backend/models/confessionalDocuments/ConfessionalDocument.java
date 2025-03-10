package backend.models.confessionalDocuments;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "confessional_documents")
@Getter
@Setter
public class ConfessionalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "created_at")
    private Short createdAt;

    @ManyToOne
    @JoinColumn(name = "parish_id")
    private Parish parish;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonFromConfessionalDocument> people;

}
