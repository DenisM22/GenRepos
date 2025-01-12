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

    @ManyToOne
    @JoinColumn(name = "first_name", nullable = false)
    private FirstName firstName;

    @ManyToOne
    @JoinColumn(name = "last_name")
    private LastName lastName;

    @ManyToOne
    @JoinColumn(name = "middle_name")
    private MiddleName middleName;

    @ManyToOne
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @ManyToOne
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @ManyToOne
    @JoinColumn(name = "social_status")
    private SocialStatus socialStatus;

    @ManyToOne
    @JoinColumn(name = "family_status")
    private FamilyStatus familyStatus;

}
