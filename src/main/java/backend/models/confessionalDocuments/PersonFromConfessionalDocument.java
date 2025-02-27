package backend.models.confessionalDocuments;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "people_from_confessional_documents")
@Getter
@Setter
public class PersonFromConfessionalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private ConfessionalDocument document;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @ManyToOne
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @ManyToOne
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @Column(name = "household")
    private String household;

    @ManyToOne
    @JoinColumn(name = "landowner_id")
    private Landowner landowner;

    @ManyToOne
    @JoinColumn(name = "family_status_id")
    private FamilyStatus familyStatus;

    @ManyToOne
    @JoinColumn(name = "social_status_id")
    private SocialStatus socialStatus;

}
