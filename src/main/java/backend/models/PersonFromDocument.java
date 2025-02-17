package backend.models;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "people_from_documents")
@Getter
@Setter
public class PersonFromDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @ManyToOne
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @ManyToOne
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @Column(name = "social_status")
    private String socialStatus;

    @Column(name = "family_status")
    private String familyStatus;

}
