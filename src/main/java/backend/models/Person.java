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

    @ManyToOne
    @JoinColumn(name = "first_name", nullable = false)
    private FirstName firstName;

    @ManyToOne
    @JoinColumn(name = "last_name")
    private LastName lastName;

    @ManyToOne
    @JoinColumn(name = "middle_name")
    private MiddleName middleName;

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
    @JoinColumn(name = "place")
    private Place place;

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
            inverseJoinColumns = @JoinColumn(name = "child_id"))
    private List<Person> children;

}
