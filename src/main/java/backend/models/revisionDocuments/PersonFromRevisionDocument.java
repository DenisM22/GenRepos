package backend.models.revisionDocuments;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "people_from_revision_documents")
@Getter
@Setter
public class PersonFromRevisionDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private RevisionDocument document;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "previous_age")
    private Short previousAge;

    @Column(name = "current_age")
    private Short currentAge;

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

    @Column(name = "departure_year")
    private Short departureYear;

    @Column(name = "departure_reason")
    private String departureReason;

    @ManyToOne
    @JoinColumn(name = "marriage_place_id")
    private Place marriagePlace;

    @Column(name = "marriage_document")
    private Boolean marriageDocument;

    @Column(name = "image")
    private String image;

    @Column(name = "image_description")
    private String imageDescription;
}
