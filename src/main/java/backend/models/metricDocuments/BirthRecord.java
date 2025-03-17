package backend.models.metricDocuments;

import backend.models.references.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "birth_records")
@Getter
@Setter
public class BirthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    @JsonIgnore
    private MetricDocument document;

    // Ребенок
    @Column(name = "newborn_name")
    private String newbornName;

    @ManyToOne
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "landowner_id")
    private Landowner landowner;

    @ManyToOne
    @JoinColumn(name = "family_status_id")
    private FamilyStatus familyStatus;

    // Отец
    @Column(name = "father_first_name")
    private String fatherFirstName;

    @Column(name = "father_last_name")
    private String fatherLastName;

    @Column(name = "father_middle_name")
    private String fatherMiddleName;

    @ManyToOne
    @JoinColumn(name = "father_social_status_id")
    private SocialStatus fatherSocialStatus;

    @Column(name = "father_is_dead")
    private Boolean fatherIsDead;

    // Мать
    @Column(name = "mother_first_name")
    private String motherFirstName;

    @Column(name = "mother_middle_name")
    private String motherMiddleName;

    @ManyToOne
    @JoinColumn(name = "mother_family_status_id")
    private FamilyStatus motherFamilyStatus;

    // Крестный
    @Column(name = "godparent_first_name")
    private String godparentFirstName;

    @Column(name = "godparent_last_name")
    private String godparentLastName;

    @Column(name = "godparent_middle_name")
    private String godparentMiddleName;

    @ManyToOne
    @JoinColumn(name = "godparent_place_id")
    private Place godparentPlace;

    @ManyToOne
    @JoinColumn(name = "godparent_family_status_id")
    private FamilyStatus godparentFamilyStatus;

    @ManyToOne
    @JoinColumn(name = "godparent_social_status_id")
    private SocialStatus godparentSocialStatus;

    @Column(name = "image")
    private String image;

    @Column(name = "image_description")
    private String imageDescription;
}
