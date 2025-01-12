package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "last_names")
@Getter
@Setter
public class LastName {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "last_name", nullable = false, unique = true)
    private String lastName;

}

