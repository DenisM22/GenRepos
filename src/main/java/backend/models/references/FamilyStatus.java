package backend.models.references;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "family_statuses")
@Getter
@Setter
public class FamilyStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "family_status", unique = true, nullable = false)
    private String familyStatus;

}

