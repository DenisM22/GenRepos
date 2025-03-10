package backend.models.metricDocuments;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "marriage_records")
@Getter
@Setter
public class MarriageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private MetricDocument document;

    @ManyToOne
    @JoinColumn(name = "marriage_date")
    private FuzzyDate marriageDate;

    // Жених
    @Column(name = "groom_first_name")
    private String groomFirstName;

    @Column(name = "groom_last_name")
    private String groomLastName;

    @Column(name = "groom_middle_name")
    private String groomMiddleName;

    @Column(name = "groom_age")
    private Short groomAge;

    @ManyToOne
    @JoinColumn(name = "groom_place_id")
    private Place groomPlace;

    @ManyToOne
    @JoinColumn(name = "groom_landowner_id")
    private Landowner groomLandowner;

    @ManyToOne
    @JoinColumn(name = "groom_social_status_id")
    private SocialStatus groomSocialStatus;

    @Column(name = "groom_marriage_number")
    private Short groomMarriageNumber;

    // Отец Жениха
    @Column(name = "groom_father_first_name")
    private String groomFatherFirstName;

    @Column(name = "groom_father_last_name")
    private String groomFatherLastName;

    @Column(name = "groom_father_middle_name")
    private String groomFatherMiddleName;

    @ManyToOne
    @JoinColumn(name = "groom_father_social_status_id")
    private SocialStatus groomFatherSocialStatus;

    // Невеста
    @Column(name = "bride_first_name")
    private String brideFirstName;

    @Column(name = "bride_last_name")
    private String brideLastName;

    @Column(name = "bride_middle_name")
    private String brideMiddleName;

    @Column(name = "bride_age")
    private Short brideAge;

    @ManyToOne
    @JoinColumn(name = "bride_place_id")
    private Place bridePlace;

    @ManyToOne
    @JoinColumn(name = "bride_landowner_id")
    private Landowner brideLandowner;

    @ManyToOne
    @JoinColumn(name = "bride_social_status_id")
    private SocialStatus brideSocialStatus;

    @Column(name = "bride_marriage_number")
    private Short brideMarriageNumber;

    // Отец Невесты
    @Column(name = "bride_father_first_name")
    private String brideFatherFirstName;

    @Column(name = "bride_father_last_name")
    private String brideFatherLastName;

    @Column(name = "bride_father_middle_name")
    private String brideFatherMiddleName;

    @ManyToOne
    @JoinColumn(name = "bride_father_social_status_id")
    private SocialStatus brideFatherSocialStatus;

    // Поручитель
    @Column(name = "guarantor_first_name")
    private String guarantorFirstName;

    @Column(name = "guarantor_last_name")
    private String guarantorLastName;

    @Column(name = "guarantor_middle_name")
    private String guarantorMiddleName;

    @ManyToOne
    @JoinColumn(name = "guarantor_place_id")
    private Place guarantorPlace;

    @Column(name = "guarantor_role")
    private String guarantorRole;

    @ManyToOne
    @JoinColumn(name = "guarantor_family_status_id")
    private FamilyStatus guarantorFamilyStatus;

    @ManyToOne
    @JoinColumn(name = "guarantor_social_status_id")
    private SocialStatus guarantorSocialStatus;

    @Column(name = "image")
    private String image;

    @Column(name = "image_description")
    private String imageDescription;
}
