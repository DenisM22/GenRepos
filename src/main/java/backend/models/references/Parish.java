package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parishes")
@Getter
@Setter
public class Parish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parish", nullable = false, unique = true)
    private String parish;

}

