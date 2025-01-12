package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "middle_names")
@Getter
@Setter
public class MiddleName {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "middle_name", nullable = false, unique = true)
    private String middleName;

}

