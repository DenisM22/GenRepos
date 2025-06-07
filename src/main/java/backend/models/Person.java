package backend.models;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "people")
@Getter
@Setter
@NoArgsConstructor
public class Person {

    public Person(Long id) {
        this.id = id;
    }

    public Person(Long id, Long userId) {
        this.id = id;
        this.userId = userId;
    }

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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "birth_date")
    private FuzzyDate birthDate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "death_date")
    private FuzzyDate deathDate;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "social_status_id")
    private SocialStatus socialStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id")
    private Person father;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id")
    private Person mother;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spouse_id")
    private Person spouse;

    @ManyToMany
    @JoinTable(
            name = "parents_children",
            joinColumns = @JoinColumn(name = "parent_id"),
            inverseJoinColumns = @JoinColumn(name = "child_id")
    )
    private List<Person> children;

    @JoinColumn(name = "user_id")
    private Long userId;

    public void addChild(Person child) {
        if (children == null) {
            children = new ArrayList<>();
        }
        children.add(child);
    }

    public void removeChild(Person child) {
        if (children != null) {
            children.remove(child);
        } else
            throw new IllegalArgumentException("Список детей пуст");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;

        return Objects.equals(id, person.id) &&
                Objects.equals(firstName, person.firstName) &&
                Objects.equals(lastName, person.lastName) &&
                Objects.equals(middleName, person.middleName) &&
                Objects.equals(gender, person.gender) &&
                Objects.equals(birthDate, person.birthDate) &&
                Objects.equals(deathDate, person.deathDate) &&
                Objects.equals(place, person.place) &&
                Objects.equals(socialStatus, person.socialStatus) &&
                Objects.equals(father != null ? father.getId() : null,
                        person.father != null ? person.father.getId() : null) &&
                Objects.equals(mother != null ? mother.getId() : null,
                        person.mother != null ? person.mother.getId() : null) &&
                Objects.equals(spouse != null ? spouse.getId() : null,
                        person.spouse != null ? person.spouse.getId() : null) &&
                Objects.equals(
                        !children.isEmpty() ?
                        children.stream().map(Person::getId).toList() : null,
                        !children.isEmpty() ?
                        person.children.stream().map(Person::getId).toList() : null
                );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'';
    }

}
