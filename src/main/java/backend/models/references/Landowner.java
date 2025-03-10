package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "landowners")
@Getter
@Setter
public class Landowner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "landowner", nullable = false)
    private String landowner;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;
}

