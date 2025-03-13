package backend.models.metricDocuments;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "death_records")
@Getter
@Setter
public class DeathRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private MetricDocument document;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "age")
    private Short age;

    @ManyToOne
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "family_status_id")
    private FamilyStatus familyStatus;

    @ManyToOne
    @JoinColumn(name = "social_status_id")
    private SocialStatus socialStatus;

    @Column(name = "death_cause")
    private String deathCause;

    @ManyToOne
    @JoinColumn(name = "burial_place_id")
    private Place burialPlace;

    @Column(name = "image")
    private String image;

    @Column(name = "image_description")
    private String imageDescription;
}