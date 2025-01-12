package backend.models;

import backend.models.references.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "documents")
@Getter
@Setter
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "year_of_creation")
    private Short yearOfCreation;

    @ManyToOne
    @JoinColumn(name = "parish")
    private Parish parish;

    @ManyToOne
    @JoinColumn(name = "place")
    private Place place;

    @Column(name = "household")
    private String household;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonFromDocument> people;

}
