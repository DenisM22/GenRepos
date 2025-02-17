package backend.models;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "people")
@Getter
@Setter
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "middle_name")
    private String middleName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @Column(name = "place")
    private String place;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spouse_id")
    private Person spouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id")
    private Person father;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id")
    private Person mother;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "parents_children",
            joinColumns = @JoinColumn(name = "parent_id"),
            inverseJoinColumns = @JoinColumn(name = "child_id")
    )
    private List<Person> children;

}
